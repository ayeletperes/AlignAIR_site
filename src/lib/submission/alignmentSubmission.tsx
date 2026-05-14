import { loadModelById } from '@/lib/model/unifiedModelLoader';
import { BatchProcessor, SequenceTokenizer, ModelInference, CandidateExtractor } from '@/lib/preprocessing/Steps/BatchProcessor';
import { CleanAndArrangeStep } from '@/lib/postprocessing/Steps/CleanAndArrange';
import { logger } from '@/utils/logger';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { MODEL_ID_TO_CHAIN } from '@/config/model/config';
import { getOrLoadOrientationModel } from '@/lib/preprocessing/Orientation/utilities';
import { ParsedRecord } from '@/utils/preprocessing/sequenceParse';
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
 * LRU result cache keyed by canonical (input + modelId + params). Lets the
 * user re-run the same query (e.g. tweak a download option, undo a clear)
 * without paying for inference again. File inputs are not cached — hashing
 * a File would require reading it a second time, which defeats the win.
 */
const RESULT_CACHE_MAX = 16;
const resultCache = new Map<string, any>();

const lruGet = (key: string): any | undefined => {
  const v = resultCache.get(key);
  if (v === undefined) return undefined;
  // Touch: move to most-recently-used position
  resultCache.delete(key);
  resultCache.set(key, v);
  return v;
};

const lruSet = (key: string, value: any): void => {
  if (resultCache.has(key)) resultCache.delete(key);
  resultCache.set(key, value);
  while (resultCache.size > RESULT_CACHE_MAX) {
    const oldest = resultCache.keys().next().value;
    if (oldest === undefined) break;
    resultCache.delete(oldest);
  }
};

/**
 * Lightweight non-cryptographic string hash (FNV-1a 32-bit) for cache keys.
 * Collisions on this would be extremely rare for our payload sizes and the
 * cache itself is non-authoritative, so SHA via SubtleCrypto would be overkill.
 */
const fastHash = (s: string): string => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h.toString(16);
};

const buildCacheKey = (
  input: string | File | ParsedRecord[],
  modelId: string,
  params: any
): string | null => {
  // Don't cache File inputs; hashing them is a second full read.
  if (input instanceof File) return null;
  let canonicalInput: string;
  if (typeof input === 'string') {
    canonicalInput = input;
  } else if (Array.isArray(input)) {
    canonicalInput = input.map((r) => `${r.id || ''}|${r.sequence}`).join('\n');
  } else {
    return null;
  }
  return `${modelId}:${fastHash(canonicalInput)}:${fastHash(JSON.stringify(params || {}))}`;
};

export const clearResultCache = (): void => {
  resultCache.clear();
};


/**
 * Phases the alignment pipeline goes through, exposed to callers so they can
 * render step-aware progress UI without having to map percentages to labels.
 */
export type AlignmentPhase =
  | 'loading-model'
  | 'tokenizing'
  | 'inferring'
  | 'postprocessing'
  | 'complete';

export interface SubmitAlignmentCallbacks {
  setProgress: (progress: number) => void;
  setPhase?: (phase: AlignmentPhase) => void;
}

/**
 * Submit alignment request using model ID.
 *
 * Backwards-compatible: pass either a setProgress callback (legacy) or a
 * { setProgress, setPhase } object.
 */
export const submitAlignmentRequestById = async (
  modelId: string,
  input: string | File | ParsedRecord[],
  flag: 'file' | 'sequence',
  params: any,
  progress: ((progress: number) => void) | SubmitAlignmentCallbacks
) => {
  const { setProgress, setPhase }: SubmitAlignmentCallbacks =
    typeof progress === 'function'
      ? { setProgress: progress }
      : progress;

  // Cache lookup before any expensive work. On hit, fast-forward the progress
  // bar so the UI still feels responsive (no abrupt "done" without phases).
  const cacheKey = buildCacheKey(input, modelId, params);
  if (cacheKey) {
    const cached = lruGet(cacheKey);
    if (cached) {
      logger.info('Alignment cache hit — skipping inference');
      setPhase?.('complete');
      setProgress(100);
      return cached;
    }
  }
  try {

    const timingAnalysis: Record<string, number> = {};

    const stepStart = (stepName: string) => (timingAnalysis[stepName] = performance.now());
    const stepEnd = (stepName: string) => {
      timingAnalysis[stepName] = performance.now() - timingAnalysis[stepName];
    };

    stepStart('total');
    setPhase?.('loading-model');
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

    setPhase?.('tokenizing');
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
          input as ParsedRecord[] | File,
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

    // Create BatchProcessor and run processing.
    // Map internal phase callbacks to (a) the orchestrator's phase state and
    // (b) an evolving numeric percentage in the 20-85 range so the overall
    // progress bar keeps moving while batches stream through inference.
    const batchProcessor = new BatchProcessor();
    const { predictions, sequences } = await batchProcessor.process(
      {
        chain: chain as any,
        input: input as string | File,
        flag: flag as any,
        onPhaseProgress: (phase, percent) => {
          if (phase === 'tokenize') {
            // 20 -> 30 across tokenization
            void updateProgress(20 + Math.round(percent * 0.1), setProgress, 0);
          } else {
            setPhase?.('inferring');
            // 30 -> 85 across inference
            void updateProgress(30 + Math.round(percent * 0.55), setProgress, 0);
          }
        },
      },
      tokenizer,
      modelInference,
      candidateExtractor
    );
    stepEnd('batchProcessor');

    setPhase?.('postprocessing');
    await updateProgress(90, setProgress);
    stepStart('cleanAndArrangePredictions');
    const referenceLoader = loader.getReferenceLoader();
    const cleanAndArrangeStep = new CleanAndArrangeStep('Clean and Arrange Predictions');
    const processedPredictions = await cleanAndArrangeStep.execute(
      predictions, modelOutputNodes, 
      chain, sequences, 
      referenceLoader, modelMetadata.hasD, 
      modelMetadata.multiChain, params);
    stepEnd('cleanAndArrangePredictions');
    setPhase?.('complete');
    await updateProgress(100, setProgress);
    stepEnd('total');
    
    // Convert timing analysis to seconds
    Object.keys(timingAnalysis).forEach((key) => {
      timingAnalysis[key] = timingAnalysis[key] / 1000;
    });
    logger.info('Timing Analysis (in seconds):', timingAnalysis);
    const result = { processedPredictions, sequences, referenceLoader, modelMetadata };
    if (cacheKey) lruSet(cacheKey, result);
    return result;
  } catch (error) {
    logger.error('Error during alignment submission:', error);
    throw error;
  }
};
