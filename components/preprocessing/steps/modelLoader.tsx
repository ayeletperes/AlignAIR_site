import { DEFAULT_CHAIN_CONFIG } from '@components/preprocessing/steps/config';
import { ModelLoader, ChainConfig, ModelWarmupOptions } from '@components/model/utilities';
import * as tf from '@tensorflow/tfjs';

export interface ModelLoadingParams {
  chain: 'heavy' | 'light' | 'trb';
  modelPath?: string;
  orientationModelPath?: string;
  k?: number;
  maxLength?: number;
  allowedMismatches?: number;
  warmupOptions?: ModelWarmupOptions;
}

export interface ModelLoadingResult {
  loader: any;
  modelOutputNodes: Record<string, number>;
  metadata: any | null; // Add metadata as part of the return
}

export const loadModel = async ({
  chain,
  modelPath,
  orientationModelPath,
  k,
  maxLength,
  allowedMismatches,
  warmupOptions,
}: ModelLoadingParams): Promise<ModelLoadingResult> => {
  const chainConfig: ChainConfig = {
    name: chain,
    k: k || DEFAULT_CHAIN_CONFIG.k!,
    maxLength: maxLength || DEFAULT_CHAIN_CONFIG.maxLength!,
    allowedMismatches: allowedMismatches || DEFAULT_CHAIN_CONFIG.allowedMismatches!,
    modelPath: modelPath || DEFAULT_CHAIN_CONFIG.modelPath(chain),
    orientationModelPath: orientationModelPath || DEFAULT_CHAIN_CONFIG.orientationModelPath(chain),
  };

  const loader = new ModelLoader(chainConfig);
  
  // Pass warmup options to initialize
  await loader.initialize(warmupOptions);

  const model = loader.getModel();
  if (!model) {
    throw new Error('Failed to load model.');
  }
  
  // Get metadata and process output nodes
  const metadata = await loader.getModelMetadata();
  
  let modelOutputNodes: Record<string, number> = {};
  
  if (metadata && metadata.outputNodes) {
    // Process the new metadata format with outputNodes mapping
    modelOutputNodes = model.outputs.map((output) => output.name).reduce((acc, node, index) => {
      // The new format maps node names to human-readable names
      if (metadata.outputNodes[node]) {
        acc[metadata.outputNodes[node]] = index;
      }
      return acc;
    }, {} as Record<string, number>);
  }
  
  return { loader, modelOutputNodes, metadata };
};

