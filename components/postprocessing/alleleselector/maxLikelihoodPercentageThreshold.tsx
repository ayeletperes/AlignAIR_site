import * as tf from '@tensorflow/tfjs';

const sortIndicesByDescendingValues = (indices: tf.Tensor, prediction: tf.Tensor): tf.Tensor => {
  const gatheredValues = tf.gather(prediction, indices);
  if (gatheredValues.rank === 0) {
      return indices;
  }
  return tf.gather(indices, tf.topk(gatheredValues, indices.shape[0]).indices);
};

// const maxLikelihoodPercentageThreshold = async (
//   prediction: tf.Tensor,
//   percentage: number = 0.21,
//   cap: number = 3
// ): Promise<[number[], number[]]> => {
//     const maxIndex = prediction.argMax().toInt().dataSync()[0];
//     const maxLikelihood = prediction.slice(maxIndex, 1).dataSync()[0];
//     const thresholdValue = maxLikelihood * percentage;
//     const indicesArray = (await tf.whereAsync(prediction.greaterEqual(thresholdValue).asType('bool'))).flatten();
//     const sortedIndices = sortIndicesByDescendingValues(indicesArray, prediction);
//     const cappedIndices = sortedIndices.rank === 0 ? sortedIndices : sortedIndices.shape[0] > cap
//       ? sortedIndices.slice([0], [cap])
//       : sortedIndices;
//     const likelihoods = tf.gather(prediction, cappedIndices).arraySync() as number[];
//     const indices = cappedIndices.arraySync() as number[];
//     return [indices, likelihoods];
// };

const maxLikelihoodPercentageThreshold = async (
  prediction: tf.Tensor,
  percentage: number = 0.21,
  cap: number = 3
): Promise<[number[], number[]]> => {
    const predictionArray = prediction.dataSync();
    
    let maxIndex = 0;
    let maxLikelihood = predictionArray[0];
    for (let i = 1; i < predictionArray.length; i++) {
        if (predictionArray[i] > maxLikelihood) {
            maxLikelihood = predictionArray[i];
            maxIndex = i;
        }
    }
    const thresholdValue = maxLikelihood * percentage;
    const indicesArray = predictionArray
        .map((val, idx) => (val >= thresholdValue ? idx : -1)) 
        .filter(idx => idx !== -1);
    if (indicesArray.length === 0) {
        console.log("No indices found above threshold");
        return [[], []];
    }
    const sortedIndices = indicesArray.sort((a, b) => predictionArray[b] - predictionArray[a]).slice(0, cap);
    const likelihoods = sortedIndices.map(idx => predictionArray[idx]);
    return [Array.from(sortedIndices), Array.from(likelihoods)];
};


// Function: getAlleles
// const getAlleles = async (
//   likelihoodVectors: any,
//   referenceMap: string[],
//   percentage: number = 0.21,
//   cap: number = 3,
// ): Promise<[string[], number[]][]> => {
//   const results: [string[], number[]][] = [];
//   const batchTensors = tf.unstack(likelihoodVectors, 0); 

//   await Promise.all(batchTensors.map(async (batch) => {
//     const batchResults: [string[], number[]][] = [];

//     // Unstack within the batch to process each sequence separately
//     //const sequenceTensors = tf.unstack(batch, 0);
    
//     const squeezedVec = batch.squeeze();
//     const [selectedAllelesIndex, likelihoods] = await maxLikelihoodPercentageThreshold(squeezedVec, percentage, cap);
//     const indicesArray = Array.isArray(selectedAllelesIndex) ? selectedAllelesIndex : [selectedAllelesIndex];
//     const alleleNames = indicesArray.map(idx => referenceMap[idx]);
//     batchResults.push([alleleNames, likelihoods]);
//     // await Promise.all(sequenceTensors.map(async (vec) => {
//     //   const squeezedVec = vec.squeeze();
//     //   const [selectedAllelesIndex, likelihoods] = await maxLikelihoodPercentageThreshold(squeezedVec, percentage, cap);
//     //   const indicesArray = Array.isArray(selectedAllelesIndex) ? selectedAllelesIndex : [selectedAllelesIndex];
//     //   const alleleNames = indicesArray.map(idx => referenceMap[idx]);
//     //   batchResults.push([alleleNames, likelihoods]);
//     // }));
    
//     results.push(...batchResults);
//   }));
  
//   return results;
// };

const getAlleles = async (
  likelihoodVectors: tf.Tensor,
  referenceMap: string[],
  percentage: number = 0.21,
  cap: number = 3
): Promise<[string[], number[]][]> => {
    const batchTensors = tf.split(likelihoodVectors, likelihoodVectors.shape[0], 0); 
    const batchResults = await Promise.all(batchTensors.map(async (batch) => {
        const squeezedVec = batch.squeeze();
        const [selectedAllelesIndex, likelihoods] = await maxLikelihoodPercentageThreshold(squeezedVec, percentage, cap);
        const indicesArray = Array.isArray(selectedAllelesIndex) ? selectedAllelesIndex : [selectedAllelesIndex];
        const alleleNames = indicesArray.map(idx => referenceMap[idx]);

        return [alleleNames, likelihoods] as [string[], number[]];
    }));
    return batchResults;
};

export {
  maxLikelihoodPercentageThreshold,
  getAlleles,
};
