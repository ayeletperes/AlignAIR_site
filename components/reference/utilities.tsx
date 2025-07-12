import { getModelById } from '@components/model/modelMetadataLoader';

export interface Allele {
  sequence?: string;
  anchor?: string | number;
  iuis?: string;
  iglabel?: string;
  asc?: string;
}

export interface Segment {
  [key: string]: Allele | undefined;
  "Short-D"?: Allele;
}

export type ChainData = {
  reference: {
      V: Segment;
      D?: Segment;
      J: Segment;
    };
};

// Loads the allele_data.json for a given model
export async function loadReferenceDataForModel(modelId: string): Promise<ChainData> {
  const modelMetadata = await getModelById(modelId);
  if (!modelMetadata) {
    throw new Error(`Model not found: ${modelId}`);
  }
  const referencePath = modelMetadata.referencePath;
  if (!referencePath) {
    throw new Error(`No reference path specified for model: ${modelId}`);
  }
  return loadReferenceDataFromPath(referencePath);
}

// Loads the allele_data.json from a given path (e.g. /reference/heavy)
export async function loadReferenceDataFromPath(referencePath: string): Promise<ChainData> {
  const jsonPath = `${referencePath}/allele_data.json`;
  const response = await fetch(jsonPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch allele_data.json at ${jsonPath}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}

// Legacy loader for default heavy chain
export async function loadReferenceData(): Promise<ChainData> {
  return loadReferenceDataFromPath('/reference/heavy');
}
