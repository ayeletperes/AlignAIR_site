import * as tf from "@tensorflow/tfjs";

const TOKENIZER_DICTIONARY: Record<string, number> = {
  A: 1,
  T: 2,
  G: 3,
  C: 4,
  N: 5,
  P: 0, // pad token
};

const PAD_ARRAYS: Record<number, Float32Array | Int32Array> = {};

/**
 * Validates the input sequence to ensure it contains only valid characters.
 * @param sequence - Input DNA sequence.
 * @throws Error if invalid characters are found.
 */
function validateSequence(sequence: string): void {
    if (!sequence) {
      throw new Error('Invalid character "" found in sequence.');
    }
    const allowedChars = Object.keys(TOKENIZER_DICTIONARY);
    for (const char of sequence.toUpperCase()) {
      if (!allowedChars.includes(char)) {
        throw new Error(`Invalid character "${char}" found in sequence.`);
      }
    }
  }

/**
 * Encodes and pads a sequence to equal length.
 * @param sequence - Input DNA sequence.
 * @param maxSeqLength - Maximum sequence length (default: 576).
 * @param useFloat - Whether to use Float32Array (default: true).
 * @returns A padded and encoded generic array (Float32Array | Int32Array).
 */
export function encodeAndEqualPadSequence(
  sequence: string,
  maxSeqLength = 576,
  useFloat = true
): Float32Array | Int32Array {
  validateSequence(sequence); // Validate the input sequence
  const ArrayType = useFloat ? Float32Array : Int32Array;

  // Preallocate the final array with zeros (padding is implicit)
  const finalSequence = new ArrayType(maxSeqLength);

  const seqLength = sequence.length;
  const encodedLength = Math.min(seqLength, maxSeqLength); // Truncate if necessary
  const padStartLength = Math.floor((maxSeqLength - encodedLength) / 2); // Padding before sequence

  // Encode directly into the correct position of the final array
  for (let i = 0; i < encodedLength; i++) {
    finalSequence[padStartLength + i] =
      TOKENIZER_DICTIONARY[sequence[i].toUpperCase()] || 0;
  }

  return finalSequence;
}


/**
 * Tokenizes a sequence, encoding it into tensors for model input.
 * @param sequence - Input DNA sequence.
 * @param maxSeqLength - Maximum sequence length (default: 576).
 * @param useFloat - Whether to use Float32 precision (default: true).
 * @returns A TensorFlow tensor representing the tokenized sequence.
 */

export function tokenizeSingleSequence(
    sequence: string,
    maxSeqLength = 576,
    useFloat = true
  ): { tokenized_sequence: tf.Tensor2D } {
    // Ensure paddedSequence matches expected input types
    const paddedSequence = encodeAndEqualPadSequence(sequence, maxSeqLength, useFloat);
  
    // Convert TypedArray to plain number[] for compatibility
    const plainSequence = Array.from(paddedSequence);
  
    // Pass the number[] array to tf.tensor2d
    const tensor = tf.tensor2d([plainSequence], [1, maxSeqLength], useFloat ? 'float32' : 'int32');
  
    return { tokenized_sequence: tensor };
}