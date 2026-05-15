/**
 * `alignair mcp` — start a Model Context Protocol server over stdio.
 *
 * Exposes three tools, all backed by the same Node-runnable pipeline that
 * the CLI uses:
 *
 *   - list_models        → array of model metadata
 *   - get_model_info     → full metadata for a single model id
 *   - align_sequence     → run V(D)J alignment on one or more sequences
 *
 * Wire into your MCP client (Claude Code, Cursor, etc.) by adding:
 *
 *   {
 *     "mcpServers": {
 *       "alignair": {
 *         "command": "alignair",
 *         "args": ["mcp"]
 *       }
 *     }
 *   }
 *
 * The SDK is ESM-only and ours is CJS, so we load it via dynamic import().
 */

import { setRemote, setPublicDir } from '../bootstrap/paths';

export interface McpOptions {
  modelsDir?: string;
  modelsUrl?: string;
  cacheDir?: string;
}

const DEFAULT_PARAMS = {
  vCap: 3,
  dCap: 3,
  jCap: 3,
  vThresh: 0.75,
  dThresh: 0.3,
  jThresh: 0.8,
};

export async function runMcpServer(opts: McpOptions): Promise<void> {
  // Configure path mode before any pipeline module is loaded.
  if (opts.modelsDir) {
    setPublicDir(opts.modelsDir);
  } else {
    setRemote({ baseUrl: opts.modelsUrl, cacheDir: opts.cacheDir });
  }

  // ESM imports inside a CJS module require dynamic import().
  const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
  const { StdioServerTransport } = await import('@modelcontextprotocol/sdk/server/stdio.js');
  const zod = await import('zod');
  const z = zod.z ?? (zod as any).default ?? zod;

  const { AVAILABLE_MODELS } = await import('@/config/model/config');
  const { parseInput } = await import('@/utils/preprocessing/sequenceParse');
  const { submitAlignmentRequestById } = await import('@/lib/submission/alignmentSubmission');

  const server = new McpServer({
    name: 'alignair',
    version: '0.1.0',
  });

  // -------------------------------------------------------------------------
  // list_models — no arguments. Returns the static catalogue.
  // -------------------------------------------------------------------------
  server.tool(
    'list_models',
    'List the V(D)J alignment models bundled with AlignAIR. Returns id, chain type, species, reference set, and last-updated date for each.',
    {},
    async () => ({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            AVAILABLE_MODELS.map((m) => ({
              id: m.id,
              name: m.name,
              chainType: m.chainType,
              species: m.species,
              referenceSet: m.referenceSet,
              hasD: m.hasD,
              multiChain: m.multiChain,
              lastUpdated: m.lastUpdated,
              description: m.description,
            })),
            null,
            2,
          ),
        },
      ],
    }),
  );

  // -------------------------------------------------------------------------
  // get_model_info — single arg: model id.
  // -------------------------------------------------------------------------
  server.tool(
    'get_model_info',
    'Return full metadata for a specific AlignAIR model, including the artifact paths and feature list.',
    {
      modelId: z.string().describe('Model ID, e.g. "IGH_S5F_576". Use list_models to discover IDs.'),
    },
    async ({ modelId }: { modelId: string }) => {
      const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
      if (!model) {
        return {
          isError: true,
          content: [{ type: 'text', text: `no model with id "${modelId}". Try list_models.` }],
        };
      }
      return { content: [{ type: 'text', text: JSON.stringify(model, null, 2) }] };
    },
  );

  // -------------------------------------------------------------------------
  // align_sequence — accepts either a FASTA string or a list of records.
  // -------------------------------------------------------------------------
  server.tool(
    'align_sequence',
    'Run V(D)J alignment on one or more nucleotide sequences. Returns per-sequence allele calls (v_call / d_call / j_call), segment coordinates, productivity, mutation rate, and indel count.',
    {
      modelId: z
        .string()
        .describe('Which AlignAIR model to run. See list_models.'),
      fasta: z
        .string()
        .describe(
          'FASTA-formatted input. Either ">id\\nACGT…\\n>id2\\n…" or a single bare nucleotide string (we will wrap it).',
        ),
      params: z
        .object({
          vThresh: z.number().min(0).max(1).optional(),
          dThresh: z.number().min(0).max(1).optional(),
          jThresh: z.number().min(0).max(1).optional(),
          vCap: z.number().int().min(1).max(100).optional(),
          dCap: z.number().int().min(1).max(100).optional(),
          jCap: z.number().int().min(1).max(100).optional(),
        })
        .optional()
        .describe('Threshold + cap overrides. Defaults match the site.'),
    },
    async ({ modelId, fasta, params }: { modelId: string; fasta: string; params?: Partial<typeof DEFAULT_PARAMS> }) => {
      // Tolerate a bare sequence (no '>' header) by wrapping it.
      const text = fasta.includes('>')
        ? fasta
        : `>query\n${fasta.replace(/\s+/g, '')}`;
      const report = parseInput(text, { tolerant: true });
      if (report.errors.length > 0) {
        return {
          isError: true,
          content: [{ type: 'text', text: `fasta parse errors:\n  - ${report.errors.join('\n  - ')}` }],
        };
      }
      if (report.records.length === 0) {
        return {
          isError: true,
          content: [{ type: 'text', text: 'no sequences parsed from input' }],
        };
      }

      const merged = { ...DEFAULT_PARAMS, ...(params || {}) };
      const result = await submitAlignmentRequestById(
        modelId,
        report.records as any,
        'sequence',
        merged,
        () => {},
      );

      const out = serialize(result.processedPredictions);
      return { content: [{ type: 'text', text: JSON.stringify(out, null, 2) }] };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Keep the process alive on stdin — the MCP transport handles the loop.
}

function serialize(p: any): Record<string, unknown>[] {
  const ids = Object.keys(p.sequences || {});
  const n = ids.length || p.v_call?.length || 0;
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < n; i++) {
    rows.push({
      sequence_id: ids[i] ?? `seq_${i + 1}`,
      v_call: p.v_call?.[i] || [],
      d_call: p.d_call?.[i] || [],
      j_call: p.j_call?.[i] || [],
      v_sequence_start: p.v_sequence_start?.[i],
      v_sequence_end: p.v_sequence_end?.[i],
      d_sequence_start: p.d_sequence_start?.[i],
      d_sequence_end: p.d_sequence_end?.[i],
      j_sequence_start: p.j_sequence_start?.[i],
      j_sequence_end: p.j_sequence_end?.[i],
      v_germline_start: p.v_germline_start?.[i],
      v_germline_end: p.v_germline_end?.[i],
      productive: !!p.productive?.[i],
      mutation_rate: p.mutation_rate?.[i],
      indel_count: p.indel_count?.[i],
    });
  }
  return rows;
}
