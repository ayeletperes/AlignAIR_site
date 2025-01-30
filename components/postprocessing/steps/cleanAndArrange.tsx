import * as tf from '@tensorflow/tfjs';

export interface CleanAndArrangeParams {
  predictions: any;
  modelOutputNodes: Record<string, number>;
  chain: 'heavy' | 'light';
}

export interface CleanedPredictions {
  v_allele: any;
  d_allele: any | null;
  j_allele: any;
  v_sequence_start: any;
  v_sequence_end: any;
  d_sequence_start: any | null;
  d_sequence_end: any | null;
  j_sequence_start: any;
  j_sequence_end: any;
  mutation_rate: any;
  indel_count: any;
  productive: any;
  type_: any | null;
  v_call: any | null;
  d_call: any | null;
  j_call: any | null;
  v_likelihood: any | null;
  d_likelihood: any | null;
  j_likelihood: any | null;
  v_germline_start: any;
  v_germline_end: any;
  d_germline_start: any | null;
  d_germline_end: any | null;
  j_germline_start: any;
  j_germline_end: any;

}

export const cleanAndArrangePredictions = (params: CleanAndArrangeParams): CleanedPredictions => {
  const { predictions, modelOutputNodes, chain } = params;

  const extractValues = (key: string): tf.Tensor => {
    const nodeIndex = modelOutputNodes[key];
    if (nodeIndex === undefined) throw new Error(`Key ${key} not found in modelOutputNodes`);
    return tf.concat(predictions.map((batch: Record<string, tf.Tensor>) => batch[nodeIndex]));
  };

  const mutationRateTensor = extractValues('mutation_rate');
  const indelCountTensor = extractValues('indel_count');
  const productiveTensor = extractValues('productive');
  const mutationRate = mutationRateTensor.dataSync();
  const indelCount = indelCountTensor.dataSync();
  const productive = productiveTensor.greater(0.5).dataSync();

  const vAllele = extractValues('v_allele');
  const jAllele = extractValues('j_allele');
  const vStart = extractValues('v_start');
  const vEnd = extractValues('v_end');
  const jStart = extractValues('j_start');
  const jEnd = extractValues('j_end');

  let dAllele = null, dStart = null, dEnd = null, type_ = null;

  if (chain === 'heavy') {
    dAllele = extractValues('d_allele');
    dStart = extractValues('d_start');
    dEnd = extractValues('d_end');
  } else {
    type_ = tf.tidy(() => extractValues('type').flatten().arraySync());
  }

  return {
    v_allele: vAllele,
    d_allele: dAllele,
    j_allele: jAllele,
    v_sequence_start: vStart,
    v_sequence_end: vEnd,
    d_sequence_start: dStart,
    d_sequence_end: dEnd,
    j_sequence_start: jStart,
    j_sequence_end: jEnd,
    mutation_rate: mutationRate,
    indel_count: indelCount,
    productive: productive,
    type_: type_,
    v_call: null,
    d_call: null,
    j_call: null,
    v_likelihood: null,
    d_likelihood: null,
    j_likelihood: null,
    v_germline_start: null,
    v_germline_end: null,
    d_germline_start: null,
    d_germline_end: null,
    j_germline_start: null,
    j_germline_end: null,
  };
};
