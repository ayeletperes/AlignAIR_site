import * as tf from "@tensorflow/tfjs";
import {fastaReader} from "./fastaReader";
import { SequenceTokenizer, ExtractAllele } from './predictSequence';
import { countTotalSequences } from './fileProcessor.js';


export async function readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(event.target.result);
      reader.onerror = error => reject(error);
      reader.readAsText(file);
    });
}

export async function readBatchSequences(fileInput, offset, batchSize) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
            const { result } = event.target;
            const batchContent = result.substring(offset, offset + batchSize);
            resolve(batchContent);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };

        fileReader.readAsText(fileInput);
    });
}
// TODO: add a batch read to the fasta files. 
/**
 * Handles form submission and performs predictions based on the provided values.
 * @param {object} values - The form values.
 * @param {File} fileInput - The file input.
 * @param {number} vconfidence - Confidence for v_allele.
 * @param {number} dconfidence - Confidence for d_allele.
 * @param {number} jconfidence - Confidence for j_allele.
 * @param {number} vcap - Capacity for v_allele.
 * @param {number} dcap - Capacity for d_allele.
 * @param {number} jcap - Capacity for j_allele.
 * @param {object} AlleleCallOHE - One-hot encoded allele call data.
 * @param {object} model - The prediction model.
 * @param {object} outputIndices - Indices for the output predictions.
 * @param {boolean} isLoading - Indicates if the model is still loading.
 * @param {function} setSubmit - Setter function for submit state.
 * @param {function} setSeqResults - Setter function for sequence results.
 * @param {function} setPredictionsAvailable - Setter function for predictions availability state.
 * @param {function} setProgress - Setter function for progress state.
 * @param {function} setElapsedTime - Setter function for elapsed time state.
 */
export async function handleSubmit2(values, fileInput, vconfidence, dconfidence, jconfidence, vcap, dcap, jcap, AlleleCallOHE, model, outputIndices, isLoading, setSubmit, setSeqResults, setPredictionsAvailable, setProgress, setElapsedTime) {
    try {
        setSubmit(true);

        let fastaLines = values.sequence;
        if (!values.sequence && fileInput) {
            countTotalSequences(fileInput, 100)
            .then((totalSequences) => {
                console.log('Total sequences:', totalSequences);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            fastaLines = await readFileContent(fileInput);
        }

        const dataDict = fastaReader.queryToDict(fastaLines);
        const confidences = { v_allele: vconfidence, d_allele: dconfidence, j_allele: jconfidence };
        const caps = { v_allele: vcap, d_allele: dcap, j_allele: jcap };

        if (!isLoading) {
            const startTime = new Date().getTime();
            const keys = Object.keys(dataDict);
            const alleleList = ['v_allele', 'd_allele', 'j_allele'];
            const numElements = 576;
            const numSequences = keys.length;
            const batchSize = Math.min(numSequences, numElements); // Adjust batch size as needed
            const totalSequences = keys.length;
            const numStages = 3; // Pre-processing, Prediction, Post-processing
            for (let i = 0; i < totalSequences; i += batchSize) {
                const remainingKeys = totalSequences - i;
                const currentBatchSize = Math.min(batchSize, remainingKeys);
                const batchKeys = keys.slice(i, i + currentBatchSize);
                const batch = batchKeys.map(key => dataDict[key]);

                // Preprocessing stage
                let encodedSequences = batch.map(item => new Int32Array(SequenceTokenizer.encodeAndEqualPadSequence(item.sequence.replace(/\n/g, '').toUpperCase())));
                const stackSequences = tf.stack(encodedSequences);
                let stageProgress = 0;

                // Update progress for pre-processing stage
                const preProcessingProgress = Math.floor(((i + currentBatchSize) / totalSequences) * 100);
                setProgress(preProcessingProgress);
                // Update elapsed time
                setElapsedTime((new Date().getTime() - startTime) / 1000);

                // Prediction stage
                const predicted = await model.predict(stackSequences);
                stageProgress += 1 / numStages;

                // clean memory 
                stackSequences.dispose();
                encodedSequences = null;

                // Update progress for prediction stage
                const predictionProgress = Math.floor(((i + currentBatchSize) / totalSequences + stageProgress) * 100);
                setProgress(predictionProgress);
                // Update elapsed time
                setElapsedTime((new Date().getTime() - startTime) / 1000);

                // Post-processing stage
                for (const allele of alleleList) {
                    const tensorData = await predicted[outputIndices[allele]].array();
                    const processedData = tensorData.map(e => ExtractAllele.getAlleles(e, AlleleCallOHE[allele], confidences[allele], caps[allele]))
                    processedData.forEach((element, index) => {
                        const key = batchKeys[index];
                        dataDict[key] = Object.assign({}, dataDict[key], { [allele]: element });
                    });
                }
                stageProgress += 1 / numStages;
                // Clean up memory
                predicted.forEach(tensor => tensor.dispose());
                // Update progress for post-processing stage
                const postProcessingProgress = Math.floor(((i + currentBatchSize) / totalSequences + stageProgress) * 100);
                setProgress(postProcessingProgress);
                // Update elapsed time
                setElapsedTime((new Date().getTime() - startTime) / 1000);
            }
        } else {
            console.error("Model is still loading.");
        }

        setSeqResults(dataDict);
        setPredictionsAvailable(true);
    } catch (error) {
        console.error("Error in predictions:", error);
    }
}
