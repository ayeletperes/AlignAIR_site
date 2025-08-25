"use client";

import { loadModelById } from '@/lib/model/unifiedModelLoader';
import { BatchProcessor, SequenceTokenizer, ModelInference, CandidateExtractor } from '@/lib/preprocessing/Steps/BatchProcessor';
import { CleanAndArrangeStep } from '@/lib/postprocessing/Steps/CleanAndArrange';
import { logger } from '@/utils/logger';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { MODEL_ID_TO_CHAIN } from '@/config/preprocessing/config';
import { getOrLoadOrientationModel } from '@/lib/preprocessing/Orientation/utilities';

/**
 * Load only the default IGH model at startup
 * NOTE: Now delegates to unified model loader
 */
export const loadDefaultModel = async (): Promise<void> => {
  const { preloadDefaultModel } = await import('@/lib/model/unifiedModelLoader');
  return preloadDefaultModel();
};

/**
 * Remove a specific alignment model from cache
 * NOTE: Now delegates to unified model loader
 */
export const removeModelFromCache = (modelId: string): boolean => {
  // Delegate to unified model loader
  logger.info(`[CacheManager] Model removal now handled by unified loader: ${modelId}`);
  return true; // For backward compatibility
};

// NOTE: Cache management functions moved to unified model loader

// NOTE: getOrLoadModel and getOrLoadModelById functions removed
// Now handled by unified model loader at /lib/model/unifiedModelLoader.ts

/**
 * Clear global model cache
 * NOTE: Now delegates to unified model loader
 */
export const clearGlobalModelCache = (): void => {
  const { clearModelCache } = require('@/lib/model/unifiedModelLoader');
  clearModelCache();
  logger.info('Global model cache cleared via unified loader');
};

/**
 * Get cache status
 * NOTE: Now delegates to unified model loader
 */
export const getModelCacheStatus = () => {
  const { getModelCacheStatus } = require('@/lib/model/unifiedModelLoader');
  return getModelCacheStatus();
};

/**
 * Get detailed cache information
 * NOTE: Now delegates to unified model loader
 */
export const getDetailedCacheStatus = () => {
  const { getModelCacheStatus } = require('@/lib/model/unifiedModelLoader');
  return getModelCacheStatus();
};

/**
 * Log cache status (only in development mode)
 * NOTE: Now delegates to unified model loader
 */
export const logModelCacheStatus = () => {
  if (process.env.NODE_ENV === 'development') {
    const detailed = getDetailedCacheStatus();
    logger.info(`[CacheStatus] Using unified model loader cache`);
  }
};

let cachedModel: any = null;
let cachedChain: string | null = null;

const updateProgress = async (progress: number, setProgress: (progress: number) => void, delayMs: number = 20) => {
  setProgress(progress);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};


/**
 * Submit alignment request using model ID
 */
export const submitAlignmentRequestById = async (
  formData: {
    modelId: string;
    input: string | File;
    flag: 'file' | 'sequence';
    params: any;
  },
  setProgress: (progress: number) => void
) => {
  try {
    const { modelId, input, flag, params } = formData;
    
    const timingAnalysis: Record<string, number> = {};

    const stepStart = (stepName: string) => (timingAnalysis[stepName] = performance.now());
    const stepEnd = (stepName: string) => {
      timingAnalysis[stepName] = performance.now() - timingAnalysis[stepName];
    };
    
    stepStart('total');
    await updateProgress(10, setProgress);
    
    stepStart('loadModel');
    // Load the model by ID using unified loader
    const { loader, modelOutputNodes } = await loadModelById({
      modelId,
      warmupOptions: {
        enabled: false, // Skip warmup since models should already be preloaded and warmed
        logWarmupTimes: false,
      },
    });
    stepEnd('loadModel');
    
    // Get model metadata for chain type
    const modelMetadata = await getModelById(modelId);
    if (!modelMetadata) {
      throw new Error(`Model not found: ${modelId}`);
    }
    const chain = modelMetadata.chainType;

    await updateProgress(20, setProgress);
    stepStart('batchProcessor');
    
    // Create adapters to bridge the loader with BatchProcessor interfaces
    const modelInference: ModelInference = {
      predict: async (tokenizedBatch: any) => {
        return await loader.model.predict(tokenizedBatch);
      }
    };

    const tokenizer: SequenceTokenizer = {
      tokenize: async (input: string | File, maxLength: number, batchSize: number, flag: 'file' | 'sequence') => {
        // Use the loader's built-in tokenization if available
        if (loader.tokenizeInput) {
          return await loader.tokenizeInput(input, maxLength, batchSize, flag);
        }
        
        // Use the dedicated tokenization worker instead of duplicating logic
        const { sequenceTokenizerWorker } = await import('@/utils/preprocessing/sequenceTokenizerWorker');
        
        // Create a simple queue to collect results
        const results: any[] = [];
        const queue = {
          put: (item: any) => {
            if (item !== null) {
              results.push(item);
            }
          }
        };
        
        // Get orientation model for processing
        const chainType = MODEL_ID_TO_CHAIN[modelId] || chain;
        const orientationModel = modelMetadata?.orientationModelPath ? 
          await getOrLoadOrientationModel(chainType, modelMetadata.orientationModelPath) : null;
        
        // Get candidate extractor from loader if available
        const candidateExtractor = loader.extractCandidates ? 
          { transformHolt: (sequence: string) => loader.extractCandidates([sequence]) } : 
          { transformHolt: (sequence: string) => ({ maxRegion: sequence }) };
        
        // Run the tokenization worker
        await sequenceTokenizerWorker(
          input,
          queue,
          maxLength,
          orientationModel,
          candidateExtractor,
          batchSize,
          flag
        );
        
        return results;
      }
    };

    const candidateExtractor: CandidateExtractor = {
      extract: (sequences: string[]) => {
        // Use loader's candidate extraction if available
        if (loader.extractCandidates) {
          return loader.extractCandidates(sequences);
        }
        return {}; // Return empty if no extraction
      }
    };

    // Create BatchProcessor and run processing
    const batchProcessor = new BatchProcessor();
    const { predictions, sequences } = await batchProcessor.process(
      { chain: chain as any, input, flag: flag as any },
      tokenizer,
      modelInference,
      candidateExtractor
    );
    stepEnd('batchProcessor');
    
    await updateProgress(40, setProgress);
    stepStart('cleanAndArrangePredictions');
    const referenceLoader = loader.getReferenceLoader();
    const cleanAndArrangeStep = new CleanAndArrangeStep('Clean and Arrange Predictions');
    const processedPredictions = await cleanAndArrangeStep.execute(
      predictions, modelOutputNodes, 
      chain, sequences, 
      referenceLoader, modelMetadata.hasD, 
      modelMetadata.multiChain, params);
    stepEnd('cleanAndArrangePredictions');
    await updateProgress(100, setProgress);
    stepEnd('total');
    
    // Convert timing analysis to seconds
    Object.keys(timingAnalysis).forEach((key) => {
      timingAnalysis[key] = timingAnalysis[key] / 1000;
    });
    logger.info('Timing Analysis (in seconds):', timingAnalysis);
    return { processedPredictions, sequences, referenceLoader, modelMetadata };
  } catch (error) {
    logger.error('Error during alignment submission:', error);
    throw error;
  }
};
