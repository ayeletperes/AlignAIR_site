import React from 'react';
import InputCounter from '@components/inputs/inputCounter';

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
}

type InputChangeHandler = (id: string, value: number) => void;

const ParamInput: React.FC<ParamInputProps> = ({ setParams, params, isDisabled, setSelectedChain, selectedChain}) => {

  const handleInputChange: InputChangeHandler = (id, value) => {
    setParams((prevInputs) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  const handleClickChange = (buttonId: string) => {
    setSelectedChain(buttonId);
  };

  return (
    <>
      <p>Immunoglobulin Chain</p>
      <div id="modelButtons" className="inline-flex rounded-md shadow-sm" role="group">
        <button 
          id="heavy"
          value="heavy"
          name="immunoglobulin-chain"
          onClick={() => handleClickChange('heavy')}
          type="button" 
          className={`px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-s-lg hover:bg-purple-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:blue-400 focus:text-white dark:border-gray-800 dark:text-white dark:hover:text-white dark:hover:bg-purple-600 dark:focus:bg-purple-600 ${selectedChain === 'heavy' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Heavy</button>
        <button 
          id="light"
          value="light"
          name="immunoglobulin-chain"
          onClick={() => handleClickChange('light')}
          type="button" 
          className={`px-4 py-2 text-sm font-medium text-gray-900 border rounded-e-lg border-gray-300 hover:bg-purple-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:blue-400 focus:text-white dark:border-gray-800 dark:text-white dark:hover:text-white dark:hover:bg-purple-600 dark:focus:bg-purple-600 ${selectedChain === 'light' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800'}`}>Light</button>
      </div>
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