/**
 * Environment configuration management
 * Provides type-safe access to environment variables
 */

export const env = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'test',

  // Feature toggles based on environment
  features: {
    modelWarmup: true,
    analytics: process.env.NODE_ENV === 'production',
    memoryMonitoring: process.env.NODE_ENV === 'development',
    devNav: process.env.NODE_ENV === 'development',
    errorReporting: process.env.NODE_ENV === 'production'
  },

  // External services
  services: {
    googleAnalytics: {
      id: process.env.NEXT_PUBLIC_GA_ID || 'G-W94F4SGX8B',
      enabled: process.env.NODE_ENV === 'production'
    },
    github: {
      repo: 'https://github.com/MuteJester/AlignAIR'
    }
  },

  // Build information
  build: {
    version: process.env.npm_package_version || '0.1.0',
    buildTime: new Date().toISOString()
  }
} as const;

// Type exports
export type Environment = typeof env;
export type FeatureKey = keyof typeof env.features;