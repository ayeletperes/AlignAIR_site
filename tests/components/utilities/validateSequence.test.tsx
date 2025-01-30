import { validateSequence } from '@components/utilities/validateSequence';

test('validates a correct DNA sequence', () => {
  const input = 'ACTGACTGNNN';
  const result = validateSequence(input);
  expect(result).toBe('ACTGACTGNNN');
});

test('validates a lowercase DNA sequence and converts it to uppercase', () => {
  const input = 'actgactgnnn';
  const result = validateSequence(input);
  expect(result).toBe('ACTGACTGNNN');
});

test('throws an error for invalid characters in a sequence', () => {
  const input = 'ACTG123';
  expect(() => validateSequence(input)).toThrow('Invalid characters in sequence');
});

test('handles an empty sequence gracefully', () => {
  const input = '';
  const result = validateSequence(input);
  expect(result).toBe('');
});
