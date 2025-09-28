export const splitSequence = (sequence: string, maxCharsPerRow: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < sequence.length; i += maxCharsPerRow) {
    chunks.push(sequence.slice(i, i + maxCharsPerRow));
  }
  return chunks;
};

// Build codon map for the whole padded window
export function buildCodonMap(nt: string, aa: string) {
  // aa length should be Math.floor(nt.length / 3)
  const codons = [];
  for (let i = 0; i < aa.length; i++) {
    const start = i * 3;
    const end = start + 3; // exclusive
    codons.push({ aa: aa[i], start, end });
  }
  return codons;
}

export type SegmentSlices = {
  start: number;
  end: number;
  nt: string;
  aa: string;
  aaEnds: number[]; // positions (0-based) in nt where each AA should be drawn, equal to (codon.end - 1 - start)
};

// Assign each codon to the segment whose boundary contains its 3rd base
export function segmentCodons(
  fullNt: string,
  fullAa: string,
  vEndNt: number,
  jStartNt: number
): Record<'V' | 'D' | 'J', SegmentSlices> {
  const codons = buildCodonMap(fullNt, fullAa);

  const segs: Record<'V' | 'D' | 'J', SegmentSlices> = {
    V: { start: 0,      end: vEndNt,   nt: fullNt.slice(0, vEndNt),       aa: '', aaEnds: [] },
    D: { start: vEndNt, end: jStartNt, nt: fullNt.slice(vEndNt, jStartNt), aa: '', aaEnds: [] },
    J: { start: jStartNt, end: fullNt.length, nt: fullNt.slice(jStartNt), aa: '', aaEnds: [] },
  };

  for (let i = 0; i < codons.length; i++) {
    const c = codons[i];
    const thirdBase = c.end - 1; // index of the 3rd nucleotide in the codon

    if (thirdBase < vEndNt) {
      segs.V.aa += c.aa;
      segs.V.aaEnds.push(thirdBase - segs.V.start);
    } else if (thirdBase < jStartNt) {
      segs.D.aa += c.aa;
      segs.D.aaEnds.push(thirdBase - segs.D.start);
    } else {
      segs.J.aa += c.aa;
      segs.J.aaEnds.push(thirdBase - segs.J.start);
    }
  }

  return segs;
}

// Split a nucleotide row, and for each row compute AA letters and their end positions in that row
export function splitSegmentForRows(
  seg: SegmentSlices,
  ntRowWidth: number
): Array<{ nt: string; aa: string; aaEnds: number[] }> {
  const rows: Array<{ nt: string; aa: string; aaEnds: number[] }> = [];
  const nt = seg.nt;
  const ends = seg.aaEnds;
  const aa = seg.aa;

  let aaIdx = 0; // index in 'aa' that matches ends[aaIdx]

  for (let rowStart = 0; rowStart < nt.length; rowStart += ntRowWidth) {
    const rowEnd = Math.min(rowStart + ntRowWidth, nt.length);
    const rowNt = nt.slice(rowStart, rowEnd);

    const rowAaLetters: string[] = [];
    const rowAaEnds: number[] = [];

    while (aaIdx < ends.length && ends[aaIdx] < rowEnd) {
      if (ends[aaIdx] >= rowStart) {
        rowAaLetters.push(aa[aaIdx]);
        rowAaEnds.push(ends[aaIdx] - rowStart);
      }
      aaIdx++;
    }

    rows.push({ nt: rowNt, aa: rowAaLetters.join(''), aaEnds: rowAaEnds });
  }

  return rows;
}
