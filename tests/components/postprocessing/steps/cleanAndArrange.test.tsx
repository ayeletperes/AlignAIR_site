import { BatchProcessor, ProcessingParams } from '@components/preprocessing/steps/batchProcessor';
import { cleanAndArrangePredictions } from '@components/postprocessing/steps/cleanAndArrange';
import { loadModel } from '@components/preprocessing/steps/modelLoader';
import express from 'express';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node'; 
import fs from 'fs';
console.log(`Using backend: ${tf.getBackend()}`); // this will ensure that tensorflow Backend in registry


describe('processSequences with Predictions', () => {
  let server: any;

  beforeAll(() => {
    const app = express();
    app.use('/models', express.static(path.resolve(__dirname, '../../../../public/models')));
    app.use('/reference', express.static(path.resolve(__dirname, '../../../../public/reference')));
    server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
  });

  afterAll(() => {
    server.close();
  });

  it('should process and predict a single sequence', async () => {
    const input = 'CNGTTGCAGCTGGTGGAGTTGGGGGAGGCGTGGTCCAGCCTGGGGGGTCCCTGAGANTCTCCTGTGCAGCGTCTGGATTCACCNTCACCAGCTATGGCATGCACTGGGTCCGCCGGGCTCACAGGCAANGGGCTGGAGTGGGTGGCAGTTATATGCTATGATGGAATTAATACAGTACTATGCAGACTCCGTGAANGGCCGATTCACCATCTCCAGAGGCACTTCCANGAAAACGCTGTATCTGCAATTGAACAGCCTGAGNGCCGAGGACACGGCTGTGTATTAGTGTGCGAGAGACCTAGAGTTCCCATTGTTTCTTCCCGATGCCCTTGATATCTGGGGCCAAGGGACAATGGTCACCGTCTCTTCAG';
    const flag = 'sequence';
    const chain = 'heavy';
    const modelPath = 'http://localhost:8080/models/alignair_heavy/model.json';
    const modelMetadataPath = 'http://localhost:8080/models/alignair_heavy/metadata.json';
    const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/heavychain_ornt_pipeline.onnx';

    const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'heavy'});
    expect(processedPredictions).toBeDefined();
    expect(Object.keys(processedPredictions).length).toBeGreaterThan(0);
  });

  it('should process and predict batches from a file', async () => {
    const input = path.resolve(__dirname,'test-data/test_2.fasta');
    const flag = 'file';
    const chain = 'heavy';
    const modelPath = 'http://localhost:8080/models/alignair_heavy/model.json';
    const modelMetadataPath = 'http://localhost:8080/models/alignair_heavy/metadata.json';
    const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/heavychain_ornt_pipeline.onnx';

    
    const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'heavy'});
    
    const productive_values = processedPredictions['productive']
    expect(productive_values.length).toEqual(2);
    expect(productive_values).toEqual([1, 0]);
  });

  it('should process and predict batches of light chain', async () => {
    const input = 'GACGTCCAGATGACCCCGTCTCCATCCTTCCTGTCTGCATCTACAGGAGGCAGAGCCAATGTCGTTTACTGGGCAAGTGAGGACATTAATACGACTTTGGCCTGGTCTCTTCAGACCTAGGGCCATNCCCTCATNTCTTCCNCTTTGCTCCAAGAGATCTTCACCCTGGGGTGTCATCGAGCCTCAGTGNCGGTGGATCTGGGACAGATCTCACTCTGGCCGTCTTCAGCCCGGGGCCTGAAGAGTTTCCACNTTCTTCCTGTGAAGGAGACCNCAACTCTCCGTCACCTCCGGGCCAGGGACACGACAGGATATGAGCC';
    const flag = 'sequence';
    const chain = 'light';
    const modelPath = 'http://localhost:8080/models/alignair_light/model.json';
    const modelMetadataPath = 'http://localhost:8080/models/alignair_light/metadata.json';
    const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/lightchain_ornt_pipeline.onnx';
  
    
    const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    const processedPredictions = cleanAndArrangePredictions({predictions, modelOutputNodes, chain:'light'});
    console.log(processedPredictions);
    const productive_values = processedPredictions['productive']
    expect(productive_values).toEqual(0);
  });
});
