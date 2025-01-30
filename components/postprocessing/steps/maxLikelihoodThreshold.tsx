
import * as tf from '@tensorflow/tfjs';
import { getAlleles } from '@components/postprocessing/alleleselector/maxLikelihoodPercentageThreshold';
import { DEFAULT_MAX_LIKELIHOOD_CONFIG } from '@components/postprocessing/steps/config';
import { CleanedPredictions } from '@components/postprocessing/steps/cleanAndArrange';
import { Allele, Segment } from '@components/reference/utilities';
import { logger } from '@components/utils/logger';

interface extractLikelihoodParams {
  alleles: Record<string, any>;
  thresholds: Record<string, number>;
  caps: Record<string, number> ;
  referenceMap: Record<string, Segment>;
}


const extractLikelihoodsAndLabelsFromCalls = async (params: extractLikelihoodParams): Promise<[Record<string, string[][]>, Record<string, number[][]>]> => {
  const { alleles, thresholds, caps, referenceMap } = params;
  const predictedAlleles: Record<string, string[][]> = {};
  const predictedAlleleLikelihoods: Record<string, number[][]> = {};

  for (const segment in alleles) {
    // Ensure the reference map aligns with the segment
    
    const referenceSegmentMap = Object.keys(referenceMap[segment]);
    
    if (segment === 'D') {
      referenceSegmentMap.push('Short-D');
    }

    if (!referenceSegmentMap) {
      console.error(`Reference map missing for segment: ${segment}`);
      continue;
    }

    // Process the alleles and thresholds
    const allelesArray = Array.isArray(alleles[segment]) ? alleles[segment][0] : alleles[segment];
    
    const selectedAlleles = await getAlleles(
      allelesArray,
      referenceSegmentMap,
      thresholds[segment],
      caps[segment]
    );

    predictedAlleles[segment] = selectedAlleles.map(([names]) => names);
    predictedAlleleLikelihoods[segment] = selectedAlleles.map(([, likelihoods]) => likelihoods);
  }

  return [predictedAlleles, predictedAlleleLikelihoods];
};




interface maxLikelihoodParams {
  chain: string;
  predictions: CleanedPredictions;
  referenceMap: Record<string, Segment>;
  paramThresholds: Record<string, number>;
  paramCaps: Record<string, number>;
}

export const applyMaxLikelihoodThresholds = async (params: maxLikelihoodParams): Promise<any> => {
  const {
    chain,
    predictions,
    referenceMap,
    paramThresholds = params.paramThresholds ?? DEFAULT_MAX_LIKELIHOOD_CONFIG.thresholds!,
    paramCaps = params.paramCaps ?? DEFAULT_MAX_LIKELIHOOD_CONFIG.caps!,
      } = params;

  logger.log("Applying Max Likelihood thresholds...");

  let alleles;
  if(chain === 'light') {
    alleles = {
      V: predictions.v_allele,
      J: predictions.j_allele,
    };
  }else{
    alleles = {
      V: predictions.v_allele,
      J: predictions.j_allele,
      D: predictions.d_allele,
    };
  }
  
 
  const [selectedAlleleCalls, likelihoodsOfSelectedAlleles] = await extractLikelihoodsAndLabelsFromCalls({
    alleles,
    thresholds: paramThresholds,
    caps: paramCaps,
    referenceMap
  });

  return {selectedAlleleCalls, likelihoodsOfSelectedAlleles};
};