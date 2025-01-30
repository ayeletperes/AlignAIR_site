import { ModelLoader, ChainConfig } from '@components/preprocessing/steps/modelLoader';
import { sequenceTokenizerWorker } from '@components/utilities/sequenceTokenizerWorker';
import express from 'express';
import path from 'path';
import * as tf from '@tensorflow/tfjs';
import * as onnx from 'onnxruntime-web';

jest.setTimeout(20000);

describe('Sequence Tokenizer Worker Integration Test', () => {
  let chainConfig: ChainConfig;
  let loader: ModelLoader;
  let server: any;

  beforeAll(async () => {
    // Set up test server to serve models
    const app = express();
    app.use('/models', express.static(path.resolve(__dirname, '../../../public/models')));
    server = app.listen(8080, () => console.log('Test server running on http://localhost:8080'));
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    chainConfig = {
      name: 'heavy',
      k: 11,
      maxLength: 576,
      allowedMismatches: 0,
      modelPath: 'http://localhost:8080/models/alignair_heavy/model.json',
      orientationModelPath: '/models/heavychain_ornt_pipeline.onnx',
    };
    loader = new ModelLoader(chainConfig);
  });

  it('should process sequences from a file correctly', async () => {
    // Initialize the loader
    await loader.initialize();

    const queue: any[] = [];
    const fakeQueue = {
      put: (data: any) => queue.push(data),
    };

    // Run the sequence tokenizer worker
    await sequenceTokenizerWorker(
      path.resolve(__dirname,'test-data/test.fasta'),
      fakeQueue,
      576,
      loader.getOrientationModel(),
      loader.getCandidateExtractor(),
      256,
      'file'
    );

    // Check the results in the queue
    expect(queue).toBeDefined();
    expect(queue[0]).toHaveProperty('tokenizedBatch');
    expect(queue[0]).toHaveProperty('originalSequences');

    const { tokenizedBatch, originalSequences } = queue[0];

    console.log(tokenizedBatch);
    // Validate tokenized batch
    expect(tokenizedBatch).toBeInstanceOf(Array);
    expect(tokenizedBatch.length).toBe(2);

    // Validate original sequences
    expect(originalSequences).toEqual([
      { id: 'seq1', sequence: 'AGAACCCGTCCCTCAAGAGTCGGGTCACCNTATCAATAGACAAGTCCGAGAGCCAGTTCTCTCTGAAGCTGAGCTCTGTGACTGCCGCGGACACGGCCGTCTGTTCCTGTGCGAGATTCCATATGATAATTGAAAGTCTGCTTTGACCACTGGGACAAGGAAAACCTGGTCNCCGTCTCTTCAGNCTTCTACGACGGAC' },
      { id: 'seq2', sequence: 'TTTGGTGGCAGCAGCAACAGGTGCCCACTCCCAGGTTCAGCTGGCGCAATCTGGAGCTGAGTTGAAGAAGCCTGGGGCCTCAGTGAAGATCTCTTGCGAGGCCTCTGGGCTCACCTTTAATACCTATGGCTACAACTGGCTGCGACAGGCCCCCGGACAAGGACTTGAGTGGATGGGATGGATCAGCGCTCACAATGGTAACAGGAACTATGTACAGAAGTTCCAGGGCAGACTCACCATGAGCACAGACGCATCCACGAACACAGTCTACATGGAGCTGACGAGCCTGAGATCTGACGACACGGCCGTATATTACTGCGCGAGAGTGCCTGATAGTAGTTGTTCTGCGGGGTGTTATTACTTTGACTACTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAGCCTCCACCAAGGGCCCATCGGTCTTCCCCCTGGCGCCCTGCTCCAGGAGCACCTCCGAGAGCACAGCGGCCCTGGGCTGCCTGGTCAAGGACTACTTCCCCGAACCGGTGACGGTGTCGTGGAACTCAGGCGCTCTGACCAGCGGCGTGCACACCTTCCCAGCTGTCCTACA' },
    ]);
  });

  it('should handle a single sequence input correctly', async () => {
    // Initialize the loader
    await loader.initialize();

    const queue: any[] = [];
    const fakeQueue = {
      put: (data: any) => queue.push(data),
    };

    const sequenceInput = 'AGAACCCGTCCCTCAAGAGTCGGGTCACCNTATCAATAGACAAGTCCGAGAGCCAGTTCTCTCTGAAGCTGAGCTCTGTGACTGCCGCGGACACGGCCGTCTGTTCCTGTGCGAGATTCCATATGATAATTGAAAGTCTGCTTTGACCACTGGGACAAGGAAAACCTGGTCNCCGTCTCTTCAGNCTTCTACGACGGAC';

    // Run the sequence tokenizer worker
    await sequenceTokenizerWorker(
      sequenceInput,
      fakeQueue,
      576,
      loader.getOrientationModel(),
      loader.getCandidateExtractor(),
      256,
      'sequence'
    );

    // Check the results in the queue
    expect(queue).toBeDefined();
    expect(queue[0]).toHaveProperty('tokenizedBatch');
    expect(queue[0]).toHaveProperty('originalSequences');

    const { tokenizedBatch, originalSequences } = queue[0];

    // Validate tokenized batch
    expect(tokenizedBatch).toBeInstanceOf(Array);
    expect(tokenizedBatch.length).toBe(1);

    // Validate original sequences
    expect(originalSequences).toEqual([{ id: 'Seq_1', sequence: 'AGAACCCGTCCCTCAAGAGTCGGGTCACCNTATCAATAGACAAGTCCGAGAGCCAGTTCTCTCTGAAGCTGAGCTCTGTGACTGCCGCGGACACGGCCGTCTGTTCCTGTGCGAGATTCCATATGATAATTGAAAGTCTGCTTTGACCACTGGGACAAGGAAAACCTGGTCNCCGTCTCTTCAGNCTTCTACGACGGAC' }]);
  });
});
