import { useCallback, useRef, useEffect, useState } from 'react';
import { logger } from './logger';

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled values
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      logger.log(`${componentName} rendered ${renderCount.current} times (${timeSinceLastRender}ms since last render)`);
    }
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    timeSinceLastRender: Date.now() - lastRenderTime.current
  };
}

/**
 * Hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string) {
  const startTime = useRef<number>(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      logger.warn(`${componentName} took ${duration.toFixed(2)}ms to render (target: <16ms)`);
    }
    
    startTime.current = performance.now();
  });
}

/**
 * Memoization helper for expensive computations
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList,
  equalityFn?: (prev: T, next: T) => boolean
): T {
  const prevValue = useRef<T>();
  const prevDeps = useRef<React.DependencyList>();

  // Check if dependencies have changed
  const depsChanged = !prevDeps.current || 
    prevDeps.current.length !== deps.length ||
    deps.some((dep, index) => dep !== prevDeps.current![index]);

  // Check if value has changed (if equality function provided)
  const valueChanged = equalityFn && prevValue.current !== undefined && 
    !equalityFn(prevValue.current, factory());

  if (depsChanged || valueChanged) {
    prevValue.current = factory();
    prevDeps.current = deps;
  }

  return prevValue.current!;
}

/**
 * Hook for preventing unnecessary re-renders
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Hook for lazy loading components
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const [Component, setComponent] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    importFunc()
      .then((module) => {
        setComponent(() => module.default);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        logger.error('Failed to load lazy component:', err);
      });
  }, [importFunc]);

  return { Component, isLoading, error, fallback };
}

/**
 * Hook for intersection observer (lazy loading)
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
} 