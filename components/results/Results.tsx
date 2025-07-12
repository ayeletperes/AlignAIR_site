// components/results/Results.tsx

import React, { memo } from 'react';
import TabSetResults from '@components/results/TabSetResults';
import DownloadResultsTable from '@components/results/DownloadResultsTable';
import { parseResults } from '@components/results/utils/parseResults';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { logger } from '@components/utils/logger';

interface ResultsProps {
  results: any;
  selectedChain: string;
  isLoading?: boolean;
}

// Custom comparison function for React.memo to prevent unnecessary re-renders
const arePropsEqual = (prevProps: ResultsProps, nextProps: ResultsProps) => {
  // If loading state changed, always re-render
  if (prevProps.isLoading !== nextProps.isLoading) {
    return false;
  }
  
  // If chain changed, always re-render
  if (prevProps.selectedChain !== nextProps.selectedChain) {
    return false;
  }
  
  // If results are null in both cases, don't re-render
  if (!prevProps.results && !nextProps.results) {
    return true;
  }
  
  // If one has results and the other doesn't, re-render
  if (!prevProps.results || !nextProps.results) {
    return false;
  }
  
  // Deep comparison of results (simplified - you might want to use a library like lodash.isEqual)
  try {
    const prevResultsString = JSON.stringify(prevProps.results);
    const nextResultsString = JSON.stringify(nextProps.results);
    return prevResultsString === nextResultsString;
  } catch (error) {
    // If JSON.stringify fails, assume they're different
    logger.warn('Failed to compare results props:', error);
    return false;
  }
};

const Results: React.FC<ResultsProps> = memo(({ results, selectedChain, isLoading = false }) => {
  // Early return for loading state
  // if (isLoading) {
  //   return (
  //     <section className="min-h-[400px] flex items-center justify-center">
  //       <LoadingSpinner 
  //         size="lg" 
  //         text="Processing results..." 
  //         className="flex-col"
  //       />
  //     </section>
  //   );
  // }

  // Early return for no results
  if (!results) {
    return (
      null
    );
  }

  try {
    const parsedResults = parseResults(results['processedPredictions'], results['sequences']);
    const resultCount = Object.keys(parsedResults).length;
    
    // Render results only if they contain fewer than 15 sequences
    if (resultCount < 15) {
      return (
        <section>
          <div className="flex justify-center mb-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded min-w-80 max-w-xl">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Successfully processed {resultCount} sequence{resultCount !== 1 ? 's' : ''}. 
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DownloadResultsTable results={parsedResults} />
          
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <TabSetResults 
                results={parsedResults} 
                referenceAlleles={results.referenceMap} 
                chain={selectedChain}
              />
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Currently, we do not support displaying more than 15 sequences in the interactive viewer.
                  You can still download the complete results below.
                </p>
              </div>
            </div>
          </div>

          <DownloadResultsTable results={parsedResults} />
          
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Viewer Unavailable</h3>
                <p className="text-gray-500 mb-4">
                  The interactive alignment viewer is limited to 15 sequences for optimal performance.
                  All {resultCount} sequences have been processed and are available for download above.
                </p>
                <div className="text-sm text-gray-400">
                  <p>Processed: {resultCount} sequences</p>
                  <p>Chain type: {selectedChain}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  } catch (error) {
    logger.error('Error parsing results:', error);
    return (
      <section className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Processing Results</h3>
          <p className="text-gray-500 mb-4">
            There was an error processing the results. Please try submitting again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-600">Error Details</summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                {error instanceof Error ? error.message : 'Unknown error'}
              </pre>
            </details>
          )}
        </div>
      </section>
    );
  }
}, arePropsEqual);

Results.displayName = 'Results';

export default Results;
