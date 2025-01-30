export const splitSequence = (sequence: string, maxCharsPerRow: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < sequence.length; i += maxCharsPerRow) {
    chunks.push(sequence.slice(i, i + maxCharsPerRow));
  }
  return chunks;
};
