import React, { useState } from 'react';
import {IGType, IGHVConverted, sortedIGHD, sortedIGHJ, LightJ, LightV} from './reference';
import { fastaReader } from './fastaReader';
import { processAllBatches } from './predictAlignment';
import { countTotalSequences } from './fileProcessor';

interface SubmissionProps {
  selectedChain: string;
  modelReady: boolean;
  setSubmission: React.Dispatch<React.SetStateAction<boolean>>;
  submission: boolean;
  sequence: string;
  file: File | null;
  params: Params;
  model: any; // Adjust the type as per your actual model type
  outputIndices: any; // Adjust the type as per your actual outputIndices type
  setResults: React.Dispatch<React.SetStateAction<any>>; // Adjust the type as per your actual setResults type
}

interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vConf: number;
  dConf: number;
  jConf: number;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second(s)`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minute(s)`;
  } else {
    return `${Math.round(seconds / 3600)} hour(s)`;
  }
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target?.result?.toString() || '');
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

type AlleleCallOHE = { [k: string]: IGType | null };

async function submitSequences(
  selectedChain: string,
  sequenceInput: string,
  fileInput: File | null,
  params: Params,
  model: any, // Adjust the type as per your actual model type
  outputIndices: any, // Adjust the type as per your actual outputIndices type
  setResults: React.Dispatch<React.SetStateAction<any>> // Adjust the type as per your actual setResults type
) {
  let fastaLines = sequenceInput;
  if (!sequenceInput && fileInput) {
    try {
      const totalSequences = await countTotalSequences(fileInput, 100);
      console.log('Total sequences:', totalSequences);
      fastaLines = await readFileContent(fileInput);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const sequenceData = fastaReader.queryToDict(fastaLines);
  const confidences = { v_call: params.vConf, d_call: params.dConf, j_call: params.jConf };
  const caps = { v_call: params.vCap, d_call: params.dCap, j_call: params.jCap };

  let AlleleCallOHE: AlleleCallOHE = { v_call: IGHVConverted, d_call: sortedIGHD, j_call: sortedIGHJ };
  if (selectedChain === 'Light') {
    AlleleCallOHE = { v_call: LightV, d_call: null, j_call: LightJ };
  }

  const keys = Object.keys(sequenceData);
  const numElements = 500;

  await processAllBatches(keys, sequenceData, AlleleCallOHE, confidences, caps, model, outputIndices, numElements);
  
  setResults(sequenceData);
}

const Submission: React.FC<SubmissionProps> = ({
  selectedChain,
  modelReady,
  setSubmission,
  submission,
  sequence,
  file,
  params,
  model,
  outputIndices,
  setResults,
}) => {
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [time, setTime] = useState(0);

  const handleClick = async () => {
    if (!sequence && !file) {
      window.alert('No sequence or file to submit');
    } else if (sequence || file) {
      setSubmission(true);
      const startTime = new Date().getTime();
      await submitSequences(selectedChain, sequence, file, params, model, outputIndices, setResults).then(() => {
        const endTime = new Date().getTime();
        setTime((endTime - startTime) / 1000);
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

  return (
    <section>
      <div className="relative pt-8 pb-10 md:pt-12 md:pb-16">
        <div className="flex items-center justify-center">
          {/* <button type="button" id="submitButton" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-3 text-center me-2 mb-2" onClick={handleClick} disabled={modelReady}>Submit</button> */}
          {submissionStatus && !submission ? (
              <button
                id="resetButton"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={handleReset}
              >
                Reset results
              </button>
            ) : (
              <button
                type="button"
                id="submitButton"
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-3 text-center me-2 mb-2"
                onClick={handleClick}
                disabled={modelReady || submission}
              >
                {submission ? 'Submitting' : 'Submit'}
              </button>
            )}
        </div>
        {submissionStatus && !submission && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* <button id="resetButton" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={handleReset}>Reset results</button> */}
            <p>
              Process sequences in: <span>{formatTime(time)}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Submission;
