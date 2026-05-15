# Parity tests — JS site vs Python AlignAIR

These fixtures pin the JS site's inference output against a reference
produced by the upstream Python AlignAIR at a known commit. The
`expected/*.json` tree is **regenerated automatically** by a GitHub
Action; you should rarely need to run anything locally.

## Layout

```
tests/parity/
├── fixtures/
│   ├── inputs/
│   │   ├── IGH_S5F_576_baseline.fasta
│   │   ├── IGL_S5F_576_baseline.fasta
│   │   ├── TCRB_UNIFORM_576_baseline.fasta
│   │   └── IGH_AlignAIR_RHESUS_MACAQUE_baseline.fasta
│   └── expected/
│       └── <modelId>/<caseName>.json   ← produced by the regen Action
├── scripts/
│   ├── airr_to_json.py        ← canonicalizes AIRR CSV → stable JSON
│   └── run-python-parity.sh   ← orchestrator (used by Action + local)
├── parity.test.ts             ← Jest: structural validation of expected/
└── README.md                  ← you are here
```

## How regeneration works

`.github/workflows/parity-regen.yml` fires when:

- `UPSTREAM.json` changes (i.e., after each upstream sync)
- a fixture input changes
- the orchestrator script itself changes
- you trigger it manually from the Actions tab (workflow_dispatch)

The Action:

1. Installs Python AlignAIR at the SHA pinned in `UPSTREAM.json`
2. Downloads model bundles (via `AlignAIR.Hub.hub` if available at that SHA)
3. Runs each input FASTA through `python app.py run ... --airr-format`
4. Canonicalizes the AIRR CSV outputs via `scripts/airr_to_json.py`
5. If any `expected/*.json` changed, opens a PR titled `parity: regenerate
   expected fixtures`

You review the PR. If the diff makes sense (e.g., you just synced upstream
and bucket-A algorithm changes are expected to shift the numbers), merge it
and port the JS code to match. If outputs changed unexpectedly without a JS
change, that's a regression — investigate before merging.

## Running locally

You only need to do this if the Action is broken (e.g., upstream changed
their CLI surface and the orchestrator script needs a tweak) or if you
want a faster feedback loop while developing the canonicalizer.

```bash
# from repo root
./tests/parity/scripts/run-python-parity.sh
```

Environment knobs:

| Var | Default | Purpose |
|---|---|---|
| `ALIGNAIR_WORKDIR` | `/tmp/alignair_parity` | Where the Python checkout + tmp outputs live |
| `ALIGNAIR_MODEL_DIR` | `$ALIGNAIR_WORKDIR/pretrained_models` | Where model bundles are kept |
| `SKIP_INSTALL=1` | — | Reuse an existing `pip install` |
| `SKIP_MODELS=1` | — | Reuse already-downloaded bundles |

After running locally, `git diff -- tests/parity/fixtures/expected/` to
review.

## What `parity.test.ts` actually does

It is **structural**, not full-pipeline. It loads every committed
`expected/*.json` and checks each record has the fields downstream code
depends on (`sequence_id`, `v_call`/`j_call` arrays, integer coordinates
when present, numeric `mutation_rate` when present). This catches:

- a broken canonicalizer
- a corrupt/truncated regen commit
- a schema drift between releases

It does **not** check that the JS site's `submitAlignmentRequestById()`
produces matching output. That would require running TF.js + ONNX Runtime
in jsdom, which the existing JS test infra mocks out. JS-vs-Python parity
is enforced via the regen Action's PR diff workflow: a human reads the
diff and ports the JS to match.

Future work to fully close the loop:

- **Headless-browser harness** (Playwright) that submits each input on a
  built site and exports the result, then diffs against `expected/*.json`.
- **Node-compatible pipeline build** so the site's TS modules can be
  executed directly under Jest with `@tensorflow/tfjs-node` and
  `onnxruntime-node`. Would also unlock the planned CLI/MCP work.

## Adding a new fixture

1. Drop a FASTA at `tests/parity/fixtures/inputs/<modelId>_<caseName>.fasta`.
   `modelId` must match one of the IDs in `src/config/model/config.ts`.
2. Push. The regen Action picks it up and opens a PR adding the matching
   `expected/<modelId>/<caseName>.json`.
3. Review and merge.

## Field reference (what `expected/*.json` contains)

| Field | Type | Notes |
|---|---|---|
| `sequence_id` | string | Carried through from the FASTA header |
| `v_call`, `d_call`, `j_call` | string[] | Sorted lexicographically, deduplicated |
| `v_sequence_start`/`end`, `d_*`, `j_*` | int \| null | 1-indexed positions |
| `v_germline_start`/`end` | int \| null | Reference coordinates |
| `productive` | boolean | |
| `mutation_rate` | number | Rounded to 3 decimal places |
| `indel_count` | int | |
| `type_` | string | Multi-chain models only |

Fields not in the table (`sequence_alignment`, `germline_alignment`,
likelihood vectors, etc.) are intentionally dropped by the canonicalizer
because they are either too large, backend-dependent, or not produced by
the JS site.
