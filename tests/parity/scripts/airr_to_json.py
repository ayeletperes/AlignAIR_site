#!/usr/bin/env python3
"""
Canonicalize Python AlignAIR's AIRR-format CSV output into a stable JSON
representation that the JS site can be diffed against.

Why a separate canonicalizer:
- AIRR CSVs have many fields the JS side doesn't emit (sequence_alignment
  strings, etc.) which we don't want to compare.
- Float columns (mutation_rate) need to be rounded so f32/f64 round-trip
  differences don't cause spurious diffs.
- Allele call columns are comma-separated strings; we split into arrays
  and sort deterministically so a different tiebreak ordering between
  releases doesn't masquerade as a real change.

Usage:
    airr_to_json.py <input.csv> <output.json>
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path
from typing import Any

# Fields the JS site asserts on. Anything else upstream emits is dropped.
INT_FIELDS = (
    "v_sequence_start",
    "v_sequence_end",
    "d_sequence_start",
    "d_sequence_end",
    "j_sequence_start",
    "j_sequence_end",
    "v_germline_start",
    "v_germline_end",
    "indel_count",
)

FLOAT_FIELDS_ROUND_3 = ("mutation_rate",)

ALLELE_FIELDS = ("v_call", "d_call", "j_call")

PASSTHROUGH_STRING = ("sequence_id", "type_", "chain_type")

BOOL_FIELDS = ("productive",)


def parse_bool(s: str) -> bool:
    return str(s).strip().lower() in {"true", "1", "t", "yes", "y"}


def parse_int(s: str) -> int | None:
    if s is None or s == "":
        return None
    try:
        return int(float(s))  # AIRR sometimes encodes as "12.0"
    except (TypeError, ValueError):
        return None


def parse_float_3(s: str) -> float | None:
    if s is None or s == "":
        return None
    try:
        return round(float(s), 3)
    except (TypeError, ValueError):
        return None


def parse_alleles(s: str) -> list[str]:
    """Split an AIRR-comma-separated allele list, dedupe, sort."""
    if not s:
        return []
    parts = [p.strip() for p in str(s).split(",")]
    parts = [p for p in parts if p]
    # Deterministic order. Python AlignAIR may emit highest-likelihood first;
    # we sort lexicographically here for stable diffs. If the JS site ever
    # cares about order, switch to a tuple-with-rank representation.
    return sorted(set(parts))


def canonicalize_row(row: dict[str, Any]) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for k in PASSTHROUGH_STRING:
        if k in row:
            out[k] = row[k]
    for k in ALLELE_FIELDS:
        if k in row:
            out[k] = parse_alleles(row.get(k, ""))
    for k in INT_FIELDS:
        if k in row:
            out[k] = parse_int(row.get(k, ""))
    for k in FLOAT_FIELDS_ROUND_3:
        if k in row:
            out[k] = parse_float_3(row.get(k, ""))
    for k in BOOL_FIELDS:
        if k in row:
            out[k] = parse_bool(row.get(k, ""))
    return out


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: airr_to_json.py <input.csv> <output.json>", file=sys.stderr)
        return 2

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])

    if not src.exists():
        print(f"error: {src} not found", file=sys.stderr)
        return 1

    with src.open(newline="") as f:
        reader = csv.DictReader(f)
        records = [canonicalize_row(r) for r in reader]

    dst.parent.mkdir(parents=True, exist_ok=True)
    with dst.open("w") as f:
        json.dump(records, f, indent=2, sort_keys=True)
        f.write("\n")

    print(f"wrote {len(records)} record(s) to {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
