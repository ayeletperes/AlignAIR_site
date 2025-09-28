/**
 * Model Preloader Component
 * Handles model preloading and status display
 */

import React from 'react';
import { useModelPreloader } from '@/hooks/useModelPreloader';
import { useAlignment, useAlignmentSelectors } from '@/contexts/AlignmentContext';
import { AppConfig } from '@/config/app.config';

export function ModelPreloader() {
  const { selectedChain, selectedModelId, modelStatus } = useAlignmentSelectors();
  const {
    isAnyModelLoading,
    getLoadingProgress,
    reloadModel
  } = useModelPreloader({
    preloadOnMount: AppConfig.features.modelWarmup, // Let the hook handle preloading
    enableWarmup: AppConfig.features.modelWarmup
  });

  // Remove the duplicate useEffect - let the hook handle preloading

  // Don't render anything in production (can add status indicator if needed)
  if (!AppConfig.features.memoryMonitoring) {
    return null;
  }

  return (
    <div className="model-preloader-status bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Model Status:</span>
          
          {/* Heavy Chain Status */}
          <div className="flex items-center space-x-1">
            <StatusIndicator status={modelStatus.heavy} />
            <span className="text-gray-600 dark:text-gray-400">Heavy</span>
          </div>
          
          {/* Light Chain Status */}
          <div className="flex items-center space-x-1">
            <StatusIndicator status={modelStatus.light} />
            <span className="text-gray-600 dark:text-gray-400">Light</span>
          </div>
          
          {/* TRB Chain Status */}
          <div className="flex items-center space-x-1">
            <StatusIndicator status={modelStatus.trb} />
            <span className="text-gray-600 dark:text-gray-400">TRB</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          {isAnyModelLoading() && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Loading models... {Math.round(getLoadingProgress())}%
            </div>
          )}
          
          {/* Current Model Status */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getStatusMessage(modelStatus[selectedChain], selectedModelId)}
          </div>

          {/* Reload Button (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => reloadModel(selectedModelId)}
              className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
              disabled={modelStatus[selectedChain] === 'loading'}
            >
              Reload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Status indicator component
 */
function StatusIndicator({ status }: { status: 'idle' | 'loading' | 'ready' | 'error' }) {
  const getStatusClasses = () => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'loading':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  return (
    <span 
      className={`w-2 h-2 rounded-full ${getStatusClasses()}`}
      title={`Status: ${status}`}
    />
  );
}

/**
 * Get status message for current model
 */
function getStatusMessage(status: 'idle' | 'loading' | 'ready' | 'error', modelId: string): string {
  switch (status) {
    case 'loading':
      return `Preparing ${modelId} for fast inference...`;
    case 'ready':
      return `${modelId} ready - submissions will be fast!`;
    case 'error':
      return `${modelId} loading failed - submissions may be slower`;
    default:
      return `${modelId} not loaded`;
  }
}
