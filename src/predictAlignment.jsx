import * as tf from "@tensorflow/tfjs";
import { SequenceTokenizer } from "./processSequence";
import {extractAllele, HeuristicReferenceMatcher} from "./postProcessing";

// post processing of the batch
export async function processBatch(batchKeys, dataDict, AlleleCallOHE, confidences, caps, segs, model, outputIndices) {
    console.log(AlleleCallOHE)
    const batch = batchKeys.map(key => dataDict[key]);
    const encodedSequencesPromises = batch.map(item => SequenceTokenizer.encodeAndEqualPadSequence(item.sequence.replace(/\n/g, '').toUpperCase()));
    const encodedSequences = await Promise.all(encodedSequencesPromises);
    const stackSequences = tf.stack(encodedSequences);
    const predicted = model.predict(stackSequences);
    const tensorsToDispose = [];
    await Promise.all(['v_allele', 'd_allele', 'j_allele'].map(async (allele) => {
      const tensorData = predicted[outputIndices[allele]];
      const tensorArray = tf.unstack(tensorData);
      const processedData = await Promise.all(tensorArray.map(async (tensor) => {
        const alleles =  extractAllele.dynamicCumulativeConfidenceThreshold(tensor, confidences[allele], caps[allele], AlleleCallOHE[allele]);
        tensorsToDispose.push(tensor);
        return alleles;
      }));
      processedData.forEach((element, index) => {
        const key = batchKeys[index];
        if (!dataDict[key]) {
          dataDict[key] = {};
        }
        dataDict[key][allele] = element;
      });
    }));

    const mapper = new HeuristicReferenceMatcher(AlleleCallOHE, segs);
    // await Promise.all(['v_segment', 'd_segment', 'j_segment'].map(async (allele) => {
    //   const tensorData = predicted[outputIndices[allele]];
    //   const tensorArray = tf.unstack(tensorData);
    //   const sequences = [];
    //   const alleles = [];
    //   Object.values(dataDict).forEach(item => {
    //     sequences.push(item.sequence);
    //     alleles.push(item[allele.charAt(0) + '_allele'][0]);
    //   });
    //   const segments =  mapper.match(
    //     sequences, 
    //     tensorArray, 
    //     alleles, 
    //     segs[allele]
    //   );
    //   console.log(segments);
    //   return segments;
    // }));


    tensorsToDispose.forEach(tensor => tf.dispose(tensor));
    predicted.forEach(tensor => tensor.dispose());
}

// post processing of all batches
export async function processAllBatches(keys, dataDict, AlleleCallOHE, confidences, caps, segs, model, outputIndices, numElements = 500) {
    const totalSequences = keys.length;
    const batchSize = Math.min(totalSequences, numElements); // Adjust batch size as needed
    for (let i = 0; i < totalSequences; i += batchSize) {
      const remainingKeys = totalSequences - i;
      const currentBatchSize = Math.min(batchSize, remainingKeys);
      const batchKeys = keys.slice(i, i + currentBatchSize);
      await processBatch(batchKeys, dataDict, AlleleCallOHE, confidences, caps, segs, model, outputIndices);
    }
  }
  