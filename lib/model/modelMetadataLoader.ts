/**
 * Model Metadata Loader
 * 
 * This utility loads model metadata from JSON files in the models directory.
 * It provides a centralized way to access model information for both UI and inference.
 */

import { logger } from '@/utils/logger';

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
  // For now, we'll load the known models
  // In the future, this could scan the models directory dynamically
  const knownModelIds = ['igh-v1.0', 'igl-v1.0', 'trb-v1.0', 'igh-v2.0', 'igl-v2.0'];
  
  const metadataPromises = knownModelIds.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  const validMetadata: ModelMetadata[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    } else {
      // Only log warnings in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`Failed to load metadata for ${knownModelIds[index]}`);
      }
    }
  });

  return validMetadata;
}

/**
 * Load only default models (one per chain type)
 */
export async function loadDefaultModelMetadata(): Promise<ModelMetadata[]> {
  // Only load the IGH model for better startup performance
  const defaultModelIds = ['igh-v1.0'];
  
  const metadataPromises = defaultModelIds.map(id => loadModelMetadata(id));
  const results = await Promise.allSettled(metadataPromises);
  
  const validMetadata: ModelMetadata[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      validMetadata.push(result.value);
    } else {
      // Only log warnings in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.warn(`Failed to load default metadata for ${defaultModelIds[index]}`);
      }
    }
  });

  return validMetadata;
}

/**
 * Get models by chain type (lazy loading - only loads when explicitly requested)
 */
export async function getModelsByChainType(chainType: string): Promise<ModelMetadata[]> {
  // Only load models for the specific chain type, not all models
  const chainModelIds: Record<string, string[]> = {
    heavy: ['igh-v1.0', 'igh-v2.0'],
    light: ['igl-v1.0', 'igl-v2.0'],
    trb: ['trb-v1.0']
  };
  
  const modelIds = chainModelIds[chainType] || [];
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
  // Only load default models by default, not all models
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
 * Helper function to determine model path from ID
 */
function getModelPathFromId(modelId: string): string | null {
  const modelPathMap: Record<string, string> = {
    'igh-v1.0': '/models/alignment/heavy/igh-v1.0',
    'igl-v1.0': '/models/alignment/light/igl-v1.0',
    'trb-v1.0': '/models/alignment/trb/trb-v1.0',
    'igh-v2.0': '/models/alignment/heavy/igh-v2.0',
    'igl-v2.0': '/models/alignment/light/igl-v2.0'
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
export async function preloadModelMetadata(modelIds: string[] = ['igh-v1.0', 'igl-v1.0', 'trb-v1.0', 'igh-v2.0', 'igl-v2.0']): Promise<void> {
  const promises = modelIds.map(id => loadModelMetadata(id));
  await Promise.allSettled(promises);
}

/**
 * Preload only default model metadata (recommended for startup)
 */
export async function preloadDefaultModelMetadata(): Promise<void> {
  // Only preload the IGH model for better startup performance
  await preloadModelMetadata(['igh-v1.0']);
}

// Static model data for compatibility with non-async components
export const AVAILABLE_MODELS: ModelMetadata[] = [
  {
    id: "igh-v1.0",
    name: "IGH Heavy Chain",
    version: "v1.0",
    chainType: "heavy",
    species: "Human",
    hasD: true,
    multiChain: false,
    referenceSet: "OGRDB V8",
    lastUpdated: "February 2025",
    "description": "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    features: ["V/D/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/heavy/igh-v1.0/model.json",
    checkpoint: "/app/pretrained_models/IGH_S5F_576", 
    orientationModelPath: "/models/orientation/heavychain_ornt_pipeline.onnx",
    referencePath: "/dataconfig/HUMAN_IGH_OGRDB.json",
    isActive: true,
    outputNodes: {
        "Identity_8": "productive",
        "Identity_9": "v_allele",
        "Identity_3": "indel_count",
        "Identity_2": "d_sequence_start",
        "Identity_6": "j_sequence_start",
        "Identity_1": "d_sequence_end",
        "Identity": "d_allele",
        "Identity_11": "v_sequence_start",
        "Identity_10": "v_sequence_end",
        "Identity_4": "j_allele",
        "Identity_7": "mutation_rate",
        "Identity_5": "j_sequence_end"
    }
  },
  {
    id: "igh-v2.0",
    name: "IGH Heavy Chain Extended",
    version: "v1.0",
    chainType: "heavy",
    species: "Human",
    hasD: true,
    multiChain: false,
    referenceSet: "Human Unified set of Alleles (HUSA)",
    lastUpdated: "August 2025",
    description: "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    features: ["V/D/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/heavy/igh-v2.0/model.json",
    checkpoint: "",
    orientationModelPath: "/models/orientation/heavychain_ornt_pipeline.onnx",
    referencePath: "/dataconfig/HUMAN_IGH_EXTENDED.json",
    isActive: true,
    outputNodes: {
        "Identity_8": "productive",
        "Identity_9": "v_allele",
        "Identity_3": "indel_count",
        "Identity_2": "d_sequence_start",
        "Identity_6": "j_sequence_start",
        "Identity_1": "d_sequence_end",
        "Identity": "d_allele",
        "Identity_11": "v_sequence_start",
        "Identity_10": "v_sequence_end",
        "Identity_4": "j_allele",
        "Identity_7": "mutation_rate",
        "Identity_5": "j_sequence_end"
    }
  },
  {
    id: "igl-v1.0",
    name: "IGL/IGK Light Chain",
    version: "v1.0",
    chainType: "light",
    species: "Human",
    hasD: false,
    multiChain: false,
    referenceSet: "OGRDB V2 & V3 extended",
    lastUpdated: "March 2025",
    description: "Immunoglobulin Lambda Light Chain model with enhanced V/J prediction",
    features: ["V/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/light/igl-v1.0/model.json",
    checkpoint: "/app/pretrained_models/IGL_S5F_576",
    orientationModelPath: "/models/orientation/lightchain_ornt_pipeline.onnx",
    referencePath: "/dataconfig/HUMAN_IGL_OGRDB.json,/dataconfig/HUMAN_IGK_OGRDB.json",
    isActive: true,
    outputNodes: {
        "Identity_8": "v_sequence_end",
        "Identity_9": "v_sequence_start",
        "Identity_3": "j_sequence_start",
        "Identity_2": "j_sequence_end",
        "Identity_6": "type",
        "Identity_1": "j_allele",
        "Identity": "indel_count",
        "Identity_4": "mutation_rate",
        "Identity_7": "v_allele",
        "Identity_5": "productive"
    }
  },
  {
    id: "igl-v2.0",
    name: "IGL/IGK Light Chain",
    version: "v2.0",
    chainType: "light",
    species: "Human",
    hasD: false,
    multiChain: true,
    referenceSet: "Human Unified set of Alleles (HUSA)",
    lastUpdated: "August 2025",
    description: "Immunoglobulin Lambda Light Chain model with enhanced V/J prediction and extended reference set",
    features: ["V/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment", "Extended reference set"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/light/igl-v2.0/model.json",
    checkpoint: "/app/pretrained_models/IGL_S5F_576",
    orientationModelPath: "/models/orientation/lightchain_ornt_pipeline.onnx",
    referencePath: ["/dataconfig/HUMAN_IGL_EXTENDED.json", "/dataconfig/HUMAN_IGK_EXTENDED.json"],
    isActive: true,
    outputNodes: {
        "Identity": "v_sequence_end",
        "Identity_1": "chain_type",
        "Identity_2": "v_sequence_start",
        "Identity_3": "indel_count",
        "Identity_4": "mutation_rate",
        "Identity_5": "j_allele",
        "Identity_6": "j_sequence_end",
        "Identity_7": "productive",
        "Identity_8": "j_sequence_start",
        "Identity_9": "v_allele"
    }
  },
  {
    id: "trb-v1.0",
    name: "TCRB Beta Chain",
    version: "v1.0",
    chainType: "trb",
    species: "Human",
    hasD: true,
    multiChain: false,
    referenceSet: "IMGT 2022",
    lastUpdated: "July 2025",
    description: "T Cell Receptor Beta Chain model optimized for TCR repertoire analysis",
    features: ["V/D/J segmentation", "Allele calling", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/trb/trb-v1.0/model.json",
    checkpoint: "/app/pretrained_models/TCRB_UNIFORM_576",
    orientationModelPath: "/models/orientation/trbchain_ornt_pipeline.onnx",
    referencePath: "/dataconfig/HUMAN_TCRB_IMGT.json",
    isActive: true,
    outputNodes: {
        "Identity_8": "productive",
        "Identity_9": "v_allele",
        "Identity_3": "indel_count",
        "Identity_2": "d_sequence_start",
        "Identity_6": "j_sequence_start",
        "Identity_1": "d_sequence_end",
        "Identity": "d_allele",
        "Identity_11": "v_sequence_start",
        "Identity_10": "v_sequence_end",
        "Identity_4": "j_allele",
        "Identity_7": "mutation_rate",
        "Identity_5": "j_sequence_end"
    }
  }
]; 