import React, { useState } from 'react';
import {ResultsHTMLTable} from '../functional/resultsHTMLTable';
import { AlignmentBrowserHeavy } from '../functional/alignmentBrowserHeavy2';
import { AlignmentBrowserLight } from '../functional/alignmentBrowserLight2';
import { AlignmentBrowserHeavyDshort } from '../functional/alignmentBrowserHeavyDshort';

interface TabSetResultsProps {
    results: any;
    referenceAlleles: any;
}

const TabView: React.FC<{ item: any; hasD: boolean; referenceAlleles: any }> = ({ item, hasD, referenceAlleles }) => {
  if (!hasD) {
    return (
      <AlignmentBrowserLight results={item} referenceAlleles={referenceAlleles} />
    )
  } else {
    
    if (item.d_call[0] === 'Short-D') {
      return (<AlignmentBrowserHeavyDshort results={item} referenceAlleles={referenceAlleles} />)
    } else {
      return (<AlignmentBrowserHeavy results={item} referenceAlleles={referenceAlleles} />)
    }
  }
};

export const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceAlleles }) => {
  const [activeTab, setActiveTab] = useState<string>('query 0');
  const hasD = 'd_call' in results['query 0'];

  const handleClick = (index: string) => {
    setActiveTab(index);
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="tab">
        {Object.entries(results).map(([index, item]: [string, any]) => (
          <button
            className={`inline-block p-4 border-b-2 rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
              activeTab === index ? 'border-purple-600 text-white-600' : 'border-transparent'
            }`}
            key={index}
            id={index}
            type="button"
            role="tab"
            aria-controls={index}
            aria-selected={activeTab === index}
            onClick={() => handleClick(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {Object.entries(results).map(([index, item]: [string, any]) => (
        <div
          key={index}
          id={item.name}
          className={`p-4 bg-gray-50 dark:bg-gray-800 ${
            activeTab === index ? '' : 'hidden'
          }`}
          role="tabpanel"
          aria-labelledby={index}
        >
          <ResultsHTMLTable results={item} />
          <br />
          <TabView item={item} hasD={hasD} referenceAlleles={referenceAlleles} />
        </div>
      ))}
    </div>
  );
};
