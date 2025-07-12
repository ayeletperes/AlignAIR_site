import { loadModel } from '@components/preprocessing/steps/modelLoader';
import { BatchProcessor } from '@components/preprocessing/steps/batchProcessor';
import { cleanAndArrangePredictions, CleanedPredictions } from '@components/postprocessing/steps/cleanAndArrange';
import { correctSegmentsForPaddings } from '@components/postprocessing/steps/segmentCorrection';
import { applyMaxLikelihoodThresholds } from '@components/postprocessing/steps/maxLikelihoodThreshold';
import { AlleleAlignmentStep } from '@components/postprocessing/steps/germlineAlignment';
import { translateVCallToIuisNames } from '@components/postprocessing/steps/translateToIUIS';
import { logger } from '@components/utils/logger';
import { getModelById } from '@components/model/modelMetadataLoader';
import { loadReferenceDataForModel } from '@components/reference/utilities';


// Global model cache - shared across preloading and submission
interface CachedModelData {
  loader: any;
  modelOutputNodes: Record<string, number>;
  timestamp: number;
}

const globalModelCache = new Map<string, CachedModelData>();

/**
 * Get or load a model with global caching
 */
export const getOrLoadModel = async (params: {
  chain: 'heavy' | 'light' | 'trb';
  modelPath?: string;
  orientationModelPath?: string;
  warmupOptions?: any;
}): Promise<{ loader: any; modelOutputNodes: Record<string, number> }> => {
  const { chain, modelPath, orientationModelPath, warmupOptions } = params;
  const cacheKey = `${chain}-${modelPath || 'default'}-${orientationModelPath || 'default'}`;
  
  // Check if model is already cached
  const cached = globalModelCache.get(cacheKey);
  if (cached) {
    logger.log(`Using cached ${chain} model`);
    return { loader: cached.loader, modelOutputNodes: cached.modelOutputNodes };
  }
  
  // Load model if not cached
  logger.log(`Loading new ${chain} model`);
  const { loader, modelOutputNodes } = await loadModel({
    chain,
    modelPath,
    orientationModelPath,
    warmupOptions,
  });
  
  // Cache the loaded model
  globalModelCache.set(cacheKey, {
    loader,
    modelOutputNodes,
    timestamp: Date.now(),
  });
  
  return { loader, modelOutputNodes };
};

/**
 * Get or load a model by ID using the new metadata system
 */
export const getOrLoadModelById = async (params: {
  modelId: string;
  warmupOptions?: any;
}): Promise<{ loader: any; modelOutputNodes: Record<string, number> }> => {
  const { modelId, warmupOptions } = params;
  
  // Check if model is already cached
  const cached = globalModelCache.get(modelId);
  if (cached) {
    logger.log(`Using cached model: ${modelId}`);
    return { loader: cached.loader, modelOutputNodes: cached.modelOutputNodes };
  }
  
  // Load model metadata
  const modelMetadata = await getModelById(modelId);
  if (!modelMetadata) {
    throw new Error(`Model not found: ${modelId}`);
  }
  
  // Load model if not cached
  logger.log(`Loading new model: ${modelId}`);
  const { loader, modelOutputNodes } = await loadModel({
    chain: modelMetadata.chainType,
    modelPath: modelMetadata.modelPath,
    orientationModelPath: modelMetadata.orientationModelPath,
    warmupOptions,
  });
  
  // Cache the loaded model
  globalModelCache.set(modelId, {
    loader,
    modelOutputNodes,
    timestamp: Date.now(),
  });
  
  return { loader, modelOutputNodes };
};

/**
 * Clear global model cache
 */
export const clearGlobalModelCache = (): void => {
  globalModelCache.clear();
  logger.log('Global model cache cleared');
};

/**
 * Get cache status
 */
export const getModelCacheStatus = () => {
  const status: Record<string, { cached: boolean; timestamp?: number }> = {};
  Array.from(globalModelCache.entries()).forEach(([key, value]) => {
    const chain = key.split('-')[0];
    status[chain] = {
      cached: true,
      timestamp: value.timestamp,
    };
  });
  return status;
};

let cachedModel: any = null;
let cachedChain: string | null = null;

const updateProgress = async (progress: number, setProgress: (progress: number) => void, delayMs: number = 20) => {
  setProgress(progress);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};

// export const submitAlignmentRequest = async (
//   formData: {
//     chain: 'heavy' | 'light' | 'trb';
//     input: string;
//     flag: 'file' | 'sequence';
//     params: any;
//     modelPath?: string;
//     orientationModelPath?: string;
//   },
//   setProgress: (progress: number) => void
// ) => {
//   try {
//     const { chain, input, flag, params, modelPath, orientationModelPath } = formData;
//     console.log(chain);
//     const timingAnalysis: Record<string, number> = {};

//     const stepStart = (stepName: string) => (timingAnalysis[stepName] = performance.now());
//     const stepEnd = (stepName: string) => {
//       timingAnalysis[stepName] = performance.now() - timingAnalysis[stepName];
//     };
//     stepStart('total');
//     await updateProgress(10, setProgress);
//     stepStart('loadModel');
//     // Load the model only if the chain has changed or model is not cached
//     if (cachedModel === null || cachedChain !== chain) {
//       cachedChain = chain;
//       const { loader, modelOutputNodes } = await getOrLoadModel({
//         chain,
//         modelPath,
//         orientationModelPath,
//         warmupOptions: {
//           enabled: false, // Skip warmup since models should already be preloaded and warmed
//           logWarmupTimes: false,
//         },
//       });
//       cachedModel = { loader, modelOutputNodes };
//     }
//     stepEnd('loadModel');
//     const { loader, modelOutputNodes } = cachedModel;

//     await updateProgress(20, setProgress);
//     stepStart('batchProcessor');
//     const { predictions, sequences } = await BatchProcessor({ chain, input, flag, loader });
//     stepEnd('batchProcessor');
//     await updateProgress(40, setProgress);
//     stepStart('cleanAndArrangePredictions');
//     const processedPredictions = cleanAndArrangePredictions({ predictions, modelOutputNodes, chain });
//     stepEnd('cleanAndArrangePredictions');
//     await updateProgress(60, setProgress);
//     stepStart('correctSegmentsForPaddings');
//     const processedSegments = correctSegmentsForPaddings({
//       sequences,
//       chain,
//       v_sequence_start: processedPredictions.v_sequence_start,
//       v_sequence_end: processedPredictions.v_sequence_end,
//       d_sequence_start: processedPredictions.d_sequence_start,
//       d_sequence_end: processedPredictions.d_sequence_end,
//       j_sequence_start: processedPredictions.j_sequence_start,
//       j_sequence_end: processedPredictions.j_sequence_end,
//     });
//     Object.assign(processedPredictions, processedSegments);
//     stepEnd('correctSegmentsForPaddings');
//     await updateProgress(70, setProgress);
//     stepStart('applyMaxLikelihoodThresholds');
//     const referenceMap = loader.getReferenceAlleles();
//     const paramThresholds = { V: params.vThresh, D: params.dThresh, J: params.jThresh };
//     const paramCaps = { V: params.vCap, D: params.dCap, J: params.jCap };
    
//     const { selectedAlleleCalls, likelihoodsOfSelectedAlleles } = await applyMaxLikelihoodThresholds({
//       chain,
//       predictions: processedPredictions,
//       referenceMap,
//       paramThresholds,
//       paramCaps,
//     });
    
//     ['V', 'D', 'J'].forEach((segment) => {
//       processedPredictions[`${segment.toLowerCase()}_call` as keyof CleanedPredictions] = selectedAlleleCalls[segment];
//       processedPredictions[`${segment.toLowerCase()}_likelihood` as keyof CleanedPredictions] = likelihoodsOfSelectedAlleles[segment];
//     });
//     stepEnd('applyMaxLikelihoodThresholds');
//     await updateProgress(80, setProgress);
//     stepStart('alleleAlignmentStep');
//     const alignmentStep = new AlleleAlignmentStep('AlignAIRR Step');
//     const germlineAlignments = alignmentStep.execute(chain, processedPredictions, referenceMap, Object.values(sequences));

//     for (const segment of Object.keys(germlineAlignments)) {
//       const segmentData = germlineAlignments[segment];

//       if (segmentData && typeof segmentData === 'object') {
//         const segmentRegions = Object.entries(segmentData);

//         processedPredictions[`${segment}_germline_start` as keyof CleanedPredictions] = segmentRegions.map(
//           ([, item]) => (item as { start_in_ref: number }).start_in_ref
//         );

//         processedPredictions[`${segment}_germline_end` as keyof CleanedPredictions] = segmentRegions.map(
//           ([, item]) => (item as { end_in_ref: number }).end_in_ref
//         );
//       } else {
//         logger.warn(`Skipping invalid or missing data for segment: ${segment}`);
//       }
//     }
//     stepEnd('alleleAlignmentStep');
//     await updateProgress(90, setProgress);
//     stepStart('translateVCallToIuisNames');
//     processedPredictions.v_call = translateVCallToIuisNames(processedPredictions.v_call, referenceMap.V);
//     stepEnd('translateVCallToIuisNames');
//     await updateProgress(100, setProgress);
//     stepEnd('total');
//     // Convert timing analysis to seconds
//     Object.keys(timingAnalysis).forEach((key) => {
//       timingAnalysis[key] = timingAnalysis[key] / 1000;
//     });
//     logger.log('Timing Analysis (in seconds):', timingAnalysis);

//     return { processedPredictions, sequences, referenceMap };
//   } catch (error) {
//     logger.error('Error during alignment submission:', error);
//     throw error;
//   }
// };

/**
 * Submit alignment request using model ID
 */
export const submitAlignmentRequestById = async (
  formData: {
    modelId: string;
    input: string;
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
    // Load the model by ID
    const { loader, modelOutputNodes } = await getOrLoadModelById({
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
    const { predictions, sequences } = await BatchProcessor({ chain, input, flag, loader });
    stepEnd('batchProcessor');
    
    await updateProgress(40, setProgress);
    stepStart('cleanAndArrangePredictions');
    const processedPredictions = cleanAndArrangePredictions({ predictions, modelOutputNodes, chain });
    stepEnd('cleanAndArrangePredictions');
    
    await updateProgress(60, setProgress);
    stepStart('correctSegmentsForPaddings');
    const processedSegments = correctSegmentsForPaddings({
      sequences,
      chain,
      v_sequence_start: processedPredictions.v_sequence_start,
      v_sequence_end: processedPredictions.v_sequence_end,
      d_sequence_start: processedPredictions.d_sequence_start,
      d_sequence_end: processedPredictions.d_sequence_end,
      j_sequence_start: processedPredictions.j_sequence_start,
      j_sequence_end: processedPredictions.j_sequence_end,
    });
    Object.assign(processedPredictions, processedSegments);
    stepEnd('correctSegmentsForPaddings');
    
    await updateProgress(70, setProgress);
    stepStart('applyMaxLikelihoodThresholds');

    const referenceMap  = loader.getReferenceAlleles();
    const paramThresholds = { V: params.vThresh, D: params.dThresh, J: params.jThresh };
    const paramCaps = { V: params.vCap, D: params.dCap, J: params.jCap };
    
    const { selectedAlleleCalls, likelihoodsOfSelectedAlleles } = await applyMaxLikelihoodThresholds({
      chain,
      predictions: processedPredictions,
      referenceMap,
      paramThresholds,
      paramCaps,
    });
    
    ['V', 'D', 'J'].forEach((segment) => {
      processedPredictions[`${segment.toLowerCase()}_call` as keyof CleanedPredictions] = selectedAlleleCalls[segment];
      processedPredictions[`${segment.toLowerCase()}_likelihood` as keyof CleanedPredictions] = likelihoodsOfSelectedAlleles[segment];
    });
    stepEnd('applyMaxLikelihoodThresholds');
    
    await updateProgress(80, setProgress);
    stepStart('alleleAlignmentStep');
    const alignmentStep = new AlleleAlignmentStep('AlignAIRR Step');
    const germlineAlignments = alignmentStep.execute(chain, processedPredictions, referenceMap, Object.values(sequences));

    for (const segment of Object.keys(germlineAlignments)) {
      const segmentData = germlineAlignments[segment];

      if (segmentData && typeof segmentData === 'object') {
        const segmentRegions = Object.entries(segmentData);

        processedPredictions[`${segment}_germline_start` as keyof CleanedPredictions] = segmentRegions.map(
          ([, item]) => (item as { start_in_ref: number }).start_in_ref
        );

        processedPredictions[`${segment}_germline_end` as keyof CleanedPredictions] = segmentRegions.map(
          ([, item]) => (item as { end_in_ref: number }).end_in_ref
        );
      } else {
        logger.warn(`Skipping invalid or missing data for segment: ${segment}`);
      }
    }
    stepEnd('alleleAlignmentStep');
    
    await updateProgress(90, setProgress);
    stepStart('translateVCallToIuisNames');
    processedPredictions.v_call = translateVCallToIuisNames(processedPredictions.v_call, referenceMap.V);
    stepEnd('translateVCallToIuisNames');
    
    await updateProgress(100, setProgress);
    stepEnd('total');
    
    // Convert timing analysis to seconds
    Object.keys(timingAnalysis).forEach((key) => {
      timingAnalysis[key] = timingAnalysis[key] / 1000;
    });
    logger.log('Timing Analysis (in seconds):', timingAnalysis);
    return { processedPredictions, sequences, referenceMap, modelMetadata };
  } catch (error) {
    logger.error('Error during alignment submission:', error);
    throw error;
  }
};
