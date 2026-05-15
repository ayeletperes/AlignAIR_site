#!/usr/bin/env node
/**
 * @alignair/cli — command-line driver for the AlignAIR pipeline.
 *
 * Reuses the site's TypeScript inference modules verbatim. Bootstraps
 * @tensorflow/tfjs-node so TF.js uses the native backend, and exposes
 * onnxruntime-node as globalThis.ort so the existing browser-style
 * ONNX sniff in src/lib/model/utilities.tsx finds a runtime.
 *
 * Subcommands:
 *   alignair list-models
 *   alignair model-info <modelId>
 *   alignair align --model <modelId> --fasta <path> [--out <path>] [--airr]
 */

// Bootstrap Node-side ML runtimes before any pipeline code is loaded.
import './bootstrap/runtimes';

import { listModels } from './commands/list-models';
import { modelInfo } from './commands/model-info';
import { align } from './commands/align';

interface ParsedArgs {
  command: string;
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command = 'help', ...rest] = argv;
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const tok = rest[i];
    if (tok.startsWith('--')) {
      const eq = tok.indexOf('=');
      if (eq !== -1) {
        flags[tok.slice(2, eq)] = tok.slice(eq + 1);
      } else {
        const next = rest[i + 1];
        if (next && !next.startsWith('--')) {
          flags[tok.slice(2)] = next;
          i++;
        } else {
          flags[tok.slice(2)] = true;
        }
      }
    } else {
      positional.push(tok);
    }
  }
  return { command, positional, flags };
}

function printHelp(): void {
  console.log(`alignair — command line interface

Usage:
  alignair list-models
  alignair model-info <modelId>
  alignair align --model <modelId> --fasta <path> [--out <path>] [--airr] [--models-dir <path>]

Common flags:
  --models-dir <path>   Directory containing model bundles (default: site's public/models/alignment/)
  --json                Emit JSON instead of pretty output (where applicable)
`);
}

async function main(): Promise<void> {
  const { command, positional, flags } = parseArgs(process.argv.slice(2));
  switch (command) {
    case 'list-models':
      await listModels({ json: !!flags.json });
      return;
    case 'model-info':
      if (positional.length === 0) {
        console.error('error: model-info requires a model ID');
        process.exit(2);
      }
      await modelInfo({ modelId: positional[0], json: !!flags.json });
      return;
    case 'align':
      await align({
        modelId: String(flags.model || ''),
        fasta: String(flags.fasta || ''),
        out: flags.out ? String(flags.out) : undefined,
        airr: !!flags.airr,
        modelsDir: flags['models-dir'] ? String(flags['models-dir']) : undefined,
      });
      return;
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      return;
    default:
      console.error(`unknown command: ${command}`);
      printHelp();
      process.exit(2);
  }
}

main().catch((err) => {
  console.error(`error: ${err?.message || err}`);
  if (process.env.ALIGNAIR_DEBUG) {
    console.error(err?.stack || '');
  }
  process.exit(1);
});
