/**
 * Validates a DNA sequence.
 * Ensures it contains only valid characters (A, C, G, T, or N) and converts it to uppercase.
 * @param sequence - Input DNA sequence.
 * @returns The validated, uppercase sequence.
 * @throws Error if invalid characters are found.
 */
export function validateSequence(sequence: string): string {
    const seq = sequence.replace(/\n/g, '').toUpperCase();
    const isValid = /^[ACGTN]*$/.test(seq);
  
    if (!isValid) {
      throw new Error('Invalid characters in sequence. Please use only A, C, G, T, or N.');
    }
  
    return seq;
  }
  