/**
 * Core alignment types for type safety across the application
 */

import type { Species } from '@/config/species/config';
import { ParsedRecord } from '@/utils/preprocessing/sequenceParse';
// Processing pipeline types
export type ProcessingStep = 
  | 'idle' 
  | 'validating' 
  | 'preprocessing' 
  | 'inference' 
  | 'postprocessing' 
  | 'complete' 
  | 'error';

export interface ProcessingProgress {
  step: ProcessingStep;
  progress: number; // 0-100
  message: string;
  timestamp: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  currentStep: ProcessingStep;
  progress: ProcessingProgress[];
  error: AlignmentError | null;
  startTime?: number;
  endTime?: number;
}

// Model types
export type ChainType = 'heavy' | 'light' | 'trb';
export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ModelPreloadStatus {
  heavy: ModelStatus;
  light: ModelStatus;
  trb: ModelStatus;
}

export interface ModelInfo {
  id: string;
  name: string;
  version: string;
  chainType: ChainType;
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

// Input types
export type InputType = 'sequence' | 'file';

export interface SequenceInput {
  type: 'sequence';
  content: string | ParsedRecord[];
  name?: string;
}

export interface FileInput {
  type: 'file';
  file: File;
  content?: string; // Parsed content
}

export type AlignmentInput = SequenceInput | FileInput;

// Parameters
export interface ProcessingParams {
  vCap: number;
  dCap: number;
  jCap: number;
  vThresh: number;
  dThresh: number;
  jThresh: number;
}

// Results types
export interface SegmentPrediction {
  segment: string;
  likelihood: number;
  startPos: number;
  endPos: number;
  allele?: string;
}

export interface AlignmentResult {
  id: string;
  sequence: string;
  chainType: ChainType;
  modelId: string;
  timestamp: number;
  
  // Segmentation results
  vSegment?: SegmentPrediction;
  dSegment?: SegmentPrediction;
  jSegment?: SegmentPrediction;
  
  // Additional analysis
  productivity?: 'productive' | 'unproductive' | 'unknown';
  mutations?: MutationInfo[];
  
  // Processing metadata
  processingTime: number;
  confidence: number;
}

export interface MutationInfo {
  position: number;
  original: string;
  mutated: string;
  type: 'silent' | 'missense' | 'nonsense';
}

// Error types
export interface AlignmentError {
  code: string;
  message: string;
  userMessage: string;
  recoverable: boolean;
  timestamp: number;
  step?: ProcessingStep;
  details?: Record<string, any>;
}

// Form state types
export interface FormState {
  selectedSpecies: Species;
  selectedChain: ChainType;
  selectedModelId: string;
  input: AlignmentInput | null;
  params: ProcessingParams;
  isValid: boolean;
  validationErrors: string[];
}

// Application state types
export interface AppState {
  form: FormState;
  processing: ProcessingState;
  models: ModelPreloadStatus;
  results: AlignmentResult[];
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    modalOpen: boolean;
  };
}