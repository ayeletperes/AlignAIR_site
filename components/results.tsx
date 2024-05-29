import React from 'react';
import { TabSetResults, DownloadResultsTable } from './processResults'; // ResultsTable TabSetResults,
import {IGType, IGHVConverted, sortedIGHD, sortedIGHJ, LightJ, LightV} from './reference';


type AlleleCallOHE = { [k: string]: IGType | null };

const Results: React.FC<{ results: any, selectedChain: string }> = ({ results, selectedChain }) => {
  
  let AlleleCallOHE: AlleleCallOHE = { v_call: IGHVConverted, d_call: sortedIGHD, j_call: sortedIGHJ };
  if (selectedChain === 'Light') {
    AlleleCallOHE = { v_call: LightV, d_call: null, j_call: LightJ };
  }

  
  if (results && Object.keys(results).length < 15) {
    return (
      
      <section>
        <div className="relative pt-4 pb-10 md:pt-8 md:pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <TabSetResults results={results} referenceAlleles={AlleleCallOHE} />
          </div>
        </div>
      </section>
    );
  } else {
    if (results) {
      return (
        <section>
          <DownloadResultsTable results={results} />
        </section>
      );
    } else {
      
      return null;
    }
  }
};

export default Results;
