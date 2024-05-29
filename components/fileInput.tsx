import React, { useRef, useState } from 'react';

interface FileInputProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setSequence: React.Dispatch<React.SetStateAction<string>>;
  isDisabled?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ setFile, isDisabled, setSequence }) => {
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    // const dragAreaRef = useRef<null | HTMLDivElement>(null);
    const fileInfoRef = useRef<HTMLDivElement>(null);
    const [fileName, setFileName] = useState('');
    const [sequenceCount, setSequenceCount] = useState(0);
  
    const setRefs = (instance: HTMLInputElement | null) => {
      if (instance) {
        // dragAreaRef.current = instance;
        fileInputRef.current = instance;
      }
    };
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        
        fileInputRef.current!.files = event.target.files;
        processFile(file);
        setFile(file);
        setSequence('');
      }
    };
  
    // const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    //   event.preventDefault();
    //   dragAreaRef.current?.classList.add('active');
    // };
  
    // const handleDragLeave = () => {
    //   dragAreaRef.current?.classList.remove('active');
    // };
  
    // const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    //   event.preventDefault();
    //   const file = event.dataTransfer.files?.[0];
    //   if (file) {
    //     console.log(file);
    //     fileInputRef.current!.files = event.dataTransfer.files;
    //     processFile(file);
    //     setFile(file);
    //   }
    //   dragAreaRef.current?.classList.remove('active');
    // };
  
    const processFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target?.result as string;
        const sequenceCount = countSequences(content);
        console.log(sequenceCount);
        setFileName(file.name);
        setSequenceCount(sequenceCount);
        displayFileInfo();
      };
      reader.readAsText(file);
    };
  
    const countSequences = (content: string) => {
      const lines = content.split('\n');
      let count = 0;
      for (const line of lines) {
        if (line.startsWith('>')) {
          count++;
        }
      }
      return count;
    };
  
    const displayFileInfo = () => {
      fileInfoRef.current!.style.display = 'flex';
      // dragAreaRef.current!.style.display = 'none';
      fileInputRef.current!.style.display = 'none';
    };
  
    const clearFile = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        
      }
      console.log(fileInfoRef.current);
      // dragAreaRef.current!.style.display = 'flex';
      fileInputRef.current!.style.display = 'flex';
      fileInfoRef.current!.style.display = 'none';
      setFileName('');
      setSequenceCount(0);
      setFile(null);
    };
  
    const handleBrowseClick = () => {
      fileInputRef.current!.click();
    };

  return (
    <>

        <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                <label htmlFor="dropzone-file" className="block mb-2 text-base font-large text-white-900 dark:text-white">Or Enter Fasta File</label>
                {isDisabled && (
                  <p className="text-red-500 text-xs">
                    To input file, please remove the sequence.
                  </p>
                )}
                </div>
                <div className="relative z-0 w-full mb-5 group flex justify-end">
                <button id="clearFile" className="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg w-full sm:w-auto px-3 py-2 text-xs font-medium text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800" onClick={clearFile}>Remove file</button>
                </div>
        </div>
        <div className="flex items-center justify-center w-full relative z-10">
          <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
          onChange={handleFileUpload} 
          ref={setRefs}
          disabled={isDisabled} 
          aria-describedby="file_input_help" 
          id="file_input" 
          type="file"/>
        </div>
        {/* <div className="flex items-center justify-center w-full relative z-10">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-4 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>  
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fasta</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleFileDrop} ref={setRefs}/>
            </label>
        </div> */}
        
      <div ref={fileInfoRef} style={{ display: 'none' }}>
        File Name: {fileName}
        <br />
        Number of Sequences: {sequenceCount}
      </div>
    </>
  );
};

export default FileInput;
