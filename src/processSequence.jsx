import * as tf from "@tensorflow/tfjs";


export class SequenceTokenizer {
  /**
   * Create a SequenceTokenizer.
   */
  
  static tokenizerDictionary = {
    "A": 1,
    "T": 2,
    "G": 3,
    "C": 4,
    "N": 5,
    "P": 0,  // pad token
  };

  static padArrays = {};

  /**
   * Encodes and equal pad a sequence.
   * @param {string} sequence - The input sequence to encode and pad.
   * @param {number} maxSeqLength - The maximum sequence length.
   * @returns {number[]} The encoded and padded sequence.
   */
  static encodeAndEqualPadSequence(sequence, maxSeqLength = 576) {
    sequence = sequence.split('');
    const encodedSequence = new Int32Array(sequence.length);
    
    for (let i = 0; i < sequence.length; i++) {
      encodedSequence[i] = this.tokenizerDictionary[sequence[i]] || 0;
    }
    const remainingLength = maxSeqLength - encodedSequence.length;
    let paddingArray = this.padArrays[remainingLength];
    if (!paddingArray) {
      paddingArray = new Int32Array(remainingLength);
      const paddingLength = remainingLength % 2 === 0 ? remainingLength / 2 : (remainingLength + 1) / 2;
      paddingArray.fill(0, 0, paddingLength);
      this.padArrays[remainingLength] = paddingArray;
    }
    const padStart = paddingArray.slice(0, paddingArray.length / 2);
    const padEnd = paddingArray.slice(paddingArray.length / 2);
    const finalSequence = new Int32Array(maxSeqLength);
    finalSequence.set(padStart, 0);
    finalSequence.set(encodedSequence, padStart.length);
    finalSequence.set(padEnd, padStart.length + encodedSequence.length);
    return finalSequence;

  }

  /**
   * Tokenizes a single sequence.
   * @param {string} sequence - The input sequence to tokenize.
   * @param {number} maxSeqLength - The maximum sequence length.
   * @returns {Object} The tokenized sequence.
   */
  static tokenizeSingleSequence(sequence, maxSeqLength = 576) {
    const paddedArray = SequenceTokenizer.encodeAndEqualPadSequence(sequence, maxSeqLength);
    
    const paddedSequenceTensor = tf.tensor2d([paddedArray], [1, maxSeqLength], 'int32');
    const input = {
      'tokenized_sequence': paddedSequenceTensor
    };

    return input;
  }
}