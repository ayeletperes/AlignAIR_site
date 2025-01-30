import express from 'express';
import path from 'path';
import fs from 'fs';
import { ModelLoader, ChainConfig } from '@components/model/utilities';
import { FastKmerDensityExtractor } from '@components/preprocessing/longsequences/fastKmerDensityExtractor';
import { model } from '@tensorflow/tfjs';

jest.setTimeout(20000);

const parseSequences = (filePath: string): { test: string[], expected: string[] } => {
  // Read the file
  const content = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(content);

  // Initialize arrays for test and expected sequences
  const testSequences: string[] = [];
  const expectedSequences: string[] = [];

  // Iterate over the JSON data
  jsonData.forEach((pair: [string, string]) => {
    const [expected, test] = pair;
    expectedSequences.push(expected);
    testSequences.push(test);
  });

  return { test: testSequences, expected: expectedSequences };
};

describe('FastKmerDensityExtractor - transformHolt', () => {
  let chainConfig: ChainConfig;
  let candidateExtractor: FastKmerDensityExtractor;
  let server: any;
  let loader: ModelLoader;

  beforeAll(async () => {
    // Set up test server to serve models
    const app = express();
    app.use('/models', express.static(path.resolve(__dirname, '../../../../public/models')));
    server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    chainConfig = {
      name: 'heavy',
      k: 11,
      maxLength: 576,
      allowedMismatches: 0,
      modelPath: 'http://localhost:8080/models/alignair_heavy/model.json',
      modelMetadataPath: '/home/ayelet/Documents/AlignAIR_site/public/models/alignair_heavy/metadata.json',
      orientationModelPath: '/models/heavychain_ornt_pipeline.onnx',
    };
    
    loader = new ModelLoader(chainConfig);
    await loader.initialize();
    candidateExtractor = loader.getCandidateExtractor()!;
  });

  it('should transform a long sequence correctly using transformHolt', async () => {
    // Initialize the candidate extractor
    candidateExtractor = loader.getCandidateExtractor()!;
    const expectedSequences = "CTGGACAAGGACTTCAATCGATGGGAGGGATCATTCCTATCTTTGGTACATCAAACTACGCATAGAAGTTCCAGGACAGAGTCACGGTAACCGCGGAGGTATCCACGAAAACAGGCTACATAGAGTTGAGGAGGCTGAGATCTAAGGACACGGCCGTGTATTACAGTACGAGGGTGGATGACTTCAGTGACTATGCCTCCTTATGGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAGACCTGCACCAAGGGCCCATCGATCCT"
    const sequence = "TATGACAACAGAAGCTAAGTGGCTTCGATAGTCTTCGAAGGAGGTCCACGCCGCTTTTAAGTCCGATCTGTCATAATTTTTACGATTGATAGCACACAATTCCCCAATGTGCGGAGAGCTGGACAAGGACTTCAATCGATGGGAGGGATCATTCCTATCTTTGGTACATCAAACTACGCATAGAAGTTCCAGGACAGAGTCACGGTAACCGCGGAGGTATCCACGAAAACAGGCTACATAGAGTTGAGGAGGCTGAGATCTAAGGACACGGCCGTGTATTACAGTACGAGGGTGGATGACTTCAGTGACTATGCCTCCTTATGGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAGACCTGCACCAAGGGCCCATCGATCCTACACGGTACACTTCGCGATACATTCGCCCGTCTCCGTTAGGACTACGTCTGTGACTCGTCCTTGTCCCGTCAAGGACAGGATCGCAGCCATCTCTGGGGCAAGCTGGGGGGGACAGAACACATAACACGA"
    // Run transformHolt
    const { maxRegion, dHistory } = candidateExtractor.transformHolt(sequence);
    // Expectations
    expect(maxRegion).toBeDefined();
    expect(dHistory).toBeInstanceOf(Array);
    expect(maxRegion.includes(expectedSequences)).toBe(true);
  });

  it('should test a set of sequences', async () => {
    // Initialize the candidate extractor
    candidateExtractor = loader.getCandidateExtractor()!;
    // Define test inputs
    const { test, expected } = parseSequences(path.resolve(__dirname,'test-data/KMer_Density_Extractor_HeavyChainTests.json')); 

    // Run transformHolt on each test sequence
    const results = test.map((sequence) => {
      const { maxRegion } = candidateExtractor.transformHolt(sequence); // Destructure the return value
      return maxRegion;
    });

    // Validate the results
    results.forEach((result, index) => {
      const expectedSequence = expected[index];
      expect(result).toContain(expectedSequence);
    });
  });

});
