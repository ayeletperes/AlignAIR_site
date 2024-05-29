"use client";

import React, { Dispatch, SetStateAction } from 'react';
import LoadModelComponent from './modelLoad';
import FileInput from './fileInput';
import SequenceInput from './sequenceinput';
import ParamInput from './paramInput';

// Define types for the params object
interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vConf: number;
  dConf: number;
  jConf: number;
}

interface FormProps {
  setSelectedChain: Dispatch<SetStateAction<string>>;
  selectedChain: string;
  setFile: Dispatch<SetStateAction<File | null>>;
  file: File | null;
  setSequence: Dispatch<SetStateAction<string>>;
  sequence: string;
  setModel: Dispatch<SetStateAction<any>>; 
  setOutputIndices: Dispatch<SetStateAction<any>>; 
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
}

const Form: React.FC<FormProps> = ({
  setSelectedChain,
  selectedChain,
  setFile,
  file,
  setSequence,
  sequence,
  setModel,
  setOutputIndices,
  setIsLoading,
  params,
  setParams,
}) => {
  return (
    <section>
      <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-2">
        <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
            AlignAIR <sub className="text-white text-sm align-baseline">beta</sub>
          </span>
        </h1>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SequenceInput 
            selectedChain={selectedChain} 
            setSequence={setSequence} 
            sequence={sequence}
            isDisabled={file != null}
            setFile={setFile} 
          />
          <FileInput setFile={setFile} isDisabled={sequence != ''} setSequence={setSequence}/>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <h4 className="text-4xl font-extrabold dark:text-white">Alignment Parameters</h4>
          <LoadModelComponent 
            setSelectedChain={setSelectedChain} 
            selectedChain={selectedChain} 
            setModel={setModel} 
            setOutputIndices={setOutputIndices} 
            setIsLoading={setIsLoading} 
          />
          <ParamInput params={params} setParams={setParams} />
        </div>
      </div>
    </section>
  );
};

export default Form;
