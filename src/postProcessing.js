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
        const padSize = extratSegmentation.calculatePadSize(sequence, maxLength);
        
        return segmenSize-padSize;
    };
    
}

export class extratProductivity {
    
    static async assesProductivity(prediction){
        
        const productive = await prediction.arraySync() > 0.5;
        
        return productive;
    };
    
}
