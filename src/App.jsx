// import outside moduls
import React, { useState, useEffect, useCallback } from 'react';
import { Form } from "@open-tech-world/react-form";
import { PrimaryButton, Stack } from "@fluentui/react";
import { ProgressIndicator } from '@fluentui/react/lib/ProgressIndicator';
// import constant
import { vAlleleCallOHE, dAlleleCallOHE, jAlleleCallOHE } from "./fastaReader";
// import app moduls
/// model moduls
import { loadModel, warmUpModel } from './loadModel';
import { handleSubmit2 } from './formHandlers';
/// results moduls
import testAlignment from './alignmentDisplay';
import ResultsLayout from './ResultsLayout';
/// controlers moduls
import { FileRemove, FileUploader } from './fileControl';
import FluentNumberField from './FluentNumberField';
import FluentTextField from './FluentTextField';

export default function App() {
  const model_url = "tfjs/AlignAIRR/model.json";
  const maxSeqLength = 576;
  const desiredModelOutputNames = ['v_segment', 'indel_count', 'd_segment', 'mutation_rate', 'j_allele', 'd_allele', 'j_segment', 'v_allele'];
  const AlleleCallOHE = { v_allele: vAlleleCallOHE, d_allele: dAlleleCallOHE, j_allele: jAlleleCallOHE };
  const [model, setModel] = useState(null);
  const [outputIndices, setOutputIndices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seqresults, setSeqResults] = useState(null);
  const [predictionsAvailable, setPredictionsAvailable] = useState(false);
  const [vconfidence, setvConfidence] = useState("0.9");
  const [dconfidence, setdConfidence] = useState("0.2");
  const [jconfidence, setjConfidence] = useState("0.8");
  const [vcap, setvCap] = useState("3");
  const [dcap, setdCap] = useState("3");
  const [jcap, setjCap] = useState("3");
  const [progress, setProgress] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [resetResults, setResetResults] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileInput, setFile] = useState(null);

  const handleReset = useCallback(() => {
    setSeqResults(null);
    setPredictionsAvailable(false);
    setSubmit(false);
    setResetResults(true);
    setProgress(0);
    setFile(null);
    setFileName("");
    setTimeout(() => setResetResults(false), 0);
  }, []);

  const [updatedBrowserWidth, setUpdatedBrowserWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setUpdatedBrowserWidth(window.innerWidth);
      console.log('Updated Browser Width:', updatedBrowserWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const { model, indices } = await loadModel(model_url, desiredModelOutputNames);
        setModel(model);
        setOutputIndices(indices);
        setIsLoading(false);
        console.log('Model loaded successfully');
        const status = warmUpModel(model, indices, maxSeqLength, AlleleCallOHE);
        if(status=='success'){
          console.log('warmup completed.');
        }
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    fetchModel();
  }, []);

  
  /**
   * Renders the layout for displaying results.
   *
   * @param {Object} results - The results object.
   * @returns {JSX.Element} The rendered layout.
   */
  // function resultsLayout(results, fileInput) {
    
  //   const tabsetOutput = Object.keys(results).length > 1 && Object.keys(results).length < 15;
  //   const fileOutput = Object.keys(results).length >= 15;

  //   if(fileOutput){
  //     return (
  //       <>
  //         <DownloadResultsButton results={results} fileName={fileName} predictionsAvailable={predictionsAvailable} staticResults={staticResults} />
  //       </>
  //     );
  //   }else{
  //     const pivotItems = Object.entries(results).map(([index, value]) => (
  //       interactiveResults(index, value, tabsetOutput)
  //     )); 
  //     if (tabsetOutput) {
  //       return (
  //         <Pivot overflowBehavior="menu">
  //           {pivotItems}
  //         </Pivot>
  //       );
  //     } else{
  //       return pivotItems;
  //     }
  //   }
  // }

  return (
    <div className="App">
      <Form
        validate={(values) => {
          const errors = {};
          if (!values.sequence && !fileName) {
            errors.sequence = "Please enter a sequence or upload a file!";
          }
          return errors;
        }}
        onSubmit={values => handleSubmit2(values, fileInput, vconfidence, dconfidence, jconfidence, vcap, dcap, jcap, AlleleCallOHE, model, outputIndices, isLoading, setSubmit, setSeqResults, setPredictionsAvailable, setProgress, setElapsedTime)}
      > 
        <Stack enableScopedSelectors disableShrink tokens={{ childrenGap: 20 }}>
            <Stack enableScopedSelectors disableShrink tokens={{ childrenGap: updatedBrowserWidth > 800 ? 300 : 10 }} horizontal={updatedBrowserWidth > 800}>
            <Stack>
              <label>Enter sequence: </label>
              <br />
              <FluentTextField name="sequence" height='130px' width={updatedBrowserWidth > 800 ? '150%' : '100%'} />
              <Stack enableScopedSelectors horizontal disableShrink horizontalAlign="space-between">
              <>
                <FileUploader setFile={setFile} setFileName={setFileName} />
                {fileName ? <p>Chosen File:{fileName}</p> : null}
                {fileName ? <FileRemove setFile={setFile} setFileName={setFileName} />: null}
              </>
              </Stack>
              <br />
              {updatedBrowserWidth > 800 && (
                <Stack>
                  <Stack enableScopedSelectors horizontal disableShrink horizontalAlign="space-between">
                    <PrimaryButton type="submit" text="Submit" />
                    <PrimaryButton type="button" text="Reset Results" onClick={handleReset} />
                  </Stack>
                  <br /> 
                  { submit && (
                    <ProgressIndicator label="Processing Sequences" description={`Time Elapsed: ${elapsedTime.toFixed(2)} seconds`} percentComplete={progress / 100} />
                    )
                  }
                </Stack>
              )}
            </Stack>
            <Stack>
              <label>Confidence level: </label>
              <br />
              <Stack enableScopedSelectors horizontal disableShrink horizontalAlign="space-between">
                <FluentNumberField name="V" maxWidth="100px" defualtVal={vconfidence} setName={setvConfidence} min="0" max="1" step="0.1" />
                <FluentNumberField name="D" maxWidth="100px" defualtVal={dconfidence} setName={setdConfidence} min="0" max="1" step="0.1" />
                <FluentNumberField name="J" maxWidth="100px" defualtVal={jconfidence} setName={setjConfidence} min="0" max="1" step="0.1" />
              </Stack>
              <br />
              <label>Max allele assignment: </label>
              <br />
              <Stack enableScopedSelectors horizontal disableShrink horizontalAlign="space-between">
                <FluentNumberField name="V" maxWidth="100px" defualtVal={vcap} setName={setvCap} min="1" max="10" step="1.0" />
                <FluentNumberField name="D" maxWidth="100px" defualtVal={dcap} setName={setdCap} min="1" max="10" step="1.0" />
                <FluentNumberField name="J" maxWidth="100px" defualtVal={jcap} setName={setjCap} min="1" max="10" step="1.0" />
              </Stack>
              
              {updatedBrowserWidth <= 800 && (
                <br />
              )}

              {updatedBrowserWidth <= 800 && (
                <Stack>
                <Stack enableScopedSelectors horizontal disableShrink horizontalAlign="space-between">
                  <PrimaryButton type="submit" text="Submit" />
                  <PrimaryButton type="button" text="Reset Results" onClick={handleReset} />
                </Stack>
                <br /> 
                { submit && (
                  <ProgressIndicator label="Processing Sequences" description={`Time Elapsed: ${elapsedTime.toFixed(2)} seconds`} percentComplete={progress / 100} />
                  )
                }
                </Stack>
              )}

              {updatedBrowserWidth <= 800 && (
                <br />
              )}

            </Stack>
          </Stack>
        </Stack>
        {predictionsAvailable && (
          //ResultsLayout(seqresults, fileName, predictionsAvailable)
          <ResultsLayout results={seqresults} fileName={fileName} predictionsAvailable={predictionsAvailable} />
        )}

        {predictionsAvailable && (
          testAlignment()
        )}
        
      </Form>
    </div>
  );
}
