# Parity tests — JS site vs Python AlignAIR

These fixtures pin the JS site's inference output against a reference
produced by the upstream Python AlignAIR at a known commit. Whenever an
upstream sync touches algorithm code, regenerate the expected outputs and
re-run these tests as part of the port.

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
│       └── <modelId>/<caseName>.json   ← generated, not yet committed
├── parity.test.ts
└── README.md   ← you are here
```

## Status

The expected-output JSON files do **not** exist yet — `parity.test.ts` is
currently `describe.skip(...)` until they are generated. This is intentional:
generating them requires running the Python pipeline at the version pinned
in `UPSTREAM.json`, which can't be done in the JS site's CI environment.

## How to generate `expected/` (one-time bootstrap, and after each upstream sync)

Run this once locally with `pip install alignair` (or from a clone of
`MuteJester/AlignAIR` checked out to the SHA in `UPSTREAM.json`).

```bash
# 1. Install at the pinned commit.
PIN=$(jq -r '.sha' UPSTREAM.json)
pip install "alignair @ git+https://github.com/MuteJester/AlignAIR@${PIN}"

# 2. Pre-download model bundles to ~/.alignair/models/ (HuggingFace Hub).
python -c "from AlignAIR.Hub import hub; hub.list_available_models()"

# 3. Run each fixture through Python AlignAIR's CLI.
mkdir -p tests/parity/fixtures/expected
for fa in tests/parity/fixtures/inputs/*.fasta; do
  base=$(basename "$fa" .fasta)
  model=${base%_baseline}            # e.g. IGH_S5F_576
  case=${base#*_}                    # e.g. baseline
  out_dir="tests/parity/fixtures/expected/${model}"
  mkdir -p "$out_dir"

  # chain type from MODEL_ID_TO_CHAIN in src/config/model/config.ts
  case "$model" in
    IGH_*|IGH_AlignAIR_RHESUS_MACAQUE) chain=heavy ;;
    IGL_*)                              chain=light ;;
    TCRB_*)                             chain=trb ;;
  esac

  python -m AlignAIR run \
    --model-checkpoint "$model" \
    --chain-type "$chain" \
    --sequences "$fa" \
    --save-path "/tmp/parity_out" \
    --airr-format

  # Convert AIRR CSV to a canonical JSON the JS side can compare against.
  python tests/parity/scripts/airr_to_json.py \
    "/tmp/parity_out/$(basename "$fa" .fasta).csv" \
    "$out_dir/${case}.json"
done

# 4. Commit the generated expected/ tree.
git add tests/parity/fixtures/expected
git commit -m "parity: regenerate fixtures against $(jq -r '.ref' UPSTREAM.json)"
```

> The `airr_to_json.py` helper is not yet written — it should round the
> `mutation_rate` field to 3 decimal places, sort allele lists
> deterministically, and drop columns the JS side doesn't emit (e.g.
> `sequence_alignment` and `germline_alignment` strings, since we only
> compare structured fields).

## How the test asserts equality

`parity.test.ts` calls `submitAlignmentRequestById()` for each fixture input
and compares the post-processed predictions against the matching JSON in
`expected/`. The fields checked are:

- `sequence_id`
- `v_call`, `d_call`, `j_call` (allele arrays, order-sensitive)
- `v_sequence_start` / `v_sequence_end`, `d_*`, `j_*` (segment coordinates)
- `v_germline_start` / `v_germline_end` (reference coordinates)
- `productive` (boolean)
- `mutation_rate` (within ±0.001 — round-trip tolerance for f32 ↔ f64)
- `indel_count`
- `type_` (chain type indicator for multi-chain models)

Likelihood vectors are **not** asserted directly — they're high-dimensional
floats that depend on backend numerics and would flake. Equality of derived
calls (above) is the right invariant.

## Triggering a regeneration

Regenerate expected fixtures when an upstream sync involves a bucket-A
change (algorithm/output schema). The triage checklist in the auto-opened
sync issue includes this step.

If a regenerated fixture's JSON differs from the previous expected output,
that proves the algorithm changed and the JS port is needed. If it matches
exactly, the upstream commit was python-only — re-classify as bucket B.
