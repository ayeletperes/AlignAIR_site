/**
 * Model Metadata Loader
 * 
 * This utility loads model metadata from JSON files in the models directory.
 * It provides a centralized way to access model information for both UI and inference.
 */

import { logger } from '@components/utils/logger';

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
  referencePath: string;
  gradient: string;
  iconColor: string;
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
  // For now, we'll load the known models
  // In the future, this could scan the models directory dynamically
  const knownModelIds = ['igh-v1.0', 'igl-v1.0', 'tcrb-v1.0'];
  
  const metadataPromises = knownModelIds.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  logger.log('Model metadata loading results:', results);
  const validMetadata: ModelMetadata[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    } else {
      logger.warn(`Failed to load metadata for ${knownModelIds[index]}`);
    }
  });

  return validMetadata;
}

/**
 * Get models by chain type
 */
export async function getModelsByChainType(chainType: string): Promise<ModelMetadata[]> {
  const allMetadata = await loadAllModelMetadata();
  return allMetadata.filter(model => model.chainType === chainType && model.isActive);
}

/**
 * Get active models
 */
export async function getActiveModels(): Promise<ModelMetadata[]> {
  const allMetadata = await loadAllModelMetadata();
  return allMetadata.filter(model => model.isActive);
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
 * Helper function to determine model path from ID
 */
function getModelPathFromId(modelId: string): string | null {
  const modelPathMap: Record<string, string> = {
    'igh-v1.0': '/models/alignment/alignair_heavy',
    'igl-v1.0': '/models/alignment/alignair_light',
    'tcrb-v1.0': '/models/alignment/alignair_trb'
  };
  
  return modelPathMap[modelId] || null;
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
export async function preloadModelMetadata(modelIds: string[] = ['igh-v1.0', 'igl-v1.0', 'tcrb-v1.0']): Promise<void> {
  const promises = modelIds.map(id => loadModelMetadata(id));
  await Promise.allSettled(promises);
} 