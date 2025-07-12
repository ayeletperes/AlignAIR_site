import { useState, useEffect, useCallback } from 'react';
import { 
  ModelMetadata, 
  loadModelMetadata, 
  loadAllModelMetadata, 
  getModelsByChainType, 
  getActiveModels,
  getDefaultModelForChain,
  getModelById,
  preloadModelMetadata
} from '@components/model/modelMetadataLoader';
import { logger } from '@components/utils/logger';

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
      logger.log(`Loaded ${models.length} model metadata files`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model metadata';
      setError(errorMessage);
      logger.error('Error loading model metadata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  useEffect(() => {
    if (options.preload) {
      preloadModelMetadata();
    }
  }, [options.preload]);

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
    loadModels();
  }, [loadModels]);

  return {
    allModels,
    loading,
    error,
    getModelsByChain,
    getDefaultModel,
    getModel,
    refresh
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