import { fastaFileReader } from '@components/utilities/sequenceReaders';

test('reads and parses FASTA input correctly', () => {
  const input = `
>seq1
ACTG
GGTT
>seq2
CCAA
TTGG
  `.trim(); // Ensure consistent trimming
  const result = fastaFileReader(input);
  console.log(result);
  expect(result).toEqual([
    { id: 'seq1', sequence: 'ACTGGGTT' },
    { id: 'seq2', sequence: 'CCAATTGG' },
  ]);
});

test('handles empty FASTA input gracefully', () => {
  const input = '';
  const result = fastaFileReader(input);
  expect(result).toEqual([]);
});

test('handles single sequence FASTA input', () => {
  const input = `
>singleSeq
ACTGACTG
  `.trim(); // Consistent trimming for input
  const result = fastaFileReader(input);
  expect(result).toEqual([
    { id: 'singleSeq', sequence: 'ACTGACTG' },
  ]);
});
