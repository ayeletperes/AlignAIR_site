import { tokenizeSingleSequence } from '@components/utilities/sequenceProcessor';
import * as tf from '@tensorflow/tfjs';

describe('tokenizeSingleSequence', () => {
  test('returns a float32 tensor when useFloat is true', () => {
    const sequence = 'ATGCN';
    const maxSeqLength = 10;
    const result = tokenizeSingleSequence(sequence, maxSeqLength, true);

    expect(result.tokenized_sequence.shape).toEqual([1, maxSeqLength]);
    expect(result.tokenized_sequence.dtype).toBe('float32');
  });

  test('returns an int32 tensor when useFloat is false', () => {
    const sequence = 'ATGCN';
    const maxSeqLength = 10;
    const result = tokenizeSingleSequence(sequence, maxSeqLength, false);

    expect(result.tokenized_sequence.shape).toEqual([1, maxSeqLength]);
    expect(result.tokenized_sequence.dtype).toBe('int32');
  });

  test('handles sequences shorter than maxSeqLength', () => {
    const sequence = 'ATGC';
    const maxSeqLength = 10;
    const result = tokenizeSingleSequence(sequence, maxSeqLength, true);
  
    const tensorData = result.tokenized_sequence.dataSync();
    expect(Array.from(tensorData.slice(3, 7))).toEqual([1, 2, 3, 4]); // Encoded sequence
    expect(Array.from(tensorData.slice(0, 3))).toEqual(Array(3).fill(0)); // Padding before
    expect(Array.from(tensorData.slice(7))).toEqual(Array(3).fill(0)); // Padding after
  });
  
  test('throws an error for invalid characters in the sequence', () => {
    const sequence = 'ATGXZ';
    const maxSeqLength = 10;
  
    expect(() => tokenizeSingleSequence(sequence, maxSeqLength, true)).toThrow(
      'Invalid character "X" found in sequence.'
    );
  });
  
  test('handles an empty sequence gracefully', () => {
    const sequence = '';
    const maxSeqLength = 10;
  
    expect(() => tokenizeSingleSequence(sequence, maxSeqLength, true)).toThrow(
      'Invalid character "" found in sequence.'
    );
  });
});
