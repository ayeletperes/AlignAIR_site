import { Species, getSpeciesModelPath, getSpeciesOrientationPath } from '@/config/species/config';

export const DEFAULT_CHAIN_CONFIG = {
    k: 11,
    maxLength: 576,
    allowedMismatches: 0,
    batchSize: 256,
    // Legacy paths for backward compatibility - deprecated, use species-aware functions
    modelPath: (chain: string) => `/models/alignment/human/${chain}/${chain}-v1.0/model.json`,
    modelMetadataPath: (chain: string) => `/models/alignment/human/${chain}/${chain}-v1.0/metadata.json`,
    orientationModelPath: (chain: string) => `/models/orientation/human/${chain}chain_ornt_pipeline.onnx`,
  };

// Species-aware model path builder
export const getModelPath = (species: Species, chain: string, modelId: string) => ({
  modelPath: getSpeciesModelPath(species, modelId),
  orientationModelPath: getSpeciesOrientationPath(species, chain),
});

// Legacy function for backward compatibility - use getModelPath with species instead
export const getLegacyModelPath = (chain: string, modelId: string) => ({
  modelPath: `/models/alignment/human/${chain}/${modelId}/model.json`,
  modelMetadataPath: `/models/alignment/human/${chain}/${modelId}/metadata.json`,
  orientationModelPath: `/models/orientation/human/${chain}chain_ornt_pipeline.onnx`,
});

  