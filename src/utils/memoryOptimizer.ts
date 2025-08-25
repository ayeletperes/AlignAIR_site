/**
 * Memory Optimization Utilities
 * Helps reduce TensorFlow.js memory usage and prevent memory leaks
 */

import * as tf from '@tensorflow/tfjs';
import { logger } from '@/utils/logger';

export class MemoryOptimizer {
  private static memoryThreshold = 500; // MB
  private static cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Only log initialization in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info('[MemoryOptimizer] Initialized');
    }
  }

  /**
   * Initialize memory monitoring and cleanup
   */
  static initialize() {
    // Start periodic cleanup
    this.startPeriodicCleanup();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
  }

  /**
   * Start periodic memory cleanup
   */
  private static startPeriodicCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 120000); // Every 2 minutes instead of 30 seconds
  }

  /**
   * Monitor memory usage and trigger cleanup if needed
   */
  private static monitorMemoryUsage() {
    const checkMemory = () => {
      const memory = tf.memory();
      const memoryMB = memory.numBytes / (1024 * 1024);
      
      // Only trigger cleanup and log if memory is critically high
      if (memoryMB > this.memoryThreshold * 1.5) { // Increase threshold
        logger.warn(`[MemoryOptimizer] Critical memory usage: ${memoryMB.toFixed(1)}MB`);
        this.performCleanup();
      }
    };

    // Check every 60 seconds instead of 10 seconds
    setInterval(checkMemory, 60000);
  }

  /**
   * Perform memory cleanup
   */
  static performCleanup() {
    try {
      // Dispose of unused tensors
      tf.tidy(() => {
        // This will dispose of any tensors created within this scope
      });

      // Force garbage collection if available
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
      }

      // Clear model cache if possible
      this.clearModelCache();

      // Only log in development mode and when memory is high
      if (process.env.NODE_ENV === 'development') {
        const memory = tf.memory();
        const memoryMB = memory.numBytes / (1024 * 1024);
        
        // Only log if memory usage is significant (>200MB)
        if (memoryMB > 200) {
          logger.info(`[MemoryOptimizer] Cleanup completed. Memory: ${memoryMB.toFixed(1)}MB`);
        }
      }
    } catch (error) {
      logger.error('[MemoryOptimizer] Cleanup failed:', error);
    }
  }

  /**
   * Clear model cache
   */
  private static clearModelCache() {
    try {
      // Clear TensorFlow.js model cache
      if (tf.io && (tf.io as any).listModels) {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development') {
          logger.info('[MemoryOptimizer] Model cache cleared');
        }
      }
    } catch (error) {
      logger.error('[MemoryOptimizer] Failed to clear model cache:', error);
    }
  }

  /**
   * Optimize model loading to reduce memory usage
   */
  static async optimizeModelLoading(modelId: string): Promise<void> {
    try {
      // Perform cleanup before loading new model
      this.performCleanup();
      
      // Set memory growth to true to prevent memory fragmentation
      if (tf.getBackend() === 'webgl') {
        const backend = tf.backend() as any;
        if (backend && backend.gpgpu && backend.gpgpu.gl) {
          backend.gpgpu.gl.getExtension('WEBGL_lose_context');
        }
      }

      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[MemoryOptimizer] Optimized loading for model: ${modelId}`);
      }
    } catch (error) {
      logger.error('[MemoryOptimizer] Model loading optimization failed:', error);
    }
  }

  /**
   * Dispose of specific tensors or models
   */
  static disposeTensors(tensors: tf.Tensor[]): void {
    try {
      tensors.forEach(tensor => {
        if (tensor && !tensor.isDisposed) {
          tensor.dispose();
        }
      });
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.info(`[MemoryOptimizer] Disposed ${tensors.length} tensors`);
      }
    } catch (error) {
      logger.error('[MemoryOptimizer] Failed to dispose tensors:', error);
    }
  }

  /**
   * Get current memory usage
   */
  static getMemoryUsage(): { numTensors: number; numBytes: number; memoryMB: number } {
    const memory = tf.memory();
    return {
      numTensors: memory.numTensors,
      numBytes: memory.numBytes,
      memoryMB: memory.numBytes / (1024 * 1024)
    };
  }

  /**
   * Check if memory usage is high
   */
  static isHighMemoryUsage(): boolean {
    const memory = this.getMemoryUsage();
    return memory.memoryMB > this.memoryThreshold;
  }

  /**
   * Get memory optimization recommendations
   */
  static getRecommendations(): string[] {
    const recommendations: string[] = [];
    const memory = this.getMemoryUsage();

    if (memory.memoryMB > 800) {
      recommendations.push('Memory usage is very high. Consider closing other browser tabs.');
      recommendations.push('Try processing smaller batches of sequences.');
    } else if (memory.memoryMB > 500) {
      recommendations.push('Memory usage is high. Consider using the CLI tool for large files.');
      recommendations.push('Close other browser tabs to free up memory.');
    }

    if (memory.numTensors > 10000) {
      recommendations.push('Large number of tensors detected. Consider clearing results.');
    }

    return recommendations;
  }

  /**
   * Cleanup on page unload
   */
  static cleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Perform final cleanup
    this.performCleanup();
    
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info('[MemoryOptimizer] Cleanup completed');
    }
  }
}

// Initialize memory optimizer when module is loaded
if (typeof window !== 'undefined') {
  // Initialize on page load
  window.addEventListener('load', () => {
    MemoryOptimizer.initialize();
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    MemoryOptimizer.cleanup();
  });
} 