import { AVAILABLE_MODELS } from './preprocessing/config';

/**
 * Centralized application configuration
 * Manages all app-wide settings and constants
 */

export const AppConfig = {
  // Model configuration
  models: {
    defaultWarmupRuns: 2,
    cacheTimeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentLoads: 1,
    preloadPriority: {
      high: [AVAILABLE_MODELS.heavy[0]],    // Only load IGH model at startup
      medium: [],                            // No medium priority models
      low: []                                // No low priority models
    }
  },

  // UI configuration
  ui: {
    defaultChain: 'heavy' as const,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFileTypes: ['.fasta', '.fa', '.txt'],
    animation: {
      defaultDuration: 200,
      slowDuration: 300,
      fastDuration: 100
    },
    theme: {
      defaultTheme: 'dark' as const,
      storageKey: 'theme'
    }
  },

  // Processing configuration  
  processing: {
    defaultParams: {
      vCap: 3,
      dCap: 3,
      jCap: 3,
      vThresh: 0.75,
      dThresh: 0.3,
      jThresh: 0.8
    },
    timeouts: {
      inference: 60000,     // 1 minute
      preprocessing: 30000, // 30 seconds
      postprocessing: 30000 // 30 seconds
    }
  },

  // Analytics configuration
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-W94F4SGX8B',
    enableInDevelopment: false
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 30000
  },

  // Feature flags
  features: {
    alleleQuery: process.env.NODE_ENV === 'development',
    modelWarmup: true,
    analytics: process.env.NODE_ENV === 'production',
    memoryMonitoring: process.env.NODE_ENV === 'development',
    performanceMetrics: true
  },

  // Logging configuration
  logging: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    enableConsole: true,
    enableRemote: false
  }
} as const;

// Type helpers for configuration
export type ChainType = 'heavy' | 'light' | 'trb';
export type ProcessingParams = typeof AppConfig.processing.defaultParams;
export type FeatureFlags = typeof AppConfig.features;