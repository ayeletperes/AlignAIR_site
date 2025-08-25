import { logger } from '@/utils/logger';

export interface ProcessingParams {
  chain: 'heavy' | 'light' | 'trb';
  input: string | File;
  flag: 'file' | 'sequence';
  maxLength?: number;
  batchSize?: number;
}

export interface ProcessingResult {
  predictions: any[];
  sequences: Record<string, any>;
}

export interface SequenceTokenizer {
  tokenize(
    input: string | File,
    maxLength: number,
    batchSize: number,
    flag: 'file' | 'sequence'
  ): Promise<any[]>;
}

export interface ModelInference {
  predict(tokenizedBatch: any): Promise<any>;
}


export interface CandidateExtractor {
  extract(sequences: string[]): any;
}

export class BatchProcessor {
  async process(
    params: ProcessingParams,
    tokenizer: SequenceTokenizer,
    model: ModelInference,
    candidateExtractor: CandidateExtractor
  ): Promise<ProcessingResult> {
    const {
      input,
      flag,
      maxLength = 576,
      batchSize = 256,
    } = params;

    // Validate required components
    if (!model) throw new Error('Main model is not loaded');
    if (!candidateExtractor) throw new Error('Candidate extractor is not initialized');

    logger.info('Starting batch processing...');
    
    // Tokenize input sequences
    const tokenizedBatches = await tokenizer.tokenize(input, maxLength, batchSize, flag);
    const predictions: any[] = [];
    const sequences: Record<string, any> = {};
    let batchNumber = 0;

    logger.info(`Processing ${tokenizedBatches.length} batches...`);

    for (const batch of tokenizedBatches) {
      if (!batch || !batch.tokenizedBatch) {
        logger.error('Invalid batch retrieved from tokenizer');
        continue;
      }

      const startTime = performance.now();
      const { tokenizedBatch, orientationFixedSequences } = batch;
      
      // Merge sequences
      Object.assign(sequences, orientationFixedSequences);
      try {
        // Model prediction
        const batchPredictions = await model.predict(tokenizedBatch);
        predictions.push(batchPredictions);
        
        batchNumber++;
        const duration = performance.now() - startTime;
        logger.info(`Processed batch ${batchNumber}. Time: ${(duration / 1000).toFixed(2)}s`);
      } catch (error) {
        logger.error(`Error during batch prediction for batch ${batchNumber + 1}:`, error);
        continue;
      }
    }

    logger.info(`All ${batchNumber} batches processed successfully.`);

    return {
      predictions,
      sequences,
    };
  }
}