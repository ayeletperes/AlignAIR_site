import {validateSequence} from '@components/preprocessing/utilities/validateSequence';

export interface SequenceRecord {
  [id: string]: string; // The key is the sequence ID, and the value is the sequence string
}

/**
 * Reads and validates a single sequence or FASTA-like input.
 * If no ID is supplied in the input, defaults to "Seq_1".
 * @param input - User input containing a single sequence or FASTA-like format.
 * @returns Object with sequence ID and validated sequence.
 */
export function sequenceReader(input: string): SequenceRecord {
  const cleanInput = input.trim().toUpperCase(); // Trim and uppercase in one step
  let id = "Seq_1";
  let sequence = "";

  // Handle FASTA input if it starts with '>'
  if (cleanInput[0] === ">") {
    const newlineIndex = cleanInput.indexOf("\n"); // Find first newline
    id = cleanInput.slice(1, newlineIndex).trim() || "Seq_1"; // Extract ID
    sequence = cleanInput.slice(newlineIndex + 1).replace(/\s+/g, ""); // Extract and clean sequence
  } else {
    // No FASTA header, treat as plain sequence
    sequence = cleanInput.replace(/\s+/g, ""); // Remove whitespace directly
  }

  // Validate and return the sequence record
  return {
    [id]: validateSequence(sequence), // Validate and return sequence
  };
}

/**
 * Reads and parses the contents of a FASTA file with a sequence limit.
 * @param fastaInput - A string containing the contents of a FASTA file.
 * @param maxSequences - Maximum number of sequences to process (default: 1000).
 * @returns An array of parsed sequences with IDs and concatenated sequences.
 */
export function fastaFileReader(
  fastaInput: string,
  maxSequences = 1000
): SequenceRecord {
  const sequences: SequenceRecord = {};
  const lines = fastaInput.trim().split(/\r?\n/);

  let currentId: string | null = null;
  let currentSequence: string[] = [];
  let sequenceCount = 0;

  for (const line of lines) {
    if (line.startsWith('>')) {
      // Stop if sequence limit is reached
      if (sequenceCount >= maxSequences) break;

      // Save the current sequence
      if (currentId && currentSequence.length > 0) {
        sequences[currentId] = currentSequence.join('').toUpperCase();
        sequenceCount++;
      }

      // Extract or assign a default ID
      currentId = line.substring(1).trim() || `Seq_${sequenceCount + 1}`;
      currentSequence = [];
    } else if (line.trim()) {
      currentSequence.push(line.trim());
    }
  }

  // Add the last sequence if applicable
  if (currentId && currentSequence.length > 0 && sequenceCount < maxSequences) {
    sequences[currentId] = validateSequence(currentSequence.join('').toUpperCase());
  }

  return sequences;
}
