import React, {useState} from 'react';
import {fastaReader, vAlleleCallOHE, dAlleleCallOHE, jAlleleCallOHE} from "./fastaReader";
import { processAllBatches } from './predictAlignment';
import { countTotalSequences } from './fileProcessor';

export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} second(s)`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minute(s)`;
  } else {
    return `${Math.round(seconds / 3600)} hour(s)`;
  }
}

export async function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

async function submitSequences(sequenceInput, fileInput, params, model, outputIndices, setResults, setInteractiveState) {

  let fastaLines = sequenceInput;
  if (!sequenceInput && fileInput) {
      countTotalSequences(fileInput, 100)
      .then((totalSequences) => {
          console.log('Total sequences:', totalSequences);
      })
      .catch((error) => {
          console.error('Error:', error);
      });
      fastaLines = await readFileContent(fileInput);
  }

  const sequenceData = fastaReader.queryToDict(fastaLines);
  const confidences = { v_allele: params.vConf, d_allele: params.dConf, j_allele: params.jConf };
  const caps = { v_allele: params.vCap, d_allele: params.dCap, j_allele: params.jCap };
  const segs = { v_allele: params.vSeg, d_allele: params.dSeg, j_allele: params.jSeg };
  const AlleleCallOHE = { v_allele: vAlleleCallOHE, d_allele: dAlleleCallOHE, j_allele: jAlleleCallOHE };
  const keys = Object.keys(sequenceData);
  const numElements = 500;

  await processAllBatches(keys, sequenceData, AlleleCallOHE, confidences, caps, segs, model, outputIndices, numElements)

  console.log('Sequence data:', sequenceData);
  // set the results
  setResults(sequenceData);
  // set the interactive state to true if the number of sequences is below 15
  setInteractiveState(Object.keys(sequenceData).length < 15);
}


export default function Submission({setSubmission, submission, sequence, file, params, model, outputIndices, setResults, setInteractiveState}){
  // TODO: Implement the submission button. Add the following:
  // - A function that checks if there is a sequence or file to submit
  // - A function that sets the submission state to true if there is a sequence or file to submit
  // - A function to process the submission
  // - A progress bar to show the submission progress
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [time, setTime] = useState(0);

  const handleClick = () => {
    if (!sequence && !file) {
      window.alert("No sequence or file to submit");
    }else if (sequence || file) {
      setSubmission(true);
      const startTime = new Date().getTime();
      submitSequences(sequence, file, params, model, outputIndices, setResults, setInteractiveState).then(() => {
          const endTime = new Date().getTime();
          setTime((endTime - startTime)/1000);
      });
      setSubmission(false);
      setSubmissionStatus(true);
    }
  };
  
  const handleReset = () => {
    setSubmission(false);
    setSubmissionStatus(false);
    setResults(null);
  };

  return(
    <>
      <div className="submmit-button-container">
        <button id="submitButton" className="submmit-button" onClick={handleClick}>Submit</button>
      </div>
      {submission && (
          <p>Submitting sequences...</p>
      )}
      {submissionStatus && !submission && (
          <>
            <button id="resetButton" className="example-button" onClick={handleReset}>Reset results</button>
            <p>Process sequences in: <span>{formatTime(time)}</span></p>
          </>
      )}
    </>
  )
};



