// components/results/TabSetResults.tsx

import React, { useState } from 'react';
import ResultsHTMLTable from '@components/results/ResultsHTMLTable';
import {AlignmentBrowserLight} from '@components/results/alignment/AlignmentBrowserLight';
import {AlignmentBrowserHeavyDshort} from '@components/results/alignment/AlignmentBrowserDShort';
import {AlignmentBrowserHeavy} from '@components/results/alignment/AlignmentBrowserHeavy';
import {invertReferenceAlleles} from '@components/results/utils/invertReferenceAlleles';
import { logger } from '@components/utils/logger';

interface TabSetResultsProps {
  results: any;
  referenceAlleles: any;
  chain: string;
}


const TabView: React.FC<{ item: any; referenceAlleles: any; chain: any; }> = ({ item, referenceAlleles, chain }) => {
    
    if (chain === 'light') {
        return (
        <AlignmentBrowserLight results={item} referenceAlleles={referenceAlleles} />
        )
    } else {
        if (item.d_call[0] === 'Short-D') {
          return (
            <AlignmentBrowserHeavyDshort results={item} referenceAlleles={referenceAlleles} />
        )
        } else {
          return (
            <AlignmentBrowserHeavy results={item} referenceAlleles={referenceAlleles} />
        )
        }
    }
};

const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceAlleles, chain }) => {
  const [activeTab, setActiveTab] = useState<string>('0');

  const referenceAllelesInverted = invertReferenceAlleles(referenceAlleles);
  
  const handleTabClick = (index: string) => {
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
            onClick={() => handleTabClick(index)}
          >
            {`Query ${index}`}
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
          <ResultsHTMLTable results={item} index={index} chain={chain}/>
          <br />
          <TabView item={item} referenceAlleles={referenceAllelesInverted} chain={chain}/>
        </div>
      ))}
    </div>
  );
};

export default TabSetResults;
