class HeuristicReferenceMatcher {
    constructor(referenceAlleles) {
        this.referenceAlleles = referenceAlleles;
    }

    static hammingDistance(s1, s2) {
        let distance = 0;
        const lengthDifference = Math.abs(s1.length - s2.length);
        const minLength = Math.min(s1.length, s2.length);
        for (let i = 0; i < minLength; i++) {
            if (s1[i] !== s2[i]) distance++;
        }
        return distance + lengthDifference;
    }

    AA_Score(s1, s2) {
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

    alignWithGermline(shortSegment, refSeq, k = 20, s = 25) {
        if (shortSegment.length < 20) return [-1, -1];

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

    match(sequences, starts, ends, alleles, k = 15, s = 30) {
        const results = [];
        const totalSequences = sequences.length;

        sequences.forEach((sequence, index) => {
            const start = starts[index];
            const end = ends[index];
            const allele = alleles[index];
            const segmentedSequence = sequence.slice(start, end);
            const referenceSequence = this.referenceAlleles[allele];
            const segmentLength = end - start;
            const referenceLength = referenceSequence.length;
            let matchFound = false;

            if (segmentLength === referenceLength) {
                results.push({
                    start_in_seq: start,
                    end_in_seq: end,
                    start_in_ref: 0,
                    end_in_ref: referenceLength
                });
            } else if (segmentLength > referenceLength) {
                const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
                results.push({
                    start_in_seq: start,
                    end_in_seq: end,
                    start_in_ref: refStart,
                    end_in_ref: refEnd
                });
            } else if (segmentLength < referenceLength) {
                const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
                if (refStart !== null) {
                    results.push({
                        start_in_seq: start,
                        end_in_seq: end,
                        start_in_ref: refStart,
                        end_in_ref: refEnd
                    });
                } else {
                    throw new Error('Error in alignment');
                }
            }
        });

        return results;
    }
}


const matcher = new HeuristicReferenceMatcher(referenceAlleles);
const sequences = ['CTGCACACATTTTTTCCAACCAAGATAAATGCTACAGGACATCTCTGAAGACCTGACTCGCCATCTCCACGGACAATTCCAACAGCCTGGTGGTCCTTGCCNTGAATNATATGGACCCTGTGGAAACANCCAGATATGACTGATCACGGGTCTCCTTCACAAATTNGCACTACTTTAAAGTTGGAGACGTCTGGGGCCAAGAGACTACGATCACCGCCTCTTCAT'];
const starts = [0, 4];
const ends = [151, 292];
const alleles = ['IGHVF1-G1*03'];

const results = matcher.match(sequences, starts, ends, alleles);
console.log(results);
