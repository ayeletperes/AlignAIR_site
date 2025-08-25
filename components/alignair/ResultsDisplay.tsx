/**
 * Results Display Component
 * Shows alignment results and processing status
 */

'use client';

import React from 'react';
import { useAlignmentSelectors } from '@/contexts/AlignmentContext';
import { useProcessingState } from '@/hooks/useProcessingState';
import { useResultsState } from '@/hooks/useResultsState';
import { generateRunMetadata, getMetadataDownloadOptions } from '@/utils/runMetadata';
// ProcessingStatus is defined inline below
import Results from '@/components/results/Results';

export function ResultsDisplay() {
  const {
    selectedChain,
    isProcessing,
    processingError,
    params,
    input
  } = useAlignmentSelectors();

  const { currentProgress, stepProgress } = useProcessingState();
  const { hasResults, latestResult } = useResultsState();

  // Show processing status when processing or if there's an error
  const showProcessingStatus = isProcessing || processingError;
  
  // Show results if we have any results or if processing is complete
  const showResults = hasResults || (!isProcessing && latestResult);

  if (!showProcessingStatus && !showResults) {
    return null;
  }

  return (
    <div className="results-display-container">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Processing Status */}
        {showProcessingStatus && (
          <div className="mb-8">
            <ProcessingStatus
              isProcessing={isProcessing}
              progress={currentProgress}
              stepProgress={stepProgress}
              error={processingError}
            />
          </div>
        )}

        {/* Results Container - Using your original Results component */}
        {showResults && (
          <div className="results-container">
            <Results
              results={latestResult}
              selectedChain={selectedChain}
              isLoading={isProcessing}
            />
            
            {/* Run Metadata Download */}
            {latestResult && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Run Metadata
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Download run configuration and metadata for reproducibility
                </p>
                <div className="flex space-x-3">
                  {getMetadataDownloadOptions(
                    generateRunMetadata(
                      latestResult,
                      params,
                      input?.type || 'sequence',
                      input?.type === 'file' ? input.file?.name : undefined,
                      input?.type === 'file' ? input.file?.size : undefined
                    )
                  ).map((option) => (
                    <button
                      key={option.format}
                      onClick={option.onClick}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 rounded-lg transition-colors"
                      title={option.description}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * Processing Status Component
 */
interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  stepProgress: any;
  error: any;
}

function ProcessingStatus({ 
  isProcessing, 
  progress, 
  stepProgress, 
  error 
}: ProcessingStatusProps) {
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
            Processing Error
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {error.userMessage || 'An error occurred during processing.'}
        </p>
        {error.recoverable && (
          <div className="text-sm text-red-600 dark:text-red-400">
            <p className="font-medium mb-2">Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              {error.getRecoverySuggestions?.().map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (!isProcessing) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <svg className="animate-spin w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
          Processing Alignment
        </h3>
      </div>
      
      {/* Overall Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-700 dark:text-blue-300">Overall Progress</span>
          <span className="text-sm text-blue-700 dark:text-blue-300">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Progress */}
      <div className="space-y-2">
        {Object.entries(stepProgress).map(([step, info]: [string, any]) => (
          <div key={step} className="flex items-center text-sm">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              info.completed 
                ? 'bg-green-500' 
                : info.progress > 0 
                  ? 'bg-blue-500 animate-pulse' 
                  : 'bg-gray-300 dark:bg-gray-600'
            }`} />
            <span className="capitalize text-blue-800 dark:text-blue-200 flex-1">
              {step.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            {info.message && (
              <span className="text-blue-600 dark:text-blue-400 text-xs">
                {info.message}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Result History Item Component
 */
interface ResultHistoryItemProps {
  result: any;
  index: number;
}

function ResultHistoryItem({ result, index }: ResultHistoryItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {index}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {result.chainType.toUpperCase()} Chain Analysis
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(result.timestamp).toLocaleString()} • {result.modelId}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {result.processingTime}ms
        </div>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          View
        </button>
      </div>
    </div>
  );
}