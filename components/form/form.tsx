'use client';
import React, { useRef } from 'react';
import FileInput from '@components/inputs/fileInput';
import SequenceInput from '@components/inputs/sequenceInput';
import ParamInput from '@components/inputs/paramInput';

interface AlignmentFormProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  setSequence: React.Dispatch<React.SetStateAction<string>>;
  sequence: string;
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
  params: {
    vCap: number;
    dCap: number;
    jCap: number;
    vThresh: number;
    dThresh: number;
    jThresh: number;
  };
  setParams: React.Dispatch<React.SetStateAction<any>>;
}

const AlignmentForm: React.FC<AlignmentFormProps> = ({
  setFile,
  file,
  setSequence,
  sequence,
  setSelectedChain,
  selectedChain,
  params,
  setParams,
}) => {
  const fileInfoRef = useRef<HTMLDivElement | null>(null);

  return (
    <section>
      <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
        <div className="max-w-6xl mx-auto px-2 sm:px-2">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span id="alignair" className="text-white">
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
          <FileInput 
            setFile={setFile} 
            isDisabled={sequence !== ''} 
            setSequence={setSequence} 
            fileInfoRef={fileInfoRef} 
          />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
          <h4 className="text-4xl font-extrabold dark:text-white">Alignment Parameters</h4>
          <div>
            <ParamInput params={params} setParams={setParams} isDisabled={selectedChain === 'light'} setSelectedChain={setSelectedChain} 
            selectedChain={selectedChain}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlignmentForm;