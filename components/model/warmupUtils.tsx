import { ChainConfig, ModelLoader, ModelWarmupOptions } from './utilities';
import { ModelManager } from './modelManager';
import { logger } from '@components/utils/logger';
import * as tf from '@tensorflow/tfjs';

/**
 * Utility functions for model warming
 */

/**
 * Warm up a single model with optimal settings
 */
export async function warmUpSingleModel(
  chainConfig: ChainConfig, 
  customOptions?: ModelWarmupOptions
): Promise<{ success: boolean; warmupTime?: number; error?: string }> {
  try {
    const startTime = performance.now();
    
    const modelLoader = new ModelLoader(chainConfig);
    await modelLoader.initialize();
    
    // Use optimal warmup options if none provided
    const warmupOptions = customOptions || modelLoader.getOptimalWarmupOptions();
    await modelLoader.warmUpModel(warmupOptions);
    
    const endTime = performance.now();
    const warmupTime = endTime - startTime;
    
    logger.log(`Model ${chainConfig.name} warmed up successfully in ${warmupTime.toFixed(2)}ms`);
    
    return { success: true, warmupTime };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Failed to warm up model ${chainConfig.name}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Warm up multiple models in parallel
 */
export async function warmUpModels(
  chainConfigs: ChainConfig[],
  options?: {
    parallel?: boolean;
    customWarmupOptions?: ModelWarmupOptions;
    onProgress?: (completed: number, total: number) => void;
  }
): Promise<Array<{ chainName: string; success: boolean; warmupTime?: number; error?: string }>> {
  const { parallel = true, customWarmupOptions, onProgress } = options || {};
  const results: Array<{ chainName: string; success: boolean; warmupTime?: number; error?: string }> = [];
  
  logger.log(`Starting warmup for ${chainConfigs.length} models ${parallel ? 'in parallel' : 'sequentially'}...`);
  
  if (parallel) {
    // Warm up all models in parallel
    const warmupPromises = chainConfigs.map(async (config) => {
      const result = await warmUpSingleModel(config, customWarmupOptions);
      return { chainName: config.name, ...result };
    });
    
    const parallelResults = await Promise.all(warmupPromises);
    results.push(...parallelResults);
    
    onProgress?.(chainConfigs.length, chainConfigs.length);
  } else {
    // Warm up models sequentially
    for (let i = 0; i < chainConfigs.length; i++) {
      const config = chainConfigs[i];
      const result = await warmUpSingleModel(config, customWarmupOptions);
      results.push({ chainName: config.name, ...result });
      
      onProgress?.(i + 1, chainConfigs.length);
    }
  }
  
  const successful = results.filter(r => r.success).length;
  logger.log(`Warmup complete: ${successful}/${chainConfigs.length} models warmed up successfully`);
  
  return results;
}

/**
 * Get system-specific optimal warmup configuration
 */
export function getSystemOptimalWarmupOptions(): ModelWarmupOptions {
  const backend = tf.getBackend();
  const memory = tf.memory();
  
  // Determine optimal configuration based on system capabilities
  let warmupRuns = 2;
  let logWarmupTimes = true;
  
  // Adjust based on backend
  if (backend === 'webgl') {
    // WebGL benefits from more warmup runs for shader compilation
    warmupRuns = 3;
  } else if (backend === 'cpu') {
    // CPU is more predictable, fewer runs needed
    warmupRuns = 1;
  }
  
  // Adjust based on available memory
  if (memory.numBytes > 500 * 1024 * 1024) { // 500MB+
    // System has good memory, can afford more thorough warmup
    warmupRuns = Math.max(warmupRuns, 3);
  } else if (memory.numBytes > 1024 * 1024 * 1024) { // 1GB+
    // High memory system, maximum warmup
    warmupRuns = 4;
  }
  
  return {
    enabled: true,
    warmupRuns,
    logWarmupTimes
  };
}

/**
 * Quick warmup with minimal overhead
 */
export async function quickWarmUpModel(chainConfig: ChainConfig): Promise<boolean> {
  try {
    await warmUpSingleModel(chainConfig, {
      enabled: true,
      warmupRuns: 1,
      logWarmupTimes: false
    });
    return true;
  } catch (error) {
    logger.error(`Quick warmup failed for ${chainConfig.name}:`, error);
    return false;
  }
}

/**
 * Comprehensive warmup with full optimization
 */
export async function comprehensiveWarmUpModel(chainConfig: ChainConfig): Promise<boolean> {
  try {
    const optimalOptions = getSystemOptimalWarmupOptions();
    await warmUpSingleModel(chainConfig, {
      ...optimalOptions,
      warmupRuns: 4, // Maximum warmup runs
      logWarmupTimes: true
    });
    return true;
  } catch (error) {
    logger.error(`Comprehensive warmup failed for ${chainConfig.name}:`, error);
    return false;
  }
}

/**
 * Check if models need warming (first time detection)
 */
export function shouldWarmUpModels(): boolean {
  const backend = tf.getBackend();
  
  // Always warm up for WebGL due to shader compilation
  if (backend === 'webgl') {
    return true;
  }
  
  // For other backends, check if it's the first run
  const hasWarmedUpBefore = localStorage.getItem('tfjs_models_warmed_up');
  if (!hasWarmedUpBefore) {
    localStorage.setItem('tfjs_models_warmed_up', Date.now().toString());
    return true;
  }
  
  // Re-warm if it's been more than 24 hours
  const lastWarmup = parseInt(hasWarmedUpBefore);
  const hoursSinceWarmup = (Date.now() - lastWarmup) / (1000 * 60 * 60);
  
  return hoursSinceWarmup > 24;
}

/**
 * Mark models as warmed up to avoid unnecessary re-warming
 */
export function markModelsAsWarmedUp(): void {
  localStorage.setItem('tfjs_models_warmed_up', Date.now().toString());
}

/**
 * Estimate warmup time based on model configuration
 */
export function estimateWarmupTime(chainConfig: ChainConfig): number {
  const backend = tf.getBackend();
  const baseTime = backend === 'webgl' ? 1000 : 200; // ms
  
  // Adjust based on model complexity
  const complexityFactor = chainConfig.maxLength / 500; // Baseline is 500 length
  
  return Math.round(baseTime * complexityFactor);
} 