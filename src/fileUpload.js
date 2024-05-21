import React, { useRef, useState } from 'react';

export default function FileUpload({setFile}){
    const fileInputRef = useRef(null);
    const dragAreaRef = useRef(null);
    const fileInfoRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [sequenceCount, setSequenceCount] = useState(0);

    const setRefs = (instance) => {
        dragAreaRef.current = instance;
      };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            processFile(file);
            setFile(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        dragAreaRef.current.classList.add('active');
    };

    const handleDragLeave = () => {
        dragAreaRef.current.classList.remove('active');
    };

    const handleFileDrop = (event) => {
        event.preventDefault(); 
        const file = event.dataTransfer.files[0];
        if (file) {
            console.log(file);
            fileInputRef.current.files = event.dataTransfer.files;
            processFile(file);
            setFile(file);
        }
        dragAreaRef.current.classList.remove('active');
    };

    const processFile = (file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            const sequenceCount = countSequences(content);
            console.log(sequenceCount);
            setFileName(file.name);
            setSequenceCount(sequenceCount);
            displayFileInfo();
        };
        reader.readAsText(file);
    };

    const countSequences = (content) => {
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
        fileInfoRef.current.style.display = 'flex';
        dragAreaRef.current.style.display = 'none';
    };

    const clearFile = () => {

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        dragAreaRef.current.style.display = 'flex';
        fileInfoRef.current.style.display = 'none';
        setFileName('');
        setSequenceCount(0);
        setFile(null);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
      };

    return (
        <>
            <div className="row">
                <p>Upload your File :</p>
                <button id="clearFile" className="example-button" onClick={clearFile}>Clear File</button>
            </div>
            <div className="drag-area" id="dragArea" ref={setRefs} style={{ display: 'flex' }} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleFileDrop}>
                <div className="icon">
                    <i className="fas fa-images"></i>
                </div>  
                <span className="header">Drag & Drop</span>
                <span className="header">or </span>
                <span className="button" onClick={handleBrowseClick}>browse</span>
                <input type="file" ref={fileInputRef} style={{ display: 'none'}} onChange={handleFileUpload} />
                <span className="support">Supports: Fasta</span>
            </div>
            <div ref={fileInfoRef} style={{ display: 'none' }}>
                File Name: {fileName}
                <br />
                Number of Sequences: {sequenceCount}
            </div>
        </>
    )
};
