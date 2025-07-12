import React from 'react';
import InputCounter from '@components/inputs/inputCounter';
import ModelSelector from '@components/inputs/ModelSelector';

interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vThresh: number;
  dThresh: number;
  jThresh: number;
}

interface ParamInputProps {
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  params: Params;
  isDisabled?: boolean;
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
  selectedModelId?: string;
  setSelectedModelId?: React.Dispatch<React.SetStateAction<string>>;
  onModelChange?: () => void;
}

type InputChangeHandler = (id: string, value: number) => void;

const ParamInput: React.FC<ParamInputProps> = ({ 
  setParams, 
  params, 
  isDisabled, 
  setSelectedChain, 
  selectedChain,
  selectedModelId,
  setSelectedModelId,
  onModelChange
}) => {

  const handleInputChange: InputChangeHandler = (id, value) => {
    setParams((prevInputs) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  return (
    <>
      <ModelSelector
        selectedChain={selectedChain}
        setSelectedChain={setSelectedChain}
        selectedModelId={selectedModelId}
        setSelectedModelId={setSelectedModelId}
        onModelChange={onModelChange}
      />
      
      <label className="block mb-2 text-base font-large text-white-900 dark:text-white">Select the max number of assignments for each call</label>
      <div id="capButtons" className="grid md:grid-cols-3 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id="vCap" label="V Cap" steps="1" min="1" max="100" defaultValue={params.vCap.toString()} onChange={handleInputChange} />
        </div>
        <div className={`relative z-0 w-full mb-5 group ${isDisabled ? 'hidden' : ''}`}>
          <InputCounter id="dCap" label="D Cap" steps="1" min="1" max="100" defaultValue={params.dCap.toString()} onChange={handleInputChange} />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id="jCap" label="J Cap" steps="1" min="1" max="100" defaultValue={params.jCap.toString()} onChange={handleInputChange} />
        </div>
      </div>
      <label className="block mb-2 text-base font-large text-white-900 dark:text-white">Percentage for each allele assignment selection</label>
      <div id="confButton" className="grid md:grid-cols-3 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id="vThresh" label="V Threshold" steps="0.01" min="0" max="1" defaultValue={params.vThresh.toString()} onChange={handleInputChange} />
        </div>
        <div className={`relative z-0 w-full mb-5 group ${isDisabled ? 'hidden' : ''}`}>
          <InputCounter id="dThresh" label="D Threshold" steps="0.01" min="0" max="1" defaultValue={params.dThresh.toString()} onChange={handleInputChange} />
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id="jThresh" label="J Threshold" steps="0.01" min="0" max="1" defaultValue={params.jThresh.toString()} onChange={handleInputChange} />
        </div>
      </div>
    </>
  );
};

export default ParamInput;