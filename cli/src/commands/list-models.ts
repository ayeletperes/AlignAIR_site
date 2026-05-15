import { AVAILABLE_MODELS } from '@/config/model/config';

interface ListModelsOptions {
  json?: boolean;
}

export async function listModels(opts: ListModelsOptions): Promise<void> {
  if (opts.json) {
    process.stdout.write(JSON.stringify(AVAILABLE_MODELS, null, 2) + '\n');
    return;
  }
  const rows = AVAILABLE_MODELS.map((m) => ({
    id: m.id,
    chain: m.chainType,
    species: m.species,
    referenceSet: m.referenceSet,
    lastUpdated: m.lastUpdated,
  }));
  const widths = {
    id: Math.max(2, ...rows.map((r) => r.id.length)),
    chain: Math.max(5, ...rows.map((r) => r.chain.length)),
    species: Math.max(7, ...rows.map((r) => r.species.length)),
    referenceSet: Math.max(13, ...rows.map((r) => r.referenceSet.length)),
    lastUpdated: Math.max(12, ...rows.map((r) => r.lastUpdated.length)),
  };
  const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - s.length));
  console.log(
    [
      pad('ID', widths.id),
      pad('CHAIN', widths.chain),
      pad('SPECIES', widths.species),
      pad('REFERENCE SET', widths.referenceSet),
      pad('UPDATED', widths.lastUpdated),
    ].join('  '),
  );
  console.log(
    [
      '-'.repeat(widths.id),
      '-'.repeat(widths.chain),
      '-'.repeat(widths.species),
      '-'.repeat(widths.referenceSet),
      '-'.repeat(widths.lastUpdated),
    ].join('  '),
  );
  for (const r of rows) {
    console.log(
      [
        pad(r.id, widths.id),
        pad(r.chain, widths.chain),
        pad(r.species, widths.species),
        pad(r.referenceSet, widths.referenceSet),
        pad(r.lastUpdated, widths.lastUpdated),
      ].join('  '),
    );
  }
}
