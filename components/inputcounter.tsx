import React, { useState, ChangeEvent } from 'react';

interface InputCounterProps {
  id: string;
  label: string;
  steps: string;
  min: string;
  max: string;
  defaultValue: string;
  onChange: (id: string, value: number) => void;
}

const InputCounter: React.FC<InputCounterProps> = ({
  id,
  label,
  steps,
  min,
  max,
  defaultValue,
  onChange,
}) => {
    const [value, setValue] = useState<string>(defaultValue);

    const handleIncrement = () => {
        let val = parseFloat(value);
        if (val < parseFloat(max)) {
            let newVal = parseFloat((parseFloat(value) + parseFloat(steps)).toFixed(1));
            setValue(newVal.toString());
            onChange(id, newVal);
        }
    };

    const handleDecrement = () => {
        let val = parseFloat(value);
        if (val > parseFloat(min)) {
            let newVal = parseFloat((parseFloat(value) - parseFloat(steps)).toFixed(1));
            setValue(newVal.toString());
            onChange(id, newVal);
        }
    };
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      onChange(id, parseFloat(value));
    };

  return (
    <div className="relative flex items-center max-w-[11rem]">
      <button
        type="button"
        id={`decrement-button-${id}`}
        data-input-counter-decrement={id}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        onClick={handleDecrement}
      >
        <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
        </svg>
      </button>
      <input
        type="text"
        id={id}
        data-input-counter
        data-input-counter-min={min}
        data-input-counter-max={max}
        aria-describedby="helper-text-explanation"
        className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder=""
        value={value}
        required
        onChange={handleInputChange}
      />
      <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
        <span>{label}</span>
      </div>
      <button
        type="button"
        id={`increment-button-${id}`}
        data-input-counter-increment={id}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
        onClick={handleIncrement}
      >
        <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
        </svg>
      </button>
    </div>
  );
};

export default InputCounter;
