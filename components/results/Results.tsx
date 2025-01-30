// components/results/Results.tsx

import React from 'react';
import TabSetResults from '@components/results/TabSetResults';
import DownloadResultsTable from '@components/results/DownloadResultsTable';
import { parseResults } from '@components/results/utils/parseResults';

interface ResultsProps {
  results: any;
  selectedChain: string;
}

const Results: React.FC<ResultsProps> = ({ results, selectedChain }) => {
  if (!results) {
    return <div>No results to display.</div>;
  }
  const parsedResults = parseResults(results['processedPredictions'], results['sequences']);
  
  // Render results only if they contain fewer than 15 sequences
  if (results) {
    if (Object.keys(parsedResults).length < 15) {
      return (
        <section>
          <DownloadResultsTable results={parsedResults} />
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <TabSetResults results={parsedResults} referenceAlleles={results.referenceMap} chain={selectedChain}/>
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section>
          <DownloadResultsTable results={parsedResults} />
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
                <span role="img" aria-label="info" style={{ fontSize: '24px' }}>ℹ️</span>
                <div>
                  <p className="text-sm text-black">
                    Currently, we do not support displaying more than 15 sequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }else{
    return <div></div>;
  }
};

export default Results;
