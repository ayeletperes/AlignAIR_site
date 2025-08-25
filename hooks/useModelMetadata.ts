import { useState, useEffect, useCallback } from 'react';
import { 
  ModelMetadata, 
  loadModelMetadata, 
  loadAllModelMetadata, 
  loadDefaultModelMetadata,
  getModelsByChainType, 
  getActiveModels,
  getDefaultModelForChain,
  getModelById,
  preloadModelMetadata,
  preloadDefaultModelMetadata
} from '@/lib/model/modelMetadataLoader';
import { loadDefaultModel } from '@/lib/submission/alignmentSubmission';
import { logger } from '@/utils/logger';

interface UseModelMetadataOptions {
  preload?: boolean;
  autoRefresh?: boolean;
}

export function useModelMetadata(options: UseModelMetadataOptions = {}) {
  const [allModels, setAllModels] = useState<ModelMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const models = await loadAllModelMetadata();
      setAllModels(models);
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[ModelMetadata] Loaded ${models.length} model metadata files`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model metadata';
      setError(errorMessage);
      logger.error('Error loading model metadata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDefaultModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const models = await loadDefaultModelMetadata();
      setAllModels(models);
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[ModelMetadata] Loaded ${models.length} default model metadata files`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load default model metadata';
      setError(errorMessage);
      logger.error('Error loading default model metadata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDefaultIghModel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Load only the default IGH model
      await loadDefaultModel();
      // Load metadata for display purposes
      const ighModel = await loadModelMetadata('igh-v1.0');
      setAllModels(ighModel ? [ighModel] : []);
      if (process.env.NODE_ENV === 'development') {
        logger.info('[ModelMetadata] Loaded default IGH model');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load default IGH model';
      setError(errorMessage);
      logger.error('Error loading default IGH model:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load only the default IGH model by default for better performance
    loadDefaultIghModel();
  }, [loadDefaultIghModel]);

  const getModelsByChain = useCallback(async (chainType: string): Promise<ModelMetadata[]> => {
    return await getModelsByChainType(chainType);
  }, []);

  const getDefaultModel = useCallback(async (chainType: string): Promise<ModelMetadata | null> => {
    return await getDefaultModelForChain(chainType);
  }, []);

  const getModel = useCallback(async (modelId: string): Promise<ModelMetadata | null> => {
    return await getModelById(modelId);
  }, []);

  const refresh = useCallback(() => {
    loadDefaultIghModel();
  }, [loadDefaultIghModel]);

  return {
    allModels,
    loading,
    error,
    getModelsByChain,
    getDefaultModel,
    getModel,
    refresh,
    loadDefaultModels,
    loadDefaultIghModel,
    loadAllModels: loadModels,
  };
}

export function useModelMetadataById(modelId: string) {
  const [model, setModel] = useState<ModelMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const metadata = await loadModelMetadata(modelId);
        setModel(metadata);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model metadata';
        setError(errorMessage);
        logger.error(`Error loading metadata for ${modelId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      loadModel();
    }
  }, [modelId]);

  return { model, loading, error };
}

export function useModelMetadataByChain(chainType: string) {
  const [models, setModels] = useState<ModelMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const chainModels = await getModelsByChainType(chainType);
        setModels(chainModels);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load model metadata';
        setError(errorMessage);
        logger.error(`Error loading metadata for chain ${chainType}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (chainType) {
      loadModels();
    }
  }, [chainType]);

  return { models, loading, error };
} 