export interface ReferenceAllele {
  name: string;
  sequence: string;
}

export interface MatchResult {
  start_in_seq: number;
  end_in_seq: number;
  start_in_ref: number;
  end_in_ref: number;
}

export class HeuristicReferenceMatcher {
  private referenceAlleles: Record<string, string>;

  constructor(referenceAlleles: Record<string, string>) {
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

  private static fastTailHeadCheck(seg: string, ref: string, k: number = 10, maxMm: number = 3): boolean {
    const headSeg = seg.slice(0, k);
    const headRef = ref.slice(0, k);
    const tailSeg = seg.slice(-k);
    const tailRef = ref.slice(-k);

    let headMismatch = 0;
    for (let i = 0; i < headSeg.length; i++) {
      if (headSeg[i] !== headRef[i]) headMismatch++;
    }

    let tailMismatch = 0;
    for (let i = 0; i < tailSeg.length; i++) {
      if (tailSeg[i] !== tailRef[i]) tailMismatch++;
    }

    return headMismatch <= maxMm && tailMismatch <= maxMm;
  }

  private static clipOverhangNoIndel(seq: string, start: number, end: number, refLen: number): [number, number] {
    const segLen = end - start;
    if (segLen <= refLen) return [start, end];
    const excess = segLen - refLen;
    const padStart = Math.floor(excess / 2);
    const newStart = start + padStart;
    const newEnd = end - (excess - padStart);
    return [newStart, newEnd];
  }

  private static isPureOverhang(segLen: number, refLen: number, indels: number): boolean {
    return segLen > refLen || (segLen === refLen && indels === 0);
  }

  public alignWithGermline(shortSegment: string, refSeq: string, indels: number, k: number = 20, s: number = 25): [number, number] {
    const L_seg = shortSegment.length;
    const L_ref = refSeq.length;
    const L_diff = Math.abs(L_ref - L_seg);

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
        if (difference === 0) break;
      }
    }

    const startWindow = shortSegment.slice(0, k);
    const endBasedStart = Math.max(0, bestEndPos - L_seg);

    let bestStartPos = endBasedStart;
    minDifference = this.AA_Score(startWindow, refSeq.slice(endBasedStart, endBasedStart + k));
    
    let offsets: number[];
    if (indels > 0) {
      const startRange = Math.min(indels, L_diff);
      const minOffset = -startRange - 1;
      const maxOffset = startRange + 1;
      offsets = [];
      for (let o = minOffset; o <= maxOffset; o++) offsets.push(o);
    } else {
      offsets = [-1, 1];
    }

    for (const offset of offsets) {
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

  public match(
    sequences: string[],
    starts: number[],
    ends: number[],
    alleles: string[],
    indelCounts: number[],
    k: number = 15,
    s: number = 30
  ): MatchResult[] {
    const results: MatchResult[] = [];

    for (let i = 0; i < sequences.length; i++) {
      let start = starts[i];
      let end = ends[i];
      const seq = sequences[i];
      const allele = alleles[i];
      const indels = indelCounts[i];

      const refSeq = this.referenceAlleles[allele];
      if (!refSeq) continue;

      const refLen = refSeq.length;

      if (indels === 0 && (end - start) > refLen) {
        [start, end] = HeuristicReferenceMatcher.clipOverhangNoIndel(seq, start, end, refLen);
      }
      
      const seg = seq.slice(start, end);
      const segLen = seg.length;
      if (segLen === refLen && indels === 0 && HeuristicReferenceMatcher.fastTailHeadCheck(seg, refSeq)) {
        results.push({ start_in_seq: start, end_in_seq: end, start_in_ref: 0, end_in_ref: refLen });
        continue;
      }

      const origSegLen = end - start;
      const [refStart, refEnd] = this.alignWithGermline(seg, refSeq, indels, k, s);
      let adjRefStart = refStart;
      let adjRefEnd = refEnd;
      const isOverhang = HeuristicReferenceMatcher.isPureOverhang(origSegLen, refLen, indels);
      if (isOverhang && (refStart > 0 || refEnd < refLen)) {
        start += refStart;
        end -= (refLen - refEnd);
        start = Math.max(0, start);
        end = Math.min(seq.length, end);
        adjRefStart = 0;
        adjRefEnd = refLen;
      }

      results.push({
        start_in_seq: start,
        end_in_seq: end,
        start_in_ref: adjRefStart,
        end_in_ref: adjRefEnd
      });
    }

    return results;
  }
}
