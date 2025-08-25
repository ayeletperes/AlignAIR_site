/**
 * Performance tests for memory usage monitoring
 * Tests memory optimization and leak detection
 */

import { renderHook, act } from '@testing-library/react';
import { MemoryMonitor, performanceMonitor } from '@/utils/performance';
import { AppConfig } from '@/config/app.config';

// Mock performance APIs
const mockPerformance = {
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024, // 100MB
  },
  now: jest.fn(() => Date.now()),
};

// Extend global with performance mock
(global as any).performance = mockPerformance;

describe('Memory Usage Performance Tests', () => {
  let memoryMonitor: MemoryMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    memoryMonitor = MemoryMonitor.getInstance();
    mockPerformance.memory.usedJSHeapSize = 50 * 1024 * 1024;
  });

  afterEach(() => {
    memoryMonitor.stopMonitoring();
  });

  describe('Memory Monitoring', () => {
    test('should monitor memory usage correctly', (done) => {
      let callCount = 0;
      
      const unsubscribe = memoryMonitor.subscribe((usage) => {
        callCount++;
        
        expect(usage.used).toBe(50 * 1024 * 1024);
        expect(usage.total).toBe(100 * 1024 * 1024);
        expect(usage.percentage).toBe(50);
        expect(usage.timestamp).toBeGreaterThan(0);
        
        if (callCount >= 2) {
          unsubscribe();
          done();
        }
      });

      memoryMonitor.startMonitoring(100); // Monitor every 100ms
    });

    test('should detect memory leaks', (done) => {
      let initialMemory = 50 * 1024 * 1024;
      let currentMemory = initialMemory;
      const memoryIncrement = 10 * 1024 * 1024; // 10MB increase per cycle
      
      // Mock increasing memory usage
      jest.spyOn(mockPerformance.memory, 'usedJSHeapSize', 'get')
        .mockImplementation(() => currentMemory);

      const memoryReadings: number[] = [];
      
      const unsubscribe = memoryMonitor.subscribe((usage) => {
        memoryReadings.push(usage.used);
        
        // Simulate memory increase
        currentMemory += memoryIncrement;
        mockPerformance.memory.usedJSHeapSize = currentMemory;
        
        if (memoryReadings.length >= 5) {
          // Check for consistent memory increase (potential leak)
          const isIncreasing = memoryReadings.every((reading, index) => 
            index === 0 || reading > memoryReadings[index - 1]
          );
          
          expect(isIncreasing).toBe(true);
          unsubscribe();
          done();
        }
      });

      memoryMonitor.startMonitoring(50);
    });

    test('should warn on high memory usage', (done) => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      // Set memory to high usage (85%)
      mockPerformance.memory.usedJSHeapSize = 85 * 1024 * 1024;
      
      const unsubscribe = memoryMonitor.subscribe((usage) => {
        if (usage.percentage > 80) {
          // Should trigger warning
          setTimeout(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
              expect.stringContaining('High memory usage'),
              expect.any(Object)
            );
            consoleSpy.mockRestore();
            unsubscribe();
            done();
          }, 10);
        }
      });

      memoryMonitor.startMonitoring(50);
    });
  });

  describe('Performance Metrics', () => {
    test('should record performance metrics correctly', () => {
      const metric = {
        name: 'model_load_time',
        value: 1500,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'model' as const
      };

      performanceMonitor.recordMetric(metric);

      const modelMetrics = performanceMonitor.getMetricsByCategory('model');
      expect(modelMetrics).toHaveLength(1);
      expect(modelMetrics[0]).toEqual(metric);
    });

    test('should calculate average metrics', () => {
      const metrics = [
        { name: 'test_metric', value: 100, unit: 'ms', timestamp: 1, category: 'ui' as const },
        { name: 'test_metric', value: 200, unit: 'ms', timestamp: 2, category: 'ui' as const },
        { name: 'test_metric', value: 300, unit: 'ms', timestamp: 3, category: 'ui' as const },
      ];

      metrics.forEach(metric => performanceMonitor.recordMetric(metric));

      const average = performanceMonitor.getAverageMetric('test_metric');
      expect(average).toBe(200); // (100 + 200 + 300) / 3
    });

    test('should limit metric storage to prevent memory bloat', () => {
      // Record more metrics than the limit (1000)
      for (let i = 0; i < 1100; i++) {
        performanceMonitor.recordMetric({
          name: `metric_${i}`,
          value: i,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'ui'
        });
      }

      const allMetrics = performanceMonitor.getMetricsByCategory('ui');
      expect(allMetrics.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Resource Cleanup', () => {
    test('should properly clean up monitoring intervals', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
      
      memoryMonitor.startMonitoring(100);
      memoryMonitor.stopMonitoring();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });

    test('should remove event listeners on unmount', () => {
      const unsubscribe1 = memoryMonitor.subscribe(() => {});
      const unsubscribe2 = memoryMonitor.subscribe(() => {});
      
      // Both should be removable
      expect(() => {
        unsubscribe1();
        unsubscribe2();
      }).not.toThrow();
    });
  });

  describe('Memory Pressure Scenarios', () => {
    test('should handle rapid memory fluctuations', (done) => {
      let cycleCount = 0;
      const baseMem = 50 * 1024 * 1024;
      
      jest.spyOn(mockPerformance.memory, 'usedJSHeapSize', 'get')
        .mockImplementation(() => {
          // Simulate fluctuating memory (sawtooth pattern)
          const cycle = Math.sin(cycleCount * 0.5) * 20 * 1024 * 1024;
          return baseMem + cycle;
        });

      const readings: number[] = [];
      
      const unsubscribe = memoryMonitor.subscribe((usage) => {
        readings.push(usage.used);
        cycleCount++;
        
        if (readings.length >= 10) {
          // Verify we captured the fluctuations
          const min = Math.min(...readings);
          const max = Math.max(...readings);
          const range = max - min;
          
          expect(range).toBeGreaterThan(10 * 1024 * 1024); // Should vary by at least 10MB
          unsubscribe();
          done();
        }
      });

      memoryMonitor.startMonitoring(20);
    });

    test('should survive memory API unavailability', () => {
      // Mock missing memory API
      const originalMemory = mockPerformance.memory;
      delete (mockPerformance as any).memory;
      
      const usage = memoryMonitor.getCurrentMemoryUsage();
      expect(usage).toBeNull();
      
      // Restore
      mockPerformance.memory = originalMemory;
    });
  });

  describe('Integration with Component Lifecycle', () => {
    test('should track memory usage during component operations', async () => {
      let memoryBeforeOperation: number;
      let memoryAfterOperation: number;
      
      // Get baseline memory
      const baseline = memoryMonitor.getCurrentMemoryUsage();
      expect(baseline).not.toBeNull();
      memoryBeforeOperation = baseline!.used;
      
      // Simulate memory-intensive operation
      const largeArray = new Array(1000000).fill('test data');
      
      // Mock increased memory usage
      mockPerformance.memory.usedJSHeapSize = memoryBeforeOperation + 50 * 1024 * 1024;
      
      const afterOperation = memoryMonitor.getCurrentMemoryUsage();
      expect(afterOperation).not.toBeNull();
      memoryAfterOperation = afterOperation!.used;
      
      expect(memoryAfterOperation).toBeGreaterThan(memoryBeforeOperation);
      
      // Cleanup
      largeArray.length = 0;
    });
  });

  describe('Performance Regression Detection', () => {
    test('should detect performance degradation over time', () => {
      const baselineTime = 100;
      const degradedTime = 500;
      
      // Record baseline metrics
      for (let i = 0; i < 10; i++) {
        performanceMonitor.recordMetric({
          name: 'component_render',
          value: baselineTime + Math.random() * 10,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'ui'
        });
      }
      
      const baselineAverage = performanceMonitor.getAverageMetric('component_render');
      
      // Record degraded metrics
      for (let i = 0; i < 5; i++) {
        performanceMonitor.recordMetric({
          name: 'component_render',
          value: degradedTime + Math.random() * 50,
          unit: 'ms',
          timestamp: Date.now(),
          category: 'ui'
        });
      }
      
      const currentAverage = performanceMonitor.getAverageMetric('component_render');
      
      // Should detect significant degradation
      const degradationRatio = currentAverage / baselineAverage;
      expect(degradationRatio).toBeGreaterThan(2); // More than 2x slower
    });
  });
});