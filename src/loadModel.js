import * as tf from '@tensorflow/tfjs';
import { SequenceTokenizer} from './processSequence';
import React, { useState, useEffect } from 'react';
// functions
export async function loadModel(model_url, desiredModelOutputNames) {
  const model = await tf.loadGraphModel(model_url);
  const indices = await getModelOutputIndices(model, desiredModelOutputNames);
  return { model, indices };
}

export async function getModelOutputIndices(model, desiredModelOutputNames) {
  if (!model) {
    console.error("Model not loaded yet.");
    return null;
  }

  const outputIndices = {};
  Object.keys(model.signature.outputs).forEach((key, index) => {
    if (desiredModelOutputNames.includes(key)) {
      outputIndices[key] = index;
    }
  });

  return outputIndices;
}

export async function warmUpModel(model, indices, maxSeqLength) {
    const isDevMode = process.env.NODE_ENV === 'development';
    const seq = 'CTGGAGCAGCTGGTGCAGTCTGGGGCTAACATGAANAAGCCTGGGCTCTCGGTGAAGGTCTCATGCAACTNTTCCGGAGGCACCTGCAGNAACTATGTCAACAACTTGGTGTGACAGGCNCCTGGANAAGGGGTTGAATGGATGGGAGGGATCATACCCATCTGTGGTACAGCAAAATCCGCACGGAGATTCCAGGGCAGAGTCNCGATTACCTCGGACAAATCCACAAGCACAGCCTACATGGAACTGAGCAGCCTGAGATCTGAGGACACGTCCCTGTATTACTATGCGAGAGACGCGGGGGTAACAATATCTTCGGATCTACNACCGAATGGACGTCAGGGGCCTAGGGACCACGGTGAGCGTCACCACAG'
    const encodedSequences = SequenceTokenizer.tokenizeSingleSequence(seq, maxSeqLength);
    let status = 'success';
    const predicted = model.predict(encodedSequences);
    if (!predicted) {
        console.error("Prediction failed.");
        status = 'failed'
        return status;
    }
    return status;
}

function LoadModelComponent({ setSelectedChain, selectedChain, setModel, setOutputIndices, setIsLoading}) {
    // constants
    const model_urls = {
        IGH: "tfjs/AlignAIRR/model.json",
        IGK: "tfjs/AlignAIRR/model.json",
        IGL: "tfjs/AlignAIRR/model.json",
    }
    const desiredModelOutputNames = ['v_segment', 'indel_count', 'd_segment', 'mutation_rate', 'j_allele', 'd_allele', 'j_segment', 'v_allele'];
    
    const maxSeqLength = 576;
    
    // Function to fetch the model
    const fetchModel = async () => {
        const model_url = model_urls[selectedChain];
        try {
            const { model, indices } = await loadModel(model_url, desiredModelOutputNames);
            setModel(model);
            setOutputIndices(indices);
            setIsLoading(false);
            console.log('Model loaded successfully');
            const status = warmUpModel(model, indices, maxSeqLength);
            if (status === 'success') {
                console.log('Warmup completed.');
            }
        } catch (error) {
            console.error("Error loading model:", error);
        }
    };

    // Fetch the model when the component mounts or when selectedButton changes
    useEffect(() => {
        fetchModel();
    }, [selectedChain]);

    // Function to handle button selection
    const selectButton = (buttonId) => {
        setSelectedChain(buttonId);
    };

    return (
        <div>
            <div className="row">
                <p>Immunoglobulin Chain</p>
                <div className="btn-group">
                    <button onClick={() => selectButton('IGH')} className={selectedChain === 'IGH' ? 'selected' : ''}>IGH</button>
                    <button onClick={() => selectButton('IGK')} className={selectedChain === 'IGK' ? 'selected' : ''}>IGK</button>
                    <button onClick={() => selectButton('IGL')} className={selectedChain === 'IGL' ? 'selected' : ''}>IGL</button>
                </div>
            </div>
        </div>
    );
}

export default LoadModelComponent;
