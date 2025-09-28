#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '../public/models/alignment');
const MODEL_CONFIG_FILE = path.join(__dirname, '../src/config/model/config.ts');
const SPECIES_CONFIG_FILE = path.join(__dirname, '../src/config/species/config.ts');

async function generateModelMetadata() {
  console.log('🔍 Scanning species-based model directories...');

  const models = [];
  const modelPathMap = {};
  const chainModelIds = {
    heavy: [],
    light: [],
    trb: []
  };
  const modelIdsAndChainTypes = {};

  // Species-specific data organization
  const speciesData = {
    human: {
      models: [],
      metadata: [],
      pathMapping: {},
      orientationModels: {
        heavy: "/models/orientation/human/heavychain_ornt_pipeline.onnx",
        light: "/models/orientation/human/lightchain_ornt_pipeline.onnx",
        trb: "/models/orientation/human/trbchain_ornt_pipeline.onnx"
      },
      referenceConfigs: {}
    },
    rhesus_macaque: {
      models: [],
      metadata: [],
      pathMapping: {},
      orientationModels: {
        heavy: "/models/orientation/rhesus_macaque/heavychain_ornt_pipeline.onnx"
      },
      referenceConfigs: {}
    }
  };

  function scanSpeciesDirectory(speciesDir, speciesName) {
    if (!fs.existsSync(speciesDir)) {
      console.warn(`⚠️  Species directory not found: ${speciesDir}`);
      return;
    }

    const chainTypes = ['heavy', 'light', 'trb'];

    for (const chainType of chainTypes) {
      const chainDir = path.join(speciesDir, chainType);
      if (!fs.existsSync(chainDir)) {
        continue; // Skip if chain type doesn't exist for this species
      }

      const entries = fs.readdirSync(chainDir, { withFileTypes: true });
      const modelDirs = entries.filter(entry => entry.isDirectory());

      for (const modelDir of modelDirs) {
        const modelPath = path.join(chainDir, modelDir.name);
        const metadataPath = path.join(modelPath, 'metadata.json');

        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

            // Ensure species information is in metadata
            if (!metadata.species) {
              metadata.species = speciesName === 'human' ? 'Human' :
                                 speciesName === 'rhesus_macaque' ? 'Rhesus Macaque' :
                                 speciesName;
            }

            // For species-specific model IDs, use the original metadata ID as-is for global config
            // For species-specific config, extract the base model ID (remove species suffix)
            const originalModelId = metadata.id;
            const baseModelId = originalModelId.includes('-rhesus_macaque') ?
              originalModelId.replace('-rhesus_macaque', '') : originalModelId;

            // Use the original metadata ID for global config (already includes species suffix if needed)
            const modelWithSpeciesId = { ...metadata, id: originalModelId };

            // Add to global arrays (for backwards compatibility)
            models.push(modelWithSpeciesId);
            modelPathMap[originalModelId] = `/models/alignment/${speciesName}/${chainType}/${baseModelId}`;
            chainModelIds[chainType].push(originalModelId);
            modelIdsAndChainTypes[originalModelId] = chainType;

            // Add to species-specific data
            const species = speciesData[speciesName];
            if (species) {
              species.models.push(originalModelId); // Base model ID for species-specific config
              species.metadata.push({ ...metadata, id: originalModelId }); // Use base ID in species metadata
              species.pathMapping[originalModelId] = `/models/alignment/${speciesName}/${chainType}/${baseModelId}`;
              species.referenceConfigs[originalModelId] = metadata.referencePath;
            }

            console.log(`✅ Loaded ${speciesName} ${chainType} metadata for ${originalModelId}`);
          } catch (error) {
            console.error(`❌ Failed to parse metadata for ${modelDir.name}:`, error.message);
          }
        } else {
          console.warn(`⚠️  No metadata.json found in ${modelPath}`);
        }
      }
    }
  }

  // Scan species directories
  const species = ['human', 'rhesus_macaque'];
  for (const speciesName of species) {
    const speciesDir = path.join(MODELS_DIR, speciesName);
    scanSpeciesDirectory(speciesDir, speciesName);
  }

  if (models.length === 0) {
    console.error('❌ No model metadata found!');
    process.exit(1);
  }

  console.log(`📊 Found ${models.length} models total`);

  // Set default models for each species (use original model IDs for species-specific config)
  speciesData.human.defaultModels = ["IGH_S5F_576"];
  speciesData.rhesus_macaque.defaultModels = ["IGH_AlignAIR_RHESUS_MACAQUE"];

  // Generate the species configuration file
  const speciesContent = generateSpeciesConfigContent(speciesData);
  fs.writeFileSync(SPECIES_CONFIG_FILE, speciesContent, 'utf8');
  console.log(`✅ Generated ${SPECIES_CONFIG_FILE}`);

  // Generate the model configuration file
  const modelContent = generateModelConfigContent(models, modelPathMap, chainModelIds, modelIdsAndChainTypes);
  fs.writeFileSync(MODEL_CONFIG_FILE, modelContent, 'utf8');
  console.log(`✅ Generated ${MODEL_CONFIG_FILE}`);
  console.log(`📝 Updated with ${models.length} models`);
}

function generateSpeciesConfigContent(speciesData) {
  return `/**
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
export const SPECIES_MODELS = ${JSON.stringify({
    human: {
      models: speciesData.human.models,
      defaultModels: speciesData.human.defaultModels,
      pathMapping: speciesData.human.pathMapping,
      orientationModels: speciesData.human.orientationModels,
      referenceConfigs: speciesData.human.referenceConfigs
    },
    rhesus_macaque: {
      models: speciesData.rhesus_macaque.models,
      defaultModels: speciesData.rhesus_macaque.defaultModels,
      pathMapping: speciesData.rhesus_macaque.pathMapping,
      orientationModels: speciesData.rhesus_macaque.orientationModels,
      referenceConfigs: speciesData.rhesus_macaque.referenceConfigs
    }
  }, null, 2)} as const;

// Chain type availability by species
export const SPECIES_CHAINS = {
  human: ['heavy', 'light', 'trb'] as const,
  rhesus_macaque: ['heavy'] as const
} as const;

// Model metadata by species
export const SPECIES_MODEL_METADATA: Record<Species, ModelMetadata[]> = {
  human: ${JSON.stringify(speciesData.human.metadata, null, 2)},
  rhesus_macaque: ${JSON.stringify(speciesData.rhesus_macaque.metadata, null, 2)}
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
`;
}

function generateModelConfigContent(models, modelPathMap, chainModelIds, modelIdsAndChainTypes) {
  const allModelIds = models.map(m => m.id);
  const defaultModelIds = ['IGH_S5F_576']; // Keep only IGH as default for performance

  return `/**
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
export const ALL_MODEL_IDS: readonly string[] = ${JSON.stringify(allModelIds)} as const;

// Default model IDs for performance (loaded on startup)
export const DEFAULT_MODEL_IDS: readonly string[] = ${JSON.stringify(defaultModelIds)} as const;

// Model path mapping
export const MODEL_PATH_MAP: Readonly<Record<string, string>> = ${JSON.stringify(modelPathMap, null, 2)} as const;

// Models grouped by chain type
export const CHAIN_MODEL_IDS: Readonly<Record<string, readonly string[]>> = ${JSON.stringify(chainModelIds, null, 2)} as const;

// Model IDs and chain types
export const MODEL_ID_TO_CHAIN: Readonly<Record<string, string>> = ${JSON.stringify(modelIdsAndChainTypes, null, 2)} as const;

// Static model metadata for synchronous access
export const AVAILABLE_MODELS: readonly ModelMetadata[] = ${JSON.stringify(models, null, 2)} as const;

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
`;
}


// Run the script
generateModelMetadata().catch(error => {
  console.error('❌ Failed to generate model metadata:', error);
  process.exit(1);
});