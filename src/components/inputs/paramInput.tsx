import React from 'react';
import InputCounter from '@/components/inputs/inputCounter';
import ModelSelector from '@/components/inputs/ModelSelector';

interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vThresh: number;
  dThresh: number;
  jThresh: number;
}

interface ParamInputProps {
  setParams: (params: Params) => void;
  params: Params;
  isDisabled?: boolean;
  setSelectedChain: (chain: string) => void;
  selectedChain: string;
  selectedModelId?: string;
  setSelectedModelId?: (modelId: string) => void;
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
    setParams({
      ...params,
      [id]: value,
    });
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
      
      {/* Model Viewport - Currently Loaded Models */}
      {/* <div className="mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Currently Loaded Models</h3>
          <ModelViewport />
        </div>
      </div> */}
      
      <fieldset className="mb-6">
        <legend className="block mb-2 text-base font-large text-white-900 dark:text-white">Select the max number of assignments for each call</legend>
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
      </fieldset>
      <fieldset className="mb-6">
        <legend className="block mb-2 text-base font-large text-white-900 dark:text-white">Percentage for each allele assignment selection</legend>
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
      </fieldset>
    </>
  );
};

export default ParamInput;