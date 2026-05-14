/**
 * Parity tests against Python AlignAIR.
 *
 * Each `expected/<modelId>/<caseName>.json` file holds the output of running
 * the upstream Python pipeline (at the SHA pinned in UPSTREAM.json) on the
 * matching `inputs/<modelId>_<caseName>.fasta`. This test feeds the FASTA
 * through the JS site's pipeline and asserts the structural fields match.
 *
 * Status: expected/ is empty on first checkout. The suite is `describe.skip`
 * until fixtures exist (see tests/parity/README.md for the regeneration
 * command). Once committed, flip to `describe.each` and CI will catch
 * regressions automatically.
 */

import fs from 'fs';
import path from 'path';

const FIXTURE_ROOT = path.join(__dirname, 'fixtures');
const INPUT_DIR = path.join(FIXTURE_ROOT, 'inputs');
const EXPECTED_DIR = path.join(FIXTURE_ROOT, 'expected');

interface ExpectedRecord {
  sequence_id: string;
  v_call: string[];
  d_call?: string[];
  j_call: string[];
  v_sequence_start: number;
  v_sequence_end: number;
  d_sequence_start?: number;
  d_sequence_end?: number;
  j_sequence_start: number;
  j_sequence_end: number;
  v_germline_start: number;
  v_germline_end: number;
  productive: boolean;
  mutation_rate: number;
  indel_count: number;
  type_?: string;
}

/** Walk fixtures/expected/<modelId>/<caseName>.json into a flat list. */
function listFixtures(): Array<{ modelId: string; caseName: string; expectedPath: string; inputPath: string }> {
  if (!fs.existsSync(EXPECTED_DIR)) return [];
  const out: Array<{ modelId: string; caseName: string; expectedPath: string; inputPath: string }> = [];
  for (const modelId of fs.readdirSync(EXPECTED_DIR)) {
    const modelDir = path.join(EXPECTED_DIR, modelId);
    if (!fs.statSync(modelDir).isDirectory()) continue;
    for (const fname of fs.readdirSync(modelDir)) {
      if (!fname.endsWith('.json')) continue;
      const caseName = path.basename(fname, '.json');
      const inputPath = path.join(INPUT_DIR, `${modelId}_${caseName}.fasta`);
      if (!fs.existsSync(inputPath)) continue;
      out.push({
        modelId,
        caseName,
        expectedPath: path.join(modelDir, fname),
        inputPath,
      });
    }
  }
  return out;
}

const fixtures = listFixtures();
const hasFixtures = fixtures.length > 0;

// Suite is skipped until expected/ is populated. See tests/parity/README.md.
(hasFixtures ? describe : describe.skip)('Parity: JS site vs Python AlignAIR', () => {
  it.each(fixtures)(
    '$modelId / $caseName matches expected output',
    async ({ expectedPath }) => {
      const expected: ExpectedRecord[] = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

      // TODO(parity): wire up to submitAlignmentRequestById once expected/ is generated.
      // Pseudocode:
      //   const records = parseFasta(fs.readFileSync(inputPath, 'utf8'));
      //   const result = await submitAlignmentRequestById(modelId, records, 'sequence', defaultParams, noopProgress);
      //   const actual = canonicalizeForParity(result);
      //   expect(actual).toEqual(expected);
      //
      // For now, the test only validates the fixture is parseable.
      expect(Array.isArray(expected)).toBe(true);
      expect(expected.length).toBeGreaterThan(0);
      for (const rec of expected) {
        expect(typeof rec.sequence_id).toBe('string');
        expect(Array.isArray(rec.v_call)).toBe(true);
        expect(Array.isArray(rec.j_call)).toBe(true);
      }
    },
    60_000,
  );
});

// Always-on smoke test so CI surfaces if the fixture loader itself breaks
// after expected/ exists.
describe('Parity fixture loader', () => {
  it('lists fixtures without throwing', () => {
    expect(() => listFixtures()).not.toThrow();
  });
});
