import * as tf from '@tensorflow/tfjs';
import { SequenceTokenizer} from './processSequence';
import React, { useEffect } from 'react';
// functions
export async function loadModel(model_url) {
  const model = await tf.loadGraphModel(model_url);
  const indices = {
    mutation_rate: 0,
    v_call: 1,
    d_sequence_start: 2,
    v_sequence_start: 3,
    d_sequence_end: 4,
    j_sequence_end: 5,
    v_sequence_end: 6,
    j_call: 7,
    ar_indels: 8,
    j_sequence_start: 9,
    d_call: 10,
    productive: 11,
  }
  //await getModelOutputIndices(model, desiredModelOutputNames);
  return { model, indices };
}

// export async function getModelOutputIndices(model, desiredModelOutputNames) {
//   if (!model) {
//     console.error("Model not loaded yet.");
//     return null;
//   }

//   const outputIndices = {};
//   Object.keys(model.signature.outputs).forEach((key, index) => {
//     if (desiredModelOutputNames.includes(key)) {
//       outputIndices[key] = index;
//     }
//   });

//   return outputIndices;
// }

export async function warmUpModel(model, indices, maxSeqLength) {
    //const isDevMode = process.env.NODE_ENV === 'development';
    const seq = 'TGGCACTTCATCGTGTACTTACAGCGCCACCTCCTAACGGGGCCCCCTCCTTGATCCACACAGCGAATCCGCCACGACCTGCGATAGCTTCGAGCAGGCCTTCAGTGGACAACATACTCTCAGCTAGGCCACCACCATTCCACAGATGCAGCTGGTGCAATCTGGGTCTGAGTCGAAGAAGCCTGGGGCCTCATTGAAGGTTTCCTGCAAGGCTTCTGGAGACACCTTCACTAGGTATGCTATGAATTGGGTGCGACAGGCCCCGGGACAAGGGCTTGAGCGGATGGGATGGATCACCACCAACACTGAGAACCCAACGTCTGCCCAGGGCTTCACAGGACGCTTTGTCTTCTCCTTGGACACCTCTGTCAGAACGGCATATCTGCAGATCTGCAGCCTAACGGCTAAGGACACTGCCGTATATTATTGTGCGAGAGATAGACTGGGACCGTATTATTACTATCACTACATGGACGTCTGGGTCAAAGGGACCACGATCACCGTCTCCTCAG'
    const encodedSequences = SequenceTokenizer.tokenizeSingleSequence(seq, maxSeqLength);
    let status = 'success';
    const predicted = model.predict(encodedSequences);
    // console.log(predicted);
    // console.log("mutation rate:", predicted[0].arraySync()[0]) // mutation rate
    // console.log("V allele:",predicted[1].arraySync()[0]) // V allele
    // console.log("D start:",predicted[2].arraySync()[0]) // D start
    // console.log("V start:", predicted[3].arraySync()[0]) // V start
    // console.log("D end:",predicted[4].arraySync()[0]) // D end
    // console.log("J end:",predicted[5].arraySync()[0]) // J end
    // console.log("V end:",predicted[6].arraySync()[0]) // V end
    // console.log("J allele:",predicted[7].arraySync()[0]) // J allele
    // console.log("Indels:",predicted[8].arraySync()[0]) // indels
    // console.log("J start:",predicted[9].arraySync()[0]) // J start
    // console.log("D allele:",predicted[10].arraySync()[0]) // D allele
    // console.log("Productive:",predicted[11].arraySync()[0]) // productive
    if (!predicted) {
        console.error("Prediction failed.");
        status = 'failed'
        return status;
    }
    return status;
}

function LoadModelComponent({ setSelectedChain, selectedChain, setModel, setOutputIndices, setIsLoading }) {
    // constants
    const model_urls = {
        IGH: "tfjs/AlignAIRR/model.json",
        IGK: "tfjs/AlignAIRR/model.json",
        IGL: "tfjs/AlignAIRR/model.json",
    };

    const maxSeqLength = 576;

    const fetchModel = async () => {
        const model_url = model_urls[selectedChain];
        try {
            // Fetch model
            console.log(`Fetching model from ${model_url}`);
            const response = await fetch(model_url);
            const arrayBuffer = await response.arrayBuffer();
            
            // Validate buffer length
            console.log("Buffer length:", arrayBuffer.byteLength);
            if (arrayBuffer.byteLength % 4 !== 0) {
                throw new Error("Buffer length is not a multiple of 4");
            }

            // Convert buffer to Float32Array
            const floatArray = new Float32Array(arrayBuffer);
            console.log("Float32Array created successfully");

            // Load the model
            const { model, indices } = await loadModel(model_url);
            setModel(model);
            setOutputIndices(indices);
            setIsLoading(false);
            console.log('Model loaded successfully');

            // Warm up the model
            const status = warmUpModel(model, indices, maxSeqLength);
            if (status === 'success') {
                console.log('Warmup completed.');
            }
        } catch (error) {
            console.error("Error loading model:", error);
            setIsLoading(false);
        }
    };

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
