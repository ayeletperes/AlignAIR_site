import React, { useEffect, useMemo, useState } from "react";
import {
  parseInput,
  toFasta,
  type ParseReport,
} from "@/utils/preprocessing/sequenceParse";


interface SequenceInputProps {
  selectedChain: string;
  setSequence: (sequence: string | string[]) => void; // accepts string or string[]
  sequence: string | string[];                         // can be string or string[]
  isDisabled?: boolean;
  setFile: (file: File | null) => void;
  setResults: (results: any) => void;
}

const exampleSequences: Record<string, string> = {
  heavy:
    ">seq1\nCAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG\n>seq2\nCAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
  light:
    ">IGL_Example\nCAGCCTGTGCTGACTCAATCATCCTCTGCCTCTGCTTCCCTGGGATCCTCGGTCAAGCTCACCTGCACTCTGAGCAGTGGGCACAGTAGCTACATCATCGCATGGCATCAACAGCAGCCAGGGAAGGCCCCTCGGTACTTGATGAAGCTTGAAGGTAGTGGAAGCTACAACAAGGGGAGCGGAGTTCCTGATCGCTTCTCAGGCTCCAGCT ",
  trb:
    ">TRB_Example\nGAAGCTGGAGTGGTTCAGTCTCCCAGATATAAGATTATAGAGAAAAAGCAGCCTGTGGCTTTTTGGTGCAATCCTATTTCTGGACACAATACCCTTTACTGGTACCGGCAGAACTTGGGACAGGGCCCGGAGCTTCTGATTCGATATGAGAATGAGGAAGCAGTAGACGATTCACAGTTGCCTAAGGATCGATTTTCTGCAGAGAGGCTCAAAGGAGTAGGCTCCACTCTCAAGATCCAGCCTGCAGAGCTTGGGGACTCGGCCGNGTATCTCTGTGCCAGCNACCCTGACGGGGGGGATACCTTCGGTTCGGGGACCAGGTTANCCGTTGTAG",
};

const SequenceInput: React.FC<SequenceInputProps> = ({
  selectedChain,
  setSequence,
  sequence,
  isDisabled,
  setFile,
  setResults,
}) => {
  // Local textarea text, always a string
  const [text, setText] = useState<string>("");

  // Sync prop to textarea
  useEffect(() => {
    if (Array.isArray(sequence)) {
      setText(toFasta(sequence));
    } else if (typeof sequence === "string") {
      setText(sequence);
    } else {
      setText("");
    }
  }, [sequence]);

  const [report, setReport] = useState<ParseReport>({
    records: [],
    errors: [],
    warnings: [],
  });

  const counts = useMemo(
    () => ({
      total: report.records.length,
      errors: report.errors.length,
      warnings: report.warnings.length,
    }),
    [report]
  );

  const handleExample = () => {
    if (!selectedChain) return;
    const example = exampleSequences[selectedChain.toLowerCase()] || "";
    setText(example);

    try {
      const rep = parseInput(example);
      setReport(rep);
      setFile(null);
      setResults(null);
      if (rep.errors.length === 0 && rep.records.length > 0) {
        const seqs = rep.records.map(r => r.sequence);
        setSequence(seqs.length === 1 ? seqs[0] : seqs);
      } else {
        setSequence(example);
      }
    } catch (e) {
      setReport({ records: [], errors: ["Failed to parse example."], warnings: [] });
      setSequence(example);
    }
  };

  const clearSequence = () => {
    setText("");
    setReport({ records: [], errors: [], warnings: [] });
    setResults(null);
    setSequence("");
  };

  const onChangeText = (val: string) => {
    setText(val);
    setResults(null);
    try {
      const rep = parseInput(val);
      setReport(rep);
      if (rep.errors.length === 0 && rep.records.length > 0) {
        const seqs = rep.records.map(r => r.sequence);
        setSequence(seqs.length === 1 ? seqs[0] : seqs);
      } else {
        setSequence(val);
      }
    } catch (e) {
      // Show a friendly error, do not crash
      setReport({ records: [], errors: ["Failed to parse input."], warnings: [] });
      setSequence(val);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <label htmlFor="sequenceInput" className="block mb-2 text-base font-medium text-white-900 dark:text-white">
            Enter sequence or FASTA
          </label>
          <p className="text-xs text-gray-500">
            Paste DNA sequence with A, C, G, T, or N. For multiple sequences, use FASTA headers that start with &gt;.
            You can paste one record, press Enter, then paste another.
          </p>
          {isDisabled && (
            <p className="text-red-500 text-xs mt-1">To submit a sequence, please remove the file.</p>
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group flex justify-end">
          {text === "" ? (
            <button
              id="exampleSequence"
              disabled={!selectedChain}
              className={`text-white ${
                selectedChain ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-300 cursor-not-allowed"
              } focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800`}
              onClick={handleExample}
              type="button"
            >
              Load Example
            </button>
          ) : (
            <button
              id="clearSequence"
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              onClick={clearSequence}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div id="inputSeq" className="mb-4">
        <textarea
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-600 focus:border-purple-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-600 dark:focus:border-purple-600"
          rows={8}
          id="sequenceInput"
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          disabled={isDisabled}
          placeholder={`>seq1\nATCG\n>seq2\nACGTN...`}
          aria-describedby="sequence-help"
          spellCheck={false}
        />
        <div id="sequence-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          FASTA is supported. Each record starts with &gt;Header. Only A, C, G, T, or N are allowed in sequences.
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          Parsed: {counts.total}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          Warnings: {counts.warnings}
        </span>
        <span className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
          Errors: {counts.errors}
        </span>
      </div>

      {report.errors.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4">
          <div className="text-red-800 dark:text-red-200 font-semibold mb-2">Validation errors</div>
          <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300 space-y-1">
            {report.errors.map((e, i) => (
              <li key={`err-${i}`}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {report.warnings.length > 0 && report.errors.length === 0 && (
        <div className="mb-6 rounded-lg border border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 p-4">
        <div className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">Warnings</div>
          <ul className="list-disc pl-5 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {report.warnings.map((w, i) => (
              <li key={`warn-${i}`}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {report.errors.length === 0 && report.records.length > 0 && (
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detected records</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {report.records.map((r) => (
              <div
                key={r.id}
                className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">ID</div>
                <div className="text-sm font-mono break-all">{r.id}</div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Length</div>
                <div className="text-sm">{r.sequence.length} bp</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SequenceInput;