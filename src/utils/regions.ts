// utils/regions.ts
import type { ReferenceLoader } from "@/lib/data/ReferenceLoader";

export type RegionToken = "FR1" | "CDR1" | "FR2" | "CDR2" | "FR3" | "CDR3";

type Boundary = { label: RegionToken; start: number; end?: number };

/** IMGT-like boundaries for V regions (AA indices, 1-based). */
const V_BOUNDARIES: Boundary[] = [
  { label: "FR1",  start: 1,   end: 26 },
  { label: "CDR1", start: 27,  end: 38 },
  { label: "FR2",  start: 39,  end: 55 },
  { label: "CDR2", start: 56,  end: 65 },
  { label: "FR3",  start: 66,  end: 104 },
  // From 105 onward we call it CDR3 for the V-only view.
];

function regionOfAA(pos: number): RegionToken {
  for (const b of V_BOUNDARIES) {
    if (pos >= b.start && (b.end === undefined || pos <= b.end)) return b.label;
  }
  return "CDR3"; // 105+
}

/**
 * Build region labels aligned to a gapped V nucleotide sequence.
 * One label per nucleotide column, same length as `gappedNt`.
 * Gaps are included and inherit the current codon region.
 */
export function regionTrackForGappedV(
  alleleName: string,
  gappedNt: string,
  _ref?: ReferenceLoader
): (RegionToken | undefined)[] {
  const out: (RegionToken | undefined)[] = new Array(gappedNt.length);

  // Count non-gap nucleotides to track codons.
  let aaIndex = 1;        // AA position, 1-based
  let codonCount = 0;     // 0..3 non-gap nts seen for current AA

  const isGap = (c: string) => c === "-" || c === "." || c === " ";

  for (let i = 0; i < gappedNt.length; i++) {
    const c = gappedNt[i] ?? "-";
    // Label this column with the region of the current AA.
    out[i] = regionOfAA(aaIndex);

    if (!isGap(c)) {
      codonCount++;
      if (codonCount === 3) {
        aaIndex += 1;
        codonCount = 0;
      }
    }
  }
  return out;
}
