import React, { useRef, useState, useEffect } from 'react';

export default function ParamInput({setParams, params}){

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setParams((prevInputs) => ({
            ...prevInputs,
            [id]: value,
        }));
    };

    return (
        <>
            <p>Alignment format option :</p>
            <div className="alignment-param-area">
                <div className="alignment-input-row">
                    <div>Cap number of assignments</div>
                    <div><input type="number" id="vCap" className="numberSpinButton" min="1" max="100" value={params.vCap} onChange={handleInputChange}/></div>
                    <div><input type="number" id="dCap" className="numberSpinButton" min="1" max="100" value={params.dCap} onChange={handleInputChange}/></div>
                    <div><input type="number" id="jCap" className="numberSpinButton" min="1" max="100" value={params.jCap} onChange={handleInputChange}/></div>
                </div>
                <div className="alignment-input-row">
                    <div>Confidence threshold</div>
                    <div><input type="number" id="vConf" className="numberSpinButton" min="0.1" max="1" value={params.vConf} step="0.1" onChange={handleInputChange}/></div>
                    <div><input type="number" id="dConf" className="numberSpinButton" min="0.1" max="1" value={params.dConf} step="0.1" onChange={handleInputChange}/></div>
                    <div><input type="number" id="jConf" className="numberSpinButton" min="0.1" max="1" value={params.jConf} step="0.1" onChange={handleInputChange}/></div>
                </div>
                <div className="alignment-input-row">
                    <div>Segmentation threshold</div>
                    <div><input type="number" id="vSeg" className="numberSpinButton" min="0.01" max="1" value={params.vSeg} step="0.01" onChange={handleInputChange}/></div>
                    <div><input type="number" id="dSeg" className="numberSpinButton" min="0.01" max="1" value={params.dSeg} step="0.01" onChange={handleInputChange}/></div>
                    <div><input type="number" id="jSeg" className="numberSpinButton" min="0.01" max="1" value={params.jSeg} step="0.01" onChange={handleInputChange}/></div>
                </div>
            </div>
        </>
    )

}
