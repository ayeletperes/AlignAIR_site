/**
 * Model Configuration
 *
 * This file contains all static model configuration data.
 * Generated automatically from metadata.json files in public/models/alignment/
 *
 * @generated This file is auto-generated. Do not edit manually.
 */

import type { ModelMetadata } from '@/lib/model/modelMetadataLoader';
import {
  Species,
  getSpeciesModels,
  getSpeciesDefaultModels,
  getSpeciesModelPath,
  getSpeciesModelMetadata,
  getModelsBySpeciesAndChain,
  DEFAULT_SPECIES
} from '@/config/species/config';

// All available model IDs
export const ALL_MODEL_IDS: readonly string[] = ["IGH_S5F_576","IGH_S5F_576_Extended","IGL_S5F_576","IGL_S5F_576_OGRDB","TCRB_UNIFORM_576","IGH_AlignAIR_RHESUS_MACAQUE"] as const;

// Default model IDs for performance (loaded on startup)
export const DEFAULT_MODEL_IDS: readonly string[] = ["IGH_S5F_576"] as const;

// Model path mapping
export const MODEL_PATH_MAP: Readonly<Record<string, string>> = {
  "IGH_S5F_576": "/models/alignment/human/heavy/IGH_S5F_576",
  "IGH_S5F_576_Extended": "/models/alignment/human/heavy/IGH_S5F_576_Extended",
  "IGL_S5F_576": "/models/alignment/human/light/IGL_S5F_576",
  "IGL_S5F_576_OGRDB": "/models/alignment/human/light/IGL_S5F_576_OGRDB",
  "TCRB_UNIFORM_576": "/models/alignment/human/trb/TCRB_UNIFORM_576",
  "IGH_AlignAIR_RHESUS_MACAQUE": "/models/alignment/rhesus_macaque/heavy/IGH_AlignAIR_RHESUS_MACAQUE"
} as const;

// Models grouped by chain type
export const CHAIN_MODEL_IDS: Readonly<Record<string, readonly string[]>> = {
  "heavy": [
    "IGH_S5F_576",
    "IGH_S5F_576_Extended",
    "IGH_AlignAIR_RHESUS_MACAQUE"
  ],
  "light": [
    "IGL_S5F_576",
    "IGL_S5F_576_OGRDB"
  ],
  "trb": [
    "TCRB_UNIFORM_576"
  ]
} as const;

// Model IDs and chain types
export const MODEL_ID_TO_CHAIN: Readonly<Record<string, string>> = {
  "IGH_S5F_576": "heavy",
  "IGH_S5F_576_Extended": "heavy",
  "IGL_S5F_576": "light",
  "IGL_S5F_576_OGRDB": "light",
  "TCRB_UNIFORM_576": "trb",
  "IGH_AlignAIR_RHESUS_MACAQUE": "heavy"
} as const;

// Static model metadata for synchronous access
export const AVAILABLE_MODELS: readonly ModelMetadata[] = [
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
  },
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
] as const;

// Helper function to get model path from ID
export function getModelPathFromId(modelId: string): string | null {
  return MODEL_PATH_MAP[modelId] || null;
}

// Helper function to get models for a chain type
export function getModelIdsForChainType(chainType: string): readonly string[] {
  return CHAIN_MODEL_IDS[chainType] || [];
}

// Helper function to get static model data by ID
export function getStaticModelById(modelId: string): ModelMetadata | null {
  return AVAILABLE_MODELS.find(model => model.id === modelId) || null;
}

// Species-aware helper functions
export function getModelsBySpecies(species: Species): readonly string[] {
  return getSpeciesModels(species);
}

export function getDefaultModelsBySpecies(species: Species): readonly string[] {
  return getSpeciesDefaultModels(species);
}

export function getModelPathForSpecies(species: Species, modelId: string): string | null {
  return getSpeciesModelPath(species, modelId);
}

export function getModelsForSpeciesAndChain(species: Species, chainType: string): ModelMetadata[] {
  return getModelsBySpeciesAndChain(species, chainType);
}

export function getAvailableModelsForSpecies(species: Species): ModelMetadata[] {
  return getSpeciesModelMetadata(species);
}

// Type definitions for better type safety
export type ModelId = typeof ALL_MODEL_IDS[number];
export type ChainType = keyof typeof CHAIN_MODEL_IDS;
export type DefaultModelId = typeof DEFAULT_MODEL_IDS[number];
