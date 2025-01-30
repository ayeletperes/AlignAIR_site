import { ModelLoader, ChainConfig } from '@components/model/utilities';
import { getFilePath } from '@components/utilities/getFilePath';
import { spawn } from 'child_process';
import * as tf from '@tensorflow/tfjs';

import express from 'express';
import path from 'path';

const app = express();
app.use('/models', express.static(path.resolve(__dirname, '../../../../public/models')));
const server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));

jest.setTimeout(20000);


describe('ModelLoader Integration Test', () => {
    
    let chainConfig: ChainConfig;

    beforeEach(() => {
      chainConfig = {
        name: 'heavy',
        k: 11,
        maxLength: 576,
        allowedMismatches: 0,
        modelPath: 'http://localhost:8080/models/alignair_heavy/model.json',
        modelMetadataPath: '/home/ayelet/Documents/AlignAIR_site/public/models/alignair_heavy/metadata.json',
        orientationModelPath: '/models/heavychain_ornt_pipeline.onnx',
      };
    });
  
    it('should load the main model, orientation model, and initialize candidate extractor', async () => {
      const loader = new ModelLoader(chainConfig);
  
      // Initialize the loader
      await loader.initialize();
  
      // Verify the main model was loaded
      const mainModel = loader.getModel();
      expect(mainModel).not.toBeNull();
      expect(mainModel).toBeInstanceOf(tf.GraphModel);
  
      // Verify the orientation model was loaded
      const orientationModel = loader.getOrientationModel();
      expect(orientationModel).not.toBeNull();
  
      // Verify the candidate extractor was initialized with references
      const candidateExtractor = loader.getCandidateExtractor();
      expect(candidateExtractor).not.toBeNull();
  
      // Verify that references are loaded
      const references = loader.getReferenceAlleles();
      if (!references) {
        throw new Error('References object is null');
      }
      expect(references).toBeDefined();
      for (const [key, value] of Object.entries(references.V || {})) {
        expect(value).toEqual(
          expect.objectContaining({
            sequence: expect.any(String),
          })
        );
      }
  
      console.log('All tests passed.');
    });
  
    it('should handle errors if a model fails to load', async () => {
        chainConfig.modelPath = 'http://localhost:8080/invalid/path/model.json';
        const loader = new ModelLoader(chainConfig);
      
        await expect(loader.loadModel()).rejects.toThrow(
          `Failed to load main model for ${chainConfig.name} chain from path: ${chainConfig.modelPath}`
        );
      });
  });

afterAll(() => {
    server.close();
});