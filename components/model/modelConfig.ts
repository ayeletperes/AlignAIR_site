export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  chainType: 'heavy' | 'light' | 'trb';
  species: string;
  referenceSet: string;
  lastUpdated: string;
  description: string;
  modelPath: string;
  modelMetadataPath: string;
  orientationModelPath: string;
  features: string[];
  documentationUrl?: string;
  isActive: boolean;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'igh-v1.0',
    name: 'IGH Heavy Chain',
    version: 'v1.0',
    chainType: 'heavy',
    species: 'Human',
    referenceSet: 'OGRDB V8 extended',
    lastUpdated: 'February 2025',
    description: 'Immunoglobulin Heavy Chain model trained on S5F mutation patterns',
    modelPath: '/models/alignment/alignair_heavy/model.json',
    modelMetadataPath: '/models/alignment/alignair_heavy/metadata.json',
    orientationModelPath: '/models/orientation/heavychain_ornt_pipeline.onnx',
    features: ['V/D/J segmentation', 'Allele calling', 'Mutation prediction', 'Productivity assessment'],
    documentationUrl: '/docs/models/igh-heavy-chain',
    isActive: true
  },
  {
    id: 'igl-v1.0',
    name: 'IGL/IGK Light Chain',
    version: 'v1.0',
    chainType: 'light',
    species: 'Human',
    referenceSet: 'OGRDB V2 & V3 extended',
    lastUpdated: 'March 2025',
    description: 'Immunoglobulin Lambda Light Chain model with enhanced V/J prediction',
    modelPath: '/models/alignment/alignair_light/model.json',
    modelMetadataPath: '/models/alignment/alignair_light/metadata.json',
    orientationModelPath: '/models/orientation/lightchain_ornt_pipeline.onnx',
    features: ['V/J segmentation', 'Allele calling', 'Mutation prediction', 'Productivity assessment'],
    documentationUrl: '/docs/models/igl-light-chain',
    isActive: true
  },
  {
    id: 'tcrb-v1.0',
    name: 'TCRB Beta Chain',
    version: 'v1.0',
    chainType: 'trb',
    species: 'Human',
    referenceSet: 'IMGT 2022',
    lastUpdated: 'July 2025',
    description: 'T Cell Receptor Beta Chain model optimized for TCR repertoire analysis',
    modelPath: '/models/alignment/alignair_trb/model.json',
    modelMetadataPath: '/models/alignment/alignair_trb/metadata.json',
    orientationModelPath: '/models/orientation/trbchain_ornt_pipeline.onnx',
    features: ['V/D/J segmentation', 'Allele calling', 'Productivity assessment'],
    documentationUrl: '/docs/models/tcrb-beta-chain',
    isActive: true
  }
];

export const getModelById = (id: string): ModelInfo | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

export const getModelsByChainType = (chainType: string): ModelInfo[] => {
  return AVAILABLE_MODELS.filter(model => model.chainType === chainType && model.isActive);
};

export const getActiveModels = (): ModelInfo[] => {
  return AVAILABLE_MODELS.filter(model => model.isActive);
};

export const getDefaultModelForChain = (chainType: string): ModelInfo | undefined => {
  const models = getModelsByChainType(chainType);
  return models.length > 0 ? models[0] : undefined;
}; 