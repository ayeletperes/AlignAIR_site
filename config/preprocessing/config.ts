export const DEFAULT_CHAIN_CONFIG = {
    k: 11,
    maxLength: 576,
    allowedMismatches: 0,
    batchSize: 256,
    // Legacy paths for backward compatibility
    modelPath: (chain: string) => `/models/alignment/${chain}/${chain}-v1.0/model.json`,
    modelMetadataPath: (chain: string) => `/models/alignment/${chain}/${chain}-v1.0/metadata.json`,
    orientationModelPath: (chain: string) => `/models/orientation/${chain}chain_ornt_pipeline.onnx`,
  };

// New model path builder for versioned models
export const getModelPath = (chain: string, modelId: string) => ({
  modelPath: `/models/alignment/${chain}/${modelId}/model.json`,
  modelMetadataPath: `/models/alignment/${chain}/${modelId}/metadata.json`,
  orientationModelPath: `/models/orientation/${chain}chain_ornt_pipeline.onnx`,
});

// Model ID to chain mapping
export const MODEL_ID_TO_CHAIN: Record<string, string> = {
  'igh-v1.0': 'heavy',
  'igh-v2.0': 'heavy',
  'igl-v1.0': 'light',
  'igl-v2.0': 'light',
  'trb-v1.0': 'trb',
};

// Available model versions per chain
export const AVAILABLE_MODELS = {
  heavy: ['igh-v1.0', 'igh-v2.0'],
  light: ['igl-v1.0', 'igl-v2.0'],
  trb: ['trb-v1.0'],
};
  