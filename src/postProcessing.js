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
        const alleles = [];
        const probability = [];
        for (const pair of valueIndexPairs) {
        cumulativeConfidence += pair.value;
        alleles.push(AlleleCallOHE[pair.index].name);
        probability.push(flattenedArray[pair.index]);
        if (cumulativeConfidence >= threshold || alleles.length >= cap) {
            break;
        }
        }

        return ({
            index: alleles,
            prob: probability
        });
        
    };
}

export class extratSegmentation {
    
    static calculatePadSize(sequence, maxLength = 576) {
        const totalPadding = maxLength - sequence.length;
        const padSize = Math.floor(totalPadding / 2);

        return padSize;
    }

    static async calculateSegment(prediction, sequence, maxLength = 576){
        
        const segmenSize = Math.round(await prediction.arraySync());
        const padSize = this.calculatePadSize(sequence, maxLength);
        
        return segmenSize-padSize;
    };
    
    
}

export class extractGermline {
    
    static calculatePadSize(sequence, maxLength = 576) {
        const totalPadding = maxLength - sequence.length;
        const padSize = Math.floor(totalPadding / 2);

        return padSize;
    }

    static AA_Score(s1, s2) {
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

    static alignWithGermline(shortSegment, refSeq, k = 20, s = 25) {
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

    static HeuristicReferenceMatcher({results, segment, referenceAlleles, call_id=0, k = 15, s = 30}) {
        // get the alignment of the sequence.
        
        const segmentedSequence = results.sequence.slice(results[`${segment}_sequence_start`], results[`${segment}_sequence_end`]);
        const segmentLength = segmentedSequence.length
        const call = results[`${segment}_call`][call_id];
        const referenceSequence = referenceAlleles[call];
        const referenceLength = referenceSequence.length;
       
        if (segmentLength === referenceLength) {
            return({
                [segment+'_germline_start']: 0,
                [segment+'_germline_end']: referenceLength
            });
        } else if (segmentLength > referenceLength) {
            const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
            return({
                [segment+'_germline_start']: refStart,
                [segment+'_germline_end']: refEnd
            });
        } else if (segmentLength < referenceLength) {
            const [refStart, refEnd] = this.alignWithGermline(segmentedSequence, referenceSequence, k, s);
            if (refStart !== null) {
                return({
                    [segment+'_germline_start']: refStart,
                    [segment+'_germline_end']: refEnd
                });
            } else {
                throw new Error('Error in alignment');
            }
        }
    }

    static getGermlineSequence({results, segment, referenceAlleles, call_id=0, k = 15, s = 30}) {
        const { [segment+'_germline_start']: refStart, [segment+'_germline_end']: refEnd } = this.HeuristicReferenceMatcher({results, segment, referenceAlleles, call_id, k, s});
        const call = results[`${segment}_call`][call_id];
        const referenceSequence = referenceAlleles[call];
        return referenceSequence.slice(refStart, refEnd);
    }
}

export class extratProductivity {
    
    static async assesProductivity(prediction){
        
        const productive = await prediction.arraySync() > 0.5;
        
        return productive;
    };
    
}
