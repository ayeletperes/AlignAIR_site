import { loadModel } from '@components/preprocessing/steps/modelLoader';
import { BatchProcessor, ProcessingParams } from '@components/preprocessing/steps/batchProcessor';
import { cleanAndArrangePredictions } from '@components/postprocessing/steps/cleanAndArrange';
import { correctSegmentsForPaddings } from '@components/postprocessing/steps/segmentCorrection';
import { applyMaxLikelihoodThresholds } from '@components/postprocessing/steps/maxLikelihoodThreshold';

import express from 'express';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node'; 
import fs from 'fs';
console.log(`Using backend: ${tf.getBackend()}`); // this will ensure that tensorflow Backend in registry

const tensorToArray = (tensor: tf.Tensor): number[] => tensor.arraySync() as number[];

// global params for the test
const chain = 'heavy';
const modelPath = 'http://localhost:8080/models/alignair_heavy/model.json';
const modelMetadataPath = '/home/ayelet/Documents/AlignAIR_site/public/models/alignair_heavy/metadata.json';
const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/heavychain_ornt_pipeline.onnx';
const paramThresholds = {V:0.75, D:0.3, J:0.8};
const paramCaps = {V:3, D:3, J:3};

describe('processSequences with Predictions', () => {
  let server: any;

  beforeAll(() => {
    const app = express();
    app.use('/models', express.static(path.resolve(__dirname, '../../../../public/models')));
    server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
  });

  afterAll(() => {
    server.close();
  });

  it('should process and predict a single sequence', async () => {
    const input = 'CNGTTGCAGCTGGTGGAGTTGGGGGAGGCGTGGTCCAGCCTGGGGGGTCCCTGAGANTCTCCTGTGCAGCGTCTGGATTCACCNTCACCAGCTATGGCATGCACTGGGTCCGCCGGGCTCACAGGCAANGGGCTGGAGTGGGTGGCAGTTATATGCTATGATGGAATTAATACAGTACTATGCAGACTCCGTGAANGGCCGATTCACCATCTCCAGAGGCACTTCCANGAAAACGCTGTATCTGCAATTGAACAGCCTGAGNGCCGAGGACACGGCTGTGTATTAGTGTGCGAGAGACCTAGAGTTCCCATTGTTTCTTCCCGATGCCCTTGATATCTGGGGCCAAGGGACAATGGTCACCGTCTCTTCAG';
    const flag = 'sequence';
    const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'heavy'});
    expect(processedPredictions).toBeDefined();
    expect(Object.keys(processedPredictions).length).toBeGreaterThan(0);
    const { v_start, v_end, d_start, d_end, j_start, j_end } = processedPredictions;
    const processedSegments = correctSegmentsForPaddings({sequences, chain:'heavy', v_start, v_end, d_start, d_end, j_start, j_end });
    processedPredictions.v_start = processedSegments.v_start;
    processedPredictions.v_end = processedSegments.v_end;
    processedPredictions.d_start = processedSegments.d_start;
    processedPredictions.d_end = processedSegments.d_end;
    processedPredictions.j_start = processedSegments.j_start;
    processedPredictions.j_end = processedSegments.j_end;
    expect(processedPredictions).toBeDefined();
    expect(Object.keys(processedPredictions).length).toBeGreaterThan(0);
    expect(processedPredictions.v_start).toEqual([0]);
    expect(processedPredictions.v_end).toEqual([297]);
    expect(processedPredictions.j_start).toEqual([322]);
    expect(processedPredictions.j_end).toEqual([371]);
    expect(processedPredictions.d_start).toEqual([306]);
    expect(processedPredictions.d_end).toEqual([313]);
    const referenceMap = loader.getReferenceAlleles();
    const {selectedAlleleCalls, likelihoodsOfSelectedAlleles} = await applyMaxLikelihoodThresholds({
        chain:chain,
        predictions: processedPredictions,
        referenceMap: referenceMap,
        paramThresholds: paramThresholds,
        paramCaps: paramCaps
    });
    
    expect(selectedAlleleCalls['V'][0]).toEqual(["IGHVF10-G37*10"]);
    expect(selectedAlleleCalls['J'][0]).toEqual(["IGHJ3*02"]);
    expect(selectedAlleleCalls['D'][0]).toEqual(["IGHD2-21*01","IGHD1-20*01","IGHD1-7*01"]);
    
  });

  it('should process and predict batches from a file', async () => {
    const input = path.resolve(__dirname,'test-data/test_2.fasta');
    const flag = 'file';
    const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'heavy'});
    const productive_values = processedPredictions['productive'].arraySync()
    expect(productive_values.length).toEqual(2);
    expect(productive_values).toEqual([1, 0]);
    const { v_start, v_end, d_start, d_end, j_start, j_end } = processedPredictions;
    const processedSegments = correctSegmentsForPaddings({sequences, chain:'heavy', v_start, v_end, d_start, d_end, j_start, j_end });
    processedPredictions.v_start = processedSegments.v_start;
    processedPredictions.v_end = processedSegments.v_end;
    processedPredictions.d_start = processedSegments.d_start;
    processedPredictions.d_end = processedSegments.d_end;
    processedPredictions.j_start = processedSegments.j_start;
    processedPredictions.j_end = processedSegments.j_end;
    expect(processedPredictions.v_start).toEqual([0, 0]);
    expect(processedPredictions.v_end).toEqual([294, 304]);
    expect(processedPredictions.j_start).toEqual([312, 332]);
    expect(processedPredictions.j_end).toEqual([370, 385]);
    expect(processedPredictions.d_start).toEqual([303, 312]);
    expect(processedPredictions.d_end).toEqual([311, 328]);
    const referenceMap = loader.getReferenceAlleles();
    const {selectedAlleleCalls, likelihoodsOfSelectedAlleles} = await applyMaxLikelihoodThresholds({
        chain:chain,
        predictions: processedPredictions,
        referenceMap: referenceMap,
        paramThresholds: paramThresholds,
        paramCaps: paramCaps
    });
    
    expect(selectedAlleleCalls['V'][0]).toEqual(["IGHVF5-G15*01"]);
    expect(selectedAlleleCalls['D'][0]).toEqual(["IGHD4-4*01","IGHD4-11*01"]);
    expect(selectedAlleleCalls['V'][1]).toEqual(["IGHVF2-G4*02"]);
    expect(selectedAlleleCalls['D'][1]).toEqual(["IGHD3-22*01"]);
    
  });

});
