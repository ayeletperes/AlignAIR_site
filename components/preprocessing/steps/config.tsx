export const DEFAULT_CHAIN_CONFIG = {
    k: 11,
    maxLength: 576,
    allowedMismatches: 0,
    batchSize: 256,
    modelPath: (chain: string) => `/models/alignment/alignair_${chain}/model.json`,
    modelMetadataPath: (chain: string) => `/models/alignment/alignair_${chain}/metadata.json`,
    orientationModelPath: (chain: string) => `/models/orientation/${chain}chain_ornt_pipeline.onnx`,
  };
  