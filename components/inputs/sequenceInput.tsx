"use client";

import React from 'react';

interface SequenceInputProps {
  selectedChain: string;
  setSequence: (sequence: string) => void;
  sequence: string;
  isDisabled?: boolean;
  setFile: (file: File | null) => void;
  setResults: (results: any) => void;
}

const SequenceInput: React.FC<SequenceInputProps> = ({ selectedChain, setSequence, sequence, isDisabled, setFile, setResults }) => {

  const exampleSequences: Record<string, string> = {
    heavy: "CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
    light: "CAGCCTGTGCTGACTCAATCATCCTCTGCCTCTGCTTCCCTGGGATCCTCGGTCAAGCTCACCTGCACTCTGAGCAGTGGGCACAGTAGCTACATCATCGCATGGCATCAACAGCAGCCAGGGAAGGCCCCTCGGTACTTGATGAAGCTTGAAGGTAGTGGAAGCTACAACAAGGGGAGCGGAGTTCCTGATCGCTTCTCAGGCTCCAGCTCTGGGGCTGACTGCTACCTCACCATCTCCAACCTCCAGTCTGAGGATGAGGCTGATTATTACTGTGAGACCTGGGACAGTAACACTCGGGTATTCGGCGGAGGGACCAAGCTGACCGTCCTAG",
    trb: "GAAGCTGGAGTGGTTCAGTCTCCCAGATATAAGATTATAGAGAAAAAGCAGCCTGTGGCTTTTTGGTGCAATCCTATTTCTGGACACAATACCCTTTACTGGTACCGGCAGAACTTGGGACAGGGCCCGGAGCTTCTGATTCGATATGAGAATGAGGAAGCAGTAGACGATTCACAGTTGCCTAAGGATCGATTTTCTGCAGAGAGGCTCAAAGGAGTAGGCTCCACTCTCAAGATCCAGCCTGCAGAGCTTGGGGACTCGGCCGNGTATCTCTGTGCCAGCNACCCTGACGGGGGGGATACCTTCGGTTCGGGGACCAGGTTANCCGTTGTAG",
  };

  const handleExample = () => {
    if (selectedChain) {
      const example = exampleSequences[selectedChain.toLowerCase()];
      setSequence(example || '');
      setFile(null);
      setResults(null);
    }
  };

  const clearSequence = () => {
    setSequence('');
    setResults(null);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
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
          value={sequence}
          onChange={(e) => validateSequence(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder="Enter your sequence here..."
          aria-describedby="sequence-help"
        />
        <div id="sequence-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter DNA sequence using only A, C, G, T, or N characters
        </div>
      </div>
    </>
  );
};

export default SequenceInput;
