import { loadModel } from '@components/preprocessing/steps/modelLoader';
import { BatchProcessor } from '@components/preprocessing/steps/batchProcessor';
import { cleanAndArrangePredictions, CleanedPredictions } from '@components/postprocessing/steps/cleanAndArrange';
import { correctSegmentsForPaddings } from '@components/postprocessing/steps/segmentCorrection';
import { applyMaxLikelihoodThresholds } from '@components/postprocessing/steps/maxLikelihoodThreshold';
import { AlleleAlignmentStep } from '@components/postprocessing/steps/germlineAlignment';
import { translateVCallToIuisNames } from '@components/postprocessing/steps/translateToIUIS';
import { logger } from '@components/utils/logger';

let cachedModel: any = null;
let cachedChain: string | null = null;

const updateProgress = async (progress: number, setProgress: (progress: number) => void, delayMs: number = 20) => {
  setProgress(progress);
  await new Promise((resolve) => setTimeout(resolve, delayMs));
};

export const submitAlignmentRequest = async (
  formData: {
    chain: 'heavy' | 'light';
    input: string;
    flag: 'file' | 'sequence';
    params: any;
    modelPath?: string;
    modelMetadataPath?: string;
    orientationModelPath?: string;
  },
  setProgress: (progress: number) => void
) => {
  try {
    const { chain, input, flag, params, modelPath, modelMetadataPath, orientationModelPath } = formData;
    const timingAnalysis: Record<string, number> = {};

    const stepStart = (stepName: string) => (timingAnalysis[stepName] = performance.now());
    const stepEnd = (stepName: string) => {
      timingAnalysis[stepName] = performance.now() - timingAnalysis[stepName];
    };
    stepStart('total');
    await updateProgress(10, setProgress);
    stepStart('loadModel');
    // Load the model only if the chain has changed or model is not cached
    if (cachedModel === null || cachedChain !== chain) {
      cachedChain = chain;
      const { loader, modelOutputNodes } = await loadModel({
        chain,
        modelPath,
        modelMetadataPath,
        orientationModelPath,
      });
      cachedModel = { loader, modelOutputNodes };
    }
    stepEnd('loadModel');
    const { loader, modelOutputNodes } = cachedModel;

    await updateProgress(20, setProgress);
    stepStart('batchProcessor');
    const { predictions, sequences } = await BatchProcessor({ chain, input, flag, loader });
    stepEnd('batchProcessor');
    await updateProgress(40, setProgress);
    stepStart('cleanAndArrangePredictions');
    const processedPredictions = cleanAndArrangePredictions({ predictions, modelOutputNodes, chain });
    stepEnd('cleanAndArrangePredictions');
    await updateProgress(60, setProgress);
    stepStart('correctSegmentsForPaddings');
    const processedSegments = correctSegmentsForPaddings({
      sequences,
      chain,
      v_sequence_start: processedPredictions.v_sequence_start,
      v_sequence_end: processedPredictions.v_sequence_end,
      d_sequence_start: processedPredictions.d_sequence_start,
      d_sequence_end: processedPredictions.d_sequence_end,
      j_sequence_start: processedPredictions.j_sequence_start,
      j_sequence_end: processedPredictions.j_sequence_end,
    });
    Object.assign(processedPredictions, processedSegments);
    stepEnd('correctSegmentsForPaddings');
    await updateProgress(70, setProgress);
    stepStart('applyMaxLikelihoodThresholds');
    const referenceMap = loader.getReferenceAlleles();
    const paramThresholds = { V: params.vThresh, D: params.dThresh, J: params.jThresh };
    const paramCaps = { V: params.vCap, D: params.dCap, J: params.jCap };
    
    const { selectedAlleleCalls, likelihoodsOfSelectedAlleles } = await applyMaxLikelihoodThresholds({
      chain,
      predictions: processedPredictions,
      referenceMap,
      paramThresholds,
      paramCaps,
    });
    
    ['V', 'D', 'J'].forEach((segment) => {
      processedPredictions[`${segment.toLowerCase()}_call` as keyof CleanedPredictions] = selectedAlleleCalls[segment];
      processedPredictions[`${segment.toLowerCase()}_likelihood` as keyof CleanedPredictions] = likelihoodsOfSelectedAlleles[segment];
    });
    stepEnd('applyMaxLikelihoodThresholds');
    await updateProgress(80, setProgress);
    stepStart('alleleAlignmentStep');
    const alignmentStep = new AlleleAlignmentStep('AlignAIRR Step');
    const germlineAlignments = alignmentStep.execute(chain, processedPredictions, referenceMap, Object.values(sequences));

    for (const segment of Object.keys(germlineAlignments)) {
      const segmentData = germlineAlignments[segment];

      if (segmentData && typeof segmentData === 'object') {
        const segmentRegions = Object.entries(segmentData);

        processedPredictions[`${segment}_germline_start` as keyof CleanedPredictions] = segmentRegions.map(
          ([, item]) => (item as { start_in_ref: number }).start_in_ref
        );

        processedPredictions[`${segment}_germline_end` as keyof CleanedPredictions] = segmentRegions.map(
          ([, item]) => (item as { end_in_ref: number }).end_in_ref
        );
      } else {
        logger.warn(`Skipping invalid or missing data for segment: ${segment}`);
      }
    }
    stepEnd('alleleAlignmentStep');
    await updateProgress(90, setProgress);
    stepStart('translateVCallToIuisNames');
    processedPredictions.v_call = translateVCallToIuisNames(processedPredictions.v_call, referenceMap.V);
    stepEnd('translateVCallToIuisNames');
    await updateProgress(100, setProgress);
    stepEnd('total');
    // Convert timing analysis to seconds
    Object.keys(timingAnalysis).forEach((key) => {
      timingAnalysis[key] = timingAnalysis[key] / 1000;
    });
    logger.log('Timing Analysis (in seconds):', timingAnalysis);

    return { processedPredictions, sequences, referenceMap };
  } catch (error) {
    logger.error('Error during alignment submission:', error);
    throw error;
  }
};




// export const submitAlignmentRequest = async (
//   formData: {
//     chain: 'heavy' | 'light';
//     input: string;
//     flag: 'file' | 'sequence';
//     params: any;
//     modelPath?: string;
//     modelMetadataPath?: string;
//     orientationModelPath?: string;
//   },
//   setProgress: (progress: number) => void
// ) => {
//   try {
//     const { chain, input, flag, params, modelPath, modelMetadataPath, orientationModelPath } = formData;

//     setProgress(10);
//     // Load model and metadata
//     const { loader, modelOutputNodes } = await loadModel({
//       chain,
//       modelPath,
//       modelMetadataPath,
//       orientationModelPath,
//     });

//     setProgress(20);
//     // Process batches and make predictions
//     const { predictions, sequences } = await BatchProcessor({ chain, input, flag, loader });

//     setProgress(30);
//     // Clean and arrange predictions
//     const processedPredictions = cleanAndArrangePredictions({ predictions, modelOutputNodes, chain });

//     setProgress(40);
//     // Correct segment positions
//     const processedSegments = correctSegmentsForPaddings({
//       sequences,
//       chain,
//       v_sequence_start: processedPredictions.v_sequence_start,
//       v_sequence_end: processedPredictions.v_sequence_end,
//       d_sequence_start: processedPredictions.d_sequence_start,
//       d_sequence_end: processedPredictions.d_sequence_end,
//       j_sequence_start: processedPredictions.j_sequence_start,
//       j_sequence_end: processedPredictions.j_sequence_end,
//     });

//     Object.assign(processedPredictions, processedSegments);

//     setProgress(50);
//     // Apply max likelihood thresholds
//     const referenceMap = loader.getReferenceAlleles();
//     const paramThresholds = { V: params.vThresh, D: params.dThresh, J: params.jThresh };
//     const paramCaps = { V: params.vCap, D: params.dCap, J: params.jCap };

//     const { selectedAlleleCalls, likelihoodsOfSelectedAlleles } = await applyMaxLikelihoodThresholds({
//       chain,
//       predictions: processedPredictions,
//       referenceMap,
//       paramThresholds,
//       paramCaps,
//     });

//     // Assign allele calls and likelihoods dynamically in a loop
//     ['V', 'D', 'J'].forEach(segment => {
//       processedPredictions[`${segment.toLowerCase()}_call` as keyof CleanedPredictions] = selectedAlleleCalls[segment];
//       processedPredictions[`${segment.toLowerCase()}_likelihood` as keyof CleanedPredictions] = likelihoodsOfSelectedAlleles[segment];
//     });

//     setProgress(60);
//     // Align with germline alleles
//     const alleleAlignmentStep = new AlleleAlignmentStep('AlignAIRR Step');
//     const sequenceToAlign = Object.values(sequences);
//     const germlineAlignments = alleleAlignmentStep.execute(processedPredictions, referenceMap, sequenceToAlign);

//     // Process germline alignments dynamically in a loop
//     for (const segment of Object.keys(germlineAlignments)) {
//       const segmentData = germlineAlignments[segment];

//       if (segmentData && typeof segmentData === 'object') {
//         const segmentRegions = Object.entries(segmentData);

//         processedPredictions[`${segment}_germline_start` as keyof CleanedPredictions] = segmentRegions.map(
//           ([, item]) => (item as { start_in_ref: number }).start_in_ref
//         );

//         processedPredictions[`${segment}_germline_end` as keyof CleanedPredictions] = segmentRegions.map(
//           ([, item]) => (item as { end_in_ref: number }).end_in_ref
//         );
//       } else {
//         logger.warn(`Skipping invalid or missing data for segment: ${segment}`);
//       }
//     }
//     setProgress(70);
//     // Translate v_calls to iuis
//     processedPredictions.v_call = translateVCallToIuisNames(processedPredictions.v_call, referenceMap['V']);
//     setProgress(100);
//     // Return results
//     return { processedPredictions, sequences, referenceMap };
//   } catch (error) {
//     logger.error('Error during alignment submission:', error);
//     throw error;
//   }
// };
