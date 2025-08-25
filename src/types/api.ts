/**
 * API and external service types
 */

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: number;
}

// Model loading types
export interface ModelLoadResponse {
  modelId: string;
  status: 'loaded' | 'cached' | 'error';
  loadTime?: number;
  cacheHit?: boolean;
  error?: string;
}

// Reference data types
export interface ReferenceAllele {
  name: string;
  sequence: string;
  functionality: string;
  species: string;
  gene: string;
}

export interface ReferenceData {
  V: ReferenceAllele[];
  D?: ReferenceAllele[];
  J: ReferenceAllele[];
  metadata: {
    version: string;
    lastUpdated: string;
    source: string;
  };
}

// Performance monitoring types
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'model' | 'ui' | 'memory' | 'network';
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  timestamp: number;
}