/**
 * Parity tests against Python AlignAIR.
 *
 * Each `expected/<modelId>/<caseName>.json` file holds the output of running
 * the upstream Python pipeline (at the SHA pinned in UPSTREAM.json) on the
 * matching `inputs/<modelId>_<caseName>.fasta`. The expected/ tree is
 * regenerated automatically by `.github/workflows/parity-regen.yml` (or
 * manually via `tests/parity/scripts/run-python-parity.sh`).
 *
 * What this Jest suite asserts: each `expected/*.json` is **structurally
 * valid** — it parses, contains records, and every record has the fields
 * downstream code relies on. This catches a broken canonicalizer, a corrupt
 * commit, or a truncated regen.
 *
 * What it does NOT assert: that the JS site's `submitAlignmentRequestById()`
 * pipeline produces the same output as Python. Running the JS pipeline in
 * Jest would require TF.js + ONNX Runtime in jsdom, which the existing test
 * infra mocks out. JS-vs-Python comparison happens in two other ways:
 *
 *   1. The Action regenerates expected/*.json against the pinned SHA. When
 *      a Python algorithm change lands, the diff is visible in a PR and a
 *      human ports the JS to match.
 *   2. A future headless-browser harness (Playwright) or a Node-compatible
 *      pipeline build would close the loop. Tracked as a follow-up.
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

// Suite is skipped until expected/ is populated by the regen workflow.
// Once it exists, this validates the structure of every committed fixture.
(hasFixtures ? describe : describe.skip)('Parity fixture structure', () => {
  it.each(fixtures)(
    '$modelId / $caseName parses and has the required fields',
    ({ expectedPath }) => {
      const expected: ExpectedRecord[] = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));

      expect(Array.isArray(expected)).toBe(true);
      expect(expected.length).toBeGreaterThan(0);
      for (const rec of expected) {
        expect(typeof rec.sequence_id).toBe('string');
        expect(Array.isArray(rec.v_call)).toBe(true);
        expect(Array.isArray(rec.j_call)).toBe(true);
        // Coordinates may legitimately be null for short / failed segments,
        // but when present they should be integers.
        if (rec.v_sequence_start != null) {
          expect(Number.isInteger(rec.v_sequence_start)).toBe(true);
        }
        if (rec.mutation_rate != null) {
          expect(typeof rec.mutation_rate).toBe('number');
        }
      }
    },
  );
});

// Always-on smoke test so CI surfaces if the fixture loader itself breaks
// after expected/ exists.
describe('Parity fixture loader', () => {
  it('lists fixtures without throwing', () => {
    expect(() => listFixtures()).not.toThrow();
  });
});
