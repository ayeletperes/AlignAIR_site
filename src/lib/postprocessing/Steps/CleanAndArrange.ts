import * as tf from '@tensorflow/tfjs';
import { 
  HeuristicReferenceMatcher, 
  ReferenceAllele, 
  MatchResult } from '@/lib/postprocessing/HeuristicMatching/HeuristicMatcher';
import { ReferenceLoader } from '@/lib/data/ReferenceLoader';
import { ChainTypeOneHotEncoder } from '@/lib/data/ChainTypeOneHotEncoder';
import { logger } from '@/utils/logger';

/** Types */
export type IuisSegmentMap = Record<string, { iuis?: string }>;
export interface SequenceRecord { sequence: string }
export type ReferenceMap = {
  V?: Record<string, ReferenceAllele>;
  D?: Record<string, ReferenceAllele>;
  J?: Record<string, ReferenceAllele>;
};

export interface CleanAndArrangeParams {
  predictions: any[];
  modelOutputNodes: Record<string, number>;
  chain: 'heavy' | 'light' | 'trb';
  sequences: Record<string, SequenceRecord>;
  referenceLoader: ReferenceLoader;
  hasD: boolean;
  multiChain: boolean;
  // thresholds and caps come directly on params
  vThresh?: number;
  dThresh?: number;
  jThresh?: number;
  vCap?: number;
  dCap?: number;
  jCap?: number;

  // optional matcher tunables
  matcherK?: number;
  matcherS?: number;
}

/** Result shape. No allele tensors kept. */
export interface CleanedPredictions {
  v_sequence_start: number[];
  v_sequence_end: number[];
  d_sequence_start: number[] | null;
  d_sequence_end: number[] | null;
  j_sequence_start: number[];
  j_sequence_end: number[];

  v_germline_start: number[];
  v_germline_end: number[];
  d_germline_start: number[] | null;
  d_germline_end: number[] | null;
  j_germline_start: number[];
  j_germline_end: number[];

  mutation_rate: Float32Array;
  indel_count: Float32Array;
  productive: Uint8Array;

  v_call: string[][];
  d_call: string[][] | null;
  j_call: string[][];
  v_likelihood: number[][];
  d_likelihood: number[][] | null;
  j_likelihood: number[][];

  type_: 'heavy' | 'light' | 'trb' | 'kappa' | 'lambda' | null;
}

/** Helpers */
const PADDED_MAX_LEN = 576;

const extract = (key: string, preds: any[], nodes: Record<string, number>): tf.Tensor => {
  const i = nodes[key]; if (i === undefined) throw new Error(`Missing node for ${key}`);
  return tf.concat(preds.map((b: Record<string, tf.Tensor>) => b[i]));
};

const toArr = (t: tf.Tensor | null | undefined): number[] | null =>
  t ? Array.from(t.dataSync() as any) : null;

const padSize = (seq: string, maxLen = PADDED_MAX_LEN) =>
  Math.floor((maxLen - seq.length) / 2);

function clip(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

const sanitizeBounds = (rawStart: number[] | null, rawEnd: number[] | null, pads: number[], seqLengths: number[]) =>{
  if (!rawStart || !rawEnd) return [];
  // Remove padding, convert to [start:end) with standard rounding
  let s = rawStart.map((v, i) => (Math.round(v - pads[i]) | 0));
  let e = rawEnd.map((v, i) => (Math.round(v - pads[i]) | 0));
  // Clamp to valid range: start in [0, L-1], end in [1, L]
  s = s.map((v, i) => clip(v, 0, seqLengths[i] - 1));
  e = e.map((v, i) => clip(v, 1, seqLengths[i]));
  // ensure non-empty end-exclusive interval
  e = e.map((v, i) => Math.max(v, s[i] + 1));
  return [s, e];
}
  

const adjust = (vals: number[] | null, pads: number[]) =>
  !vals ? [] : vals.map((v, i) => Math.round(Math.abs(v - pads[i])));

const maxPctThresh = (vec: tf.Tensor, pct = 0.21, cap = 3): [number[], number[]] => {
  const a = vec.dataSync() as Float32Array | number[];
  let maxV = a[0];
  for (let i = 1; i < a.length; i++) if (a[i] > maxV) maxV = a[i];
  const thr = maxV * pct;
  const idx: number[] = [];
  for (let i = 0; i < a.length; i++) if (a[i] >= thr) idx.push(i);
  if (!idx.length) return [[], []];
  idx.sort((i, j) => (a[j] as number) - (a[i] as number));
  const cut = idx.slice(0, cap);
  return [cut, cut.map(i => a[i] as number)];
};

const getAlleles = async (
  logits: tf.Tensor,
  refNames: string[],
  pct = 0.21,
  cap = 3
): Promise<[string[], number[]][]> => {
  const batches = tf.split(logits, logits.shape[0], 0);
  try {
    return await Promise.all(batches.map(async b => {
      const v = b.squeeze();
      const [idx, lik] = maxPctThresh(v, pct, cap);
      return [idx.map(i => refNames[i]), lik] as [string[], number[]];
    }));
  } finally {
    batches.forEach(t => t.dispose());
  }
};


/** Main */
export const cleanAndArrangePredictions = async (params: CleanAndArrangeParams): Promise<CleanedPredictions> => {
  const {
    predictions, modelOutputNodes, chain, sequences, referenceLoader, hasD, multiChain,
    vThresh = 0.1, dThresh = 0.1, jThresh = 0.1,
    vCap = 3, dCap = 3, jCap = 3,
    matcherK = 15, matcherS = 30
  } = params;

  // Debug: Predictions structure (removed for production)
  // Scalars to JS
  logger.step('Extracting scalars');
  const mutation_rate = extract('mutation_rate', predictions, modelOutputNodes).dataSync() as Float32Array;
  const indel_count  = extract('indel_count',  predictions, modelOutputNodes).floor().abs().dataSync() as Float32Array;
  const productive   = extract('productive',   predictions, modelOutputNodes).greater(0.5).dataSync() as Uint8Array;
  // Allele logits tensors, only used to compute calls, then disposed
  logger.step('Extracting allele logits');
  const v_logits = extract('v_allele', predictions, modelOutputNodes);
  const j_logits = extract('j_allele', predictions, modelOutputNodes);
  const d_logits = hasD ? extract('d_allele', predictions, modelOutputNodes) : null;

  // Prefer discrete boundaries from position logits if available; fallback to expectations
  logger.step('Extracting start and end tensors');
  const first = predictions[0];
  
  const stackOrNone = (key: string) => {
    return key in first ? extract(key, predictions, modelOutputNodes) : null;
  };

  // Try logits path
  const vStartLogits = stackOrNone('v_start_logits');
  const vEndLogits = stackOrNone('v_end_logits');
  const jStartLogits = stackOrNone('j_start_logits');
  const jEndLogits = stackOrNone('j_end_logits');

  // Helper function to extract argmax positions from logits
  const extractArgmax = (logitsKey: string): number[] => {
    const tensor = extract(logitsKey, predictions, modelOutputNodes);
    const data = tensor.dataSync() as Float32Array;
    const [batchSize, seqLen] = tensor.shape;

    return Array.from({length: batchSize}, (_, i) => {
      const start = i * seqLen;
      const row = data.slice(start, start + seqLen);
      let maxIdx = 0;
      let maxVal = row[0];
      for (let j = 1; j < seqLen; j++) {
        if (row[j] > maxVal) {
          maxVal = row[j];
          maxIdx = j;
        }
      }
      return maxIdx;
    });
  };

  let vStart: number[], vEnd: number[], jStart: number[], jEnd: number[];

  if (vStartLogits && vEndLogits && jStartLogits && jEndLogits) {
    vStart = extractArgmax('v_start_logits');
    vEnd = extractArgmax('v_end_logits');
    jStart = extractArgmax('j_start_logits');
    jEnd = extractArgmax('j_end_logits');
  } else {
    // Fallback: use provided scalar starts/ends (expectations)
    const vStartT = extract('v_sequence_start', predictions, modelOutputNodes);
    const vEndT = extract('v_sequence_end', predictions, modelOutputNodes);
    const jStartT = extract('j_sequence_start', predictions, modelOutputNodes);
    const jEndT = extract('j_sequence_end', predictions, modelOutputNodes);
    
    vStart = toArr(vStartT)!;
    vEnd = toArr(vEndT)!;
    jStart = toArr(jStartT)!;
    jEnd = toArr(jEndT)!;
  }

  let dStart: number[] | null = null, dEnd: number[] | null = null;
  
  if (hasD) {
    const dStartLogits = stackOrNone('d_start_logits');
    const dEndLogits = stackOrNone('d_end_logits');
    
    if (dStartLogits && dEndLogits) {
      dStart = extractArgmax('d_start_logits');
      dEnd = extractArgmax('d_end_logits');
    } else {
      const dStartT = extract('d_sequence_start', predictions, modelOutputNodes);
      const dEndT = extract('d_sequence_end', predictions, modelOutputNodes);
      
      dStart = toArr(dStartT);
      dEnd = toArr(dEndT);
    }
  }

  const seqs = Object.values(sequences).map(s => s.sequence);
  const pads = seqs.map(s => padSize(s, PADDED_MAX_LEN));
  // Correct padding
  logger.step('Correcting padding');
  const seqLengths = seqs.map(s => s.length);
  const [v_sequence_start, v_sequence_end] = sanitizeBounds(vStart, vEnd, pads, seqLengths);
  let [j_sequence_start, j_sequence_end] = sanitizeBounds(jStart, jEnd, pads, seqLengths);
  let [d_sequence_start, d_sequence_end] = hasD ? sanitizeBounds(dStart, dEnd, pads, seqLengths) : [null, null];
  // Optional monotonic repair: enforce V ≤ D ≤ J ordering where applicable
  logger.step('Monotonic repair');
  if (hasD && d_sequence_start && d_sequence_end) {
    d_sequence_start = d_sequence_start.map((v, i) => Math.max(v, v_sequence_end[i]));
    d_sequence_end = d_sequence_end.map((v, i) => Math.max(v, d_sequence_start[i] + 1));
    j_sequence_start = j_sequence_start.map((v, i) => Math.max(v, d_sequence_end[i]));
    j_sequence_end = j_sequence_end.map((v, i) => Math.max(v, j_sequence_start[i] + 1));
  } else {
    j_sequence_start = j_sequence_start.map((v, i) => Math.max(v, v_sequence_end[i]));
    j_sequence_end = j_sequence_end.map((v, i) => Math.max(v, j_sequence_start[i] + 1));
  }

  // Allele encoder: names from reference maps
  logger.step('Getting allele names');
  const V_names = referenceLoader.getNames('V');
  const J_names = referenceLoader.getNames('J');
  const D_names = (() => { const base = referenceLoader.getNames('D'); if (base.length) base.push('Short-D'); return base; })();

  const V_sel = await getAlleles(v_logits, V_names, vThresh, vCap);
  const J_sel = await getAlleles(j_logits, J_names, jThresh, jCap);
  const D_sel = d_logits ? await getAlleles(d_logits, D_names, dThresh, dCap) : null;
  
  const v_call = V_sel.map(([n]) => n), v_likelihood = V_sel.map(([, l]) => l);
  
  const j_call = J_sel.map(([n]) => n), j_likelihood = J_sel.map(([, l]) => l);
  const d_call = D_sel ? D_sel.map(([n]) => n) : null;
  const d_likelihood = D_sel ? D_sel.map(([, l]) => l) : null;

  // Dispose logits now
  v_logits.dispose();
  j_logits.dispose();
  if (d_logits) d_logits.dispose();

  // Germline alignment using matcher
  logger.step('Matching germline alleles');
  const vMatcher = new HeuristicReferenceMatcher(referenceLoader.getSeqs('V') || {});
  const jMatcher = new HeuristicReferenceMatcher(referenceLoader.getSeqs('J') || {});
  const dMatcher = hasD ? new HeuristicReferenceMatcher(referenceLoader.addShortD(referenceLoader.getSeqs('D')) || {}) : null;

  const vMaps: MatchResult[] = vMatcher.match(seqs, v_sequence_start, v_sequence_end, v_call.map(a => a[0] || ''), Array.from(indel_count), matcherK, matcherS);
  const jMaps: MatchResult[] = jMatcher.match(seqs, j_sequence_start, j_sequence_end, j_call.map(a => a[0] || ''), Array.from(indel_count), matcherK, matcherS);
  const dMaps: MatchResult[] | null = dMatcher ? dMatcher.match(seqs, d_sequence_start || [], d_sequence_end || [], (d_call || []).map(a => a?.[0] || ''), Array.from(indel_count), matcherK, matcherS) : null;

  const v_germline_start = vMaps.map(m => m.start_in_ref);
  const v_germline_end   = vMaps.map(m => m.end_in_ref);
  const j_germline_start = jMaps.map(m => m.start_in_ref);
  const j_germline_end   = jMaps.map(m => m.end_in_ref);
  const d_germline_start = dMaps ? dMaps.map(m => m.start_in_ref) : null;
  const d_germline_end   = dMaps ? dMaps.map(m => m.end_in_ref)   : null;

  const v_call_iuis = referenceLoader.translateCalls(v_call,'V', 'iuis')
  const j_call_iuis = referenceLoader.translateCalls(j_call,'J', 'iuis');
  const d_call_iuis = d_call ? referenceLoader.translateCalls(d_call,'D', 'iuis') : null;

  logger.step('Determining chain type');
  let type_ = null
  if(chain === "light"){
    if(multiChain){
      const chainTypeEncoder = new ChainTypeOneHotEncoder(['lambda', 'kappa']);
      const type_ = chainTypeEncoder.decode(extract('chain_type', predictions, modelOutputNodes))  
    }else{
      type_ = extract('chain_type', predictions, modelOutputNodes).flatten().arraySync()[0] === 1 ? 'kappa' : 'lambda'
    }
  }else{
    type_ = chain
  }
  logger.step('Returning results');

  return {
    v_sequence_start, v_sequence_end,
    d_sequence_start, d_sequence_end,
    j_sequence_start, j_sequence_end,

    v_germline_start, v_germline_end,
    d_germline_start, d_germline_end,
    j_germline_start, j_germline_end,

    mutation_rate, indel_count, productive,

    v_call: v_call_iuis, v_likelihood,
    d_call: d_call_iuis, d_likelihood,
    j_call: j_call_iuis, j_likelihood,

    type_: type_ as 'heavy' | 'light' | 'trb' | 'kappa' | 'lambda' | null
  };
};

/** Minimal wrapper */
export class CleanAndArrangeStep {
  constructor(private name: string) {}
  public async execute(
    rawPredictions: any[],
    modelOutputNodes: Record<string, number>,
    chain: 'heavy' | 'light' | 'trb',
    sequences: Record<string, SequenceRecord>,
    referenceLoader: ReferenceLoader,
    hasD: boolean,
    multiChain: boolean,
    params?: Partial<Pick<CleanAndArrangeParams, 'vThresh' | 'dThresh' | 'jThresh' | 'vCap' | 'dCap' | 'jCap' | 'matcherK' | 'matcherS'>>
  ): Promise<CleanedPredictions> {
    return cleanAndArrangePredictions({
      predictions: rawPredictions,
      modelOutputNodes,
      chain,
      sequences,
      referenceLoader,
      hasD,
      multiChain,
      ...params
    });
  }
}