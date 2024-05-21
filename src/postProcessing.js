import * as tf from "@tensorflow/tfjs";

export class extractAllele {
    // get the annotation for each allele based on percentage and cap
    static async dynamicCumulativeConfidenceThreshold(prediction, percentage = 0.9, cap = 3, AlleleCallOHE){
        
        const array = await prediction.array();
        const flattenedArray = array.flat();
        const valueIndexPairs = flattenedArray
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .slice(0, cap);
        const totalConfidence = valueIndexPairs.reduce((sum, pair) => sum + pair.value, 0);
        const threshold = percentage * totalConfidence;

        let cumulativeConfidence = 0.0;
        const selectedLabels = [];

        for (const pair of valueIndexPairs) {
        cumulativeConfidence += pair.value;
        selectedLabels.push(pair.index);
        if (cumulativeConfidence >= threshold || selectedLabels.length >= cap) {
            break;
        }
        }

        return selectedLabels.map(index => ({
        index: AlleleCallOHE[index].name,
        prob: flattenedArray[index]
        }));
        
    };
}

export class HeuristicReferenceMatcher {
    
    constructor(referenceAlleles, segmentThreshold = 0.2) {
        this.referenceAlleles = referenceAlleles;
        this.segmentThreshold = segmentThreshold;
    }

    static async extractValueIndices(tensor, threshold = 0.3) {
        const array = await tensor.array();
        const indices = array.map((value, index) => value > threshold ? index : -1);
        return indices;
    }

    static async applySegmentThresholding(segments, t = 0.3) {
        
        const mask = await segments.map(async row => HeuristicReferenceMatcher.extractValueIndices(row, t));
        console.log(mask);
        const firstIndices = Array(mask.length).fill(-1);
        const lastIndices = Array(mask.length).fill(-1);

        mask.forEach((row, i) => {
            const trueIndices = row.reduce((indices, value, index) => {
                if (value) indices.push(index);
                return indices;
            }, []);
            if (trueIndices.length > 0) {
                firstIndices[i] = trueIndices[0];
                lastIndices[i] = trueIndices[trueIndices.length - 1];
            }
        });

        return [firstIndices, lastIndices];
    }

    static hammingDistance(s1, s2) {
        const lengthDifference = Math.abs(s1.length - s2.length);
        const minLength = Math.min(s1.length, s2.length);
        let distance = lengthDifference;

        for (let i = 0; i < minLength; i++) {
            if (s1[i] !== s2[i]) {
                distance++;
            }
        }

        return distance;
    }

    static calculatePadSize(sequence, maxLength = 512) {
        const totalPadding = maxLength - sequence.length;
        const padSize = Math.floor(totalPadding / 2);

        return padSize;
    }

    AA_Score(s1, s2) {
        let alignmentScore = 0;
        let velocity = 0;
        const acceleration = 0.05;
        let lastMatch = null;

        for (let i = 0; i < s1.length; i++) {
            const isMatch = s1[i] === s2[i];
            let scoreChange;

            if (isMatch) {
                if (lastMatch) {
                    velocity += acceleration;
                } else {
                    velocity = acceleration;
                }
                scoreChange = -1 - velocity;
            } else {
                if (lastMatch === false) {
                    velocity += acceleration;
                } else {
                    velocity = acceleration;
                }
                scoreChange = 1 + velocity;
            }

            alignmentScore += scoreChange;
            lastMatch = isMatch;
        }

        return alignmentScore;
    }

    alignWithGermline(shortSegment, refSeq, k = 20, s = 25) {
        if (shortSegment.length < 20) {
            return [false, -1, -1];
        }

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
                if (minDifference === 0) {
                    break;
                }
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
                if (difference === 0) {
                    break;
                }
            }
        }

        return [bestStartPos, bestEndPos];
    }

    match(sequences, segments, alleles, k = 15, s = 30, threshold = 0.1, maxSequenceLength = 576) {
        const [starts, ends] = HeuristicReferenceMatcher.applySegmentThresholding(segments, threshold);
        const paddingSizes = sequences.map(seq => HeuristicReferenceMatcher.calculatePadSize(seq, maxSequenceLength));

        const adjustedStarts = starts.map((start, index) => Math.max(0, start - paddingSizes[index]));
        const adjustedEnds = ends.map((end, index) => Math.max(0, end - paddingSizes[index]));

        const results = [];

        sequences.forEach((sequence, index) => {
            const start = adjustedStarts[index];
            const end = adjustedEnds[index];
            const allele = alleles[index];
            const segmentedSequence = sequence.slice(start, end);
            const referenceSequence = this.referenceAlleles[allele];
            const segmentLength = end - start;
            const referenceLength = referenceSequence.length;

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
                    throw new Error('Error');
                }
            }
        });

        return results;
    }
}
