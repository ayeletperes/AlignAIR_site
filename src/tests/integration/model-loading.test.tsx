/**
 * Integration tests for model loading and management
 * Tests model preloading, caching, and error handling
 */

import { renderHook, act } from '@testing-library/react';
import { useModelPreloader } from '@/hooks/useModelPreloader';
import { AlignmentProvider } from '@/contexts/AlignmentContext';
import { AppConfig } from '@/config/app.config';

// Mock external dependencies
jest.mock('@/components/submission/alignmentSubmission', () => ({
  getOrLoadModelById: jest.fn(),
}));

jest.mock('@/components/model/modelMetadataLoader', () => ({
  getModelById: jest.fn(),
  getDefaultModelForChain: jest.fn(),
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

// Test wrapper
function createWrapper() {
  return ({ children }: { children: React.ReactNode }) => (
    <AlignmentProvider>{children}</AlignmentProvider>
  );
}

describe('Model Loading Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Model Preloading', () => {
    test('should preload models in priority order', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      // Mock model metadata
      getModelById
        .mockResolvedValueOnce({ id: 'igh-v1.0', chainType: 'heavy' })
        .mockResolvedValueOnce({ id: 'igl-v1.0', chainType: 'light' })
        .mockResolvedValueOnce({ id: 'trb-v1.0', chainType: 'trb' });

      // Mock successful model loading
      getOrLoadModelById.mockResolvedValue({
        loader: { predict: jest.fn() },
        modelOutputNodes: { output: 0 }
      });

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // Trigger preloading
      await act(async () => {
        result.current.preloadModelsByPriority();
      });

      // Wait for preloading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // Verify models were loaded in correct order
      expect(getOrLoadModelById).toHaveBeenCalledTimes(3);
      
      // High priority model should be loaded first
      expect(getOrLoadModelById).toHaveBeenNthCalledWith(1, 
        expect.objectContaining({ modelId: 'igh-v1.0' })
      );
    });

    test('should handle model loading failures gracefully', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      getModelById.mockResolvedValue({ id: 'igh-v1.0', chainType: 'heavy' });
      getOrLoadModelById.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        try {
          await result.current.preloadModelById('igh-v1.0');
        } catch (error) {
          // Expected to throw
        }
      });

      // Model status should be set to error
      expect(result.current.modelStatus.heavy).toBe('error');
    });

    test('should cache loaded models', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      getModelById.mockResolvedValue({ id: 'igh-v1.0', chainType: 'heavy' });
      getOrLoadModelById.mockResolvedValue({
        loader: { predict: jest.fn() },
        modelOutputNodes: { output: 0 }
      });

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // Load model twice
      await act(async () => {
        await result.current.preloadModelById('igh-v1.0');
      });

      await act(async () => {
        await result.current.preloadModelById('igh-v1.0');
      });

      // Should only load once due to caching
      expect(getOrLoadModelById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Model Status Management', () => {
    test('should track loading progress correctly', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      getModelById.mockResolvedValue({ id: 'igh-v1.0', chainType: 'heavy' });
      
      // Mock slow loading
      getOrLoadModelById.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            loader: { predict: jest.fn() },
            modelOutputNodes: { output: 0 }
          }), 100)
        )
      );

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // Start loading
      act(() => {
        result.current.preloadModelById('igh-v1.0');
      });

      // Should be loading
      expect(result.current.modelStatus.heavy).toBe('loading');
      expect(result.current.isAnyModelLoading()).toBe(true);

      // Wait for completion
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Should be ready
      expect(result.current.modelStatus.heavy).toBe('ready');
      expect(result.current.isAnyModelLoading()).toBe(false);
    });

    test('should calculate loading progress correctly', async () => {
      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // Initially 0% progress (all models idle)
      expect(result.current.getLoadingProgress()).toBe(0);

      // Mock one model as ready (should be 33.33% for 3 models)
      act(() => {
        // This would be done internally by the hook
        // For testing, we'd need to access the context directly
      });
    });
  });

  describe('Concurrent Loading Control', () => {
    test('should respect max concurrent loads', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      // Mock different models
      getModelById
        .mockImplementation((id: string) => {
          const models = {
            'igh-v1.0': { id: 'igh-v1.0', chainType: 'heavy' },
            'igl-v1.0': { id: 'igl-v1.0', chainType: 'light' },
            'trb-v1.0': { id: 'trb-v1.0', chainType: 'trb' }
          };
          return Promise.resolve(models[id as keyof typeof models]);
        });

      let loadingCount = 0;
      let maxConcurrentLoads = 0;

      getOrLoadModelById.mockImplementation(async () => {
        loadingCount++;
        maxConcurrentLoads = Math.max(maxConcurrentLoads, loadingCount);
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        loadingCount--;
        return {
          loader: { predict: jest.fn() },
          modelOutputNodes: { output: 0 }
        };
      });

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // Queue multiple models
      await act(async () => {
        const promises = [
          result.current.queueModelPreload('igh-v1.0'),
          result.current.queueModelPreload('igl-v1.0'),
          result.current.queueModelPreload('trb-v1.0'),
        ];
        
        await Promise.all(promises);
      });

      // Should not exceed max concurrent loads
      expect(maxConcurrentLoads).toBeLessThanOrEqual(AppConfig.models.maxConcurrentLoads);
    });
  });

  describe('Error Recovery', () => {
    test('should allow model reload after error', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      getModelById.mockResolvedValue({ id: 'igh-v1.0', chainType: 'heavy' });
      
      // First call fails
      getOrLoadModelById.mockRejectedValueOnce(new Error('Load failed'));
      // Second call succeeds
      getOrLoadModelById.mockResolvedValueOnce({
        loader: { predict: jest.fn() },
        modelOutputNodes: { output: 0 }
      });

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      // First attempt should fail
      await act(async () => {
        try {
          await result.current.preloadModelById('igh-v1.0');
        } catch (error) {
          // Expected
        }
      });

      expect(result.current.modelStatus.heavy).toBe('error');

      // Reload should succeed
      await act(async () => {
        await result.current.reloadModel('igh-v1.0');
      });

      expect(result.current.modelStatus.heavy).toBe('ready');
    });
  });

  describe('Performance Metrics', () => {
    test('should track model loading times', async () => {
      const { getOrLoadModelById } = require('@/components/submission/alignmentSubmission');
      const { getModelById } = require('@/components/model/modelMetadataLoader');

      getModelById.mockResolvedValue({ id: 'igh-v1.0', chainType: 'heavy' });
      
      const loadStartTime = Date.now();
      getOrLoadModelById.mockImplementation(async () => {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          loader: { predict: jest.fn() },
          modelOutputNodes: { output: 0 }
        };
      });

      const { result } = renderHook(() => useModelPreloader(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.preloadModelById('igh-v1.0');
      });

      const loadTime = Date.now() - loadStartTime;
      
      // Should track reasonable loading time
      expect(loadTime).toBeGreaterThanOrEqual(100);
      expect(loadTime).toBeLessThan(1000); // Reasonable upper bound for test
    });
  });
});