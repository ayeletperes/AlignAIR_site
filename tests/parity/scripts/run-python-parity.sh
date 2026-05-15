#!/usr/bin/env bash
# Regenerate parity expected/*.json by running the upstream Python AlignAIR
# pipeline at the SHA pinned in UPSTREAM.json.
#
# Usable both locally and from .github/workflows/parity-regen.yml.
#
# Environment:
#   ALIGNAIR_WORKDIR   override the working directory (default: $TMPDIR or /tmp).
#   ALIGNAIR_MODEL_DIR override where model bundles are stored (default:
#                      $ALIGNAIR_WORKDIR/pretrained_models).
#   SKIP_INSTALL=1     skip pip install (use an already-installed AlignAIR).
#   SKIP_MODELS=1      skip model download (assume models already at MODEL_DIR).
#
# Requires: python3 >=3.9, pip, git, jq.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PIN_FILE="${REPO_ROOT}/UPSTREAM.json"
INPUTS_DIR="${REPO_ROOT}/tests/parity/fixtures/inputs"
EXPECTED_DIR="${REPO_ROOT}/tests/parity/fixtures/expected"
CANONICALIZER="${REPO_ROOT}/tests/parity/scripts/airr_to_json.py"

WORKDIR="${ALIGNAIR_WORKDIR:-${TMPDIR:-/tmp}/alignair_parity}"
MODEL_DIR="${ALIGNAIR_MODEL_DIR:-${WORKDIR}/pretrained_models}"
mkdir -p "$WORKDIR" "$MODEL_DIR"

if [[ ! -f "$PIN_FILE" ]]; then
  echo "ERROR: $PIN_FILE missing" >&2
  exit 2
fi

REPO=$(jq -r '.repo' "$PIN_FILE")
SHA=$(jq -r '.sha' "$PIN_FILE")
REF=$(jq -r '.ref' "$PIN_FILE")

echo "==> Pinned: $REF ($SHA)"

# -----------------------------------------------------------------------------
# 1. Install Python AlignAIR at the pinned SHA.
# -----------------------------------------------------------------------------
if [[ "${SKIP_INSTALL:-0}" != "1" ]]; then
  echo "==> Installing alignair @ ${SHA}..."
  python3 -m pip install --quiet --upgrade pip
  # Editable install from a fresh checkout — gives us access to test fixtures
  # and `app.py` if needed. pip install git+ would also work but doesn't expose
  # the repo tree.
  if [[ ! -d "${WORKDIR}/AlignAIR" ]]; then
    git clone --quiet "https://github.com/${REPO}.git" "${WORKDIR}/AlignAIR"
  fi
  git -C "${WORKDIR}/AlignAIR" fetch --quiet origin
  git -C "${WORKDIR}/AlignAIR" checkout --quiet "$SHA"
  python3 -m pip install --quiet -e "${WORKDIR}/AlignAIR"
fi

# -----------------------------------------------------------------------------
# 2. Download / locate model bundles.
#
# Different upstream releases ship different model-acquisition stories:
#   - >= the commit that added src/AlignAIR/Hub/hub.py: HuggingFace auto-fetch.
#   - older: bundles must already exist on disk under --model-dir.
# We attempt the Hub path first and fall back to a missing-bundle error so the
# user can drop pre-converted bundles into $ALIGNAIR_MODEL_DIR.
# -----------------------------------------------------------------------------
declare -A MODEL_BUNDLES=(
  [IGH_S5F_576]="IGH_S5F_576:HUMAN_IGH_OGRDB"
  [IGL_S5F_576]="IGL_S5F_576:HUMAN_IGL_EXTENDED,HUMAN_IGK_EXTENDED"
  [TCRB_UNIFORM_576]="TCRB_UNIFORM_576:HUMAN_TCRB_IMGT"
  [IGH_AlignAIR_RHESUS_MACAQUE]="IGH_AlignAIR_RHESUS_MACAQUE:RHESUS_MACAQUE_IGH_MUSA"
)

ensure_bundle() {
  local model_id="$1"
  local target="${MODEL_DIR}/${model_id}"
  if [[ -d "$target" && -f "${target}/config.json" ]]; then
    echo "    bundle ${model_id}: present"
    return 0
  fi
  echo "    bundle ${model_id}: downloading via huggingface_hub..."
  python3 - <<PY || return 1
import sys
try:
    from AlignAIR.Hub import hub  # type: ignore
except ImportError:
    print("    hub.py not available at this pinned SHA. ", end="")
    print("Place a pre-downloaded bundle at ${target} and re-run with SKIP_MODELS=1.")
    sys.exit(3)

try:
    hub.download_pretrained_model("${model_id}", target="${target}")
except Exception as e:
    print(f"    download failed: {e}", file=sys.stderr)
    sys.exit(4)
PY
}

if [[ "${SKIP_MODELS:-0}" != "1" ]]; then
  echo "==> Ensuring model bundles..."
  for model_id in "${!MODEL_BUNDLES[@]}"; do
    if ! ensure_bundle "$model_id"; then
      echo "ERROR: could not obtain bundle ${model_id}" >&2
      echo "       Either set SKIP_MODELS=1 and place bundles in ${MODEL_DIR}," >&2
      echo "       or upgrade UPSTREAM.json to a SHA that has AlignAIR.Hub.hub." >&2
      exit 4
    fi
  done
fi

# -----------------------------------------------------------------------------
# 3. Run each fixture through Python AlignAIR and canonicalize.
# -----------------------------------------------------------------------------
TMPRUN="${WORKDIR}/run_outputs"
rm -rf "$TMPRUN"
mkdir -p "$TMPRUN"

for fasta in "${INPUTS_DIR}"/*.fasta; do
  base=$(basename "$fasta" .fasta)
  # base is "<modelId>_<caseName>" — split on last underscore.
  case_name="${base##*_}"
  model_id="${base%_*}"
  bundle_meta="${MODEL_BUNDLES[$model_id]:-}"
  if [[ -z "$bundle_meta" ]]; then
    echo "    skipping ${base}: no bundle mapping for ${model_id}"
    continue
  fi
  dataconfig="${bundle_meta#*:}"
  bundle_dir="${MODEL_DIR}/${model_id}"

  echo "==> Running ${model_id} / ${case_name}..."
  out_subdir="${TMPRUN}/${model_id}/${case_name}"
  mkdir -p "$out_subdir"

  # Try the new entry point (`app.py run`) first; fall back to the module form.
  if (cd "${WORKDIR}/AlignAIR" && python3 app.py run \
        --model-dir="${bundle_dir}" \
        --genairr-dataconfig="${dataconfig}" \
        --sequences="${fasta}" \
        --save-path="${out_subdir}" \
        --airr-format \
        >"${out_subdir}/stdout.log" 2>&1); then
    :
  else
    echo "    app.py run failed; see ${out_subdir}/stdout.log" >&2
    exit 5
  fi

  # AIRR output naming: "<basename>_alignairr_results.csv" per upstream README.
  csv="${out_subdir}/${base}_alignairr_results.csv"
  if [[ ! -f "$csv" ]]; then
    # Some upstream versions name the output differently — find any csv.
    csv=$(find "$out_subdir" -maxdepth 1 -name "*.csv" | head -n1 || true)
  fi
  if [[ -z "${csv:-}" || ! -f "$csv" ]]; then
    echo "    no CSV produced in ${out_subdir}" >&2
    exit 6
  fi

  expected_out="${EXPECTED_DIR}/${model_id}/${case_name}.json"
  python3 "${CANONICALIZER}" "${csv}" "${expected_out}"
done

echo "==> Done. Generated fixtures at ${EXPECTED_DIR}"
echo "    Review with: git diff -- tests/parity/fixtures/expected/"
