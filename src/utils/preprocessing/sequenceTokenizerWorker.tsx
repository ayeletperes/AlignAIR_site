import { encodeAndEqualPadSequence } from '@/utils/preprocessing/sequenceProcessor';
import { sequenceReader, fastaFileReader, SequenceRecord } from '@/utils/preprocessing/sequenceReaders';
import { fixOrientation } from '@/lib/preprocessing/Orientation/utilities';
import { logger } from '@/utils/logger';
import * as tf from '@tensorflow/tfjs';



export async function sequenceTokenizerWorker(
  input: string | File,
  queue: any,
  maxSeqLength: number,
  orientationPipeline: any,
  candidateExtractor: any,
  batchSize: number = 256,
  flag: 'file' | 'sequence'
): Promise<void> {

  
  const timingAnalysis: Record<string, number> = {};

  const stepStart = (stepName: string) => (timingAnalysis[stepName] = performance.now());
  const stepEnd = (stepName: string) => {
    timingAnalysis[stepName] = performance.now() - timingAnalysis[stepName];
  };

  if (!flag) throw new Error('A flag indicating "file" or "sequence" is required.');
  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error('Batch size must be a positive integer.');
  }
  if (!candidateExtractor) throw new Error('Candidate extractor is not defined.');
  if (!orientationPipeline) throw new Error('Orientation pipeline is not defined.');

  let sequences: Record<string, SequenceRecord> = {};
  let content: string | undefined;

  if (flag === 'file') {
    // Reading file
    stepStart('File Read');
    if (typeof window !== 'undefined' && input instanceof File) {
      // Use FileReader for browser
      content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsText(input);
      });
    } else {
      throw new Error('Invalid input type for file.');
    }

    if (!content.startsWith('>')) {
      throw new Error('The file does not appear to be a valid FASTA file.');
    }

    const sequenceArray = fastaFileReader(content);
    sequences = Object.fromEntries(sequenceArray.map(seq => [seq.id, seq]));
    stepEnd('File Read');
    logger.info(`Read ${Object.keys(sequences).length} sequences from the file.`);
  } else {
    // Handling direct sequence input
    stepStart('Direct Sequence Read');
    const sequenceArray = sequenceReader(input as string);
    sequences = Object.fromEntries(sequenceArray.map(seq => [seq.id, seq]));
    stepEnd('Direct Sequence Read');
  }

  const sequenceEntries = Object.entries(sequences);

  while (sequenceEntries.length > 0) {
    const batchEntries = sequenceEntries.splice(0, batchSize);
    let batch: Record<string, SequenceRecord> = Object.fromEntries(batchEntries);

    // Extract candidate regions
    stepStart('Candidate Extraction');
    batch = Object.fromEntries(
      Object.entries(batch).map(([id, sequenceRecord]) => {
        if (sequenceRecord.sequence.length < maxSeqLength) {
          return [id, sequenceRecord];
        } else {
          const { maxRegion } = candidateExtractor.transformHolt(sequenceRecord.sequence);
          return [id, { id: sequenceRecord.id, sequence: maxRegion }];
        }
      })
    );
    stepEnd('Candidate Extraction');
    let fixedSequences: string[] = [];
    // Fix orientation
    stepStart('Fix Orientation');
    try {
      if (orientationPipeline) {
        // Use the async fixOrientation function from utilities
        const sequences = Object.values(batch).map(sr => sr.sequence);
        fixedSequences = await fixOrientation(orientationPipeline, sequences);
      } else {
        // No orientation pipeline available, use sequences as-is
        fixedSequences = Object.values(batch).map(sr => sr.sequence);
      }
    } catch (error) {
      logger.error('Error during orientation fixing:', error);
      throw error;
    }
    stepEnd('Fix Orientation');
    
    // Replace sequences with fixed ones
    batch = Object.fromEntries(
      Object.entries(batch).map(([id, sequenceRecord], idx) => [id, { id: sequenceRecord.id, sequence: fixedSequences[idx] }])
    );

    // Encode and pad sequences
    stepStart('Encoding and Padding');
    const tokenizedSequences = Object.values(batch).map((sequenceRecord) => {
      const encodedSequence: any = encodeAndEqualPadSequence(sequenceRecord.sequence, maxSeqLength, false);
      return encodedSequence;
    });
    stepEnd('Encoding and Padding');

    if (tokenizedSequences.length === 0) {
      throw new Error('No sequences available for tensor creation.');
    }

    // Tensor creation
    stepStart('Tensor Creation');
    let inputTensor: any;
    let tensorShape: string;

    if (tokenizedSequences.length === 1) {
      inputTensor = { tokenized_sequence: tf.tensor2d(tokenizedSequences[0] as any, [1, maxSeqLength], 'int32') };
      tensorShape = 'single';
    } else {
      const stackedTensor = tf.stack(tokenizedSequences);
      inputTensor = { tokenized_sequence: stackedTensor };
      tensorShape = 'stacked';
    }
    stepEnd('Tensor Creation');

    queue.put({
      tokenizedBatch: inputTensor,
      orientationFixedSequences: batch,
      tensorShape,
    });
  }

  queue.put(null);

  logger.info('Timing Analysis:', timingAnalysis);
}
