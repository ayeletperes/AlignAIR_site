import * as tf from '@tensorflow/tfjs';
import { SequenceTokenizer, SequenceTokenizerLight } from './processSequence';
import { extractAllele, extratSegmentation, extratProductivity, extractGermline, extratType } from './postProcessing';




export async function processBatch(
  batchKeys: string[],
  dataDict: { [key: string]: any },
  AlleleCallOHE: any, // Adjust the type as per your actual type
  confidences: { [key: string]: number },
  caps: { [key: string]: number },
  model: tf.LayersModel,
  outputIndices: { [key: string]: number }
) {
  let features = ['v_call', 'd_call', 'j_call', 'v_sequence_start', 'v_sequence_end', 'd_sequence_start', 'd_sequence_end', 'j_sequence_start', 'j_sequence_end', 'productive', 'mutation_rate', 'ar_indels']
  let chain = 'Heavy';
  let tokenizer = SequenceTokenizer;
  if (!AlleleCallOHE['d_call']) {
    features = ['v_call', 'j_call', 'v_sequence_start', 'v_sequence_end', 'j_sequence_start', 'j_sequence_end', 'productive', 'mutation_rate', 'ar_indels', 'type']
    chain = 'Light';
    tokenizer = SequenceTokenizerLight;
  }

  const batch = batchKeys.map(key => dataDict[key]);
  const encodedSequencesPromises = batch.map(item =>
    tokenizer.encodeAndEqualPadSequence(item.sequence.replace(/\n/g, '').toUpperCase())
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

  
  let entropyValid: { [key: string]: boolean } = {
    v_call: false,
    d_call: false,
    j_call: false,
  }

  const entropyThreshold: { [key: string]: number } = {
    v_call: 2,
    d_call: 2,
    j_call: 1,
  };

  await Promise.all(
    features.map(async feature => {
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

            const array = await tensor.array() as number[][];
            const flattenedArray = array.flat();
            const sumProb = flattenedArray.reduce((a, b) => a + b, 0);
            const entropy = sumProb * Math.log(sumProb) || 0;

            const thresh = entropyThreshold[feature] || 0;

          
            if(entropy < thresh){
              entropyValid[feature] = true;
              const alleles = extractAllele
              .dynamicCumulativeConfidenceThreshold(tensor, confidences[feature], caps[feature], AlleleCallOHE[feature]);
              tensorsToDispose.push(tensor);
              return alleles;
            }else{
              tensorsToDispose.push(tensor);
              const allelesempty = {index: [], prob: null};
              return allelesempty;
            }

            
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
                if (feature === 'type') {
                  const type = extratType.assesTyep(tensor);
                  tensorsToDispose.push(tensor);
                  return type;
                } else {
                  const segment = extratSegmentation.calculateSegment(tensor, sequences[Number(index)]);
                  tensorsToDispose.push(tensor);
                  return segment;
                }
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
          if (entropyValid[feature]) {
            dataDict[key][feature] = element.index;
            dataDict[key][feature.charAt(0) + '_likelihoods'] = element.prob;
          } else {
            dataDict[key][feature] = '';
            dataDict[key][feature.charAt(0) + '_likelihoods'] = null;
          }
        } else {
          if (feature === 'mutation_rate') {
            dataDict[key][feature] = element;
          } else {
            if (feature === 'productive') {
              dataDict[key][feature] = element;
            } else {
              if (feature === 'ar_indels') {
                dataDict[key][feature] = Math.round(element);
              } else{
                dataDict[key][feature] = element;
              }
            }
          }
        }
      });
    

      
    })
  );

  // for each key in dataDict, add the germline alignment. Here, we just gonna pull the records for the first match.
  
  batchKeys.forEach(key => {
    const item = dataDict[key];
    const alleles = chain==='Heavy' ? ['v', 'd', 'j'] : ['v', 'j'];
    alleles.forEach((allele: string) => {
      const k = allele === 'd' ? 5 : 15;
      
      if (entropyValid[allele+'_call']) {
        const segments = extractGermline.HeuristicReferenceMatcher({
          results: item,
          segment: allele,
          referenceAlleles: AlleleCallOHE[`${allele}_call`],
          k: k,
        });
        dataDict[key] = { ...dataDict[key], ...segments };
      }else{
        dataDict[key][allele + '_germline_start'] = null;
        dataDict[key][allele + '_germline_end'] = null;
        dataDict[key][allele + '_sequence_start'] = null;
        dataDict[key][allele + '_sequence_end'] = null;
        
    }
      
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
