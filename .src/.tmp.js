import * as tf from "@tensorflow/tfjs";
import * as tfn from "@tensorflow/tfjs-node";
import {vAlleleCallOHE,sortedIGHVDataDict,dAlleleCallOHE,sortedIGHDDataDict,jAlleleCallOHE,sortedIGHJDataDict,} from "./FastaReader";

const handler = tfn.io.fileSystem('/home/ayelet/Downloads/sandbox/public/tfjs/alignairr_model/model.json');
const model = await tf.loadGraphModel(handler);
const tokenizerDictionary = {
    "A": 1,
    "T": 2,
    "G": 3,
    "C": 4,
    "N": 5,
    "P": 0,  // pad token
  };

function encodeAndEqualPadSequence(sequence, maxSeqLength=512) {
    const encodedSequence = sequence.split(' ').map(nucleotide => tokenizerDictionary[nucleotide]);
    const paddingLength = maxSeqLength - encodedSequence.length;
    const isEven = paddingLength % 2 === 0;
    const padSize = Math.floor(paddingLength / 2);
  
    if (isEven) {
      encodedSequence.unshift(...Array(padSize).fill(0));
      encodedSequence.push(...Array(padSize).fill(0));
    } else {
      encodedSequence.unshift(...Array(padSize).fill(0));
      encodedSequence.push(...Array(padSize + 1).fill(0));
    }
  
    return encodedSequence;
}

function tokenizeSingleSequence(sequence, maxSeqLength=512) {
    const paddedArray = encodeAndEqualPadSequence(sequence, maxSeqLength);
    const paddedSequenceTensor = tf.tensor2d([paddedArray], [1, maxSeqLength], 'int32');
    const input = {
        'tokenized_sequence': paddedSequenceTensor
    };

    return input;
}

function extract_prediction_alleles(prediction, AlleleCallOHE, th = 0.4) {
    const sortedIndices = tf.topk(prediction, 198, true).indices.arraySync();
    const result = [{ index: AlleleCallOHE[sortedIndices[0]], prob: prediction[sortedIndices[0]]}];
  
    for (let ip = 1; ip < sortedIndices.length; ip++) {
      const diff = Math.log(prediction[sortedIndices[ip - 1]] / prediction[sortedIndices[ip]]);
      if (diff < th) {
        result.push({ index: AlleleCallOHE[sortedIndices[ip]], prob: prediction[sortedIndices[ip]]});
      } else {
        break;
      }
    }
  
    return result;
}
  
/* function extract_prediction_alleles(probabilities, th = 0.4) {
    const V_ratio = [];
    const v_alleles = log_threshold(probabilities, th);
    V_ratio.push(v_alleles.map(index => vAlleleCallOHE[index]));
    return V_ratio;
}
 */
/* function fastaToDict(fastaContent) {
    const fastaLines = fastaContent.split('\n');
    const dataDict = {};
    let currentKey = '';
    let currentValue = '';
    fastaLines.forEach(line => {
        if (line.startsWith('>')) {
            if (currentKey && currentValue) {
                dataDict[currentKey] = currentValue;
            }
            currentKey = line.slice(1).trim();
            currentValue = '';
        } else {
            currentValue += line.trim();
        }
    });
    if (currentKey && currentValue) {
        dataDict[currentKey] = currentValue;
    }
    return dataDict;
}
const IGHVDataDict = fastaToDict(IGHV);
 */
const sample = "GAAGTGCAGCTGGTGGAGTCTGGGGGAGNCTTGGTACAGCCTGGNAGGTCCCTGAGACTCTCCTGTGCAGCCTCNNGNTNCACCTTTGATGATTNTGCCATGCACTGGGTCCGNCAAGCTCCAGGGAAGGGCCTGGAGTGGGTCTCAGGTATTAGTTGGAATAGTGGTATCATAGTCTATGCGGACTCTGTGAAGGGNCGATTCACCATCTCCAGAGACAACGCCAAGAACTCCCTGTATCTGCAAATGAACAGTCTGAGAGCTGAGGACACGGCCTTGTATTACTGTGCAAAAGATATGACGGGCGGGGCGCCCCACCCATTTGATGCTTTTGATATCTGGGGCCTAGGGACAATGGTCACCGTCTCTTCAG";
const dataset = tokenizeSingleSequence(sample);
const predicted = model.predict(dataset);
const probabilitiesTensor = predicted[6];
const probabilitiesArray = await probabilitiesTensor.data();

/* const sortedIGHVDataDict = Object.keys(IGHVDataDict).sort().reduce((obj, key) => {
    obj[key] = IGHVDataDict[key];
    return obj;
}, {});

// Create an object to store V allele call indices
const vAlleleCallOHE = {};
Object.keys(sortedIGHVDataDict).forEach((vAllele, index) => {
    vAlleleCallOHE[index] = vAllele;
}); */
const predict_v_prob = extract_prediction_alleles(probabilitiesArray, vAlleleCallOHE, 1);
console.log(predict_v_prob)



/* import React,{ useState, useEffect } from 'react';
import { Form, useField } from "@open-tech-world/react-form";
import { ComboBox, PrimaryButton, TextField } from "@fluentui/react";
import * as tf from "@tensorflow/tfjs";
import Values from "./Values";
import {vAlleleCallOHE,sortedIGHVDataDict,dAlleleCallOHE,sortedIGHDDataDict,jAlleleCallOHE,sortedIGHJDataDict,} from "./FastaReader";
import {SequenceTokenizer} from './PredictSequence';

const tokenizer = new SequenceTokenizer();
const sample = "GAAGTGCAGCTGGTGGAGTCTGGGGGAGNCTTGGTACAGCCTGGNAGGTCCCTGAGACTCTCCTGTGCAGCCTCNNGNTNCACCTTTGATGATTNTGCCATGCACTGGGTCCGNCAAGCTCCAGGGAAGGGCCTGGAGTGGGTCTCAGGTATTAGTTGGAATAGTGGTATCATAGTCTATGCGGACTCTGTGAAGGGNCGATTCACCATCTCCAGAGACAACGCCAAGAACTCCCTGTATCTGCAAATGAACAGTCTGAGAGCTGAGGACACGGCCTTGTATTACTGTGCAAAAGATATGACGGGCGGGGCGCCCCACCCATTTGATGCTTTTGATATCTGGGGCCTAGGGACAATGGTCACCGTCTCTTCAG";
const dataset = tokenizer.tokenizeSingleSequence(sample);
const predicted = model.predict(dataset);
// V alleles
const predict_v_prob = extract_prediction_alleles(predicted[6].data(), vAlleleCallOHE, 1);
console.log("Predictions:", predict_v_prob);

export default function App() {
  const [model, setModel] = useState(null);
  const [predictedClass, setPredictedClass] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const model_url = "tfjs/alignairr_model/model.json";
      const model = await tf.loadGraphModel(model_url);
      setModel(model);
    };

    loadModel();
  }, []);

  function FluentTextField({ name, ...otherProps }) {
    const { field, error } = useField(name);
    return (
      <TextField multiline errorMessage={error} {...field} {...otherProps} />
    );
  }

  return (
    <div className="App">
      <Form
        validate={(values) => {
          const errors = {};
          if (!values.sequence) {
            errors.sequence = "Required!";
          }
          return errors;
        }}
        onSubmit={(values) => alert(JSON.stringify(values, "", 4))}
      >
        <div>
          <label>Enter sequence: </label>
          <FluentTextField name="sequence" />
        </div>
        <br />
        <PrimaryButton type="submit" text="Submit" />
        <Values />
      </Form>
    </div>
  );
}
 */
