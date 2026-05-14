# Translation Map — Python AlignAIR → JS site

This document records the mapping between modules in the upstream Python
[MuteJester/AlignAIR](https://github.com/MuteJester/AlignAIR) repo and their
TypeScript re-implementations in this site. It is the single source of truth
that `scripts/check-upstream.sh` and `.github/workflows/upstream-check.yml`
rely on. The list of upstream paths actively watched lives in `UPSTREAM.json`.

When you change a row, also update `UPSTREAM.json.paths` if the watched paths
shift. When you sync to a new upstream commit, bump `UPSTREAM.json.sha` and
`UPSTREAM.json.ref`.

## Current pin

See `UPSTREAM.json` — currently pinned at `v2.0.2`
(`e74c3592143004315656ae1ec74f52c31ba9bb41`).

## Mapping

| Phase | JS file(s) | Python source (path under `src/AlignAIR/` upstream) | Notes / known divergences |
|---|---|---|---|
| Pipeline orchestration | `src/lib/submission/alignmentSubmission.tsx` | `Pipeline/main.py`, `Pipeline/Runner/runner.py` | JS pipeline exposes an `AlignmentPhase` callback + LRU result cache that Python lacks (UI-only concerns). |
| Batched inference | `src/lib/preprocessing/Steps/BatchProcessor.ts` | `Preprocessing/Steps/batch_processing_steps.py` | JS adds an `onPhaseProgress(phase, percent)` callback for the UI progress bar. Default batch size is hardware-tuned in JS (cores × 64, floored 128, capped 1024). |
| Tokenization | `src/utils/preprocessing/sequenceTokenizerWorker.tsx`, `src/utils/preprocessing/sequenceProcessor.tsx`, `src/utils/preprocessing/sequenceParse.tsx`, `src/utils/preprocessing/sequenceReaders.tsx` | `Data/batch_readers/`, `Data/tokenizers/` | The JS file is named `*Worker` but currently runs on the main thread. Real Web Worker promotion is tracked separately. |
| Candidate extraction | `src/lib/preprocessing/LongSequence/FastKmerDensityExtractor.ts` | `Data/batch_readers/` (FastKmerDensityExtractor class) | Direct port — file header comment already says "matching Python FastKmerDensityExtractor". |
| Orientation correction | `src/lib/preprocessing/Orientation/utilities.ts` + ONNX models under `/public/models/orientation/` | `Preprocessing/Orientation/`, `Preprocessing/Steps/fix_orientation_step.py` | Same ONNX model used in both — converted once and bundled in `/public/models/orientation/`. |
| Post-processing / thresholding | `src/lib/postprocessing/Steps/CleanAndArrange.ts` | `PostProcessing/Steps/clean_up_steps.py`, `PostProcessing/Steps/allele_threshold_step.py` | The "Maximum Likelihood Thresholding" + Short-D suppression logic documented at `/docs/technical/thresholding`. Threshold defaults (V=0.75, D=0.3, J=0.8) and Short-D > 0.5 cutoff are duplicated in both impls. |
| Heuristic germline matching | `src/lib/postprocessing/HeuristicMatching/HeuristicMatcher.ts` | Heuristic alignment scoring in upstream `PostProcessing/` and adjacent | Match upstream's tail-head check, position-clipping, and AA-score acceleration. |
| Reference / DataConfig | `src/lib/data/ReferenceLoader.ts`, `src/lib/data/DataConfig.ts` | `Pipeline/AIRR/`, `Data/MultiChainDataset.py` | `DataConfig.ts` already has inline `// Python equivalent: …` comments on `_unfold_alleles` and `allele_list`. JS adds IndexedDB caching layer (`src/lib/data/referenceCache.ts`) — pure JS-side optimization, no Python counterpart. |
| Model loading | `src/lib/model/unifiedModelLoader.ts`, `src/lib/model/modelManager.tsx`, `src/lib/model/modelMetadataLoader.ts`, `src/lib/model/utilities.tsx` | `Hub/hub.py`, `Models/`, `Serialization/` | Python downloads weights via HuggingFace Hub (`AlignAIR/AlignAIR-pretrained`). JS site bundles pre-converted TF.js + ONNX artifacts under `/public/models/`. Conversion is done with `src/AlignAIR/API/Make_Javascript_Format.py` upstream. |
| Model conversion (one-way) | (no JS equivalent — output consumed) | `API/Make_Javascript_Format.py` | This is the script that produces the TF.js model bundles the site ships. Tracked in the allow-list so we notice when the export format changes. |

## What is *not* translated

These directories are original to the site and do not need upstream tracking:

- `src/app/**` — Next.js pages and routing
- `src/components/**` — React UI
- `src/contexts/**`, `src/hooks/**` — React state management
- `src/utils/runMetadata.ts`, `src/utils/errorHandler.ts`, `src/utils/logger.ts`, etc. — site infrastructure
- `src/lib/data/referenceCache.ts` — IndexedDB caching layer (JS-only optimization)
- styling, theming, file I/O

## How upstream changes get tracked

1. **Weekly automated check.** `.github/workflows/upstream-check.yml` runs every Monday 9am UTC, calls `scripts/check-upstream.sh`, and auto-opens / appends to an `Upstream AlignAIR sync` issue if anything in the allow-listed paths changed.
2. **Release feed.** Subscribe to `https://github.com/MuteJester/AlignAIR/releases.atom` for new tagged releases between cron runs.
3. **Manual check.** Run `npm run check-upstream` locally any time.

## How to triage an `upstream-sync` issue

The auto-generated issue lists every changed file in the allow-listed paths.
For each changed file, classify into one bucket:

- **A. Algorithm / output schema change** (anything under `Pipeline/`, `Preprocessing/`, `PostProcessing/`, `Data/batch_readers/`, `Data/tokenizers/`) → **port to JS**. Open a child PR.
- **B. Python-only refactor** (typing, packaging, perf fixes that don't change outputs) → **bump pin only**.
- **C. Model artifact** (new model in `Hub/hub.py:AVAILABLE_MODELS`, or weights retrain on HuggingFace) → **manual conversion task**. The Python→TF.js step is `src/AlignAIR/API/Make_Javascript_Format.py`. Converted artifacts go under `/public/models/{species}/{chain}/{modelId}/`; `scripts/generate-model-metadata.js` picks them up automatically.

If parity fixtures (`tests/parity/`) still match after regenerating expected
outputs against the new upstream, the change is bucket B in practice — port
only what differs.

## How to port a bucket-A change

1. Branch off `dev_api`. Name: `upstream-sync-<short-sha>`.
2. Translate the Python diff into the JS module(s) listed in the mapping above.
3. Regenerate parity fixtures (see `tests/parity/README.md`).
4. `npm test -- parity.test.ts` must pass.
5. Bump `UPSTREAM.json.sha`, `UPSTREAM.json.ref`, `UPSTREAM.json.checked_at`.
6. Update this file if the mapping itself changed.
7. Open PR. CI re-runs `check-upstream.sh` to confirm we're in sync.
