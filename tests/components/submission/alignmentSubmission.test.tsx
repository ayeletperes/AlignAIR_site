import {submitAlignmentRequest} from '@components/submission/alignmentSubmission';

import express from 'express';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node'; 
import fs from 'fs';
console.log(`Using backend: ${tf.getBackend()}`); // this will ensure that tensorflow Backend in registry

// global params for the test
describe('processSequences with Predictions', () => {
  let server: any;

  beforeAll(() => {
    const app = express();
    app.use('/models', express.static(path.resolve(__dirname, '../../../public/models')));
    app.use('/reference', express.static(path.resolve(__dirname, '../../../public/reference')));
    server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
  });

  afterAll(() => {
    server.close();
  });

  it('should process and predict a single sequence', async () => {
    const chain = 'heavy';
    const modelPath = 'http://localhost:8080/models/alignair_heavy/model.json';
    const modelMetadataPath = 'http://localhost:8080/models/alignair_heavy/metadata.json';
    const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/heavychain_ornt_pipeline.onnx';
    const input = 'CNGTTGCAGCTGGTGGAGTTGGGGGAGGCGTGGTCCAGCCTGGGGGGTCCCTGAGANTCTCCTGTGCAGCGTCTGGATTCACCNTCACCAGCTATGGCATGCACTGGGTCCGCCGGGCTCACAGGCAANGGGCTGGAGTGGGTGGCAGTTATATGCTATGATGGAATTAATACAGTACTATGCAGACTCCGTGAANGGCCGATTCACCATCTCCAGAGGCACTTCCANGAAAACGCTGTATCTGCAATTGAACAGCCTGAGNGCCGAGGACACGGCTGTGTATTAGTGTGCGAGAGACCTAGAGTTCCCATTGTTTCTTCCCGATGCCCTTGATATCTGGGGCCAAGGGACAATGGTCACCGTCTCTTCAG';
    const flag = 'sequence';
    const { processedPredictions, sequences } = await submitAlignmentRequest({
      chain: chain,
      input: input,
      flag: flag,
      params: {vThresh:0.75, dThresh:0.3, jThresh:0.8, vCap:3, dCap:3, jCap:3},
      modelPath: modelPath,
      modelMetadataPath: modelMetadataPath,
      orientationModelPath: orientationModelPath
    }, (progress: number) => {
      console.log(`Progress: ${progress}%`);
    });

    console.log(processedPredictions);
    console.log(sequences);

  });

  it('should process and predict a single sequence', async () => {
    const chain = 'light';
    const modelPath = 'http://localhost:8080/models/alignair_light/model.json';
    const modelMetadataPath = 'http://localhost:8080/models/alignair_light/metadata.json';
    const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/lightchain_ornt_pipeline.onnx';
    const input = 'TCGATGTNGCAGCCTTGGGCTGACCCTAGGACGGTCANCTCCGTCTAACGAGCACCACTATAGGAGAGCAAGCAATNATACTCAGCCTCATCATCAGGCTGCGCACCCGAAAGGGTCAGGCCAGCTATGCCCCCAAGGAGGGAGCCTGAGAACCGGGCAGGGGTCCAGGAGTGATTGTTGCTCGTCTCGTCAATCAGTGTCCTGGGGGCTTGGCCTGGCTTGTGCTGGAGGCANAAGGGATAATGACCACTGGCGGCAGCTCCAGTNTTGGAGCCACAAGGGAGAGTGACTNTCCCTCCCGGGGACACAGTCAGTGAGGGCCCCTGAGTCACCACAGTCTT';
    const flag = 'sequence';
    const { processedPredictions, sequences } = await submitAlignmentRequest({
      chain: chain,
      input: input,
      flag: flag,
      params: {vThresh:0.75, dThresh:0.3, jThresh:0.8, vCap:3, dCap:3, jCap:3},
      modelPath: modelPath,
      modelMetadataPath: modelMetadataPath,
      orientationModelPath: orientationModelPath
    }, (progress: number) => {
      console.log(`Progress: ${progress}%`);
    });

    console.log(processedPredictions);
    console.log(sequences);

  });

  // it('should process and predict batches from a file', async () => {
  //   const input = path.resolve(__dirname,'test-data/test_2.fasta');
  //   const flag = 'file';
  //   const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
  //   const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
  //   expect(predictions).toBeDefined();
  //   expect(sequences).toBeDefined();
  //   const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'heavy'});
  //   const productive_values = processedPredictions['productive'].arraySync()
  //   expect(productive_values.length).toEqual(2);
  //   expect(productive_values).toEqual([1, 0]);
  //   const { v_sequence_start, v_sequence_end, d_sequence_start, d_sequence_end, j_sequence_start, j_sequence_end } = processedPredictions;
  //   const processedSegments = correctSegmentsForPaddings({sequences, chain:'heavy', v_sequence_start, v_sequence_end, d_sequence_start, d_sequence_end, j_sequence_start, j_sequence_end });
  //   processedPredictions.v_sequence_start = processedSegments.v_sequence_start;
  //   processedPredictions.v_sequence_end = processedSegments.v_sequence_end;
  //   processedPredictions.d_sequence_start = processedSegments.d_sequence_start;
  //   processedPredictions.d_sequence_end = processedSegments.d_sequence_end;
  //   processedPredictions.j_sequence_start = processedSegments.j_sequence_start;
  //   processedPredictions.j_sequence_end = processedSegments.j_sequence_end;
  //   expect(processedPredictions).toBeDefined();
  //   expect(processedPredictions.v_sequence_start).toEqual([0, 0]);
  //   expect(processedPredictions.v_sequence_end).toEqual([294, 304]);
  //   expect(processedPredictions.j_sequence_start).toEqual([312, 332]);
  //   expect(processedPredictions.j_sequence_end).toEqual([370, 385]);
  //   expect(processedPredictions.d_sequence_start).toEqual([303, 312]);
  //   expect(processedPredictions.d_sequence_end).toEqual([311, 328]);
  //   const referenceMap = loader.getReferenceAlleles();
  //   const {selectedAlleleCalls, likelihoodsOfSelectedAlleles} = await applyMaxLikelihoodThresholds({
  //       chain:chain,
  //       predictions: processedPredictions,
  //       referenceMap: referenceMap,
  //       paramThresholds: paramThresholds,
  //       paramCaps: paramCaps
  //   });
    
  //   expect(selectedAlleleCalls['V'][0]).toEqual(["IGHVF5-G15*01"]);
  //   expect(selectedAlleleCalls['D'][0]).toEqual(["IGHD4-4*01","IGHD4-11*01"]);
  //   expect(selectedAlleleCalls['V'][1]).toEqual(["IGHVF2-G4*02"]);
  //   expect(selectedAlleleCalls['D'][1]).toEqual(["IGHD3-22*01"]);
    

  //   processedPredictions.v_call = selectedAlleleCalls['V'];
  //   processedPredictions.j_call = selectedAlleleCalls['J'];
  //   processedPredictions.v_likelihood = likelihoodsOfSelectedAlleles['V'];
  //   processedPredictions.j_likelihood = likelihoodsOfSelectedAlleles['J'];

  //   if(chain === 'heavy') {
  //     processedPredictions.d_call = selectedAlleleCalls['D'];
  //     processedPredictions.d_likelihood = likelihoodsOfSelectedAlleles['D'];
  //   }

  //   const alleleAlignmentStep = new AlleleAlignmentStep('AlignAIRR Step');
  //   const sequenceToAlign = Object.values(sequences);
  //   const germlineAlignments = alleleAlignmentStep.execute(processedPredictions, referenceMap, sequenceToAlign);
    
  //   for (const segment of Object.keys(germlineAlignments)) {
  //     const segmentData = germlineAlignments[segment];
      
  //     if (segmentData && typeof segmentData === 'object') {
  //       const segmentRegions = Object.entries(segmentData);
    
  //       // Map over the regions to extract start and end
  //       processedPredictions[`${segment}_germline_start` as keyof CleanedPredictions] = segmentRegions.map(
  //         ([, item]) => (item as { start_in_ref: number })["start_in_ref"]
  //       );
    
  //       processedPredictions[`${segment}_germline_end` as keyof CleanedPredictions] = segmentRegions.map(
  //         ([, item]) => (item as { end_in_ref: number })["end_in_ref"]
  //       );
  //     } else {
  //       console.warn(`Skipping invalid or missing data for segment: ${segment}`);
  //     }
  //   }

  //   console.log(processedPredictions);
  // });

});
