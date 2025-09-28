// components/results/TabSetResults.tsx
import React, { useState, useCallback, useMemo } from 'react';
import ResultsHTMLTable from '@/components/results/ResultsHTMLTable';
import AlignmentBrowserVDJ from 'src/components/results/alignment/AlignmentBrowser';
import { logger } from '@/utils/logger';

interface TabSetResultsProps {
  results: any;
  referenceLoader: any;
  chain: 'heavy' | 'light' | 'trb';
}

const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceLoader, chain }) => {
  const entries = useMemo(() => Object.entries(results) as [string, any][], [results]);

  // default to first tab
  const [activeIndex, setActiveIndex] = useState(0);

  const onTabClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    logger.info(`Switched to tab ${idx}`);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    const last = entries.length - 1;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabClick(idx);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onTabClick(idx === last ? 0 : idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onTabClick(idx === 0 ? last : idx - 1);
    }
  }, [entries.length, onTabClick]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
        <p className="text-gray-500">No sequences were processed successfully.</p>
      </div>
    );
  }

  // Only the active item is computed and rendered below
  const activePair = entries[activeIndex];
  const activeItem = activePair?.[1];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Results tabs">
          {entries.map(([key, item], idx) => {
            const isActive = idx === activeIndex;
            const hasErrors = !!(item.errors && item.errors.length > 0);
            return (
              <button
                key={key}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  transition-colors duration-200
                  ${isActive
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-black dark:text-gray-400 dark:hover:text-gray-300'}
                  ${hasErrors ? 'text-red-600 dark:text-red-400' : ''}
                `}
                onClick={() => onTabClick(idx)}
                onKeyDown={(e) => onKeyDown(e, idx)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${idx}`}
                tabIndex={0}
              >
                <div className="flex items-center space-x-2">
                  <span>Query {idx + 1}</span>
                  {hasErrors && (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Single active panel */}
      <div id={`panel-${activeIndex}`} role="tabpanel" aria-labelledby={`tab-${activeIndex}`}>
        {activeItem?.errors?.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Processing Issues Detected</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {activeItem.errors.map((err: string, i: number) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <ResultsHTMLTable results={activeItem} index={String(activeIndex)} chain={chain} />
          </div>
        </div>

        <div className="mt-6">
          <AlignmentBrowserVDJ
            results={activeItem}
            referenceLoader={referenceLoader}
            chain={chain === 'light' ? 'light' : 'heavy'}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Use ← → arrow keys to navigate between tabs, or click to select</p>
      </div>
    </div>
  );
};

export default TabSetResults;
