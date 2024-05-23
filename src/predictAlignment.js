import * as tf from "@tensorflow/tfjs";
import { SequenceTokenizer } from "./processSequence";
import {extractAllele, extratSegmentation, extratProductivity, extractGermline} from "./postProcessing";

// post processing of the batch
export async function processBatch(batchKeys, dataDict, AlleleCallOHE, confidences, caps, model, outputIndices) {
    const batch = batchKeys.map(key => dataDict[key]);
    const encodedSequencesPromises = batch.map(item => SequenceTokenizer.encodeAndEqualPadSequence(item.sequence.replace(/\n/g, '').toUpperCase()));
    const encodedSequences = await Promise.all(encodedSequencesPromises);
    const stackSequences = tf.stack(encodedSequences);
    const predicted = model.predict(stackSequences);
    const tensorsToDispose = [];

    const sequences = [];
      Object.values(dataDict).forEach(item => {
      sequences.push(item.sequence);
    });

    await Promise.all(['v_call', 'd_call', 'j_call', 'v_sequence_start', 'v_sequence_end', 'd_sequence_start', 'd_sequence_end', 'j_sequence_start', 'j_sequence_end', 'productive', 'mutation_rate', 'ar_indels'].map(async (allele) => {
      const tensorData = predicted[outputIndices[allele]];
      const tensorArray = tf.unstack(tensorData);
      const processedData = await Promise.all(tensorArray.map(async (tensor, index) => {
      if (['v_call', 'd_call', 'j_call'].includes(allele)) {
        const alleles = extractAllele.dynamicCumulativeConfidenceThreshold(tensor, confidences[allele], caps[allele], AlleleCallOHE[allele]);
        tensorsToDispose.push(tensor);
        return alleles;
      } else {
        if (['mutation_rate', 'ar_indels'].includes(allele)){
            const value = Math.abs(tensor.arraySync()[0]);
            tensorsToDispose.push(tensor);
            return value;
        }else{
          if (allele === 'productive') {
            const productive = extratProductivity.assesProductivity(tensor);
            tensorsToDispose.push(tensor);
            return productive;
          } else {
            const segment = extratSegmentation.calculateSegment(tensor, sequences[index]);
            tensorsToDispose.push(tensor);
            return segment;
          }
        }
      }
      }));
      processedData.forEach((element, index) => {
      const key = batchKeys[index];
      if (!dataDict[key]) {
        dataDict[key] = {};
      }
      if (['v_call', 'd_call', 'j_call'].includes(allele)) {
        dataDict[key][allele] = element.index;
        dataDict[key][allele.charAt(0) + '_likelihoods'] = element.prob;
      } else {
        if (['mutation_rate', 'ar_indels'].includes(allele)){
            dataDict[key][allele] = element;
          }
          else {
            if (allele === 'productive') {
              dataDict[key][allele] = element;
            } else {
              dataDict[key][allele] = element;
            }
        }
      }
      });
    }));

    // for each key in dataDict, add the germline alignment. Here, we just gonna pull the records for the first match. 
    let dictionary = {};
    Object.entries(AlleleCallOHE).forEach(([index, value]) => {
      dictionary[index] = Object.values(value).reduce((obj, item) => {
        obj[item.name] = item.sequence;
        return obj;
      }, {});
    });
    console.log(dictionary);
    batchKeys.forEach(key => {
      const item = dataDict[key];
      ['v', 'd', 'j'].forEach((allele) => {
        const segments = extractGermline.HeuristicReferenceMatcher(item, allele, dictionary[`${allele}_call`]);
        dataDict[key] = { ...dataDict[key], ...segments };
      });
    });      
    console.log(dataDict);
    tensorsToDispose.forEach(tensor => tf.dispose(tensor));
    predicted.forEach(tensor => tensor.dispose());
}

// post processing of all batches
export async function processAllBatches(keys, dataDict, AlleleCallOHE, confidences, caps, model, outputIndices, numElements = 500) {
    const totalSequences = keys.length;
    const batchSize = Math.min(totalSequences, numElements); // Adjust batch size as needed
    for (let i = 0; i < totalSequences; i += batchSize) {
      const remainingKeys = totalSequences - i;
      const currentBatchSize = Math.min(batchSize, remainingKeys);
      const batchKeys = keys.slice(i, i + currentBatchSize);
      await processBatch(batchKeys, dataDict, AlleleCallOHE, confidences, caps, model, outputIndices);
    }
  }
  