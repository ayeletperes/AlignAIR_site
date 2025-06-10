import { ModelLoader, ChainConfig, ModelWarmupOptions } from './utilities';
import { logger } from '@components/utils/logger';
import * as tf from '@tensorflow/tfjs';

export interface ModelManagerConfig {
  autoWarmup?: boolean;
  warmupOptions?: ModelWarmupOptions;
  maxMemoryUsageMB?: number;
  enableMemoryMonitoring?: boolean;
}

export interface LoadedModelInfo {
  loader: ModelLoader;
  lastUsed: number;
  memoryUsage?: number;
}

/**
 * ModelManager handles loading, caching, and memory management of multiple models
 */
export class ModelManager {
  private loadedModels: Map<string, LoadedModelInfo> = new Map();
  private config: ModelManagerConfig;
  private memoryWarningThreshold: number;

  constructor(config: ModelManagerConfig = {}) {
    this.config = {
      autoWarmup: true,
      warmupOptions: {
        enabled: true,
        warmupRuns: 2,
        logWarmupTimes: false
      },
      maxMemoryUsageMB: 2048, // 2GB default limit
      enableMemoryMonitoring: true,
      ...config
    };
    
    this.memoryWarningThreshold = (this.config.maxMemoryUsageMB! * 0.8) * 1024 * 1024; // 80% of limit in bytes
    
    if (this.config.enableMemoryMonitoring) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Load a model with the specified chain configuration
   */
  async loadModel(chainConfig: ChainConfig, warmupOptions?: ModelWarmupOptions): Promise<ModelLoader> {
    const modelKey = this.getModelKey(chainConfig);
    
    // Check if model is already loaded
    if (this.loadedModels.has(modelKey)) {
      const modelInfo = this.loadedModels.get(modelKey)!;
      modelInfo.lastUsed = Date.now();
      logger.log(`Using cached model for ${chainConfig.name}`);
      return modelInfo.loader;
    }
    
    // Check memory before loading new model
    await this.checkMemoryUsage();
    
    logger.log(`Loading new model for ${chainConfig.name} chain...`);
    
    const loader = new ModelLoader(chainConfig);
    const finalWarmupOptions = warmupOptions || this.config.warmupOptions;
    
    await loader.initialize(finalWarmupOptions);
    
    // Store in cache
    const modelInfo: LoadedModelInfo = {
      loader,
      lastUsed: Date.now(),
      memoryUsage: this.estimateModelMemory(loader)
    };
    
    this.loadedModels.set(modelKey, modelInfo);
    
    logger.log(`Model for ${chainConfig.name} loaded and cached`);
    
    return loader;
  }

  /**
   * Get a cached model or load it if not available
   */
  async getModel(chainConfig: ChainConfig): Promise<ModelLoader> {
    return this.loadModel(chainConfig);
  }

  /**
   * Dispose of a specific model
   */
  disposeModel(chainConfig: ChainConfig): void {
    const modelKey = this.getModelKey(chainConfig);
    const modelInfo = this.loadedModels.get(modelKey);
    
    if (modelInfo) {
      modelInfo.loader.dispose();
      this.loadedModels.delete(modelKey);
      logger.log(`Disposed model for ${chainConfig.name} chain`);
    }
  }

  /**
   * Dispose all loaded models
   */
  disposeAllModels(): void {
    logger.log('Disposing all loaded models...');
    
    Array.from(this.loadedModels.entries()).forEach(([key, modelInfo]) => {
      modelInfo.loader.dispose();
    });
    
    this.loadedModels.clear();
    logger.log('All models disposed');
  }

  /**
   * Get memory usage statistics for all loaded models
   */
  getMemoryStats(): {
    totalTensorFlowMemory: { numTensors: number; numBytes: number };
    loadedModels: Array<{
      chain: string;
      memoryUsage?: number;
      lastUsed: number;
      isWarmedUp: boolean;
    }>;
    backend: string;
  } {
    const tfMemory = tf.memory();
    const models = Array.from(this.loadedModels.entries()).map(([key, info]) => ({
      chain: key,
      memoryUsage: info.memoryUsage,
      lastUsed: info.lastUsed,
      isWarmedUp: info.loader.isModelWarmedUp()
    }));

    return {
      totalTensorFlowMemory: tfMemory,
      loadedModels: models,
      backend: tf.getBackend()
    };
  }

  /**
   * Warm up all loaded models
   */
  async warmUpAllModels(warmupOptions?: ModelWarmupOptions): Promise<void> {
    logger.log('Warming up all loaded models...');
    
    const warmupPromises = Array.from(this.loadedModels.values()).map(modelInfo => 
      modelInfo.loader.warmUpModel(warmupOptions)
    );
    
    await Promise.all(warmupPromises);
    logger.log('All models warmed up');
  }

  /**
   * Clean up least recently used models when memory is high
   */
  async cleanupMemory(forceCleanup: boolean = false): Promise<void> {
    const memoryStats = this.getMemoryStats();
    
    if (!forceCleanup && memoryStats.totalTensorFlowMemory.numBytes < this.memoryWarningThreshold) {
      return;
    }
    
    logger.log('Starting memory cleanup...');
    
    // Sort models by last used time (oldest first)
    const sortedModels = Array.from(this.loadedModels.entries())
      .sort(([, a], [, b]) => a.lastUsed - b.lastUsed);
    
    // Remove oldest models until memory is below threshold
    for (const [key, modelInfo] of sortedModels) {
      if (!forceCleanup && tf.memory().numBytes < this.memoryWarningThreshold) {
        break;
      }
      
      logger.log(`Disposing model ${key} to free memory`);
      modelInfo.loader.dispose();
      this.loadedModels.delete(key);
    }
    
    logger.log('Memory cleanup completed');
  }

  private getModelKey(chainConfig: ChainConfig): string {
    return `${chainConfig.name}_${chainConfig.modelPath}`;
  }

  private estimateModelMemory(loader: ModelLoader): number | undefined {
    const memoryInfo = loader.getMemoryInfo();
    return memoryInfo.modelSize || memoryInfo.tensorflow.numBytes;
  }

  private async checkMemoryUsage(): Promise<void> {
    const currentMemory = tf.memory().numBytes;
    
    if (currentMemory > this.memoryWarningThreshold) {
      logger.warn(`Memory usage is high (${(currentMemory / 1024 / 1024).toFixed(2)}MB). Attempting cleanup...`);
      await this.cleanupMemory();
    }
  }

  private startMemoryMonitoring(): void {
    // Monitor memory every 30 seconds
    setInterval(() => {
      const memoryStats = this.getMemoryStats();
      const memoryMB = memoryStats.totalTensorFlowMemory.numBytes / 1024 / 1024;
      
      if (memoryMB > (this.config.maxMemoryUsageMB! * 0.9)) {
        logger.warn(`High memory usage detected: ${memoryMB.toFixed(2)}MB`);
      }
    }, 30000);
  }

  /**
   * Get loaded model count
   */
  getLoadedModelCount(): number {
    return this.loadedModels.size;
  }

  /**
   * Check if a model is loaded
   */
  isModelLoaded(chainConfig: ChainConfig): boolean {
    return this.loadedModels.has(this.getModelKey(chainConfig));
  }
} 