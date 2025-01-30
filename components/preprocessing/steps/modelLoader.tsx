import { DEFAULT_CHAIN_CONFIG } from '@components/preprocessing/steps/config';
import { ModelLoader, ChainConfig } from '@components/model/utilities';
import * as tf from '@tensorflow/tfjs';

export interface ModelLoadingParams {
  chain: 'heavy' | 'light';
  modelPath?: string;
  modelMetadataPath?: string;
  orientationModelPath?: string;
  k?: number;
  maxLength?: number;
  allowedMismatches?: number;
}

export interface ModelLoadingResult {
  loader: any;
  modelOutputNodes: Record<string, number>;
  metadata: any | null; // Add metadata as part of the return
}

export const loadModel = async ({
  chain,
  modelPath,
  modelMetadataPath,
  orientationModelPath,
  k,
  maxLength,
  allowedMismatches,
}: ModelLoadingParams): Promise<ModelLoadingResult> => {
  const chainConfig: ChainConfig = {
    name: chain,
    k: k || DEFAULT_CHAIN_CONFIG.k!,
    maxLength: maxLength || DEFAULT_CHAIN_CONFIG.maxLength!,
    allowedMismatches: allowedMismatches || DEFAULT_CHAIN_CONFIG.allowedMismatches!,
    modelPath: modelPath || DEFAULT_CHAIN_CONFIG.modelPath(chain),
    modelMetadataPath: modelMetadataPath || DEFAULT_CHAIN_CONFIG.modelMetadataPath(chain),
    orientationModelPath: orientationModelPath || DEFAULT_CHAIN_CONFIG.orientationModelPath(chain),
  };

  const loader = new ModelLoader(chainConfig);
  await loader.initialize();

  const model = loader.getModel();
  if (!model) {
    throw new Error('Failed to load model.');
  }
  
  // Metadata processing guard
  let metadata: any | null = null;
  let modelOutputNodes: Record<string, number> = {};
  if (chainConfig.modelMetadataPath) {
    metadata = await loader.getModelMetadata();
    modelOutputNodes = model.outputs.map((output) => output.name).reduce((acc, node, index) => {
      const key = `${node}:0`;
      if (metadata && metadata[key]) {
        acc[metadata[key]] = index;
      }
      return acc;
    }, {} as Record<string, number>);
    
  }
  
  return { loader, modelOutputNodes, metadata };
};

