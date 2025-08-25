/**
 * Performance Monitoring System
 * Provides comprehensive performance tracking and optimization
 */

import { logger } from '@/utils/logger';
import { useEffect, useState } from 'react';

// Performance metrics interface
export interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    limit: number;
    percentage: number;
  };
  timing: {
    pageLoad: number;
    firstPaint: number;
    firstContentfulPaint: number;
    domContentLoaded: number;
  };
  processing: {
    modelLoadTime: number;
    inferenceTime: number;
    totalProcessingTime: number;
  };
  errors: {
    count: number;
    lastError?: string;
  };
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  memory: {
    warning: 0.95, // 70%
    critical: 0.9  // 90%
  },
  timing: {
    slow: 3000,    // 3 seconds
    verySlow: 5000 // 5 seconds
  }
};

// Performance monitoring class
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private observers: Set<(metrics: PerformanceMetrics) => void>;
  private monitoringInterval?: NodeJS.Timeout;
  private isMonitoring: boolean = false;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.observers = new Set();
  }

  // Initialize metrics
  private initializeMetrics(): PerformanceMetrics {
    return {
      memory: {
        used: 0,
        total: 0,
        limit: 0,
        percentage: 0
      },
      timing: {
        pageLoad: 0,
        firstPaint: 0,
        firstContentfulPaint: 0,
        domContentLoaded: 0
      },
      processing: {
        modelLoadTime: 0,
        inferenceTime: 0,
        totalProcessingTime: 0
      },
      errors: {
        count: 0,
        lastError: undefined
      }
    };
  }

  // Start monitoring
  startMonitoring(intervalMs: number = 5000): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
    }, intervalMs);

    logger.info('[PerformanceMonitor] Started monitoring');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    logger.info('[PerformanceMonitor] Stopped monitoring');
  }

  // Update metrics
  private updateMetrics(): void {
    this.updateMemoryMetrics();
    this.updateTimingMetrics();
    this.checkPerformanceThresholds();
    this.notifyObservers();
  }

  // Update memory metrics
  private updateMemoryMetrics(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memory = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      };
    }
  }

  // Update timing metrics
  private updateTimingMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.timing = {
        pageLoad: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint(),
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      };
    }
  }

  // Get first paint time
  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  // Get first contentful paint time
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  // Check performance thresholds
  private checkPerformanceThresholds(): void {
    // Memory threshold checks
    if (this.metrics.memory.percentage > PERFORMANCE_THRESHOLDS.memory.critical) {
      logger.warn('[PerformanceMonitor] Critical memory usage detected', this.metrics.memory);
      this.triggerMemoryWarning();
    } else if (this.metrics.memory.percentage > (PERFORMANCE_THRESHOLDS.memory.warning)) {
      logger.warn('[PerformanceMonitor] High memory usage detected', this.metrics.memory.percentage);
    }

    // Timing threshold checks
    if (this.metrics.timing.pageLoad > PERFORMANCE_THRESHOLDS.timing.verySlow) {
      logger.warn('[PerformanceMonitor] Very slow page load detected', this.metrics.timing);
    } else if (this.metrics.timing.pageLoad > PERFORMANCE_THRESHOLDS.timing.slow) {
      logger.warn('[PerformanceMonitor] Slow page load detected', this.metrics.timing);
    }
  }

  // Trigger memory warning
  private triggerMemoryWarning(): void {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('memory-warning', {
      detail: this.metrics.memory
    }));
  }

  // Notify observers
  private notifyObservers(): void {
    this.observers.forEach(observer => {
      try {
        observer(this.metrics);
      } catch (error) {
        logger.error('[PerformanceMonitor] Observer error:', error);
      }
    });
  }

  // Add observer
  addObserver(observer: (metrics: PerformanceMetrics) => void): void {
    this.observers.add(observer);
  }

  // Remove observer
  removeObserver(observer: (metrics: PerformanceMetrics) => void): void {
    this.observers.delete(observer);
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Update processing metrics
  updateProcessingMetrics(metrics: Partial<PerformanceMetrics['processing']>): void {
    this.metrics.processing = { ...this.metrics.processing, ...metrics };
  }

  // Record error
  recordError(error: string): void {
    this.metrics.errors.count++;
    this.metrics.errors.lastError = error;
  }

  // Get memory usage percentage
  getMemoryUsage(): number {
    return this.metrics.memory.percentage;
  }

  // Check if memory usage is critical
  isMemoryCritical(): boolean {
    return this.metrics.memory.percentage > PERFORMANCE_THRESHOLDS.memory.critical;
  }

  // Check if memory usage is high
  isMemoryHigh(): boolean {
    return this.metrics.memory.percentage > PERFORMANCE_THRESHOLDS.memory.warning;
  }

  // Get formatted memory string
  getFormattedMemory(): string {
    const { used, total, limit } = this.metrics.memory;
    const usedMB = Math.round(used / 1024 / 1024);
    const totalMB = Math.round(total / 1024 / 1024);
    const limitMB = Math.round(limit / 1024 / 1024);
    const percentage = Math.round(this.metrics.memory.percentage * 100);
    
    return `${usedMB}MB / ${totalMB}MB (${percentage}%)`;
  }

  // Track custom metric
  trackMetric(name: string, value: number, category?: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        event_category: category || 'performance',
        event_label: name,
        value: value
      });
    }
  }

  // Track processing time
  trackProcessingTime(step: string, duration: number): void {
    this.trackMetric(`${step}_time`, duration, 'processing');
    logger.info(`[PerformanceMonitor] ${step} took ${duration}ms`);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance utility functions
export const PerformanceUtils = {
  // Measure execution time
  measureTime<T>(fn: () => T, name: string): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    performanceMonitor.trackProcessingTime(name, duration);
    return result;
  },

  // Measure async execution time
  async measureTimeAsync<T>(fn: () => Promise<T>, name: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    performanceMonitor.trackProcessingTime(name, duration);
    return result;
  },

  // Debounce function
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if device is low-end
  isLowEndDevice(): boolean {
    const memory = performanceMonitor.getMemoryUsage();
    const cores = navigator.hardwareConcurrency || 1;
    return memory > 0.8 || cores < 4;
  },

  // Get performance recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = performanceMonitor.getMetrics();

    if (metrics.memory.percentage > 0.8) {
      recommendations.push('Close other browser tabs to free up memory');
    }

    if (metrics.timing.pageLoad > 3000) {
      recommendations.push('Consider using a faster internet connection');
    }

    if (this.isLowEndDevice()) {
      recommendations.push('Consider using the CLI tool for better performance');
    }

    return recommendations;
  }
};

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = (newMetrics: PerformanceMetrics) => {
      setMetrics(newMetrics);
    };

    performanceMonitor.addObserver(observer);
    
    // Start monitoring if not already started
    performanceMonitor.startMonitoring();

    logger.debug(`[usePerformanceMonitor] Monitoring started for ${componentName}`);

    return () => {
      performanceMonitor.removeObserver(observer);
      logger.debug(`[usePerformanceMonitor] Monitoring stopped for ${componentName}`);
    };
  }, [componentName]);

  return metrics;
};