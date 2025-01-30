// components/results/utils/alignmentUtils.ts

/**
 * Splits a sequence into chunks of a specified size for rendering.
 * @param sequence - The DNA or amino acid sequence to split.
 * @param chunkSize - The maximum size of each chunk.
 * @returns An array of sequence chunks.
 */
export const splitSequence = (sequence: string, chunkSize: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Finds mismatched indices between two sequences.
 * @param query - The query sequence.
 * @param reference - The reference sequence.
 * @param chunkSize - The chunk size for dividing the sequences.
 * @returns An object with mismatched indices grouped by chunks.
 */
export const GetSequenceMismatchIdx = (
  query: string,
  reference: string,
  chunkSize: number
): { [key: number]: number[] } => {
  const mismatches: { [key: number]: number[] } = {};
  for (let i = 0; i < query.length; i++) {
    if (query[i] !== reference[i]) {
      const chunkIdx = Math.floor(i / chunkSize);
      if (!mismatches[chunkIdx]) mismatches[chunkIdx] = [];
      mismatches[chunkIdx].push(i % chunkSize);
    }
  }
  return mismatches;
};
