import React from 'react';
import {TabSetResults, DownloadResultsTable} from './processResults'; //ResultsTable TabSetResults,
import {vAlleleCallOHE, dAlleleCallOHE, jAlleleCallOHE} from "./fastaReader";

const AlignairPageResults = ({ results}) => {
  
  const AlleleCallOHE = { v_call: vAlleleCallOHE, d_call: dAlleleCallOHE, j_call: jAlleleCallOHE };
  let dictionary = {};
  Object.entries(AlleleCallOHE).forEach(([index, value]) => {
    dictionary[index] = Object.values(value).reduce((obj, item) => {
      obj[item.name] = item.sequence;
      return obj;
    }, {});
  });
  
  // if the length of results is less then 15, return the tabset view, else return "In production"
  if (results && Object.keys(results).length < 15) {
    return (
      // <ResultsTable results={results[Object.keys(results)[0]]} />
      <>
        <TabSetResults results={results} referenceAlleles={dictionary}/>
        {/* <br/>
        <AlignmentBrowser resultsObj={results} /> */}
      </>
    );
  } else {
    if(results){
      return (
        <DownloadResultsTable results={results} />
      );
    } else{
      // return null if there are no results
      return null;
    }
  }

};

export default AlignairPageResults;