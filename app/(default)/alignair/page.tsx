"use client";

import React, { useState, Dispatch, SetStateAction, useEffect} from 'react';
import Form from '@/components/form';
import Submission from '@/components/submission';
import Results from '@/components/results';
import { metadata } from './metadata';

// Define types for the params object
interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vConf: number;
  dConf: number;
  jConf: number;
}


export default function App() {
  const [submission, setSubmission] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [sequence, setSequence] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('IGH');
  const [model, setModel] = useState<any>(null); 
  const [outputIndices, setOutputIndices] = useState<any>(null); 
  const [modelReady, setModelReady] = useState<boolean>(true);
  const [results, setResults] = useState<any>(null); 
  const [params, setParams] = useState<Params>({
    vCap: 3,
    dCap: 3,
    jCap: 3,
    vConf: 0.9,
    dConf: 0.2,
    jConf: 0.8,
  });

  useEffect(() => {
      // Set the default value to "Heavy" when the component mounts
      setSelectedChain('Heavy');
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
      <Form
        setFile={setFile as Dispatch<SetStateAction<File | null>>}
        file={file}
        setSequence={setSequence as Dispatch<SetStateAction<string>>}
        sequence={sequence}
        setSelectedChain={setSelectedChain as Dispatch<SetStateAction<string>>}
        selectedChain={selectedChain}
        setModel={setModel as Dispatch<SetStateAction<any>>}
        setOutputIndices={setOutputIndices as Dispatch<SetStateAction<any>>}
        setIsLoading={setModelReady as Dispatch<SetStateAction<boolean>>}
        params={params}
        setParams={setParams as Dispatch<SetStateAction<Params>>}
        setResults={setResults}
        setSubmission={setSubmission}
      />
      <Submission
        selectedChain={selectedChain} 
        modelReady={modelReady}
        setSubmission={setSubmission}
        submission={submission}
        sequence={sequence}
        file={file}
        params={params}
        model={model}
        outputIndices={outputIndices}
        setResults={setResults}
      />
      {results && 
        <Results results={results} selectedChain={selectedChain}/>
      }
    </>
  )
}
