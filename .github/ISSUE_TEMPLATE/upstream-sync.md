---
name: Upstream sync (manual)
about: Manually file an upstream AlignAIR change to triage. The weekly cron does this automatically — only use this template if you spotted a change between cron runs.
title: 'Upstream AlignAIR sync: <short-sha>'
labels: ['upstream-sync', 'needs-triage']
---

<!--
Auto-opened version of this issue is produced by .github/workflows/upstream-check.yml
based on the diff between UPSTREAM.json.sha and upstream main.
See TRANSLATION_MAP.md for the JS files affected by each upstream path.
-->

## Context

- Pinned: `<ref>` (`<sha>`)
- Latest upstream main: `<latest_sha>`
- Latest release: `<latest_tag>`

## Files changed (in watched paths)

<!-- paste the file list from check-upstream.sh output -->

## Triage

For each file above, classify into one bucket:

- [ ] **A. Algorithm / output schema change** — port to JS.
  Branch off `dev_api` as `upstream-sync-<short-sha>`, translate the diff,
  regenerate parity fixtures (see `tests/parity/README.md`),
  bump `UPSTREAM.json`.
- [ ] **B. Python-only refactor** — no port. Bump `UPSTREAM.json.sha` directly.
- [ ] **C. Model artifact** — request a Python→TF.js conversion run via
  `src/AlignAIR/API/Make_Javascript_Format.py`. Drop converted artifacts into
  `/public/models/{species}/{chain}/{modelId}/`. `scripts/generate-model-metadata.js`
  picks them up.

## Implementation PR

<!-- link the PR once opened -->
