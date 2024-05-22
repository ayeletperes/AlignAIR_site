import React, {useState} from 'react';
import Header from './alignairPageHeader';
import Content from './toolPageContent';
import Submission from './toolPageSubmission';
import AlignairPageResults from './toolPageResults';

export default function ToolPageApp(){
  const [submission, setSubmission] = useState(false);
  const [file, setFile] = useState(null);
  const [sequence, setSequence] = useState('');
  const [selectedChain, setSelectedChain] = useState('IGH');
  const [model, setModel] = useState(null);
  const [outputIndices, setOutputIndices] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [params, setParams] = useState({
      vCap: 3,
      dCap: 3,
      jCap: 3,
      vConf: 0.9,
      dConf: 0.2,
      jConf: 0.8,
      vSeg: 0.1,
      dSeg: 0.01,
      jSeg: 0.01,
  });

  return(
    <div>
      <Header />
      <Content setFile={setFile} setSequence={setSequence} sequence={sequence} setSelectedChain={setSelectedChain} selectedChain={selectedChain} setModel={setModel} setOutputIndices={setOutputIndices} setIsLoading={setIsLoading} params={params} setParams={setParams}/>
      {!isLoading && 
        <>
          <Submission setSubmission={setSubmission} submission={submission} sequence={sequence} file={file} params={params} model={model} outputIndices={outputIndices} setResults={setResults} /> 
          <AlignairPageResults results={results} />
        </>
      }
      <footer>
        <div className="footer-logo">AlignAIR</div>
        <a href="https://github.com" className="github-logo">
            <i className="fab fa-github" style={{fontSize: '24px', color: '#828282'}}></i>
        </a>
      </footer>
    </div>
  )
};




