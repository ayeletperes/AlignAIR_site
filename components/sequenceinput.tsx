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

  const example_sequences: Record<string, string> = {
    Heavy: "CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
    Light: "CAGCCTGTGCTGACTCAATCATCCTCTGCCTCTGCTTCCCTGGGATCCTCGGTCAAGCTCACCTGCACTCTGAGCAGTGGGCACAGTAGCTACATCATCGCATGGCATCAACAGCAGCCAGGGAAGGCCCCTCGGTACTTGATGAAGCTTGAAGGTAGTGGAAGCTACAACAAGGGGAGCGGAGTTCCTGATCGCTTCTCAGGCTCCAGCTCTGGGGCTGACTGCTACCTCACCATCTCCAACCTCCAGTCTGAGGATGAGGCTGATTATTACTGTGAGACCTGGGACAGTAACACTCGGGTATTCGGCGGAGGGACCAAGCTGACCGTCCTAG",
  };

  const handleExample = () => {
    if (selectedChain && sequenceInputRef.current) {
      sequenceInputRef.current.value = example_sequences[selectedChain];
      setSequence(sequenceInputRef.current.value);
      setFile(null);
    }
  };

  const validateSequence = (sequence: string) => {
    const seq = sequence.replace(/\n/g, '').toUpperCase()
    const testSeq = /^[ACGTNacgtn]*$/.test(seq);
    if (!testSeq) {
      window.alert('Invalid characters in sequence. Please use only A, C, G, T, or N.');
    }else{
      setSequence(seq);
    }
  }
//   const clear = () => {
//     if (sequenceInputRef.current) {
//       sequenceInputRef.current.value = '';
//       setSequence(sequenceInputRef.current.value);
//     }
//   };

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="sequenceInput" className="block mb-2 text-base font-large text-white-900 dark:text-white">Enter a sequence</label>
            {isDisabled && (
              <p className="text-red-500 text-xs">
                To input sequence, please remove the file.
              </p>
            )}
        </div>
        <div className="relative z-0 w-full mb-5 group flex justify-end">
            <button 
              disabled={!selectedChain} 
              className={`text-white ${selectedChain ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'} focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`} 
              onClick={handleExample}>
                Example Sequence
            </button>
        </div>
      </div>
      <div className="mb-12">
        <textarea
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
          rows={4}
          id="sequenceInput"
          ref={sequenceInputRef}
          value={sequence}
          onChange={e => validateSequence(e.target.value)}
          disabled={isDisabled}
        />
      </div>
    </>
  );
};

export default SequenceInput;
