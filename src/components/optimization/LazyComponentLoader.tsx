/**
 * Lazy Component Loader
 * Provides lazy loading capabilities for heavy components
 */

'use client';

import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { logger } from '@/utils/logger';

interface LazyLoadProps {
  fallback?: React.ReactNode;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  className?: string;
}

/**
 * Higher-order component for lazy loading
 */
export function withLazyLoading<P extends object>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadProps = {}
) {
  const LazyComponent = React.lazy(() =>
    importFunction().then(Component => ({
      default: Component.default as ComponentType<P>
    }))
  );

  return function LazyLoadedComponent(props: P) {
    const {
      fallback = <LazyLoadingSpinner />,
      error: ErrorComponent = DefaultErrorBoundary,
      className
    } = options;

    return (
      <div className={className}>
        <ErrorBoundary ErrorComponent={ErrorComponent}>
          <Suspense fallback={fallback}>
            <LazyComponent {...(props as any)} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  };
}

/**
 * Error Boundary for lazy loaded components
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  ErrorComponent: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('[LazyComponentLoader] Component failed to load:', { error: { error, info: errorInfo } });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { ErrorComponent } = this.props;
      return (
        <ErrorComponent
          error={this.state.error}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default loading spinner
 */
function LazyLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
    </div>
  );
}

/**
 * Default error boundary component
 */
function DefaultErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-red-600 dark:text-red-400 mb-4">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Failed to Load Component
      </h3>
      <p className="text-red-700 dark:text-red-300 text-center mb-4 max-w-md">
        This component couldn't be loaded. Please check your internet connection and try again.
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

/**
 * Hook for programmatic lazy loading
 */
export function useLazyImport<T>(
  importFunction: () => Promise<{ default: T }>,
  dependencies: React.DependencyList = []
) {
  const [component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const loadComponent = React.useCallback(async () => {
    if (component) return; // Already loaded

    setLoading(true);
    setError(null);

    try {
      const loaded = await importFunction();
      setComponent(loaded.default);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Import failed');
      setError(error);
      logger.error('[useLazyImport] Import failed:', error);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return {
    component,
    loading,
    error,
    loadComponent,
    retry: loadComponent
  };
}

/**
 * Intersection observer based lazy loader
 */
interface LazyIntersectionLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyIntersectionLoader({
  children,
  fallback = <LazyLoadingSpinner />,
  rootMargin = '50px',
  threshold = 0.1,
  className
}: LazyIntersectionLoaderProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (hasLoaded || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}

// Pre-built lazy components for common heavy components
export const LazyAlignmentBrowser = withLazyLoading(
  () => import('@/components/results/alignment/AlignmentBrowser').then(module => ({ default: module.AlignmentBrowserVDJ })),
  {
    fallback: (
      <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading alignment viewer...</p>
        </div>
      </div>
    )
  }
);

export const LazyResultsTable = withLazyLoading(
  () => import('@/components/results/ResultsHTMLTable'),
  {
    fallback: (
      <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading results table...</div>
      </div>
    )
  }
);

// export const LazyModelVisualizer = withLazyLoading(
//   () => import('@/components/model/ModelVisualizer'),
//   {
//     fallback: (
//       <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
//           <p className="text-gray-600 dark:text-gray-400 text-sm">Loading visualizer...</p>
//         </div>
//       </div>
//     )
//   }
// );