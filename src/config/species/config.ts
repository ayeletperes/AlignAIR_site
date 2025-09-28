/**
 * Species Configuration
 *
 * Centralized configuration for different species supported by AlignAIR.
 * Defines models, reference sets, and species-specific settings.
 *
 * @generated This file is auto-generated. Do not edit manually.
 */

import type { ModelMetadata } from '@/lib/model/modelMetadataLoader';

export type Species = 'human' | 'rhesus_macaque';

// Species display names and descriptions
export const SPECIES_INFO = {
  human: {
    id: 'human' as const,
    name: 'Human',
    scientificName: 'Homo sapiens',
    description: 'Human immunoglobulin and T-cell receptor models',
    icon: '🧑‍⚕️',
  },
  rhesus_macaque: {
    id: 'rhesus_macaque' as const,
    name: 'Rhesus Macaque',
    scientificName: 'Macaca mulatta',
    description: 'Non-human primate immunoglobulin models',
    icon: '🐒',
  }
} as const;

// Species-specific model configurations
export const SPECIES_MODELS = {
  "human": {
    "models": [
      "IGH_S5F_576",
      "IGH_S5F_576_Extended",
      "IGL_S5F_576",
      "IGL_S5F_576_OGRDB",
      "TCRB_UNIFORM_576"
    ],
    "defaultModels": [
      "IGH_S5F_576"
    ],
    "pathMapping": {
      "IGH_S5F_576": "/models/alignment/human/heavy/IGH_S5F_576",
      "IGH_S5F_576_Extended": "/models/alignment/human/heavy/IGH_S5F_576_Extended",
      "IGL_S5F_576": "/models/alignment/human/light/IGL_S5F_576",
      "IGL_S5F_576_OGRDB": "/models/alignment/human/light/IGL_S5F_576_OGRDB",
      "TCRB_UNIFORM_576": "/models/alignment/human/trb/TCRB_UNIFORM_576"
    },
    "orientationModels": {
      "heavy": "/models/orientation/human/heavychain_ornt_pipeline.onnx",
      "light": "/models/orientation/human/lightchain_ornt_pipeline.onnx",
      "trb": "/models/orientation/human/trbchain_ornt_pipeline.onnx"
    },
    "referenceConfigs": {
      "IGH_S5F_576": "/dataconfig/HUMAN_IGH_OGRDB.json",
      "IGH_S5F_576_Extended": "/dataconfig/HUMAN_IGH_EXTENDED.json",
      "IGL_S5F_576": [
        "/dataconfig/HUMAN_IGL_EXTENDED.json",
        "/dataconfig/HUMAN_IGK_EXTENDED.json"
      ],
      "IGL_S5F_576_OGRDB": "/dataconfig/HUMAN_IGK_OGRDB.json,/dataconfig/HUMAN_IGL_OGRDB.json",
      "TCRB_UNIFORM_576": "/dataconfig/HUMAN_TCRB_IMGT.json"
    }
  },
  "rhesus_macaque": {
    "models": [
      "IGH_AlignAIR_RHESUS_MACAQUE"
    ],
    "defaultModels": [
      "IGH_AlignAIR_RHESUS_MACAQUE"
    ],
    "pathMapping": {
      "IGH_AlignAIR_RHESUS_MACAQUE": "/models/alignment/rhesus_macaque/heavy/IGH_AlignAIR_RHESUS_MACAQUE"
    },
    "orientationModels": {
      "heavy": "/models/orientation/rhesus_macaque/heavychain_ornt_pipeline.onnx"
    },
    "referenceConfigs": {
      "IGH_AlignAIR_RHESUS_MACAQUE": "/dataconfig/RHESUS_MACAQUE_IGH_MUSA.json"
    }
  }
} as const;

// Chain type availability by species
export const SPECIES_CHAINS = {
  human: ['heavy', 'light', 'trb'] as const,
  rhesus_macaque: ['heavy'] as const
} as const;

// Model metadata by species
export const SPECIES_MODEL_METADATA: Record<Species, ModelMetadata[]> = {
  human: [
  {
    "id": "IGH_S5F_576",
    "name": "IGH Heavy Chain",
    "version": "v1.0",
    "chainType": "heavy",
    "species": "Human",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "OGRDB V8",
    "lastUpdated": "February 2025",
    "description": "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/human/heavy/IGH_S5F_576/model.json",
    "checkpoint": "/app/pretrained_models/IGH_S5F_576",
    "dataconfigPython": "/app/pretrained_models/IGH_S5F_576/dataconfig.pkl",
    "orientationModelPath": "/models/orientation/human/heavychain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/HUMAN_IGH_OGRDB.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "mutation_rate",
      "Identity_1": "v_allele",
      "Identity_2": "d_sequence_start",
      "Identity_3": "v_sequence_start",
      "Identity_4": "d_sequence_end",
      "Identity_5": "j_sequence_end",
      "Identity_6": "v_sequence_end",
      "Identity_7": "j_allele",
      "Identity_8": "indel_count",
      "Identity_9": "j_sequence_start",
      "Identity_10": "d_allele",
      "Identity_11": "productive"
    }
  },
  {
    "id": "IGH_S5F_576_Extended",
    "name": "IGH Heavy Chain Extended",
    "version": "v1.0",
    "chainType": "heavy",
    "species": "Human",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "Human Unified set of Alleles (HUSA)",
    "lastUpdated": "September 2025",
    "description": "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/human/heavy/IGH_S5F_576_Extended/model.json",
    "checkpoint": "/app/pretrained_models/IGH_S5F_576_Extended",
    "dataconfigPython": "/app/pretrained_models/IGH_S5F_576_Extended/dataconfig.pkl",
    "orientationModelPath": "/models/orientation/human/heavychain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/HUMAN_IGH_EXTENDED.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "mutation_rate",
      "Identity_1": "v_allele",
      "Identity_2": "d_sequence_start",
      "Identity_3": "v_sequence_start",
      "Identity_4": "d_sequence_end",
      "Identity_5": "j_sequence_end",
      "Identity_6": "v_sequence_end",
      "Identity_7": "j_allele",
      "Identity_8": "indel_count",
      "Identity_9": "j_sequence_start",
      "Identity_10": "d_allele",
      "Identity_11": "productive"
    }
  },
  {
    "id": "IGL_S5F_576",
    "name": "IGL/IGK Light Chain Extended",
    "version": "v1.0",
    "chainType": "light",
    "species": "Human",
    "hasD": false,
    "multiChain": true,
    "referenceSet": "Human Unified set of Alleles (HUSA)",
    "lastUpdated": "September 2025",
    "description": "Immunoglobulin Lambda and Kappa Light Chain model with enhanced V/J prediction",
    "features": [
      "V/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment",
      "Extended reference set"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/human/light/IGL_S5F_576/model.json",
    "checkpoint": "/app/pretrained_models/IGL_S5F_576",
    "dataconfigPython": "/app/pretrained_models/IGL_S5F_576/dataconfig.pkl",
    "orientationModelPath": "/models/orientation/human/lightchain_ornt_pipeline.onnx",
    "referencePath": [
      "/dataconfig/HUMAN_IGL_EXTENDED.json",
      "/dataconfig/HUMAN_IGK_EXTENDED.json"
    ],
    "isActive": true,
    "outputNodes": {
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
    "id": "IGL_S5F_576_OGRDB",
    "name": "IGL/IGK Light Chain OGRDB",
    "version": "v1.0",
    "chainType": "light",
    "species": "Human",
    "hasD": false,
    "multiChain": false,
    "referenceSet": "OGRDB V2 & V3 extended",
    "lastUpdated": "March 2025",
    "description": "Immunoglobulin Lambda Light Chain model with enhanced V/J prediction",
    "features": [
      "V/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/human/light/IGL_S5F_576_OGRDB/model.json",
    "checkpoint": "legacy",
    "dataconfigPython": "legacy",
    "orientationModelPath": "/models/orientation/human/lightchain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/HUMAN_IGK_OGRDB.json,/dataconfig/HUMAN_IGL_OGRDB.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "j_sequence_end",
      "Identity_1": "chain_type",
      "Identity_2": "v_allele",
      "Identity_3": "v_sequence_end",
      "Identity_4": "productive",
      "Identity_5": "j_allele",
      "Identity_6": "j_sequence_start",
      "Identity_7": "mutation_rate",
      "Identity_8": "v_sequence_start",
      "Identity_9": "indel_count"
    }
  },
  {
    "id": "TCRB_UNIFORM_576",
    "name": "TCRB Beta Chain",
    "version": "v1.0",
    "chainType": "trb",
    "species": "Human",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "IMGT 2022",
    "lastUpdated": "September 2025",
    "description": "T Cell Receptor Beta Chain model optimized for TCR repertoire analysis",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/human/trb/TCRB_UNIFORM_576/model.json",
    "checkpoint": "/app/pretrained_models/TCRB_UNIFORM_576",
    "dataconfigPython": "/app/pretrained_models/TCRB_UNIFORM_576/dataconfig.pkl",
    "orientationModelPath": "/models/orientation/human/trbchain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/HUMAN_TCRB_IMGT.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "mutation_rate",
      "Identity_1": "v_allele",
      "Identity_2": "d_sequence_start",
      "Identity_3": "v_sequence_start",
      "Identity_4": "d_sequence_end",
      "Identity_5": "j_sequence_end",
      "Identity_6": "v_sequence_end",
      "Identity_7": "j_allele",
      "Identity_8": "indel_count",
      "Identity_9": "j_sequence_start",
      "Identity_10": "d_allele",
      "Identity_11": "productive"
    }
  }
],
  rhesus_macaque: [
  {
    "id": "IGH_AlignAIR_RHESUS_MACAQUE",
    "name": "IGH Heavy Chain",
    "version": "v1.0",
    "chainType": "heavy",
    "species": "Rhesus Macaque",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "Rhesus Macaque Unified set of Alleles (MUSA)",
    "lastUpdated": "September 2025",
    "description": "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/rhesus_macaque/heavy/IGH_AlignAIR_RHESUS_MACAQUE/model.json",
    "checkpoint": "stealth",
    "dataconfigPython": "stealth",
    "orientationModelPath": "/models/orientation/rhesus_macaque/heavychain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/RHESUS_MACAQUE_IGH_MUSA.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "mutation_rate",
      "Identity_1": "v_allele",
      "Identity_2": "d_sequence_start",
      "Identity_3": "v_sequence_start",
      "Identity_4": "d_sequence_end",
      "Identity_5": "j_sequence_end",
      "Identity_6": "v_sequence_end",
      "Identity_7": "j_allele",
      "Identity_8": "indel_count",
      "Identity_9": "j_sequence_start",
      "Identity_10": "d_allele",
      "Identity_11": "productive"
    }
  }
]
};

// Helper functions
export function getSpeciesModels(species: Species): readonly string[] {
  return SPECIES_MODELS[species].models;
}

export function getSpeciesDefaultModels(species: Species): readonly string[] {
  return SPECIES_MODELS[species].defaultModels;
}

export function getSpeciesModelPath(species: Species, modelId: string): string | null {
  const pathMapping = SPECIES_MODELS[species].pathMapping as Record<string, string>;
  return pathMapping[modelId] || null;
}

export function getSpeciesOrientationPath(species: Species, chainType: string): string | null {
  const orientationModels = SPECIES_MODELS[species].orientationModels as Record<string, string>;
  return orientationModels[chainType] || null;
}

export function getSpeciesReferenceConfig(species: Species, modelId: string): string | string[] | null {
  const referenceConfigs = SPECIES_MODELS[species].referenceConfigs as Record<string, string | string[]>;
  return referenceConfigs[modelId] || null;
}

export function getSpeciesChainTypes(species: Species): readonly string[] {
  return SPECIES_CHAINS[species];
}

export function getSpeciesModelMetadata(species: Species): ModelMetadata[] {
  return SPECIES_MODEL_METADATA[species];
}

export function getModelsBySpeciesAndChain(species: Species, chainType: string): ModelMetadata[] {
  return getSpeciesModelMetadata(species).filter(model => model.chainType === chainType);
}

// Get all available species
export function getAvailableSpecies(): Species[] {
  return Object.keys(SPECIES_INFO) as Species[];
}

// Default species
export const DEFAULT_SPECIES: Species = 'human';
