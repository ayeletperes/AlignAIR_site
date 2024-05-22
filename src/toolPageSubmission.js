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

async function submitSequences(sequenceInput, fileInput, params, model, outputIndices, setResults) {

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
  const confidences = { v_call: params.vConf, d_call: params.dConf, j_call: params.jConf };
  const caps = { v_call: params.vCap, d_call: params.dCap, j_call: params.jCap };
  const AlleleCallOHE = { v_call: vAlleleCallOHE, d_call: dAlleleCallOHE, j_call: jAlleleCallOHE };
  const keys = Object.keys(sequenceData);
  const numElements = 500;

  await processAllBatches(keys, sequenceData, AlleleCallOHE, confidences, caps, model, outputIndices, numElements)
  // set the results
  setResults(sequenceData);
}


export default function Submission({setSubmission, submission, sequence, file, params, model, outputIndices, setResults}){
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
      submitSequences(sequence, file, params, model, outputIndices, setResults).then(() => {
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



