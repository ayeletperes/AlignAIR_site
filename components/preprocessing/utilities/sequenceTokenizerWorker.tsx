import { encodeAndEqualPadSequence } from '@components/preprocessing/utilities/sequenceProcessor';
import { sequenceReader, fastaFileReader, SequenceRecord } from '@components/preprocessing/utilities/sequenceReaders';
import { fixOrientation } from '@components/preprocessing/orientation/utilities';
import { logger } from '@components/utils/logger';
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

  let sequences: SequenceRecord = {};
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
    } // in testing mode
    // } else if (typeof input === 'string') {
    //   // Use fs for Node.js
    //   const filePath = path.resolve(input);
    //   content = fs.readFileSync(filePath, 'utf8');
    // } 
    else {
      throw new Error('Invalid input type for file.');
    }

    if (!content.startsWith('>')) {
      throw new Error('The file does not appear to be a valid FASTA file.');
    }

    sequences = fastaFileReader(content);
    stepEnd('File Read');
    logger.log(`Read ${Object.keys(sequences).length} sequences from the file.`);
  } else {
    // Handling direct sequence input
    stepStart('Direct Sequence Read');
    sequences = sequenceReader(input as string);
    stepEnd('Direct Sequence Read');
  }

  const sequenceEntries = Object.entries(sequences);

  while (sequenceEntries.length > 0) {
    const batchEntries = sequenceEntries.splice(0, batchSize);
    let batch: SequenceRecord = Object.fromEntries(batchEntries);

    // Extract candidate regions
    stepStart('Candidate Extraction');
    batch = Object.fromEntries(
      Object.entries(batch).map(([id, sequence]) => {
        if (sequence.length < maxSeqLength) {
          return [id, sequence];
        } else {
          const { maxRegion } = candidateExtractor.transformHolt(sequence);
          return [id, maxRegion];
        }
      })
    );
    stepEnd('Candidate Extraction');

    let fixedSequences: string[] = [];
    // Fix orientation
    stepStart('Fix Orientation');
    try {
      fixedSequences = await fixOrientation(orientationPipeline, Object.values(batch));
    } catch (error) {
      logger.error('Error during orientation fixing:', error);
      throw error;
    }
    stepEnd('Fix Orientation');
    
    // Replace sequences with fixed ones
    batch = Object.fromEntries(
      Object.entries(batch).map(([id], idx) => [id, fixedSequences[idx]])
    );

    // Encode and pad sequences
    stepStart('Encoding and Padding');
    const tokenizedSequences = Object.values(batch).map((sequence) => {
      const encodedSequence: any = encodeAndEqualPadSequence(sequence, maxSeqLength, false);
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
      inputTensor = { tokenized_sequence: tf.tensor2d([tokenizedSequences[0]], [1, maxSeqLength], 'int32') };
      tensorShape = 'single';
    } else {
      inputTensor = tf.stack(tokenizedSequences);
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

  logger.log('Timing Analysis:', timingAnalysis);
}



// import { encodeAndEqualPadSequence } from '@components/utilities/sequenceProcessor';
// import { sequenceReader, fastaFileReader, SequenceRecord } from '@components/utilities/sequenceReaders';
// import { fixOrientation } from '@components/preprocessing/orientation/utilities';
// import * as tf from '@tensorflow/tfjs';

// export async function sequenceTokenizerWorker(
//   input: string | File,
//   queue: any,
//   maxSeqLength: number,
//   orientationPipeline: any,
//   candidateExtractor: any,
//   batchSize: number = 256,
//   flag: 'file' | 'sequence'
// ): Promise<void> {
//   if (!flag) throw new Error('A flag indicating "file" or "sequence" is required.');
//   if (!Number.isInteger(batchSize) || batchSize <= 0) {
//     throw new Error('Batch size must be a positive integer.');
//   }
//   if (!candidateExtractor) throw new Error('Candidate extractor is not defined.');
//   if (!orientationPipeline) throw new Error('Orientation pipeline is not defined.');

//   let sequences: SequenceRecord = {};
//   let content: string | undefined;

//   if (flag === 'file') {
//     // Use FileReader for browser compatibility
//     if (!(input instanceof File)) {
//       throw new Error('Input must be a File when flag is set to "file".');
//     }

//     try {
//       content = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result as string);
//         reader.onerror = () => reject(new Error('Failed to read file.'));
//         reader.readAsText(input);
//       });

//       if (!content.startsWith('>')) {
//         throw new Error('The file does not appear to be a valid FASTA file.');
//       }

//       sequences = fastaFileReader(content);
//       logger.log(`Read ${Object.keys(sequences).length} sequences from the file.`);
//     } catch (error) {
//       logger.error('Error reading file:', error);
//       throw error;
//     }
//   } else {
//     // Handle direct sequence input
//     sequences = sequenceReader(input as string);
//   }

//   const sequenceEntries = Object.entries(sequences);

//   while (sequenceEntries.length > 0) {
//     const batchEntries = sequenceEntries.splice(0, batchSize);
//     let batch: SequenceRecord = Object.fromEntries(batchEntries);

//     batch = Object.fromEntries(
//       Object.entries(batch).map(([id, sequence]) => {
//         if (sequence.length < maxSeqLength) {
//           return [id, sequence];
//         } else {
//           const { maxRegion } = candidateExtractor.transformHolt(sequence);
//           return [id, maxRegion];
//         }
//       })
//     );

//     let fixedSequences: string[] = [];
//     try {
//       fixedSequences = await fixOrientation(orientationPipeline, Object.values(batch));
//     } catch (error) {
//       logger.error('Error during orientation fixing:', error);
//       throw error;
//     }

//     batch = Object.fromEntries(
//       Object.entries(batch).map(([id], idx) => [id, fixedSequences[idx]])
//     );

//     const tokenizedSequences = Object.values(batch).map((sequence) => {
//       const encodedSequence: any = encodeAndEqualPadSequence(sequence, maxSeqLength, false);
//       return encodedSequence;
//     });

//     if (tokenizedSequences.length === 0) {
//       throw new Error('No sequences available for tensor creation.');
//     }

//     let inputTensor: any;
//     let tensorShape: string;

//     if (tokenizedSequences.length === 1) {
//       inputTensor = { tokenized_sequence: tf.tensor2d([tokenizedSequences[0]], [1, maxSeqLength], 'int32') };
//       tensorShape = 'single';
//     } else {
//       inputTensor = tf.stack(tokenizedSequences);
//       tensorShape = 'stacked';
//     }

//     queue.put({
//       tokenizedBatch: inputTensor,
//       orientationFixedSequences: batch,
//       tensorShape,
//     });
//   }

//   queue.put(null);
// }
