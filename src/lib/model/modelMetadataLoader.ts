/**
 * Model Metadata Loader
 * 
 * This utility loads model metadata from JSON files in the models directory.
 * It provides a centralized way to access model information for both UI and inference.
 */

import { logger } from '@/utils/logger';
import { 
  ALL_MODEL_IDS, 
  DEFAULT_MODEL_IDS, 
  MODEL_PATH_MAP, 
  CHAIN_MODEL_IDS, 
  AVAILABLE_MODELS,
  getModelPathFromId,
  getModelIdsForChainType,
  getStaticModelById,
  type ModelId,
  type ChainType
} from '@/config/model/config';

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  chainType: 'heavy' | 'light' | 'trb';
  species: string;
  referenceSet: string;
  lastUpdated: string;
  description: string;
  features: string[];
  documentationUrl?: string;
  modelPath: string;
  checkpoint: string;
  orientationModelPath: string;
  referencePath: string | string[];
  hasD: boolean;
  multiChain: boolean;
  isActive: boolean;
  outputNodes: Record<string, string>;
}

// Cache for loaded metadata to avoid repeated fetches
const metadataCache = new Map<string, ModelMetadata>();

/**
 * Load metadata for a specific model by ID
 */
export async function loadModelMetadata(modelId: string): Promise<ModelMetadata | null> {
  // Check cache first
  if (metadataCache.has(modelId)) {
    return metadataCache.get(modelId)!;
  }

  try {
    // Determine the model path based on ID
    const modelPath = getModelPathFromId(modelId);
    if (!modelPath) {
      logger.warn(`Unknown model ID: ${modelId}`);
      return null;
    }

    // Fetch the metadata file
    const response = await fetch(`${modelPath}/metadata.json`);
    if (!response.ok) {
      logger.error(`Failed to load metadata for ${modelId}: ${response.statusText}`);
      return null;
    }

    const metadata: ModelMetadata = await response.json();
    
    // Validate required fields
    if (!metadata.id || !metadata.name || !metadata.chainType) {
      logger.error(`Invalid metadata for ${modelId}: missing required fields`);
      return null;
    }

    // Cache the metadata
    metadataCache.set(modelId, metadata);
    return metadata;
  } catch (error) {
    logger.error(`Error loading metadata for ${modelId}:`, error);
    return null;
  }
}

/**
 * Load metadata for all available models
 */
export async function loadAllModelMetadata(): Promise<ModelMetadata[]> {
  const metadataPromises = ALL_MODEL_IDS.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  const validMetadata: ModelMetadata[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    } else {
      // Only log warnings in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`Failed to load metadata for ${ALL_MODEL_IDS[index]}`);
      }
    }
  });

  return validMetadata;
}

/**
 * Load only default models (one per chain type)
 */
export async function loadDefaultModelMetadata(): Promise<ModelMetadata[]> {
  const metadataPromises = DEFAULT_MODEL_IDS.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  
  const validMetadata: ModelMetadata[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    } else {
      // Only log warnings in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`Failed to load default metadata for ${DEFAULT_MODEL_IDS[index]}`);
      }
    }
  });

  return validMetadata;
}

/**
 * Get models by chain type (lazy loading - only loads when explicitly requested)
 */
export async function getModelsByChainType(chainType: string): Promise<ModelMetadata[]> {
  const modelIds = getModelIdsForChainType(chainType);
  const metadataPromises = modelIds.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  
  const validMetadata: ModelMetadata[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    }
  });
  
  return validMetadata.filter(model => model.isActive);
}

/**
 * Get active models (lazy loading - only loads when explicitly requested)
 */
export async function getActiveModels(): Promise<ModelMetadata[]> {
  return await loadDefaultModelMetadata();
}

/**
 * Get default model for a chain type
 */
export async function getDefaultModelForChain(chainType: string): Promise<ModelMetadata | null> {
  const models = await getModelsByChainType(chainType);
  return models.length > 0 ? models[0] : null;
}

/**
 * Get model by ID
 */
export async function getModelById(id: string): Promise<ModelMetadata | null> {
  return await loadModelMetadata(id);
}

/**
 * Clear the metadata cache (useful for development/testing)
 */
export function clearMetadataCache(): void {
  metadataCache.clear();
}

/**
 * Get cached metadata (for synchronous access when available)
 */
export function getCachedMetadata(modelId: string): ModelMetadata | null {
  return metadataCache.get(modelId) || null;
}

/**
 * Preload metadata for better performance
 */
export async function preloadModelMetadata(modelIds: readonly string[] = ALL_MODEL_IDS): Promise<void> {
  const promises = modelIds.map(id => loadModelMetadata(id));
  await Promise.allSettled(promises);
}

/**
 * Preload only default model metadata (recommended for startup)
 */
export async function preloadDefaultModelMetadata(): Promise<void> {
  await preloadModelMetadata(DEFAULT_MODEL_IDS);
}


// Re-export static data and types for convenience
export { 
  AVAILABLE_MODELS,
  ALL_MODEL_IDS,
  DEFAULT_MODEL_IDS,
  MODEL_PATH_MAP,
  CHAIN_MODEL_IDS,
  getModelPathFromId,
  getModelIdsForChainType,
  getStaticModelById,
  type ModelId,
  type ChainType
};