// Main lib exports - Clean Architecture

// Core data layer (pure logic)
export { DataConfig } from './data';
export type { ConfigMetadata, DataConfig as DataConfigType, AlleleMapping, PropertiesMap } from './data';
export type { Allele as DataAllele } from './data';

// Processing layers (pure logic)
export * from './preprocessing/LongSequence/FastKmerDensityExtractor';
export * from './preprocessing/Orientation/utilities';
export * from './preprocessing/Steps/BatchProcessor';

// Reference data
export { ReferenceLoader } from './data/ReferenceLoader';

// Legacy exports for compatibility
export * from './model/modelManager';
export * from './model/modelMetadataLoader';
export * from './submission/alignmentSubmission';