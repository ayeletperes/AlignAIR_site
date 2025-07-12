// components/results/TabSetResults.tsx

import React, { useState, useCallback, useMemo } from 'react';
import ResultsHTMLTable from '@components/results/ResultsHTMLTable';
import {AlignmentBrowserLight} from '@components/results/alignment/AlignmentBrowserLight';
import {AlignmentBrowserHeavyDshort} from '@components/results/alignment/AlignmentBrowserDShort';
import {AlignmentBrowserHeavy} from '@components/results/alignment/AlignmentBrowserHeavy';
import {invertReferenceAlleles} from '@components/results/utils/invertReferenceAlleles';
import { logger } from '@components/utils/logger';
import { usePerformanceMonitor } from '@components/utils/performance';

interface TabSetResultsProps {
  results: any;
  referenceAlleles: any;
  chain: string;
}

const TabView: React.FC<{ item: any; referenceAlleles: any; chain: any; }> = React.memo(({ item, referenceAlleles, chain }) => {
  // Performance monitoring
  usePerformanceMonitor('TabView');
    
  if (chain === 'light') {
    return (
      <AlignmentBrowserLight results={item} referenceAlleles={referenceAlleles} />
    );
  } else {
    if (item.d_call[0] === 'Short-D') {
      return (
        <AlignmentBrowserHeavyDshort results={item} referenceAlleles={referenceAlleles} />
      );
    } else {
      return (
        <AlignmentBrowserHeavy results={item} referenceAlleles={referenceAlleles} />
      );
    }
  }
});

TabView.displayName = 'TabView';

const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceAlleles, chain }) => {
  // Performance monitoring
  usePerformanceMonitor('TabSetResults');
  
  const [activeTab, setActiveTab] = useState<string>('0');

  // Memoize expensive computations
  const referenceAllelesInverted = useMemo(() => 
    invertReferenceAlleles(referenceAlleles), 
    [referenceAlleles]
  );

  const resultsEntries = useMemo(() => 
    Object.entries(results), 
    [results]
  );

  const handleTabClick = useCallback((index: string) => {
    setActiveTab(index);
    logger.log(`Switched to tab ${index}`);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, index: string) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabClick(index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (parseInt(index) + 1) % resultsEntries.length;
        handleTabClick(nextIndex.toString());
        break;
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = (parseInt(index) - 1 + resultsEntries.length) % resultsEntries.length;
        handleTabClick(prevIndex.toString());
        break;
    }
  }, [handleTabClick, resultsEntries.length]);

  // Early return for empty results
  if (resultsEntries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
        <p className="text-gray-500">No sequences were processed successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Results tabs">
          {resultsEntries.map(([index, item]: [string, any]) => {
            const isActive = activeTab === index;
            const hasErrors = item.errors && item.errors.length > 0;
            
            return (
              <button
                key={index}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  transition-colors duration-200
                  ${isActive 
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                  ${hasErrors ? 'text-red-600 dark:text-red-400' : ''}
                `}
                onClick={() => handleTabClick(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${index}`}
                tabIndex={0}
              >
                <div className="flex items-center space-x-2">
                  <span>Query {parseInt(index) + 1}</span>
                  {hasErrors && (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {resultsEntries.map(([index, item]: [string, any]) => {
          const isActive = activeTab === index;
          const hasErrors = item.errors && item.errors.length > 0;
          
          return (
            <div
              key={index}
              id={`panel-${index}`}
              className={`transition-opacity duration-200 ${
                isActive ? 'block opacity-100' : 'hidden opacity-0'
              }`}
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
            >
              {/* Error Display */}
              {hasErrors && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Processing Issues Detected
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {item.errors.map((error: string, errorIndex: number) => (
                            <li key={errorIndex}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Table */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <ResultsHTMLTable results={item} index={index} chain={chain} />
                </div>
              </div>

              {/* Alignment Browser */}
              <div className="mt-6">
                <TabView 
                  item={item} 
                  referenceAlleles={referenceAllelesInverted} 
                  chain={chain}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard Navigation Help */}
      <div className="text-xs text-gray-500 text-center">
        <p>Use ← → arrow keys to navigate between tabs, or click to select</p>
      </div>
    </div>
  );
};

export default TabSetResults;
