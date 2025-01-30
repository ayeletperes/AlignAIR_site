import { BatchProcessor, ProcessingParams } from '@components/preprocessing/steps/batchProcessor';
import {inspectModel} from '@components/preprocessing/orientation/utilities'; 
import { loadModel } from '@components/preprocessing/steps/modelLoader';
import express from 'express';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs-node'; 
import fs from 'fs';
console.log(`Using backend: ${tf.getBackend()}`); // this will ensure that tensorflow Backend in registry


// describe('processSequences with Predictions', () => {
//   let server: any;
//   const chain = 'heavy';
//   const modelPath = 'http://localhost:8080/models/alignair_heavy/model.json';
//   const modelMetadataPath = 'http://localhost:8080/models/alignair_heavy/metadata.json';
//   const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/heavychain_ornt_pipeline.onnx';

//   beforeAll(() => {
//     const app = express();
//     app.use('/models', express.static(path.resolve(__dirname, '../../../../public/models')));
//     app.use('/reference', express.static(path.resolve(__dirname, '../../../../public/reference')));
//     server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
//   });

//   afterAll(() => {
//     server.close();
//   });

//   it('should process and predict a single sequence', async () => {
//     const input = 'CNGTTGCAGCTGGTGGAGTTGGGGGAGGCGTGGTCCAGCCTGGGGGGTCCCTGAGANTCTCCTGTGCAGCGTCTGGATTCACCNTCACCAGCTATGGCATGCACTGGGTCCGCCGGGCTCACAGGCAANGGGCTGGAGTGGGTGGCAGTTATATGCTATGATGGAATTAATACAGTACTATGCAGACTCCGTGAANGGCCGATTCACCATCTCCAGAGGCACTTCCANGAAAACGCTGTATCTGCAATTGAACAGCCTGAGNGCCGAGGACACGGCTGTGTATTAGTGTGCGAGAGACCTAGAGTTCCCATTGTTTCTTCCCGATGCCCTTGATATCTGGGGCCAAGGGACAATGGTCACCGTCTCTTCAG';
//     const flag = 'sequence';
    
//     inspectModel(orientationModelPath);
//     const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
//     const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});

//     const logFilePath = path.resolve(__dirname, 'logs/predictions.log');
//     fs.writeFileSync(logFilePath, '', 'utf8');
//     const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
//     await new Promise<void>((resolve, reject) => {
//       predictions.map((pred: any) => {
//         pred.map((tensor: any) => {
//           logStream.write(`Tensor: ${JSON.stringify(tensor)}\n`);
//           logStream.write(`ArraySync: ${JSON.stringify(tensor.arraySync())}\n`);
//         });
//       });
  
//       // Close the stream and resolve when done
//       logStream.end((err: any) => {
//         if (err) return reject(err);
//         console.log('Logging complete. Data written to predictions.log');
//         resolve();
//       });
//     });

//     expect(predictions).toBeDefined();
//     expect(sequences).toBeDefined();
//     expect(predictions.length).toBeGreaterThan(0);
//   });

//   it('should process and predict batches from a file', async () => {
//     //const input = path.resolve(__dirname,'test-data/test_2.fasta');
//     const input = path.resolve(__dirname, 'test-data/test_2.fasta');
//     const flag = 'file';   
//     const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
//     const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
//     expect(predictions).toBeDefined();
//     expect(sequences).toBeDefined();
//     expect(predictions.length).toBeGreaterThan(0);
//     // expect(sequences.length).toBeGreaterThan(0);
//   });

//   it('should process and predict batches from a file when batch size is smaller then number of sequences', async () => {
//     const input = path.resolve(__dirname,'test-data/test_3.fasta');
//     const flag = 'file';
    
//     const { loader, modelOutputNodes } = await loadModel({chain, modelPath, modelMetadataPath, orientationModelPath});
//     const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader, batchSize: 2});
//     expect(predictions).toBeDefined();
//     expect(sequences).toBeDefined();
//     expect(predictions.length).toBeGreaterThan(0);
//     // expect(sequences.length).toBeGreaterThan(0);
//   });

// });


describe('processSequences with Predictions for light chain', () => {
  let server: any;
  const chain = 'light';
  const modelPath = 'http://localhost:8080/models/alignair_light/model.json';
  const modelMetadataPath = 'http://localhost:8080/models/alignair_light/metadata.json';
  const orientationModelPath = '/home/ayelet/Documents/AlignAIR_site/public/models/lightchain_ornt_pipeline.onnx';

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
    const input = 'GACGTCCAGATGACCCCGTCTCCATCCTTCCTGTCTGCATCTACAGGAGGCAGAGCCAATGTCGTTTACTGGGCAAGTGAGGACATTAATACGACTTTGGCCTGGTCTCTTCAGACCTAGGGCCATNCCCTCATNTCTTCCNCTTTGCTCCAAGAGATCTTCACCCTGGGGTGTCATCGAGCCTCAGTGNCGGTGGATCTGGGACAGATCTCACTCTGGCCGTCTTCAGCCCGGGGCCTGAAGAGTTTCCACNTTCTTCCTGTGAAGGAGACCNCAACTCTCCGTCACCTCCGGGCCAGGGACACGACAGGATATGAGCC';
    const flag = 'sequence';
    
    const { loader, modelOutputNodes } = await loadModel({chain:chain, modelPath:modelPath, modelMetadataPath:modelMetadataPath, orientationModelPath:orientationModelPath});
    const { predictions, sequences } = await BatchProcessor({chain, input, flag, loader});
    const { modelInput, modelOutput } = loader.getModelIO(true);
    const logFilePath = path.resolve(__dirname, 'logs/predictions_light.log');
    fs.writeFileSync(logFilePath, '', 'utf8');
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });
    await new Promise<void>((resolve, reject) => {
      predictions.map((pred: any) => {
      pred.map((tensor: any, index: number) => {
        logStream.write(`Model Output Name: ${loader.model.outputs[index].name}\n`);
        logStream.write(`Model Output shape: ${tensor.shape}\n`);
        logStream.write(`Tensor Value: ${JSON.stringify(tensor.arraySync())}\n`);
      });
      });
  
      // Close the stream and resolve when done
      logStream.end((err: any) => {
        if (err) return reject(err);
        console.log('Logging complete. Data written to predictions.log');
        resolve();
      });
    });

    expect(predictions).toBeDefined();
    expect(sequences).toBeDefined();
    expect(predictions.length).toBeGreaterThan(0);
  });
});
