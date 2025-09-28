// components/VGenePairAligned.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useVGenePairAligned } from "@/hooks/useVGeneAlignment";

type Props = {
  refLoader: any;                 // ReferenceLoader
  gene: string | null;
  wrap?: number;
};

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function regionBg(r?: string): string {
  switch (r) {
    case "FR1":  return "bg-[rgba(255,107,138,0.18)]";
    case "CDR1": return "bg-[rgba(78,205,196,0.18)]";
    case "FR2":  return "bg-[rgba(69,183,209,0.18)]";
    case "CDR2": return "bg-[rgba(150,206,180,0.18)]";
    case "FR3":  return "bg-[rgba(254,202,87,0.18)]";
    case "CDR3": return "bg-[rgba(255,159,243,0.18)]";
    case "FR4":  return "bg-[rgba(84,160,255,0.18)]";
    default:     return "";
  }
}

function buildRegionLabelRow(regions: (string|undefined)[], start: number, len: number): string[] {
  // Place the region name at the first column of each span inside the block.
  const labels: string[] = new Array(len).fill(" ");
  let prev: string | undefined = regions[start];
  if (prev) labels[0] = String(prev);
  for (let i = 1; i < len; i++) {
    const r = regions[start + i];
    if (r && r !== prev) {
      labels[i] = String(r);
      prev = r;
    }
  }
  return labels;
}

export const VGenePairAligned: React.FC<Props> = ({ refLoader, gene, wrap = 60 }) => {
  const [useIUIS, setUseIUIS] = useState(false);
  const { rows, width, refRegions } = useVGenePairAligned(refLoader, gene, useIUIS);

  console.log('refRegions', refRegions);
  console.log('rows', rows);
  const chunked = useMemo(() => {
    return rows.map(r => ({
      name: r.name,
      isReference: r.isReference,
      aaChunks: chunk(r.aaRow, wrap),
      ntChunks: chunk(r.ntRow, wrap),
    }));
  }, [rows, wrap]);

  if (!gene) return <div className="text-sm text-gray-500">Pick a V gene.</div>;
  if (rows.length === 0) return <div className="text-sm text-gray-500">No alleles for {gene}.</div>;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="text-sm text-gray-500">
          AA shown at the <b>second</b> NT of each codon. Non-reference rows: <code>-</code> for matches, red for mismatches. Hover any cell for details.
        </div>
        <label className="text-sm inline-flex items-center gap-2">
          <input
            type="checkbox"
            className="accent-purple-600"
            checked={useIUIS}
            onChange={(e) => setUseIUIS(e.target.checked)}
          />
          Show IUIS names
        </label>
      </div>

      {/* One block per horizontal chunk */}
      {chunked[0].aaChunks.map((_, block) => {
        const blockLen = Math.min(wrap, width - block * wrap);
        const regionLabelRow = buildRegionLabelRow(refRegions, block * wrap, blockLen);

        return (
          <div key={`blk-${block}`} className="mb-6">
            {/* ruler every 10 columns */}
            <pre className="font-mono text-[10px] text-gray-400 leading-4 select-text mb-1">
              {Array.from({ length: blockLen }, (_, i) => {
                const pos = block * wrap + i + 1;
                return pos % 10 === 0 ? String((pos / 10) % 10) : " ";
              }).join("")}
            </pre>

            {/* region labels row */}
            <div className="flex items-baseline gap-3 mb-1">
              <div className="w-48 shrink-0 font-mono text-[11px] text-gray-500">Regions</div>
              <pre className="font-mono text-[11px] leading-5">
                {regionLabelRow.map((lab, i) => {
                  const r = refRegions[block * wrap + i];
                  const cls = `inline-block px-[2px] ${regionBg(r)}`;
                  return (
                    <span key={`rl-${i}`} className={cls} title={r ?? ""}>
                      {i === 0 ? lab : (lab.length > 0 ? lab : " ")}
                    </span>
                  );
                })}
              </pre>
            </div>

            {/* rows in this block */}
            {chunked.map(row => (
              <div key={`${row.name}-blk-${block}`} className="mb-2">
                <div className="flex items-baseline gap-3">
                  <div className="w-48 shrink-0 font-mono text-[12px] text-gray-600 dark:text-gray-300">
                    {row.name}{row.isReference ? "  (ref)" : ""}
                  </div>

                  {/* AA row */}
                  <div className="overflow-x-auto">
                    <pre className="font-mono text-[12px] leading-5">
                      {row.aaChunks[block]?.map((c, i) => {
                        const ch = c.aaDisplay ?? " ";
                        const tip = c.tooltip;
                        const red = !row.isReference && c.diffAA;
                        const cls = `inline-block px-[2px] ${red ? "text-red-600 dark:text-red-400 font-semibold" : ""}`;
                        return (
                          <span key={`aa-${i}`} className={cls} title={tip}>
                            {ch}
                          </span>
                        );
                      })}
                    </pre>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="w-48 shrink-0" />
                  {/* NT row with region shading */}
                  <div className="overflow-x-auto">
                    <pre className="font-mono text-[12px] leading-5">
                      {row.ntChunks[block]?.map((c, i) => {
                        const ch = c.ntDisplay || "-";
                        const tip = c.tooltip;
                        const red = !row.isReference && c.diffNT;
                        const cls = `inline-block px-[2px] ${regionBg(c.region)} ${red ? "text-red-600 dark:text-red-400 font-semibold" : ""}`;
                        return (
                          <span key={`nt-${i}`} className={cls} title={tip}>
                            {ch}
                          </span>
                        );
                      })}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

