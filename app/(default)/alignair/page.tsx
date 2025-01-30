'use client';
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import Modal from 'react-modal';
import { useMount, usePrevious, useSetState } from 'react-use';

import AlignmentForm from '@/components/form/form';
import Submission from '@components/submission/submission';
import Results from '@/components/results/Results';
//import Results from '@/components/functional/results';
import { metadata } from './metadata';

function logGroup(type: string, data: any) {
  console.groupCollapsed(type);
  console.log(data);
  console.groupEnd();
}

interface State {
  modalIsOpen: boolean;
  run: boolean;
  steps: Step[];
}

interface Params {
  vCap: number;
  dCap: number;
  jCap: number;
  vThresh: number;
  dThresh: number;
  jThresh: number;
}

export default function App() {
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side
  const [submission, setSubmission] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [sequence, setSequence] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<'heavy' | 'light'>('heavy');
  const [results, setResults] = useState<any>(null);
  const [resultsReady, setResultsReady] = useState(false); // New state to track if results are ready
  const [params, setParams] = useState<Params>({
    vCap: 3,
    dCap: 3,
    jCap: 3,
    vThresh: 0.75,
    dThresh: 0.3,
    jThresh: 0.8,
  });

  // State for dynamic input and flag
  const [input, setInput] = useState<string | File | null>(null);
  const [flag, setFlag] = useState<'sequence' | 'file'>('sequence');

  useEffect(() => {
    // Dynamically set input and flag
    if (file) {
      setInput(file);
      setFlag('file');
    } else if (sequence) {
      setInput(sequence);
      setFlag('sequence');
    }
  }, [file, sequence]);

  useEffect(() => {
    setSelectedChain('heavy');
    setIsClient(true);

    if (window.gtag) {
      window.gtag('config', 'G-W94F4SGX8B', {
        'page_title': metadata.title,
        'page_path': window.location.pathname,
      });
    }
  }, []);

  // Watch for results being set and update resultsReady
  useEffect(() => {
    if (results) {
      
      setResultsReady(true); // Results are now fully ready
    } else {
      setResultsReady(false);
    }
  }, [results]);
  
  const [{ modalIsOpen, run, steps }, setState] = useSetState<State>({
    modalIsOpen: true,
    run: true,
    steps: [
      {
        content: (
          <div>
            This is AlignAIR beta version.<br />
            Let's get to know our interface and start aligning! 😎.<br />
            You can exit anytime using skip.
          </div>
        ),
        placement: 'bottom',
        target: '#alignair',
        spotlightClicks: true,
      },
      // Additional steps here
    ] as Step[],
  });

  const previousModalIsOpen = usePrevious(modalIsOpen);

  useEffect(() => {
    if (!previousModalIsOpen && modalIsOpen) {
      setState({
        run: true,
      });
    }
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setState({ run: false });
    }

    logGroup(type, data);
  };

  return (
    <>
      {isClient && (
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={run}
          showSkipButton
          steps={steps}
          styles={{
            options: {
              arrowColor: "rgb(93,93,255)",
              backgroundColor: "rgb(93,93,255)",
              primaryColor: "rgb(93,93,255)",
              textColor: 'white',
            },
          }}
        />
      )}

      <AlignmentForm
        setFile={setFile as Dispatch<SetStateAction<File | null>>}
        file={file}
        setSequence={setSequence as Dispatch<SetStateAction<string>>}
        sequence={sequence}
        setSelectedChain={setSelectedChain as Dispatch<SetStateAction<string>>}
        selectedChain={selectedChain}
        params={params}
        setParams={setParams as Dispatch<SetStateAction<Params>>}
      />

      <Submission
        chain={selectedChain}
        input={input as string | null} // Dynamically set input
        flag={flag} // Dynamically set flag
        params={params}
        results={results}
        setResults={setResults}
      />
      
      {resultsReady && <Results results={results} selectedChain={selectedChain} />}
    </>
  );
}
