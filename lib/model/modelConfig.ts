export interface ModelConfig {
  id: string;
  name: string;
  version: string;
  chainType: 'heavy' | 'light' | 'trb';
  species: string;
  referenceSet: string;
  lastUpdated: string;
  description: string;
  features: string[];
  documentationUrl: string;
  modelPath: string;
  checkpoint: string;
  orientationModelPath: string;
  referencePath: string;
  gradient: string;
  iconColor: string;
  isActive: boolean;
  outputNodes: Record<string, string>;
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "igh-v1.0",
    name: "IGH Heavy Chain v1.0",
    version: "v1.0",
    chainType: "heavy",
    species: "Human",
    referenceSet: "OGRDB V8 extended",
    lastUpdated: "February 2025",
    description: "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    features: ["V/D/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/heavy/igh-v1.0/model.json",
    checkpoint: "/app/pretrained_models/IGH_S5F_576",
    orientationModelPath: "/models/orientation/heavychain_ornt_pipeline.onnx",
    referencePath: "/reference/heavy/allele_data.json",
    gradient: "from-blue-500 to-cyan-500",
    iconColor: "bg-blue-600",
    isActive: true,
    outputNodes: {
      "Identity_8": "productive",
      "Identity_9": "v_allele",
      "Identity_3": "indel_count",
      "Identity_2": "d_start",
      "Identity_6": "j_start",
      "Identity_1": "d_end",
      "Identity": "d_allele",
      "Identity_11": "v_start",
      "Identity_10": "v_end",
      "Identity_4": "j_allele",
      "Identity_7": "mutation_rate",
      "Identity_5": "j_end"
    }
  },
  {
    id: "igh-v2.0",
    name: "IGH Heavy Chain v2.0",
    version: "v2.0",
    chainType: "heavy",
    species: "Human",
    referenceSet: "OGRDB V9 extended",
    lastUpdated: "August 2025",
    description: "IGH Heavy Chain model trained on S5F mutation patterns",
    features: ["V/D/J segmentation", "Allele calling", "Mutation prediction", "Productivity assessment"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/heavy/igh-v2.0/model.json",
    checkpoint: "/app/pretrained_models/IGH_S5F_v2_576",
    orientationModelPath: "/models/orientation/heavychain_ornt_pipeline.onnx",
    referencePath: "/reference/heavy_extended/allele_data.json",
    gradient: "from-blue-600 to-cyan-600",
    iconColor: "bg-blue-700",
    isActive: true,
    outputNodes: {
      "Identity_8": "productive",
      "Identity_9": "v_allele",
      "Identity_3": "indel_count",
      "Identity_2": "d_start",
      "Identity_6": "j_start",
      "Identity_1": "d_end",
      "Identity": "d_allele",
      "Identity_11": "v_start",
      "Identity_10": "v_end",
      "Identity_4": "j_allele",
      "Identity_7": "mutation_rate",
      "Identity_5": "j_end"
    }
  },
  {
    id: "igl-v1.0",
    name: "IGL Light Chain v1.0",
    version: "v1.0",
    chainType: "light",
    species: "Human",
    referenceSet: "OGRDB V8 extended",
    lastUpdated: "February 2025",
    description: "Immunoglobulin Light Chain model for lambda and kappa chains",
    features: ["V/J segmentation", "Allele calling", "Mutation analysis", "Chain type detection"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/light/igl-v1.0/model.json",
    checkpoint: "/app/pretrained_models/IGL_S5F_576",
    orientationModelPath: "/models/orientation/lightchain_ornt_pipeline.onnx",
    referencePath: "/reference/light/allele_data.json",
    gradient: "from-green-500 to-emerald-500",
    iconColor: "bg-green-600",
    isActive: true,
    outputNodes: {
      "Identity_8": "productive",
      "Identity_9": "v_allele",
      "Identity_3": "indel_count",
      "Identity_6": "j_start",
      "Identity_11": "v_start",
      "Identity_10": "v_end",
      "Identity_4": "j_allele",
      "Identity_7": "mutation_rate",
      "Identity_5": "j_end"
    }
  },
  {
    id: "igl-v2.0",
    name: "IGL Light Chain v2.0",
    version: "v2.0",
    chainType: "light",
    species: "Human",
    referenceSet: "OGRDB V8 extended",
    lastUpdated: "February 2025",
    description: "Enhanced Immunoglobulin Light Chain model with improved precision",
    features: ["Enhanced V/J segmentation", "Improved allele calling", "Advanced mutation analysis", "Chain type detection"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/light/igl-v2.0/model.json",
    checkpoint: "/app/pretrained_models/IGL_S5F_v2_576",
    orientationModelPath: "/models/orientation/lightchain_ornt_pipeline.onnx",
    referencePath: "/reference/light_extended/allele_data.json",
    gradient: "from-green-600 to-emerald-600",
    iconColor: "bg-green-700",
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
    name: "TRB T-Cell Receptor Beta",
    version: "v1.0",
    chainType: "trb",
    species: "Human",
    referenceSet: "OGRDB V8 extended",
    lastUpdated: "February 2025",
    description: "T-Cell Receptor Beta chain model for TCR repertoire analysis",
    features: ["V/D/J segmentation", "TCR allele calling", "CDR3 identification", "Clonotype analysis"],
    documentationUrl: "/models",
    modelPath: "/models/alignment/trb/trb-v1.0/model.json",
    checkpoint: "/app/pretrained_models/TRB_S5F_576",
    orientationModelPath: "/models/orientation/trb_ornt_pipeline.onnx",
    referencePath: "/reference/trb/allele_data.json",
    gradient: "from-purple-500 to-violet-500",
    iconColor: "bg-purple-600",
    isActive: true,
    outputNodes: {
      "Identity_8": "productive",
      "Identity_9": "v_allele",
      "Identity_3": "indel_count",
      "Identity_2": "d_start",
      "Identity_6": "j_start",
      "Identity_1": "d_end",
      "Identity": "d_allele",
      "Identity_11": "v_start",
      "Identity_10": "v_end",
      "Identity_4": "j_allele",
      "Identity_7": "mutation_rate",
      "Identity_5": "j_end"
    }
  }
];

export const getModelById = (id: string): ModelConfig | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

export const getModelsByChainType = (chainType: 'heavy' | 'light' | 'trb'): ModelConfig[] => {
  return AVAILABLE_MODELS.filter(model => model.chainType === chainType);
};

export const getActiveModels = (): ModelConfig[] => {
  return AVAILABLE_MODELS.filter(model => model.isActive);
};

export const getDefaultModelForChain = (chainType: 'heavy' | 'light' | 'trb'): ModelConfig | undefined => {
  const chainModels = getModelsByChainType(chainType);
  // Return the latest version (assuming higher version numbers are better)
  return chainModels.sort((a, b) => b.version.localeCompare(a.version))[0];
};