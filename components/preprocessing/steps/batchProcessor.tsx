import { sequenceTokenizerWorker } from '@components/preprocessing/utilities/sequenceTokenizerWorker';
import { DEFAULT_CHAIN_CONFIG } from '@components/preprocessing/steps/config';
import { Queue } from '@components/preprocessing/utilities/queCreator';
import { SequenceRecord } from '@components/preprocessing/utilities/sequenceReaders';
import { logger } from '@components/utils/logger';

export interface ProcessingParams {
  chain: 'heavy' | 'light';
  input: string | File;
  flag: 'file' | 'sequence';
  loader: any;
  maxLength?: number;
  batchSize?: number;
}

export const BatchProcessor = async (params: ProcessingParams) => {
  const {
    chain,
    input,
    flag,
    loader,
    maxLength = DEFAULT_CHAIN_CONFIG.maxLength!,
    batchSize = DEFAULT_CHAIN_CONFIG.batchSize!,
  } = params;

  // Initialize a queue for batch processing
  const sequenceQueue = new Queue<any>(64);
  const predictions: any[] = [];
  const sequences: SequenceRecord = {};
  const batchTimes: number[] = [];
  let batchNumber = 0;
  let batch;
  const model = loader.getModel();

  logger.log('Starting batch processing...');
  const startTokenizerTime = performance.now();
  await sequenceTokenizerWorker(
    input,
    sequenceQueue,
    maxLength,
    loader.getOrientationModel(),
    loader.getCandidateExtractor(),
    batchSize,
    flag
  );
  //logger.log(performance.now()-startTokenizerTime);
  const startTime = performance.now();
  logger.log('Tokenizer finished. Starting batch prediction...');
  logger.log('There are ', sequenceQueue.size()-1, ' batches in the queue');

  try {
    while ((batch = sequenceQueue.get()) !== null || batchNumber<1) {
      if (!batch || !batch.tokenizedBatch) {
        logger.error('Invalid batch retrieved from queue');
        continue;
      }
      let batchStartTime = performance.now();
      const { tokenizedBatch, orientationFixedSequences, tensorShape } = batch;
      Object.assign(sequences, orientationFixedSequences);
      let batchEndTime = performance.now();
      batchStartTime = performance.now();
      let batchPredictions;
      try {
        batchPredictions = await model.predict(tokenizedBatch);
      } catch (error) {
        logger.error(`Error during batch prediction for batch ${batchNumber + 1}:`, error);
        continue;
      }
      batchEndTime = performance.now();

      batchTimes.push(batchEndTime - batchStartTime);
      predictions.push(batchPredictions);
      batchNumber++;
      //logger.log(`Processed Batch ${batchNumber}. Time: ${((batchEndTime - batchStartTime) / 1000).toFixed(2)} seconds.`);
    }

    //logger.log(`All batches processed in ${((performance.now() - startTime)/ 1000).toFixed(2)} seconds.`);

    return {
      predictions: predictions,
      sequences: sequences,
    };
  } catch (error) {
    logger.error('Error during batch processing:', error);
    throw error;
  }
};