/**
 * Unified Model Loader
 * Consolidates the ModelManager and global cache approaches
 * Provides backward compatibility while eliminating duplication
 */

import { ModelManager } from './modelManager';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { logger } from '@/utils/logger';
import { renameIdentityKeysNumber } from '@/utils/models/outputNodes';

// Global instance to replace the duplicate global caches
const globalModelManager = new ModelManager({
  autoWarmup: true,
  maxMemoryUsageMB: 2048,
  enableMemoryMonitoring: true,
});

/**
 * Unified model loading function that replaces both getOrLoadModel and getOrLoadModelById
 */
export const loadModelById = async (params: {
  modelId: string;
  warmupOptions?: any;
}): Promise<{ loader: any; modelOutputNodes: Record<string, number> }> => {
  const { modelId, warmupOptions } = params;
  
  logger.info(`[UnifiedModelLoader] Loading model: ${modelId}`);
  
  // Get model metadata
  const modelMetadata = await getModelById(modelId);
  if (!modelMetadata) {
    throw new Error(`Model not found: ${modelId}`);
  }
  
  // Create chain config for ModelManager
  const chainConfig = {
    name: modelMetadata.chainType,
    modelPath: modelMetadata.modelPath,
    orientationModelPath: modelMetadata.orientationModelPath,
    k: 11,
    maxLength: 576,
    allowedMismatches: 0,
    batchSize: 256,
    modelId: modelId
  };
  
  // Use ModelManager to load the model
  const loader = await globalModelManager.loadModel(chainConfig, warmupOptions);
  const modelOutputNodes = renameIdentityKeysNumber(modelMetadata.outputNodes);
  
  return { loader, modelOutputNodes };
};

/**
 * Load orientation model (consolidates orientation model loading)
 */
export const loadOrientationModel = async (chainType: string, orientationModelPath: string): Promise<any> => {
  // This would use a similar approach for orientation models
  // For now, delegate to the existing implementation to avoid breaking changes
  const { getOrLoadOrientationModel } = await import('@/lib/preprocessing/Orientation/utilities');
  return getOrLoadOrientationModel(chainType, orientationModelPath);
};

/**
 * Get model cache status
 */
export const getModelCacheStatus = () => {
  // Return a basic status structure for backward compatibility
  return {
    alignment: { count: 0, size: 0, models: [] as any[]},
    orientation: { count: 0, size: 0, models: [] as any[]},
    total: { count: 0, size: 0 }
  };
};

/**
 * Clear all cached models
 */
export const clearModelCache = () => {
  globalModelManager.disposeAllModels();
};

/**
 * Preload default model
 */
export const preloadDefaultModel = async (): Promise<void> => {
  try {
    await loadModelById({ modelId: 'IGH_S5F_576' });
    logger.info('[UnifiedModelLoader] Default IGH model preloaded successfully');
  } catch (error) {
    logger.error('[UnifiedModelLoader] Failed to preload default IGH model:', error);
  }
};

// Export the global instance for direct access if needed
export { globalModelManager };