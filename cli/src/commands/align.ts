/**
 * `alignair align` — runs the full inference pipeline on a local FASTA file.
 *
 * Strategy:
 *   - Bootstrap path-rewriting so the pipeline's server-absolute model and
 *     reference paths resolve to disk under --models-dir.
 *   - Parse the FASTA using the existing sequenceParse utility.
 *   - Delegate to submitAlignmentRequestById() — the same entry point the
 *     site uses. Output comes back as the same CleanedPredictions shape.
 *   - Format predictions as CSV (default) or JSON.
 */

import * as fs from 'fs';
import * as path from 'path';
import { setPublicDir, setRemote } from '../bootstrap/paths';
import { parseInput, type ParsedRecord } from '@/utils/preprocessing/sequenceParse';

interface AlignOptions {
  modelId: string;
  fasta: string;
  out?: string;
  airr?: boolean;
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

export async function align(opts: AlignOptions): Promise<void> {
  if (!opts.modelId) throw new Error('--model is required');
  if (!opts.fasta) throw new Error('--fasta is required');
  if (!fs.existsSync(opts.fasta)) throw new Error(`fasta file not found: ${opts.fasta}`);

  // Pick fetch mode. Explicit --models-dir wins; otherwise download from
  // the deployed site URL and cache under ~/.alignair/cache/.
  if (opts.modelsDir) {
    setPublicDir(opts.modelsDir);
  } else {
    setRemote({ baseUrl: opts.modelsUrl, cacheDir: opts.cacheDir });
  }

  // Lazy-load after publicDir is set, so the pipeline's first module-level
  // network/file accesses get the patched globals.
  const { submitAlignmentRequestById } = await import('@/lib/submission/alignmentSubmission');

  const fastaText = fs.readFileSync(opts.fasta, 'utf8');
  const report = parseInput(fastaText, { tolerant: true });
  if (report.errors.length > 0) {
    throw new Error(`fasta parse errors:\n  - ${report.errors.join('\n  - ')}`);
  }
  if (report.records.length === 0) {
    throw new Error('no sequences parsed from input');
  }

  process.stderr.write(`Running ${opts.modelId} on ${report.records.length} sequence(s)…\n`);
  const t0 = Date.now();

  let lastPct = -1;
  const setProgress = (pct: number) => {
    const rounded = Math.round(pct);
    if (rounded !== lastPct && rounded % 10 === 0) {
      process.stderr.write(`  progress: ${rounded}%\n`);
      lastPct = rounded;
    }
  };

  const result = await submitAlignmentRequestById(
    opts.modelId,
    report.records as ParsedRecord[],
    'sequence',
    DEFAULT_PARAMS,
    setProgress,
  );

  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  process.stderr.write(`Done in ${elapsed}s\n`);

  const rows = serializePredictions(result.processedPredictions, opts.airr);
  const output = formatOutput(rows, opts.airr);

  if (opts.out) {
    fs.writeFileSync(opts.out, output);
    process.stderr.write(`Wrote ${opts.out}\n`);
  } else {
    process.stdout.write(output);
  }

  // TF.js Node keeps a worker thread alive after inference; without an
  // explicit exit Node hangs ~60s waiting on it. Output is already flushed.
  process.exit(0);
}

function serializePredictions(predictions: any, airr?: boolean): Record<string, unknown>[] {
  const sequenceIds = Object.keys(predictions.sequences || {});
  const n = sequenceIds.length || predictions.v_call?.length || 0;
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < n; i++) {
    const row: Record<string, unknown> = {
      sequence_id: sequenceIds[i] ?? `seq_${i + 1}`,
      v_call: (predictions.v_call?.[i] || []).join(','),
      d_call: (predictions.d_call?.[i] || []).join(','),
      j_call: (predictions.j_call?.[i] || []).join(','),
      v_sequence_start: predictions.v_sequence_start?.[i],
      v_sequence_end: predictions.v_sequence_end?.[i],
      d_sequence_start: predictions.d_sequence_start?.[i],
      d_sequence_end: predictions.d_sequence_end?.[i],
      j_sequence_start: predictions.j_sequence_start?.[i],
      j_sequence_end: predictions.j_sequence_end?.[i],
      v_germline_start: predictions.v_germline_start?.[i],
      v_germline_end: predictions.v_germline_end?.[i],
      productive: predictions.productive?.[i],
      mutation_rate: predictions.mutation_rate?.[i],
      indel_count: predictions.indel_count?.[i],
    };
    if (airr && predictions.type_) {
      row.type_ = predictions.type_;
    }
    rows.push(row);
  }
  return rows;
}

function formatOutput(rows: Record<string, unknown>[], airr?: boolean): string {
  if (rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const header = cols.join(airr ? '\t' : ',');
  const sep = airr ? '\t' : ',';
  const lines = [header];
  for (const r of rows) {
    lines.push(cols.map((c) => formatCell(r[c])).join(sep));
  }
  return lines.join('\n') + '\n';
}

function formatCell(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : '';
  if (typeof v === 'string') {
    return v.includes(',') || v.includes('"') || v.includes('\n')
      ? `"${v.replace(/"/g, '""')}"`
      : v;
  }
  return String(v);
}
