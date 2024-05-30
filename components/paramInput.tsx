import React, { ChangeEvent } from 'react';
import InputCounter from './inputcounter';

interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vConf: number;
  dConf: number;
  jConf: number;
}

interface ParamInputProps {
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  params: Params;
  isDisabled?: boolean;
}

type InputChangeHandler = (id: string, value: number) => void;

const ParamInput: React.FC<ParamInputProps> = ({ setParams, params, isDisabled }) => {

  const handleInputChange: InputChangeHandler = (id, value) => {
    setParams((prevInputs) => ({
      ...prevInputs,
      [id]: value,
    }));
  };

  return (
    <>
      <label className="block mb-2 text-base font-large text-white-900 dark:text-white">Select the max number of assignments for each call</label>
      <div className="grid md:grid-cols-3 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"vCap"} label={'V cap'} steps="1" min="1" max="100" defaultValue={params.vCap.toString()} onChange={handleInputChange}/>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"dCap"} label={'D cap'} steps="1" min="1" max="100" isDisabled={isDisabled} defaultValue={params.dCap.toString()} onChange={handleInputChange}/>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"jCap"} label={'J cap'} steps="1" min="1" max="100" defaultValue={params.jCap.toString()} onChange={handleInputChange}/>
        </div>
      </div>
      <label className="block mb-2 text-base font-large text-white-900 dark:text-white">Select the confidence threshold for each call</label>
      <div className="grid md:grid-cols-3 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"vConf"} label={'V confidence'} steps="0.1" min="0" max="1" defaultValue={params.vConf.toString()} onChange={handleInputChange}/>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"dConf"} label={'D confidence'} steps="0.1" min="0" max="1" isDisabled={isDisabled} defaultValue={params.dConf.toString()} onChange={handleInputChange}/>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <InputCounter id={"jConf"} label={'J confidence'} steps="0.1" min="0" max="1" defaultValue={params.jConf.toString()} onChange={handleInputChange}/>
        </div>
      </div>
    </>
  );
};

export default ParamInput;
