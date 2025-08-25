import React from 'react';

type RegionName = 'FR1' | 'FR2' | 'FR3' | 'FR4' | 'CDR1' | 'CDR2' | 'CDR3';

// export type GridCell = {
//   nt: string;            // sample nucleotide
//   aa?: string;           // AA shown at this nt (only on the codon’s 2nd base)
//   aaIndex?: number;      // 0-based AA index in the full window
//   gnt?: string;          // germline nucleotide (optional)
//   seg?: 'V' | 'D' | 'J'; // which segment the nt belongs to
//   np?: 0 | 1 | 2;        // 1=NP1, 2=NP2
//   mismatch?: boolean;    // nt mismatch to germline
//   region?: RegionName;   // optional region marker (computed by browser)
// };

type GridCell = { nt: string; aa?: string; region?: string; [k: string]: any };


export interface AlignedBlockProps {
  row: GridCell[];                 // one visual line of cells
  className?: string;
}

const COLORS: Record<RegionName, string> = {
  CDR1: '#4ECDC4',
  CDR2: '#96CEB4',
  CDR3: '#FF9FF3',
  FR1:  '#FF6B8A',
  FR2:  '#45B7D1',
  FR3:  '#FECA57',
  FR4:  '#54A0FF',
};

export const AlignedBlock: React.FC<AlignedBlockProps> = ({ row, className }) => {
  const regionSpans: JSX.Element[] = [];
  const aaSpans: JSX.Element[] = [];
  const ntSpans: JSX.Element[] = [];
  const glSpans: JSX.Element[] = [];

  for (let i = 0; i < row.length; i++) {
    const c = row[i];

    // Regions (one thin block per nucleotide)
    if (c.region) {
      const color = COLORS[c.region as RegionName];
      const isCDR = c.region.startsWith('CDR');
      regionSpans.push(
        <span
          key={`rg-${i}`}
          className={isCDR ? 'alignment-region alignment-cdr-indicator' : 'alignment-region'}
          style={{ gridRow: 1, backgroundColor: color, boxShadow: `${isCDR ? `0 2px 4px ${color}40` : `0 1px 3px ${color}30`}` }}
          title={`Region: ${c.region}`}
        >
          {isCDR ? <div className="cdr-marker">●</div> : null}
        </span>
      );
    } else {
      regionSpans.push(<span key={`rg-${i}`} className="alignment-hidden" style={{ gridRow: 1 }}> </span>);
    }

    // AA (only where aa exists for this nucleotide)
    if (c.aa) {
      const isVar = c.aa !== 'X'; // 'X' is padded/unknown
      aaSpans.push(
        <span
          key={`aa-${i}`}
          className={`${isVar ? 'alignment-char' : 'alignment-mismatch'} aa-char`}
          style={{ gridRow: 2 }}
          title={`AA ${c.aaIndex! + 1}: ${c.aa}${isVar ? '' : ' (Variant)'}`}
          data-position={c.aaIndex! + 1}
          data-type="amino-acid"
        >
          {c.aa}
        </span>
      );
    } else {
      aaSpans.push(<span key={`aa-h-${i}`} className="alignment-hidden" style={{ gridRow: 2 }}> </span>);
    }

    // NT (sample)
    const cls = c.mismatch ? 'alignment-mismatch nt-char' : c.np ? 'alignment-np np-region' : 'alignment-char nt-char';
    ntSpans.push(
      <span
        key={`nt-${i}`}
        className={`${cls}`}
        style={{ gridRow: 3 }}
        title={`${c.np === 1 ? 'NP1 ' : c.np === 2 ? 'NP2 ' : ''}Position ${c.i + 1}: ${c.nt}${c.mismatch ? ' (Mismatch)' : ''}`}
        data-position={c.i + 1}
        data-type="nucleotide"
      >
        {c.nt}
      </span>
    );

    // NT (germline)
    glSpans.push(
      <span
        key={`gl-${i}`}
        className="alignment-char germline-char"
        style={{ gridRow: 4 }}
        title={`Germline ${c.i + 1}: ${c.np ? '' : c.gnt ?? ''}`}
        data-position={c.i + 1}
        data-type="germline"
      >
        {c.np ? '' : c.gnt ?? ''}
      </span>
    );
  }

  return (
    <div className={`subgrid-col2-row modern-aligned-block ${className ?? ''}`}>
      <div className="region-row">
        {regionSpans.map((el, k) => <React.Fragment key={`r-${k}`}>{el}</React.Fragment>)}
      </div>
      <div className="aa-row">
        {aaSpans.map((el, k) => <React.Fragment key={`a-${k}`}>{el}</React.Fragment>)}
      </div>
      <div className="nt-row">
        {ntSpans.map((el, k) => <React.Fragment key={`n-${k}`}>{el}</React.Fragment>)}
      </div>
      <div className="germline-row">
        {glSpans.map((el, k) => <React.Fragment key={`g-${k}`}>{el}</React.Fragment>)}
      </div>
    </div>
  );
};

export default AlignedBlock;
