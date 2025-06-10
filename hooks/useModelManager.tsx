import { useState, useEffect, useRef, useCallback } from 'react';
import { ModelManager, ModelManagerConfig } from '@components/model/modelManager';
import { ChainConfig, ModelLoader, ModelWarmupOptions } from '@components/model/utilities';
import { logger } from '@components/utils/logger';

export interface UseModelManagerOptions extends ModelManagerConfig {
  preloadModels?: ChainConfig[];
  enablePerformanceLogging?: boolean;
}

export interface ModelManagerState {
  isLoading: boolean;
  loadedModels: number;
  memoryStats: any;
  error: string | null;
}

/**
 * React hook for managing TensorFlow.js models with warming and memory management
 */
export function useModelManager(options: UseModelManagerOptions = {}) {
  const [state, setState] = useState<ModelManagerState>({
    isLoading: false,
    loadedModels: 0,
    memoryStats: null,
    error: null
  });

  const modelManagerRef = useRef<ModelManager | null>(null);

  // Initialize model manager
  useEffect(() => {
    modelManagerRef.current = new ModelManager({
      autoWarmup: true,
      maxMemoryUsageMB: 1024, // 1GB default for web apps
      enableMemoryMonitoring: true,
      ...options
    });

    // Preload models if specified
    if (options.preloadModels && options.preloadModels.length > 0) {
      preloadModels(options.preloadModels);
    }

    return () => {
      // Cleanup on unmount
      if (modelManagerRef.current) {
        modelManagerRef.current.disposeAllModels();
      }
    };
  }, []);

  // Update stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (modelManagerRef.current) {
        const memoryStats = modelManagerRef.current.getMemoryStats();
        const loadedModels = modelManagerRef.current.getLoadedModelCount();
        
        setState(prev => ({
          ...prev,
          loadedModels,
          memoryStats
        }));
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const preloadModels = useCallback(async (configs: ChainConfig[]) => {
    if (!modelManagerRef.current) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      logger.log(`Preloading ${configs.length} models...`);
      
      const startTime = performance.now();
      
      // Load models in parallel for faster startup
      await Promise.all(
        configs.map(config => modelManagerRef.current!.loadModel(config))
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (options.enablePerformanceLogging) {
        logger.log(`All models preloaded in ${duration.toFixed(2)}ms`);
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        loadedModels: modelManagerRef.current!.getLoadedModelCount()
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during model preloading';
      logger.error('Error preloading models:', errorMessage);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
    }
  }, [options.enablePerformanceLogging]);

  const loadModel = useCallback(async (
    chainConfig: ChainConfig,
    warmupOptions?: ModelWarmupOptions
  ): Promise<ModelLoader | null> => {
    if (!modelManagerRef.current) return null;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const startTime = performance.now();
      const loader = await modelManagerRef.current.loadModel(chainConfig, warmupOptions);
      const endTime = performance.now();
      
      if (options.enablePerformanceLogging) {
        logger.log(`Model ${chainConfig.name} loaded in ${(endTime - startTime).toFixed(2)}ms`);
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        loadedModels: modelManagerRef.current!.getLoadedModelCount()
      }));
      
      return loader;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during model loading';
      logger.error('Error loading model:', errorMessage);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
      return null;
    }
  }, [options.enablePerformanceLogging]);

  const warmUpAllModels = useCallback(async (warmupOptions?: ModelWarmupOptions) => {
    if (!modelManagerRef.current) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const startTime = performance.now();
      await modelManagerRef.current.warmUpAllModels(warmupOptions);
      const endTime = performance.now();
      
      if (options.enablePerformanceLogging) {
        logger.log(`All models warmed up in ${(endTime - startTime).toFixed(2)}ms`);
      }

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during warmup';
      logger.error('Error warming up models:', errorMessage);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage
      }));
    }
  }, [options.enablePerformanceLogging]);

  const disposeModel = useCallback((chainConfig: ChainConfig) => {
    if (modelManagerRef.current) {
      modelManagerRef.current.disposeModel(chainConfig);
      setState(prev => ({ 
        ...prev,
        loadedModels: modelManagerRef.current!.getLoadedModelCount()
      }));
    }
  }, []);

  const disposeAllModels = useCallback(() => {
    if (modelManagerRef.current) {
      modelManagerRef.current.disposeAllModels();
      setState(prev => ({ 
        ...prev,
        loadedModels: 0,
        memoryStats: null
      }));
    }
  }, []);

  const cleanupMemory = useCallback(async (force: boolean = false) => {
    if (modelManagerRef.current) {
      await modelManagerRef.current.cleanupMemory(force);
      setState(prev => ({ 
        ...prev,
        loadedModels: modelManagerRef.current!.getLoadedModelCount()
      }));
    }
  }, []);

  const isModelLoaded = useCallback((chainConfig: ChainConfig): boolean => {
    return modelManagerRef.current?.isModelLoaded(chainConfig) || false;
  }, []);

  return {
    // State
    ...state,
    
    // Methods
    loadModel,
    preloadModels,
    warmUpAllModels,
    disposeModel,
    disposeAllModels,
    cleanupMemory,
    isModelLoaded,
    
    // Utilities
    getMemoryStats: () => modelManagerRef.current?.getMemoryStats() || null,
    getLoadedModelCount: () => modelManagerRef.current?.getLoadedModelCount() || 0,
  };
} 