"use client";

import React, { useRef } from 'react';

interface SequenceInputProps {
  selectedChain: string;
  setSequence: React.Dispatch<React.SetStateAction<string>>;
  sequence: string;
  isDisabled?: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const SequenceInput: React.FC<SequenceInputProps> = ({ selectedChain, setSequence, sequence, isDisabled, setFile }) => {
  const sequenceInputRef = useRef<HTMLTextAreaElement | null>(null);

  const exampleSequences: Record<string, string> = {
    heavy: "CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
    light: "CAGCCTGTGCTGACTCAATCATCCTCTGCCTCTGCTTCCCTGGGATCCTCGGTCAAGCTCACCTGCACTCTGAGCAGTGGGCACAGTAGCTACATCATCGCATGGCATCAACAGCAGCCAGGGAAGGCCCCTCGGTACTTGATGAAGCTTGAAGGTAGTGGAAGCTACAACAAGGGGAGCGGAGTTCCTGATCGCTTCTCAGGCTCCAGCTCTGGGGCTGACTGCTACCTCACCATCTCCAACCTCCAGTCTGAGGATGAGGCTGATTATTACTGTGAGACCTGGGACAGTAACACTCGGGTATTCGGCGGAGGGACCAAGCTGACCGTCCTAG",
  };

  const handleExample = () => {
    if (selectedChain && sequenceInputRef.current) {
      const example = exampleSequences[selectedChain.toLowerCase()];
      sequenceInputRef.current.value = example || '';
      setSequence(example || '');
      setFile(null);
    }
  };

  const clearSequence = () => {
    if (sequenceInputRef.current) {
      sequenceInputRef.current.value = '';
    }
    setSequence('');
  };

  const validateSequence = (input: string) => {
    const sanitizedInput = input.replace(/\n/g, '').toUpperCase();
    const isValid = /^[ACGTN]*$/.test(sanitizedInput);

    if (!isValid) {
      window.alert('Invalid characters in sequence. Please use only A, C, G, T, or N.');
    } else {
      setSequence(sanitizedInput);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="sequenceInput" className="block mb-2 text-base font-medium text-white-900 dark:text-white">
            Enter a sequence
          </label>
          {isDisabled && (
            <p className="text-red-500 text-xs">
              To submit a sequence, please remove the file.
            </p>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group flex justify-end">
          {sequence==='' ? (
            <button
              id="exampleSequence"
              disabled={!selectedChain}
              className={`text-white ${
                selectedChain ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'
              } focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`}
              onClick={handleExample}
            >
              Load Example Sequence
            </button>
          ):(
            <button
              id="clearSequence"
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              onClick={clearSequence}
            >
              Clear Sequence
            </button>
          )}
        </div>
      </div>
      <div id="inputSeq" className="mb-12">
        <textarea
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
          rows={4}
          id="sequenceInput"
          ref={sequenceInputRef}
          value={sequence}
          onChange={(e) => validateSequence(e.target.value)}
          disabled={isDisabled}
          placeholder="Enter your sequence here..."
        />
      </div>
    </>
  );
};

export default SequenceInput;
