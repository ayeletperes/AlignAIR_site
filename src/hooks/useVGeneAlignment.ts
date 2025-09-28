// hooks/useVGenePairAligned.ts
import { useMemo } from "react";
import type { ReferenceLoader, SegmentKey } from "@/lib/data/ReferenceLoader";
import { regionTrackForGappedV } from "@/utils/regions";
import { mapGappedNtToCodons } from "@/utils/translate";

const SEG: SegmentKey = "V";

function alleleToGene(name: string): string {
  const i = name.indexOf("*");
  return i >= 0 ? name.slice(0, i) : name;
}
function sortAlleles(a: string, b: string): number {
  const pa = a.split("*")[1] ?? "";
  const pb = b.split("*")[1] ?? "";
  const na = parseInt(pa, 10);
  const nb = parseInt(pb, 10);
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na !== nb) return na - nb;
  return a.localeCompare(b, "en", { numeric: true });
}

export type PairCell = {
  // visuals
  ntDisplay: string;                 // shown character for NT row ('-' for match in non-ref)
  aaDisplay?: string;                // shown character at codon 2nd NT ('-' for match in non-ref)
  // meta
  nt: string;                        // raw NT at column
  region?: string;                   // FR1/CDR1/...
  aa?: string;                       // codon AA (one per codon)
  aaPos?: number;                    // AA index 1-based
  codonOfs?: 0 | 1 | 2;              // 0..2 within codon
  diffAA?: boolean;                  // AA != ref AA at aaPos
  diffNT?: boolean;                  // NT != ref NT at this column (for non-ref)
  col: number;                       // 0-based NT column
  tooltip: string;                   // combined hover text
  isAAAnchor?: boolean;              // true only on the 2nd NT of each codon
};

export type AllelePairRow = {
  name: string;                      // display name chosen upstream (allele or IUIS)
  rawName: string;                   // original allele name
  aaRow: PairCell[];
  ntRow: PairCell[];
  isReference: boolean;
};

export function useVGenePairAligned(
  refLoader: ReferenceLoader | null,
  gene: string | null,
  useIUISNames: boolean
) {
  return useMemo(() => {
    if (!refLoader || !gene) return { rows: [] as AllelePairRow[], width: 0, refRegions: [] as (string|undefined)[] };

    const gapped = refLoader.getSeqsGapped?.(SEG) || {};
    const labels = refLoader.getLabels?.(SEG) || {};
    const names = Object.keys(gapped).filter(n => alleleToGene(n) === gene).sort(sortAlleles);
    if (names.length === 0) return { rows: [], width: 0, refRegions: [] };

    // global width
    const width = names.reduce((m, n) => Math.max(m, gapped[n]?.length ?? 0), 0);

    // reference strings, regions, and AA mapping
    const refRaw = names[0];
    const refG = (gapped[refRaw] || "").padEnd(width, "-");
    const refRegions = regionTrackForGappedV(refRaw, refG, refLoader); // length = width
    const refMap = mapGappedNtToCodons(refG);
    const refAAByPos: Record<number, string> = {};
    for (const c of refMap.codons) refAAByPos[c.aaIndex] = c.aa;
    const refCharAt = (col: number) => refG[col] || "-";

    const rows: AllelePairRow[] = [];

    for (const rawName of names) {
      const displayName = useIUISNames ? (labels?.[rawName]?.iuis ?? rawName) : rawName;

      const g = (gapped[rawName] || "").padEnd(width, "-");
      const regions = regionTrackForGappedV(rawName, g, refLoader); // length = width
      const m = mapGappedNtToCodons(g);

      // col -> within-codon offset; mark AA anchor at the 2nd NT (offset 1)
      const col2ofs: Record<number, 0 | 1 | 2> = {};
      for (const codon of m.codons) codon.cols.forEach((col, k) => { col2ofs[col] = k as 0|1|2; });

      // AA diffs by aaIndex
      const diffByAAIndex: Record<number, boolean> = {};
      for (const codon of m.codons) {
        const refAA = refAAByPos[codon.aaIndex];
        diffByAAIndex[codon.aaIndex] = refAA ? (codon.aa !== refAA) : false;
      }

      const aaRow: PairCell[] = new Array(width);
      const ntRow: PairCell[] = new Array(width);

      for (let col = 0; col < width; col++) {
        const nt = g[col] || "-";
        const region = regions[col];
        const codonId = m.col2codon[col];

        let aa: string | undefined;
        let aaPos: number | undefined;
        let codonOfs: 0 | 1 | 2 | undefined;
        let isAAAnchor = false;
        let diffAA = false;

        if (codonId !== null && codonId !== undefined) {
          const codon = m.codons[codonId];
          aa = codon.aa;
          aaPos = codon.aaIndex;
          codonOfs = col2ofs[col];
          diffAA = !!diffByAAIndex[aaPos];
          isAAAnchor = codonOfs === 1; // SECOND nucleotide carries AA glyph
        }

        const refNT = refCharAt(col);
        const isRef = rawName === refRaw;

        // NT display logic
        const ntMatches = !isRef && nt === refNT;
        const ntDisplay = isRef ? nt : (ntMatches ? "-" : nt);
        const diffNT = isRef ? false : !ntMatches;

        // AA display logic (only at anchor column)
        let aaDisplay: string | undefined;
        if (isAAAnchor && aa && aaPos) {
          if (isRef) {
            aaDisplay = aa; // show full AA for reference
          } else {
            aaDisplay = diffAA ? aa : "-";
          }
        }

        const tooltip =
          codonId !== null && codonId !== undefined
            ? `AA ${aaPos}${codonOfs !== undefined ? `, codon ofs ${codonOfs}` : ""} • allele ${rawName} = ${aa ?? m.codons[codonId].aa}${refAAByPos[aaPos!] ? `, ref = ${refAAByPos[aaPos!]}` : ""} • NT col ${col + 1}${!isRef ? (ntMatches ? " • NT match" : " • NT mismatch") : ""}`
            : `No AA (gap/incomplete) • allele ${rawName} • NT col ${col + 1}`;

        const cell: PairCell = {
          ntDisplay,
          aaDisplay,
          nt,
          region,
          aa,
          aaPos,
          codonOfs,
          diffAA,
          diffNT,
          col,
          tooltip,
          isAAAnchor
        };

        aaRow[col] = cell;
        ntRow[col] = cell;
      }

      rows.push({
        name: displayName,
        rawName,
        aaRow,
        ntRow,
        isReference: rawName === refRaw,
      });
    }

    console.log('rows', rows);
    console.log('refRegions', refRegions);
    return { rows, width, refRegions };
  }, [refLoader, gene, useIUISNames]);
}
