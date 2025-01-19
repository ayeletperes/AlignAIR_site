import React from 'react';
import { TabSetResults } from '../ui/tabsetView';
import { DownloadResultsTable } from '../downloadResults';
import {IGType, IGHVConverted, sortedIGHD, sortedIGHJ, LightJ, LightV} from '../reference';


type AlleleCallOHE = { [k: string]: IGType | null };

const Results: React.FC<{ results: any, selectedChain: string }> = ({ results, selectedChain }) => {
  
  let AlleleCallOHE: AlleleCallOHE = { v_call: IGHVConverted, d_call: sortedIGHD, j_call: sortedIGHJ };
  if (selectedChain === 'Light') {
    AlleleCallOHE = { v_call: LightV, d_call: null, j_call: LightJ };
  }

  if (results) {
    if (Object.keys(results).length < 15) {
      return (
        <section>
          <DownloadResultsTable results={results} />
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <TabSetResults results={results} referenceAlleles={AlleleCallOHE} />
            </div>
          </div>
        </section>
      );
    } else {
      return (
        <section>
          <DownloadResultsTable results={results} />
          <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
                <span role="img" aria-label="building" style={{ fontSize: '24px' }}>ℹ️</span>
                <div>
                  <p className="text-sm text-black">
                    Currently we do not support a display of more than 15 sequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  } else {
    return (
      <div>
      </div>
    );
  }
};

export default Results;
