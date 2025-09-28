/**
 * Custom hook for model preloading management
 * Handles the preloading of models with priority and caching
 */

import { useCallback, useEffect, useRef } from 'react';
import { ChainType, ModelStatus } from '@/types/alignment';
import { AppConfig } from '@/config/app.config';
import { useAlignment } from '@/contexts/AlignmentContext';
import { loadModelById } from '@/lib/model/unifiedModelLoader';
import { getModelById } from '@/lib/model/modelMetadataLoader';
import { logger } from '@/utils/logger';
import { ErrorHandler, ErrorCodes } from '@/utils/errorHandler';

interface ModelPreloaderOptions {
  enableWarmup?: boolean;
  warmupRuns?: number;
  preloadOnMount?: boolean;
  priorityOrder?: ChainType[];
}

export function useModelPreloader(options: ModelPreloaderOptions = {}) {
  const { state, actions } = useAlignment();
  const { 
    enableWarmup = AppConfig.features.modelWarmup,
    warmupRuns = AppConfig.models.defaultWarmupRuns,
    preloadOnMount = false, // Changed from true to false to prevent auto-loading
    priorityOrder = ['heavy', 'light', 'trb'] as ChainType[]
  } = options;

  const preloadingRef = useRef(new Set<string>());
  const preloadQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef(false);

  /**
   * Preload a specific model by ID
   */
  const preloadModelById = useCallback(async (modelId: string): Promise<void> => {
    // Prevent duplicate preloading
    if (preloadingRef.current.has(modelId)) {
      logger.info(`Model ${modelId} is already being preloaded`);
      return;
    }

    try {
      const modelMetadata = await getModelById(modelId);
      if (!modelMetadata) {
        throw ErrorHandler.createModelError(ErrorCodes.MODEL_NOT_FOUND, `Model not found: ${modelId}`, modelId);
      }

      const chain = modelMetadata.chainType;
      
      // Check if model is already ready
      if (state.models[chain] === 'ready') {
        logger.info(`Model ${modelId} is already ready, skipping preload`);
        return;
      }

      // Mark as loading
      preloadingRef.current.add(modelId);
      actions.updateModelStatus(chain, 'loading');
      logger.info(`Starting preload for model: ${modelId} (${chain} chain)`);

      // Load the model with warmup
      await loadModelById({
        modelId,
        warmupOptions: enableWarmup ? {
          enabled: true,
          warmupRuns,
          logWarmupTimes: true,
        } : { enabled: false },
      });

      // Mark as ready
      actions.updateModelStatus(chain, 'ready');
      logger.info(`Model ${modelId} preloaded successfully!`);

    } catch (error) {
      const alignmentError = ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), 'ModelPreloader');
      logger.error(`Failed to preload model ${modelId}:`, alignmentError);
      
      // Get chain type for error status update
      try {
        const modelMetadata = await getModelById(modelId);
        if (modelMetadata) {
          actions.updateModelStatus(modelMetadata.chainType, 'error');
        }
      } catch {
        // If we can't get metadata, we can't update status
      }
      
      throw alignmentError;
    } finally {
      preloadingRef.current.delete(modelId);
    }
  }, [state.models, actions, enableWarmup, warmupRuns]);

  /**
   * Process the preload queue
   */
  const processPreloadQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || preloadQueueRef.current.length === 0) {
      return;
    }

    isProcessingQueueRef.current = true;
    
    try {
      // Process one model at a time to avoid overwhelming the system
      while (preloadQueueRef.current.length > 0) {
        const modelId = preloadQueueRef.current.shift()!;
        
        try {
          // Inline preload logic to avoid circular dependency
          if (preloadingRef.current.has(modelId)) {
            logger.info(`Model ${modelId} is already being preloaded`);
            continue;
          }

          const modelMetadata = await getModelById(modelId);
          if (!modelMetadata) {
            throw ErrorHandler.createModelError(ErrorCodes.MODEL_NOT_FOUND, `Model not found: ${modelId}`, modelId);
          }

          const chain = modelMetadata.chainType;
          
          if (state.models[chain] === 'ready') {
            logger.info(`Model ${modelId} is already ready, skipping preload`);
            continue;
          }

          preloadingRef.current.add(modelId);
          actions.updateModelStatus(chain, 'loading');
          logger.info(`Starting preload for model: ${modelId} (${chain} chain)`);
          
          await loadModelById({
            modelId,
            warmupOptions: enableWarmup ? {
              enabled: true,
              warmupRuns,
              logWarmupTimes: true,
            } : { enabled: false },
          });

          actions.updateModelStatus(chain, 'ready');
          logger.info(`Model ${modelId} preloaded successfully!`);
          preloadingRef.current.delete(modelId);

          // Small delay between models to prevent browser lock-up
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          logger.error(`Queue processing failed for model ${modelId}:`, error);
          preloadingRef.current.delete(modelId);
          
          try {
            const modelMetadata = await getModelById(modelId);
            if (modelMetadata) {
              actions.updateModelStatus(modelMetadata.chainType, 'error');
            }
          } catch {
            // If we can't get metadata, we can't update status
          }
        }
      }
    } finally {
      isProcessingQueueRef.current = false;
    }
  }, [state.models, actions, enableWarmup, warmupRuns]);

  /**
   * Queue a model for preloading
   */
  const queueModelPreload = useCallback((modelId: string) => {
    if (!preloadQueueRef.current.includes(modelId)) {
      preloadQueueRef.current.push(modelId);
      processPreloadQueue();
    }
  }, [processPreloadQueue]);

  /**
   * Preload models based on priority
   */
  const preloadModelsByPriority = useCallback(() => {
    const { high, medium, low } = AppConfig.models.preloadPriority;
    
    // Queue models in priority order
    [...high, ...medium, ...low].forEach(modelId => {
      queueModelPreload(modelId);
    });
  }, [queueModelPreload]);

  /**
   * Get preload status for a specific model
   */
  const getModelStatus = useCallback(async (modelId: string): Promise<ModelStatus> => {
    // This is a simplified status check - in practice you'd map modelId to chain
    try {
      const modelMetadata = await getModelById(modelId);
      if (!modelMetadata) return 'error';
      
      return state.models[modelMetadata.chainType as ChainType];
    } catch {
      return 'error';
    }
  }, [state.models]);

  /**
   * Check if any models are currently loading
   */
  const isAnyModelLoading = useCallback((): boolean => {
    return Object.values(state.models).some(status => status === 'loading');
  }, [state.models]);

  /**
   * Get loading progress (simplified)
   */
  const getLoadingProgress = useCallback((): number => {
    const statuses = Object.values(state.models);
    const ready = statuses.filter(status => status === 'ready').length;
    const total = statuses.length;
    return total > 0 ? (ready / total) * 100 : 0;
  }, [state.models]);

  /**
   * Force reload a model (clear cache and reload)
   */
  const reloadModel = useCallback(async (modelId: string) => {
    const modelMetadata = await getModelById(modelId);
    if (!modelMetadata) return;

    // Reset status and reload
    actions.updateModelStatus(modelMetadata.chainType, 'idle');
    await preloadModelById(modelId);
  }, [actions, preloadModelById]);

  // Auto-preload on mount if enabled (only once)
  useEffect(() => {
    if (preloadOnMount) {
      const { high, medium, low } = AppConfig.models.preloadPriority;
      const allModels = [...high, ...medium, ...low];
      
      // Only add models that aren't already queued or loaded
      allModels.forEach(modelId => {
        if (!preloadQueueRef.current.includes(modelId) && !preloadingRef.current.has(modelId)) {
          preloadQueueRef.current.push(modelId);
        }
      });
      
      if (preloadQueueRef.current.length > 0) {
        processPreloadQueue();
      }
    }
  }, []); // Remove dependencies to prevent re-runs

  // Preload model when selection changes (but only if not already loaded/loading)
  useEffect(() => {
    if (state.form.selectedModelId) {
      const isAlreadyQueued = preloadQueueRef.current.includes(state.form.selectedModelId);
      const isCurrentlyLoading = preloadingRef.current.has(state.form.selectedModelId);
      
      if (!isAlreadyQueued && !isCurrentlyLoading) {
        // Check if model is already ready
        getModelById(state.form.selectedModelId).then(metadata => {
          if (metadata && state.models[metadata.chainType] !== 'ready') {
            preloadQueueRef.current.push(state.form.selectedModelId);
            processPreloadQueue();
          }
        }).catch(() => {
          // If we can't get metadata, queue it anyway
          preloadQueueRef.current.push(state.form.selectedModelId);
          processPreloadQueue();
        });
      }
    }
  }, [state.form.selectedModelId]);

  return {
    // Status
    modelStatus: state.models,
    isAnyModelLoading,
    getLoadingProgress,
    getModelStatus,
    
    // Actions
    preloadModelById,
    queueModelPreload,
    preloadModelsByPriority,
    reloadModel,
    
    // Utils
    preloadingModels: Array.from(preloadingRef.current),
    queuedModels: [...preloadQueueRef.current]
  };
}
