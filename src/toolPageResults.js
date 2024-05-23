import React from 'react';
import {TabSetResults, DownloadResultsTable} from './processResults'; //ResultsTable TabSetResults, 
const AlignairPageResults = ({ results }) => {
  
  // if the length of results is less then 15, return the tabset view, else return "In production"
  if (results && Object.keys(results).length < 15) {
    return (
      // <ResultsTable results={results[Object.keys(results)[0]]} />
      <TabSetResults results={results} />
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