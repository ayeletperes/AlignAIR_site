import { logger } from '@/utils/logger';

export interface ProcessingParams {
  chain: 'heavy' | 'light' | 'trb';
  input: string | File;
  flag: 'file' | 'sequence';
  maxLength?: number;
  batchSize?: number;
  /**
   * Optional progress callback emitted while iterating batches.
   * `phase` distinguishes the tokenization sweep from inference so the
   * orchestrator can surface step-aware progress without sniffing percentages.
   */
  onPhaseProgress?: (phase: 'tokenize' | 'inference', percent: number) => void;
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

/**
 * Pick a batch size that scales with the host's hardware concurrency.
 * Floor 128 keeps single-core/low-spec devices honest; cap 1024 avoids
 * pathological GPU memory pressure on multi-thousand-sequence inputs.
 */
const getDefaultBatchSize = (): number => {
  const cores =
    (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
  return Math.max(128, Math.min(1024, cores * 64));
};

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
      batchSize = getDefaultBatchSize(),
      onPhaseProgress,
    } = params;

    // Validate required components
    if (!model) throw new Error('Main model is not loaded');
    if (!candidateExtractor) throw new Error('Candidate extractor is not initialized');

    logger.info('Starting batch processing...');

    onPhaseProgress?.('tokenize', 0);
    // Tokenize input sequences
    const tokenizedBatches = await tokenizer.tokenize(input, maxLength, batchSize, flag);
    onPhaseProgress?.('tokenize', 100);

    const predictions: any[] = [];
    const sequences: Record<string, any> = {};
    let batchNumber = 0;
    const totalBatches = tokenizedBatches.length;

    logger.info(`Processing ${totalBatches} batches...`);
    onPhaseProgress?.('inference', 0);

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
        if (totalBatches > 0) {
          onPhaseProgress?.('inference', Math.round((batchNumber / totalBatches) * 100));
        }
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