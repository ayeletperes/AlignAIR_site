import * as tf from '@tensorflow/tfjs';
import { SequenceTokenizer, SequenceTokenizerLight } from './processSequence';
import React, { useEffect, useState } from 'react';

export async function loadModel(model_url: string) {
    if (!model_url) {
        throw new Error('Model URL is null or undefined.');
    }
    const model = await tf.loadGraphModel(model_url);
    
    return model;
}

export async function warmUpModel(model: tf.GraphModel, indices: Record<string, number>, maxSeqLength: number) {
  const seq = 'TGGCACTTCATCGTGTACTTACAGCGCCACCTCCTAACGGGGCCCCCTCCTTGATCCACACAGCGAATCCGCCACGACCTGCGATAGCTTCGAGCAGGCCTTCAGTGGACAACATACTCTCAGCTAGGCCACCACCATTCCACAGATGCAGCTGGTGCAATCTGGGTCTGAGTCGAAGAAGCCTGGGGCCTCATTGAAGGTTTCCTGCAAGGCTTCTGGAGACACCTTCACTAGGTATGCTATGAATTGGGTGCGACAGGCCCCGGGACAAGGGCTTGAGCGGATGGGATGGATCACCACCAACACTGAGAACCCAACGTCTGCCCAGGGCTTCACAGGACGCTTTGTCTTCTCCTTGGACACCTCTGTCAGAACGGCATATCTGCAGATCTGCAGCCTAACGGCTAAGGACACTGCCGTATATTATTGTGCGAGAGATAGACTGGGACCGTATTATTACTATCACTACATGGACGTCTGGGTCAAAGGGACCACGATCACCGTCTCCTCAG';
  const encodedSequences = SequenceTokenizer.tokenizeSingleSequence(seq, maxSeqLength) as tf.NamedTensorMap;
  let status = 'failed';
  const predicted = model.predict(encodedSequences);
  if (!predicted) {
    console.error('Prediction failed.');
    status = 'failed';
  }else{
    status = 'success';
  }
  return status;
}

export async function warmUpModelLight(model: tf.GraphModel, indices: Record<string, number>, maxSeqLength: number) {
  const seq = 'GATATTGTGATGACCCAGACTCCACTCTCCTCACCTGTCACCCTTGGACAGCCGGCCTCCATCTCCTGCAGGTCTAGTCAAAGCCTCGTACACAGTGATGGAAACCCCTACTTGAGTTGGCTTCAGCAGAGGCCAGGCCAGCCTCCAAGACTCCTAATTTATAAGATTTCTAACCGGTTCTCTGGGGTCCCAGACAGATTCAGTGGCAGTGGGGCAGGGACAGATTTCACACTGAAAATCAGCAGGGTGGAAGCTGAGGATGTCGGGGTTTATTACTGCACGCAAGCTACACAATTTCTCTGGACGTTCGGCCAAGGGACCAAGGTGGAAATCAAAC';
  const encodedSequences = SequenceTokenizerLight.tokenizeSingleSequence(seq, maxSeqLength) as tf.NamedTensorMap;
  let status = 'failed';
  const predicted = model.predict(encodedSequences);
  if (process.env.NODE_ENV === 'development') {
    console.log(predicted)
    Object.values(predicted).forEach((tensor, index) => {
      console.log('Index:', index, ' Values: ', tensor.arraySync());
    })
  }
  if (!predicted) {
    console.error('Prediction failed.');
    status = 'failed';
  }else{
    status = 'success';
  }
  return status;
}

interface LoadModelComponentProps {
  setSelectedChain: React.Dispatch<React.SetStateAction<string>>;
  selectedChain: string;
  setModel: React.Dispatch<React.SetStateAction<tf.GraphModel | null>>;
  setOutputIndices: React.Dispatch<React.SetStateAction<Record<string, number> | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const model_urls: { [key: string]: string } = {
    Heavy: 'tfjs/AlignAIRR/model.json',
    Light: 'tfjs/AlignAIRR_LightChain/model.json', // replace the model URL if necessary
  };

const LoadModelComponent: React.FC<LoadModelComponentProps> = ({ setSelectedChain, selectedChain, setModel, setOutputIndices, setIsLoading }) => {
    const [selectedModel, setSelectedModel] = useState<string>('tfjs/AlignAIRR/model.json');
    const maxSeqLength = 576;
  
    const fetchModel = async () => {

        if (!selectedModel) {
            console.error('Model URL is undefined.');
            return;
        }
        try {
            const response = await fetch(selectedModel);
            const arrayBuffer = await response.arrayBuffer();
            
            if (arrayBuffer.byteLength % 4 !== 0 && selectedChain === 'Heavy') {
              throw new Error('Buffer length is not a multiple of 4');
            }
        
            const model = await loadModel(selectedModel);

            if (process.env.NODE_ENV === 'development') {
              console.log('Model loaded:', model);
            } 

            setModel(model);
            setIsLoading(false);
            let status = 'failed'
            if(selectedChain === 'Light'){
              const indicesLight = {
                v_sequence_end: 0,
                j_sequence_end: 1,
                v_sequence_start: 2,
                productive: 3,
                ar_indels: 4,
                j_sequence_start: 5,
                j_call: 6,
                mutation_rate: 7,
                type: 8,
                v_call: 9,
              };
              setOutputIndices(indicesLight);
              status = await warmUpModelLight(model, indicesLight, maxSeqLength);
            }else{
              const indices = {
                  mutation_rate: 0,
                  v_call: 1,
                  d_sequence_start: 2,
                  v_sequence_start: 3,
                  d_sequence_end: 4,
                  j_sequence_end: 5,
                  v_sequence_end: 6,
                  j_call: 7,
                  ar_indels: 8,
                  j_sequence_start: 9,
                  d_call: 10,
                  productive: 11,
              };
              setOutputIndices(indices);
              status = await warmUpModel(model, indices, maxSeqLength);
            }
            if (status === 'failed') {
                console.log('Warmup failed.');
            }
        } catch (error) {
            console.error('Error loading model:', error);
            setIsLoading(false);
        }
    };
  
    useEffect(() => {
      fetchModel();
    }, [selectedChain, selectedModel]);
  
    const selectButton = (buttonId: string) => {
      setSelectedChain(buttonId);
      setSelectedModel(model_urls[buttonId]);
    };
  
    return (
      <div>
        <p>Immunoglobulin Chain</p>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button 
            id="Heavy"
            value="Heavy"
            name="immunoglobulin-chain"
            onClick={() => selectButton('Heavy')}
            type="button" 
            className={`px-4 py-2 text-sm font-medium text-gray-900  border border-gray-300 rounded-s-lg hover:bg-purple-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:blue-400 focus:text-white dark:border-gray-800 dark:text-white dark:hover:text-white dark:hover:bg-purple-600 dark:focus:bg-purple-600 ${selectedChain === 'Heavy' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800'}`}>
            Heavy
          </button>
          <button 
            id="Light"
            value="Light"
            name="immunoglobulin-chain"
            onClick={() => selectButton('Light')}
            type="button" 
            className={`px-4 py-2 text-sm font-medium text-gray-900  border rounded-e-lg border-gray-300 hover:bg-purple-700 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:blue-400 focus:text-white dark:border-gray-800 dark:text-white dark:hover:text-white dark:hover:bg-purple-600 dark:focus:bg-purple-600 ${selectedChain === 'Light' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800'}`}>
            Light
          </button>
        </div>


        {/* <div className="flex items-center mb-4">
        <input
            id="Heavy"
            type="radio"
            value="Heavy"
            name="immunoglobulin-chain"
            className="w-4 h-4 text-blue-400 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={selectedChain === 'Heavy'}
            onChange={() => selectButton('Heavy')}
        />
        <label htmlFor="Heavy" className="text-white ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Heavy</label>
        </div>
        <div className="flex items-center mb-4">
        <input
            id="Light"
            type="radio"
            value="Light"
            name="immunoglobulin-chain"
            className="w-4 h-4 text-blue-400 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={selectedChain === 'Light'}
            onChange={() => selectButton('Light')}
        />
        <label htmlFor="Light" className="text-white ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Light</label>
        </div> */}
    </div>
    );
};
  
export default LoadModelComponent;
