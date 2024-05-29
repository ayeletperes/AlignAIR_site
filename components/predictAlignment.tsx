import * as tf from '@tensorflow/tfjs';
import { SequenceTokenizer } from './processSequence';
import { extractAllele, extratSegmentation, extratProductivity, extractGermline } from './postProcessing';

export async function processBatch(
  batchKeys: string[],
  dataDict: { [key: string]: any },
  AlleleCallOHE: any, // Adjust the type as per your actual type
  confidences: { [key: string]: number },
  caps: { [key: string]: number },
  model: tf.LayersModel,
  outputIndices: { [key: string]: number }
) {
  const batch = batchKeys.map(key => dataDict[key]);
  const encodedSequencesPromises = batch.map(item =>
    SequenceTokenizer.encodeAndEqualPadSequence(item.sequence.replace(/\n/g, '').toUpperCase())
  );
  const encodedSequences = await Promise.all(encodedSequencesPromises);
  const stackSequences = tf.stack(encodedSequences);
  const predicted = model.predict(stackSequences);
  let tensorData: tf.Tensor<tf.Rank>;

  const tensorsToDispose: tf.Tensor[] = [];

  const sequences: string[] = [];
  Object.values(dataDict).forEach(item => {
    sequences.push(item.sequence);
  });

  await Promise.all(
    ['v_call', 'd_call', 'j_call', 'v_sequence_start', 'v_sequence_end', 'd_sequence_start', 'd_sequence_end', 'j_sequence_start', 'j_sequence_end', 'productive', 'mutation_rate', 'ar_indels'].map(async feature => {
      const outputIndex = outputIndices[feature];
      if (Array.isArray(predicted)) {
        if (predicted[outputIndex] instanceof tf.Tensor) {
          tensorData = predicted[outputIndex];
        } else {
          throw new Error('The element at the specified index is not a tensor.');
        }
      } else if (predicted instanceof tf.Tensor) {
        tensorData = predicted;
      } else {
        throw new Error('The predicted data is not a tensor or an array of tensors.');
      }
      const tensorArray = tf.unstack(tensorData);
      const processedData = await Promise.all(
        tensorArray.map(async (tensor: tf.Tensor<tf.Rank>, index: number) => {
          if (['v_call', 'd_call', 'j_call'].includes(feature)) {
            const alleles = extractAllele.dynamicCumulativeConfidenceThreshold(tensor, confidences[feature], caps[feature], AlleleCallOHE[feature]);
            tensorsToDispose.push(tensor);
            return alleles;
          } else {
            if (['mutation_rate', 'ar_indels'].includes(feature)) {
              const array = tensor.arraySync()
              let val: number;
              if (Array.isArray(array) && array.length > 0 && typeof array[0] === 'number') {
                val = array[0];
              } else {
                  throw new Error('Unexpected data format in productiveArray.');
              }
              const value = Math.abs(val);
              tensorsToDispose.push(tensor);
              return value;
            } else {
              if (feature === 'productive') {
                const productive = extratProductivity.assesProductivity(tensor);
                tensorsToDispose.push(tensor);
                return productive;
              } else {
                const segment = extratSegmentation.calculateSegment(tensor, sequences[Number(index)]);
                tensorsToDispose.push(tensor);
                return segment;
              }
            }
          }
        })
      );
      processedData.forEach((element: any, index: string | number) => {
        const key = batchKeys[index as number];
        if (!dataDict[key]) {
          dataDict[key] = {};
        }
        if (['v_call', 'd_call', 'j_call'].includes(feature)) {
          dataDict[key][feature] = element.index;
          dataDict[key][feature.charAt(0) + '_likelihoods'] = element.prob;
        } else {
          if (['mutation_rate', 'ar_indels'].includes(feature)) {
            dataDict[key][feature] = element;
          } else {
            if (feature === 'productive') {
              dataDict[key][feature] = element;
            } else {
              dataDict[key][feature] = element;
            }
          }
        }
      });
    })
  );

  // for each key in dataDict, add the germline alignment. Here, we just gonna pull the records for the first match.
  console.log('dataDict:', dataDict)
  batchKeys.forEach(key => {
    const item = dataDict[key];
    ['v', 'd', 'j'].forEach((allele: string) => {
      const k = allele === 'd' ? 5 : 15;
      const segments = extractGermline.HeuristicReferenceMatcher({
        results: item,
        segment: allele,
        referenceAlleles: AlleleCallOHE[`${allele}_call`],
        k: k,
      });
      dataDict[key] = { ...dataDict[key], ...segments };
    });
  });

  if (Array.isArray(predicted)) {
    predicted.forEach((tensor: { dispose: () => any; }) => tensor.dispose());
  } else {
    predicted.dispose();
  }
}

export async function processAllBatches(
  keys: string[],
  dataDict: { [key: string]: any },
  AlleleCallOHE: any, // Adjust the type as per your actual type
  confidences: { [key: string]: number },
  caps: { [key: string]: number },
  model: tf.LayersModel,
  outputIndices: { [key: string]: number },
  numElements: number = 500
) {
  const totalSequences = keys.length;
  const batchSize = Math.min(totalSequences, numElements); // Adjust batch size as needed
  for (let i = 0; i < totalSequences; i += batchSize) {
    const remainingKeys = totalSequences - i;
    const currentBatchSize = Math.min(batchSize, remainingKeys);
    const batchKeys = keys.slice(i, i + currentBatchSize);
    await processBatch(batchKeys, dataDict, AlleleCallOHE, confidences, caps, model, outputIndices);
  }
}
