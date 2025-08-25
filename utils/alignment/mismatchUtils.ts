export const GetSequenceMismatchIdx = (
  sequence: string,
  germline: string,
  maxCharsPerRow: number
): { [key: number]: number[] } => {
  const mismatch: { [key: number]: number[] } = {};
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== germline[i] && !['N', '-', '.'].includes(sequence[i])) {
      const row = Math.floor(i / maxCharsPerRow);
      const col = i % maxCharsPerRow;
      if (!mismatch[row]) mismatch[row] = [];
      mismatch[row].push(col);
    }
  }
  return mismatch;
};
