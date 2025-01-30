import { sequenceReader } from '@components/utilities/sequenceReaders';

test('reads a plain sequence input and assigns default ID', () => {
  const input = 'ACTGACTGNNN';
  const result = sequenceReader(input);
  expect(result).toEqual([{ id: 'Seq_1', sequence: 'ACTGACTGNNN' }]);
});

test('reads a FASTA-like sequence input with ID', () => {
  const input = `
>seq1
ACTG
GGTT
`.trim();
  const result = sequenceReader(input);
  expect(result).toEqual([{ id: 'seq1', sequence: 'ACTGGGTT' }]);
});

test('reads a FASTA-like sequence input without ID and assigns default ID', () => {
  const input = `
>
ACTG
GGTT
`.trim();
  const result = sequenceReader(input);
  expect(result).toEqual([{ id: 'Seq_1', sequence: 'ACTGGGTT' }]);
});

test('throws an error for invalid characters in a sequence', () => {
  const input = `
>seq1
ACTG
INVALID
`;
  expect(() => sequenceReader(input)).toThrow('Invalid characters in sequence');
});
