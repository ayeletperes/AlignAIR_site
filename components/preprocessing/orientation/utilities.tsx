import * as onnx from 'onnxruntime-web';
//const onnx = require('onnxruntime-node');



export async function inspectModel(path: string): Promise<void> {
  try {
    const session = await onnx.InferenceSession.create(path);
    console.log('Model Inputs:');
    session.inputNames.forEach((name: string) => {
      console.log(`- Name: ${name}`);
    });

    console.log('Model Outputs:');
    session.outputNames.forEach((name: string) => {
      console.log(`- Name: ${name}`);
    });

  } catch (error) {
    console.error('Failed to inspect the model:', error);
  }
}

export const runModel = async (
  pipeline: any,
  sequences: string[]
): Promise<string[]> => {
  if (!Array.isArray(sequences) || sequences.length === 0) {
    throw new Error('Invalid input sequences for model inference');
  }
  const inputTensor = new onnx.Tensor('string', sequences, [sequences.length, 1]);
  const feeds = { string_input: inputTensor };
  try {
    const results = await pipeline.run(feeds, ['label']);
    return results.label.data as string[];
  } catch (error) {
    console.error('Error during model inference. Reinitializing session...');
    throw error;
  }
};

export const fixOrientation = async (
  pipeline: any | null,
  sequences: string[]
): Promise<string[]> => {
  if (!pipeline) {
    throw new Error('Invalid orientation pipeline');
  }
  try {
    const orientations = await runModel(pipeline, sequences);
    const fixedSequences = sequences.map((sequence, index) =>
      singleFixOrientation(sequence, orientations[index])
    );
    return fixedSequences;
  } catch (error) {
    console.error('Error during orientation fixing:', error);
    throw error;
  } 
};

const complement: Record<string, string> = { A: 'T', T: 'A', C: 'G', G: 'C', N: 'N' };

const reverseSequence = (seq: string): string => seq.split('').reverse().join('');
const complementSequence = (seq: string): string =>
  seq.split('').map((base) => complement[base] || base).join('');
const reverseComplementSequence = (seq: string): string =>
  complementSequence(reverseSequence(seq));

const singleFixOrientation = (seq: string, orientation: string): string => {
  switch (orientation) {
    case 'Normal':
      return seq;
    case 'Reversed':
      return reverseSequence(seq);
    case 'Complement':
      return complementSequence(seq);
    case 'Reverse Complement':
      return reverseComplementSequence(seq);
    default:
      throw new Error('Unrecognized Orientation Label');
  }
};
