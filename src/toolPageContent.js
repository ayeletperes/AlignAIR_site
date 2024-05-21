import React, { useRef, useState } from 'react';
import LoadModelComponent from './loadModel';
import FileUpload from './fileUpload';
import SequenceInput from './sequenceInput';
import ParamInput from './paramInput';
function Content({setSelectedChain, selectedChain, setFile, setSequence, sequence, setModel, setOutputIndices, setIsLoading, params, setParams}) {
    return(
        <div className="content">
            <div className="left-column">
                <LoadModelComponent setSelectedChain={setSelectedChain} selectedChain={selectedChain} setModel={setModel} setOutputIndices={setOutputIndices} setIsLoading={setIsLoading}/>
                <FileUpload setFile={setFile}/>
                <SequenceInput selectedChain={selectedChain} setSequence={setSequence} sequence={sequence}/>
            </div>
            <div className="right-column">
            <ParamInput params={params} setParams={setParams}/>
                <p> Genotype parameters :</p>
                <div className="genotype-param-area">
                    <div className="text-placeholder placeholder"></div>
                    <div className="text-placeholder placeholder"></div>
                    <div className="text-placeholder placeholder"></div>
                    <div className="text-placeholder placeholder"></div>
                </div>
            </div>
        </div>
    )
  };

export default Content;

