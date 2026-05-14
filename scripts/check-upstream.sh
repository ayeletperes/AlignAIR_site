#!/usr/bin/env bash
# Diff upstream AlignAIR (Python) against the pinned SHA in UPSTREAM.json,
# filtered to the allow-listed paths. Writes a markdown report to stdout.
#
# Exit 0 = no relevant change. Exit 1 = changes detected (CI uses this).
# Exit 2 = configuration / network error.
#
# Requires: curl, jq.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PIN_FILE="${REPO_ROOT}/UPSTREAM.json"

if [[ ! -f "$PIN_FILE" ]]; then
  echo "ERROR: $PIN_FILE not found" >&2
  exit 2
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq is required" >&2
  exit 2
fi

REPO=$(jq -r '.repo' "$PIN_FILE")
PINNED_SHA=$(jq -r '.sha' "$PIN_FILE")
PINNED_REF=$(jq -r '.ref' "$PIN_FILE")
mapfile -t PATHS < <(jq -r '.paths[]' "$PIN_FILE")

if [[ -z "$REPO" || -z "$PINNED_SHA" || "${#PATHS[@]}" -eq 0 ]]; then
  echo "ERROR: $PIN_FILE missing required fields (repo, sha, paths)" >&2
  exit 2
fi

# Resolve latest commit on upstream default branch.
API="https://api.github.com/repos/${REPO}"
AUTH=()
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  AUTH=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
fi

LATEST_JSON=$(curl -sSL "${AUTH[@]}" "${API}/branches/main") || {
  echo "ERROR: failed to fetch latest main branch" >&2
  exit 2
}
LATEST_SHA=$(jq -r '.commit.sha' <<<"$LATEST_JSON")

if [[ "$LATEST_SHA" == "null" || -z "$LATEST_SHA" ]]; then
  echo "ERROR: could not resolve upstream main SHA" >&2
  echo "$LATEST_JSON" >&2
  exit 2
fi

# Short-circuit: identical pin.
if [[ "$PINNED_SHA" == "$LATEST_SHA" ]]; then
  cat <<EOF
# Upstream sync check: up to date

- Pinned: \`${PINNED_REF}\` (\`${PINNED_SHA}\`)
- Latest upstream main: \`${LATEST_SHA}\`

No new commits.
EOF
  exit 0
fi

# Compare pinned ... latest.
COMPARE_JSON=$(curl -sSL "${AUTH[@]}" "${API}/compare/${PINNED_SHA}...${LATEST_SHA}") || {
  echo "ERROR: failed to fetch compare" >&2
  exit 2
}

AHEAD=$(jq -r '.ahead_by // 0' <<<"$COMPARE_JSON")
TOTAL_FILES=$(jq -r '.files | length' <<<"$COMPARE_JSON")

# Write COMPARE_JSON to a temp file — it can be many MB and exceed ARG_MAX.
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT
COMPARE_FILE="$TMPDIR/compare.json"
PATHS_FILE="$TMPDIR/paths.json"
printf '%s' "$COMPARE_JSON" >"$COMPARE_FILE"
printf '%s\n' "${PATHS[@]}" | jq -R -s -c 'split("\n") | map(select(length > 0))' >"$PATHS_FILE"

RELEVANT_FILES=$(jq --slurpfile paths "$PATHS_FILE" -c '
  ($paths[0]) as $p
  | .files
  | map(select(
      [.filename as $f | $p | any(. as $pre | $f | startswith($pre))] | any
    ))
' "$COMPARE_FILE")

RELEVANT_COUNT=$(jq -r 'length' <<<"$RELEVANT_FILES")

# Latest tag (informational).
LATEST_TAG=$(curl -sSL "${AUTH[@]}" "${API}/releases/latest" | jq -r '.tag_name // "unknown"')

if [[ "$RELEVANT_COUNT" -eq 0 ]]; then
  cat <<EOF
# Upstream sync check: no relevant changes

- Pinned: \`${PINNED_REF}\` (\`${PINNED_SHA}\`)
- Latest upstream main: \`${LATEST_SHA}\`
- Latest release: \`${LATEST_TAG}\`
- Commits ahead: ${AHEAD}
- Total files changed: ${TOTAL_FILES}
- Files changed in watched paths: 0

Upstream has moved forward but nothing under the watched paths changed.
Safe to bump \`UPSTREAM.json.sha\` to \`${LATEST_SHA}\` without porting.
EOF
  exit 0
fi

# Build the report body for relevant files.
{
  cat <<EOF
# Upstream AlignAIR sync: ${LATEST_SHA:0:12}

- **Pinned:** \`${PINNED_REF}\` (\`${PINNED_SHA}\`)
- **Latest upstream main:** \`${LATEST_SHA}\`
- **Latest release:** \`${LATEST_TAG}\`
- **Commits ahead:** ${AHEAD}
- **Files changed (total):** ${TOTAL_FILES}
- **Files changed in watched paths:** ${RELEVANT_COUNT}

## Files to review

EOF

  jq -r '.[] | "- `\(.filename)` — **\(.status)**, +\(.additions)/-\(.deletions) ([blob](\(.blob_url)))"' <<<"$RELEVANT_FILES"

  echo
  echo "## Commits in range"
  echo
  jq -r '.commits[] | "- `\(.sha[0:7])` \(.commit.message | split("\n") | .[0]) — \(.commit.author.name)"' "$COMPARE_FILE"

  cat <<'EOF'

## Triage checklist

For each file above, classify into one of:

- [ ] **A. Algorithm / output schema change** — port to JS. Branch off `dev_api`,
  translate the diff, regenerate parity fixtures, bump pin.
- [ ] **B. Python-only refactor** — no port needed. Bump `UPSTREAM.json.sha`.
- [ ] **C. Model artifact** — request a Python→TF.js conversion run via
  `src/AlignAIR/API/Make_Javascript_Format.py`, then drop the artifacts into
  `/public/models/{species}/{chain}/{modelId}/`.

See `TRANSLATION_MAP.md` for the JS files affected by each upstream path.
EOF
}

exit 1
