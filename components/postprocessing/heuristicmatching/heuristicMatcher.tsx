
import { Allele, Segment } from '@components/reference/utilities';

export const hammingDistance = (s1: string, s2: string): number => {
    return Array.from(s1).reduce((acc, c1, i) => acc + (c1 !== s2[i] ? 1 : 0), Math.abs(s1.length - s2.length));
};
  
export const calculatePadSize = (sequence: string, maxLength: number = 512): number => {
    const totalPadding = maxLength - sequence.length;
    return Math.floor(totalPadding / 2);
};
  
export class HeuristicReferenceMatcher {
    private referenceAlleles: Segment;
  
    constructor(referenceAlleles: Segment, private segmentThreshold: number = 0.2) {
      this.referenceAlleles = referenceAlleles;
    }
  
    public AA_Score(s1: string, s2: string): number {
      let alignmentScore = 0;
      let velocity = 0;
      const acceleration = 0.05;
      let lastMatch: boolean | null = null;
  
      for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
        const isMatch = s1[i] === s2[i];
        if (isMatch) {
          velocity = lastMatch ? velocity + acceleration : acceleration;
          alignmentScore -= 1 + velocity;
        } else {
          velocity = lastMatch === false ? velocity + acceleration : acceleration;
          alignmentScore += 1 + velocity;
        }
        lastMatch = isMatch;
      }
  
      return alignmentScore;
    }
  
    public alignWithGermline(shortSegment: string, refSeq: string, k: number = 20, s: number = 25): [number, number] {
      const L_seg = shortSegment.length;
      const L_ref = refSeq.length;
      const L_diff = L_ref - L_seg;
      s = Math.min(L_diff, s) + 1;
  
      const endWindow = shortSegment.slice(-k);
  
      let minDifference = Infinity;
      let bestEndPos = L_ref;
  
      for (let offset = 0; offset < s; offset++) {
        const refWindow = refSeq.slice(L_ref - (k + offset), L_ref - offset);
        const difference = this.AA_Score(endWindow, refWindow);
        if (difference < minDifference) {
          minDifference = difference;
          bestEndPos = L_ref - offset;
          if (minDifference === 0) break;
        }
      }
  
      const startWindow = shortSegment.slice(0, k);
      const endBasedStart = bestEndPos - L_seg;
      let bestStartPos = endBasedStart;
      
      minDifference = Infinity;
      const start_search_range = Math.min(9, L_diff)
      for (let offset = -start_search_range; offset <= start_search_range; offset++) {
        const currentStart = Math.max(0, endBasedStart + offset);
        const currentEnd = Math.min(currentStart + k, L_ref)
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
  
    public match(
      sequences: string[],
      starts: number[],
      ends: number[],
      alleles: string[],
      k: number = 15,
      s: number = 30,
      gene: string | null = null
    ): any[] {
      const results: any[] = [];
      for (let i = 0; i < sequences.length; i++) {
        const sequence = sequences[i];
        const start = starts[i];
        const end = ends[i];
        const allele = alleles[i];
        const segmentedSequence = sequence.slice(start, end);
        const referenceAllele = this.referenceAlleles[allele];
        if (!referenceAllele) {
            console.error(`Reference allele not found for ${allele}`);
            continue;
        }
        const referenceSequence = referenceAllele.sequence;
        if (!referenceSequence) {
            console.error(`Reference allele sequence not found for ${allele}`);
            continue;
        }
        const referenceLength = referenceSequence.length;
        const segmentLength = end - start;
        
  
        if (segmentLength === referenceLength) {
          results.push({ start_in_seq: start, end_in_seq: end, start_in_ref: 0, end_in_ref: referenceLength });
        } else {
          const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
          results.push({ start_in_seq: start, end_in_seq: end, start_in_ref: Math.abs(refStart), end_in_ref: Math.abs(refEnd) });
        }
      }
      return results;
    }
  }
  