import * as tf from '@tensorflow/tfjs';


export class extractAllele {
    
  static async dynamicCumulativeConfidenceThreshold(
    prediction: tf.Tensor,
    percentage = 0.9,
    cap = 3,
    reference: any // Adjust the type as per your actual type
  ) {
    const refArray: [string, string][] = Object.entries(reference);
    const array = await prediction.array() as number[][];
    const flattenedArray = array.flat();
    const valueIndexPairs = flattenedArray
      .map((value: any, index: any) => ({ value, index }))
      .sort((a: { value: number; }, b: { value: number; }) => b.value - a.value)
      .slice(0, cap);
    const totalConfidence = valueIndexPairs.reduce((sum: any, pair: { value: any; }) => sum + pair.value, 0);
    const threshold = percentage * totalConfidence;

    let cumulativeConfidence = 0.0;
    const alleles: string[] = [];
    const probability: number[] = [];
    for (const pair of valueIndexPairs) {
      cumulativeConfidence += pair.value;
      alleles.push(refArray[pair.index][0]);
      probability.push(flattenedArray[pair.index]);
      if (cumulativeConfidence >= threshold || alleles.length >= cap) {
        break;
      }
    }

    return {
      index: alleles,
      prob: probability,
    };
  }
}

export class extratSegmentation {
  static calculatePadSize(sequence: string, maxLength = 576) {
    const totalPadding = maxLength - sequence.length;
    const padSize = Math.floor(totalPadding / 2);

    return padSize;
  }

  static async calculateSegment(prediction: tf.Tensor, sequence: string, maxLength = 576) {
    let segmenSize: number;
    const segmenSizeArray = await prediction.array();
    if (typeof segmenSizeArray === 'number') {
        segmenSize = Math.round(segmenSizeArray);
    } else if (Array.isArray(segmenSizeArray) && segmenSizeArray.length > 0 && typeof segmenSizeArray[0] === 'number') {
        segmenSize = Math.round(segmenSizeArray[0]);
    } else {
        throw new Error('Unexpected data format in segmenSizeArray.');
    }
    const padSize = this.calculatePadSize(sequence, maxLength);
    return segmenSize - padSize;
  }
}

export class extractGermline {
  static calculatePadSize(sequence: string, maxLength = 576) {
    const totalPadding = maxLength - sequence.length;
    const padSize = Math.floor(totalPadding / 2);

    return padSize;
  }

  static AA_Score(s1: string, s2: string) {
    let alignmentScore = 0;
    let velocity = 0;
    const acceleration = 0.05;
    let lastMatch = null;

    for (let i = 0; i < s1.length && i < s2.length; i++) {
      const isMatch = s1[i] === s2[i];
      if (isMatch) {
        if (lastMatch) {
          velocity += acceleration;
        } else {
          velocity = acceleration;
        }
        alignmentScore -= 1 + velocity;
      } else {
        if (lastMatch === false) {
          velocity += acceleration;
        } else {
          velocity = acceleration;
        }
        alignmentScore += 1 + velocity;
      }
      lastMatch = isMatch;
    }

    return alignmentScore;
  }

  static alignWithGermline(shortSegment: string, refSeq: string, k = 20, s = 25) {
    if (shortSegment.length < k) return [-1, -1];

    const L_seg = shortSegment.length;
    const L_ref = refSeq.length;
    const L_diff = L_ref - L_seg;
    const adjustedS = Math.min(L_diff, s) + 1;
    const endWindow = shortSegment.slice(-k);

    let minDifference = Infinity;
    let bestEndPos = L_ref;
    for (let offset = 0; offset < adjustedS; offset++) {
      const refWindow = refSeq.slice(L_ref - (k + offset), L_ref - offset);
      const difference = this.AA_Score(endWindow, refWindow);
      if (difference < minDifference) {
        minDifference = difference;
        bestEndPos = L_ref - offset;
        if (minDifference === 0) break;
      }
    }

    minDifference = Infinity;
    const startWindow = shortSegment.slice(0, k);
    const endBasedStart = bestEndPos - L_seg;
    let bestStartPos = endBasedStart;
    const startSearchRange = Math.min(9, L_diff);
    for (let offset = -startSearchRange - 1; offset <= startSearchRange + 1; offset++) {
      const currentStart = Math.max(0, endBasedStart + offset);
      const currentEnd = Math.min(currentStart + k, L_ref);
      const refWindow = refSeq.slice(currentStart, currentEnd);
      if (refWindow.length !== startWindow.length) continue;
      const difference = this.AA_Score(startWindow, refWindow) + Math.abs(offset);
      if (difference < minDifference) {
        minDifference = difference;
        bestStartPos = currentStart;
        if (difference === 0) break;
      }
    }

    return [bestStartPos, bestEndPos];
  }

static HeuristicReferenceMatcher({
    results,
    segment,
    referenceAlleles,
    call_id = 0,
    k = 15,
    s = 30,
}: {
    results: any;
    segment: any;
    referenceAlleles: any;
    call_id?: number;
    k?: number;
    s?: number;
}) {
    const segmentedSequence = results.sequence.slice(results[`${segment}_sequence_start`], results[`${segment}_sequence_end`]);
    const segmentLength = segmentedSequence.length;
    const call = results[`${segment}_call`][call_id];
    const referenceSequence = referenceAlleles[call];
    const referenceLength = referenceSequence.length;

    if (segmentLength === referenceLength) {
        return {
            [segment + '_germline_start']: 0,
            [segment + '_germline_end']: referenceLength,
          };
        } else if (segmentLength > referenceLength) {
          const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
          return {
            [segment + '_germline_start']: refStart,
            [segment + '_germline_end']: refEnd,
          };
        } else if (segmentLength < referenceLength) {
          const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
          if (refStart !== null) {
            return {
              [segment + '_germline_start']: refStart,
              [segment + '_germline_end']: refEnd,
            };
          } else {
            throw new Error('Error in alignment');
          }
        }
      }
    
    static getGermlineSequence({ results, segment, referenceAlleles, call_id = 0, k = 15, s = 30 }: {
        results: any;
        segment: any;
        referenceAlleles: any;
        call_id?: number;
        k?: number;
        s?: number;
    }) {
        const { [`${segment}_germline_start`]: refStart = 0, [`${segment}_germline_end`]: refEnd = 0 } = this.HeuristicReferenceMatcher({ results, segment, referenceAlleles, call_id, k, s }) || {};
        const call = results[`${segment}_call`][call_id];
        const referenceSequence = referenceAlleles[call];
        return referenceSequence.slice(refStart, refEnd);
    }
}
    
    export class extratProductivity {
      static async assesProductivity(prediction: tf.Tensor) {
        let productive: boolean = false;
        const productiveArray = prediction.arraySync();
        if (typeof productiveArray === 'number') {
          productive = productiveArray > 0.5;
        } else if (Array.isArray(productiveArray) && productiveArray.length > 0 && typeof productiveArray[0] === 'number') {
          productive = productiveArray[0] > 0.5;
        } else {
            throw new Error('Unexpected data format in productiveArray.');
        }
        
        return productive;
      };
    }
    
    export class extratType {
      static async assesTyep(prediction: tf.Tensor) {
        let type: string = '';
        const typeArray = prediction.arraySync();
        if (typeof typeArray === 'number') {
          type = typeArray > 0.5? 'IGK': 'IGL';
        } else if (Array.isArray(typeArray) && typeArray.length > 0 && typeof typeArray[0] === 'number') {
          type = typeArray[0] > 0.5? 'IGK': 'IGL';
        } else {
            throw new Error('Unexpected data format in typeArray.');
        }
        
        return type;
      };
    }
