import React, { useRef, useState } from 'react';
import Link from 'next/link'
import { ParsedRecord } from '@/utils/preprocessing/sequenceParse';

interface FileInputProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setSequence: React.Dispatch<React.SetStateAction<ParsedRecord[]>>;
  isDisabled?: boolean;
  fileInfoRef: React.RefObject<HTMLDivElement>;
  setResults: React.Dispatch<React.SetStateAction<any>>;
}

const FileInput: React.FC<FileInputProps> = ({ setFile, isDisabled, setSequence, fileInfoRef, setResults }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [sequenceCount, setSequenceCount] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const ingestFile = (file: File) => {
    setSequence([]);
    setResults(null);
    processFile(file);
    setFile(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) ingestFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (isDisabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) ingestFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDisabled) return;
    if (!isDragActive) setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target?.result as string;
      const valid = validateSequences(content);
      if (valid) {
        const sequenceCount = countSequences(content);

        // 🚨 **NEW: Check if sequences exceed 1000**
        if (sequenceCount > 1000) {
          window.alert(
            `Your file contains ${sequenceCount} sequences. For better performance, please use the CLI version.`
          );
          clearFile();  // ✅ Reset input
          return;
        }

        setFileName(file.name);
        setSequenceCount(sequenceCount);
        if (fileInfoRef.current) {
          fileInfoRef.current.style.display = 'block';
        }
      } else {
        clearFile();
      }
    };
    reader.readAsText(file);
  };

  const validateSequences = (content: string) => {
    const lines = content.split('\n');
    for (let line of lines) {
      if (line.startsWith('>')) continue;
      const seq = line.toUpperCase().replace(/\n/g, '');
      if (!/^[ACGTN]*$/.test(seq)) {
        window.alert('Invalid characters in sequence. Please use only A, C, G, T, or N.');
        return false;
      }
    }
    return true;
  };

  const countSequences = (content: string) => {
    return content.split('\n').filter((line) => line.startsWith('>')).length;
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName('');
    setSequenceCount(0);
    setFile(null);
    setResults(null);
    if (fileInfoRef.current) {
      fileInfoRef.current.style.display = 'none';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <label htmlFor="file_input" className="block mb-2 text-base font-large text-white-900 dark:text-white">
              Or Enter a FASTA file
            </label>
            <p className="text-gray-500 text-xs dark:text-gray-400">
              ⚠️ The Web interface supports up to <b>1000 sequences</b>. For larger files, please use the <Link href="/cli"><span style={{ color: 'white' }}>CLI Tool</span></Link> 
            </p>
            {isDisabled && (
              <p className="text-red-500 text-xs">
                To input a file, please remove the sequence.
              </p>
            )}
          </div>
        <div className="relative z-0 w-full mb-5 group flex justify-end">
          {fileName !== '' && (
            <button
              id="clearFile"
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              onClick={clearFile}
            >
              Remove file
            </button>
          )}
        </div>
      </div>
      <div
        id="fileinput"
        className={`flex flex-col items-stretch w-full relative z-10 rounded-lg border-2 border-dashed transition-colors ${
          isDragActive
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
            : 'border-transparent'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          onChange={handleFileUpload}
          ref={fileInputRef}
          disabled={isDisabled}
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          accept=".fasta,.fa,.txt"
          aria-label="Upload FASTA file"
        />
        <div id="file_input_help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {isDragActive
            ? 'Drop the file to upload'
            : 'Supported formats: FASTA (.fasta, .fa), Text (.txt). Drag and drop is also supported. Maximum 1000 sequences.'}
        </div>
      </div>
      <div ref={fileInfoRef} style={{ display: 'none' }}>
        File Name: {fileName}
        <br />
        Number of Sequences: {sequenceCount}
      </div>
    </>
  );
};

export default FileInput;
