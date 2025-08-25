// Data layer exports - Pure TypeScript logic matching Python
export type { Allele, ConfigMetadata, DataConfig as DataConfigType, AlleleMapping, PropertiesMap } from './types';
export { DataConfig } from './DataConfig';
export { ReferenceLoader } from './ReferenceLoader';
export { ChainTypeOneHotEncoder } from './ChainTypeOneHotEncoder';

// Additional type exports
export type { 
  ChainType,
  OneHot,
  OneHotBatch
} from './ChainTypeOneHotEncoder';
