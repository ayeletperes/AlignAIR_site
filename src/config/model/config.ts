/**
 * Model Configuration
 * 
 * This file contains all static model configuration data.
 * Generated automatically from metadata.json files in public/models/alignment/
 * 
 * @generated This file is auto-generated. Do not edit manually.
 */

import type { ModelMetadata } from '@/lib/model/modelMetadataLoader';

// All available model IDs
export const ALL_MODEL_IDS: readonly string[] = ["igh-v1.0","igh-v2.0","igl-v1.0","igl-v2.0","trb-v1.0"] as const;

// Default model IDs for performance (loaded on startup)
export const DEFAULT_MODEL_IDS: readonly string[] = ["igh-v1.0"] as const;

// Model path mapping
export const MODEL_PATH_MAP: Readonly<Record<string, string>> = {
  "igh-v1.0": "/models/alignment/heavy/igh-v1.0",
  "igh-v2.0": "/models/alignment/heavy/igh-v2.0",
  "igl-v1.0": "/models/alignment/light/igl-v1.0",
  "igl-v2.0": "/models/alignment/light/igl-v2.0",
  "trb-v1.0": "/models/alignment/trb/trb-v1.0"
} as const;

// Models grouped by chain type
export const CHAIN_MODEL_IDS: Readonly<Record<string, readonly string[]>> = {
  "heavy": [
    "igh-v1.0",
    "igh-v2.0"
  ],
  "light": [
    "igl-v1.0",
    "igl-v2.0"
  ],
  "trb": [
    "trb-v1.0"
  ]
} as const;

// Model IDs and chain types
export const MODEL_ID_TO_CHAIN: Readonly<Record<string, string>> = {
  "igh-v1.0": "heavy",
  "igh-v2.0": "heavy",
  "igl-v1.0": "light",
  "igl-v2.0": "light",
  "trb-v1.0": "trb"
} as const;

// Static model metadata for synchronous access
export const AVAILABLE_MODELS: readonly ModelMetadata[] = [
  {
    "id": "igh-v1.0",
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
    "modelPath": "/models/alignment/heavy/igh-v1.0/model.json",
    "checkpoint": "/app/pretrained_models/IGH_S5F_576",
    "orientationModelPath": "/models/orientation/heavychain_ornt_pipeline.onnx",
    "referencePath": "/dataconfig/HUMAN_IGH_OGRDB.json",
    "isActive": true,
    "outputNodes": {
      "Identity": "productive",
      "Identity_1": "v_allele",
      "Identity_2": "indel_count",
      "Identity_3": "d_sequence_start",
      "Identity_4": "j_sequence_start",
      "Identity_5": "d_sequence_end",
      "Identity_6": "d_allele",
      "Identity_7": "v_sequence_start",
      "Identity_8": "v_sequence_end",
      "Identity_9": "j_allele",
      "Identity_10": "mutation_rate",
      "Identity_11": "j_sequence_end"
    }
  },
  {
    "id": "igh-v2.0",
    "name": "IGH Heavy Chain Extended",
    "version": "v1.0",
    "chainType": "heavy",
    "species": "Human",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "Human Unified set of Alleles (HUSA)",
    "lastUpdated": "August 2025",
    "description": "Immunoglobulin Heavy Chain model trained on S5F mutation patterns",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/heavy/igh-v2.0/model.json",
    "checkpoint": "",
    "orientationModelPath": "/models/orientation/heavychain_ornt_pipeline.onnx",
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
    "id": "igl-v1.0",
    "name": "IGL/IGK Light Chain",
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
    "modelPath": "/models/alignment/light/igl-v1.0/model.json",
    "checkpoint": "/app/pretrained_models/IGL_S5F_576",
    "orientationModelPath": "/models/orientation/lightchain_ornt_pipeline.onnx",
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
    "id": "igl-v2.0",
    "name": "IGL/IGK Light Chain",
    "version": "v2.0",
    "chainType": "light",
    "species": "Human",
    "hasD": false,
    "multiChain": true,
    "referenceSet": "Human Unified set of Alleles (HUSA)",
    "lastUpdated": "August 2025",
    "description": "Immunoglobulin Lambda Light Chain model with enhanced V/J prediction and extended reference set",
    "features": [
      "V/J segmentation",
      "Allele calling",
      "Mutation prediction",
      "Productivity assessment",
      "Extended reference set"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/light/igl-v2.0/model.json",
    "checkpoint": "/app/pretrained_models/IGL_S5F_576",
    "orientationModelPath": "/models/orientation/lightchain_ornt_pipeline.onnx",
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
    "id": "trb-v1.0",
    "name": "TCRB Beta Chain",
    "version": "v1.0",
    "chainType": "trb",
    "species": "Human",
    "hasD": true,
    "multiChain": false,
    "referenceSet": "IMGT 2022",
    "lastUpdated": "July 2025",
    "description": "T Cell Receptor Beta Chain model optimized for TCR repertoire analysis",
    "features": [
      "V/D/J segmentation",
      "Allele calling",
      "Productivity assessment"
    ],
    "documentationUrl": "/models",
    "modelPath": "/models/alignment/trb/trb-v1.0/model.json",
    "checkpoint": "/app/pretrained_models/TCRB_UNIFORM_576",
    "orientationModelPath": "/models/orientation/trbchain_ornt_pipeline.onnx",
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

// Type definitions for better type safety
export type ModelId = typeof ALL_MODEL_IDS[number];
export type ChainType = keyof typeof CHAIN_MODEL_IDS;
export type DefaultModelId = typeof DEFAULT_MODEL_IDS[number];
