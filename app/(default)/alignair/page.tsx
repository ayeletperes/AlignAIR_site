'use client';
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import Modal from 'react-modal';
import { useMount, usePrevious, useSetState } from 'react-use';

import AlignmentForm from '@/components/form/form';
import Submission from '@components/submission/submission';
import Results from '@/components/results/Results';
import { getOrLoadModel, getOrLoadModelById } from '@components/submission/alignmentSubmission';
import { logger } from '@components/utils/logger';
import { getDefaultModelForChain, getModelById } from '@components/model/modelMetadataLoader';
//import Results from '@/components/functional/results';
import { metadata } from './metadata';

function logGroup(type: string, data: any) {
  if (process.env.NODE_ENV === 'development') {
    logger.log(`[${type}]`, data);
  }
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

interface ModelPreloadStatus {
  heavy: 'idle' | 'loading' | 'ready' | 'error';
  light: 'idle' | 'loading' | 'ready' | 'error';
  trb: 'idle' | 'loading' | 'ready' | 'error';
}

export default function App() {
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side
  const [submission, setSubmission] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [sequence, setSequence] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<'heavy' | 'light' | 'trb'>('heavy');
  const [selectedModelId, setSelectedModelId] = useState<string>('igh-v1.0'); // Default to IGH model
  const [results, setResults] = useState<any>(null);
  const [resultsReady, setResultsReady] = useState(false); // New state to track if results are ready
  const [isProcessing, setIsProcessing] = useState(false); // New state to track processing status
  const [modelPreloadStatus, setModelPreloadStatus] = useState<ModelPreloadStatus>({
    heavy: 'idle',
    light: 'idle',
    trb: 'idle',
  });
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

  // Model preloading function by ID
  const preloadModelById = async (modelId: string) => {
    try {
      const modelMetadata = await getModelById(modelId);
      if (!modelMetadata) {
        logger.error(`Model not found: ${modelId}`);
        return;
      }

      const chain = modelMetadata.chainType;
      
      // Check if model is already ready to avoid unnecessary re-warmup
      if (modelPreloadStatus[chain] === 'ready') {
        logger.log(`Model ${modelId} is already ready, skipping preload`);
        return;
      }
      
      setModelPreloadStatus(prev => ({ ...prev, [chain]: 'loading' }));
      logger.log(`Preloading model: ${modelId} (${chain} chain)...`);
      
      await getOrLoadModelById({
        modelId,
        warmupOptions: {
          enabled: true,
          warmupRuns: 2,
          logWarmupTimes: true,
        },
      });
      
      setModelPreloadStatus(prev => ({ ...prev, [chain]: 'ready' }));
      logger.log(`Model ${modelId} preloaded and ready!`);
    } catch (error) {
      logger.error(`Failed to preload model ${modelId}:`, error);
      const modelMetadata = await getModelById(modelId);
      if (modelMetadata) {
        setModelPreloadStatus(prev => ({ ...prev, [modelMetadata.chainType]: 'error' }));
      }
    }
  };

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
    setSelectedModelId('igh-v1.0'); // Set default model
    setIsClient(true);

    // Note: Model preloading is now handled by the selectedModelId useEffect
    // No need to call preloadModelById here as it will be triggered automatically

    if (window.gtag) {
      window.gtag('config', 'G-W94F4SGX8B', {
        'page_title': metadata.title,
        'page_path': window.location.pathname,
      });
    }
  }, []);

  // Update selectedModelId when selectedChain changes (only if no specific model is selected)
  useEffect(() => {
    const updateDefaultModel = async () => {
      const defaultModel = await getDefaultModelForChain(selectedChain);
      if (defaultModel && !selectedModelId) {
        setSelectedModelId(defaultModel.id);
        // Reset results when chain changes and model is automatically updated
        setResults(null);
      }
    };
    
    updateDefaultModel();
  }, [selectedChain, selectedModelId]);

  // Preload model when selected model changes - this is the single source of truth for model preloading
  useEffect(() => {
    if (selectedModelId) {
      preloadModelById(selectedModelId);
    }
  }, [selectedModelId]);

  // Watch for results being set and update resultsReady
  useEffect(() => {
    if (results) {
      setIsProcessing(false);
      setResultsReady(true); // Results are now fully ready
    } else {
      setResultsReady(false);
    }
  }, [results]);

  // Watch for submission changes to set processing state
  useEffect(() => {
    if (submission && (input || sequence)) {
      setIsProcessing(true);
    }
  }, [submission, input, sequence]);
  
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

      {/* Model Preloading Status */}
      {/* <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Model Status:</span>
              <div className="flex items-center space-x-1">
                <span 
                  className={`w-2 h-2 rounded-full ${
                    modelPreloadStatus.heavy === 'ready' ? 'bg-green-500' :
                    modelPreloadStatus.heavy === 'loading' ? 'bg-yellow-500 animate-pulse' :
                    modelPreloadStatus.heavy === 'error' ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                ></span>
                <span className="text-gray-600">Heavy</span>
              </div>
              <div className="flex items-center space-x-1">
                <span 
                  className={`w-2 h-2 rounded-full ${
                    modelPreloadStatus.light === 'ready' ? 'bg-green-500' :
                    modelPreloadStatus.light === 'loading' ? 'bg-yellow-500 animate-pulse' :
                    modelPreloadStatus.light === 'error' ? 'bg-red-500' : 'bg-gray-300'
                  }`}
                ></span>
                <span className="text-gray-600">Light</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {modelPreloadStatus[selectedChain] === 'loading' && 'Preparing model for fast inference...'}
            {modelPreloadStatus[selectedChain] === 'ready' && 'Model ready - submissions will be fast!'}
            {modelPreloadStatus[selectedChain] === 'error' && 'Model loading failed - submissions may be slower'}
          </div>
        </div>
      </div> */}

      <AlignmentForm
        setFile={setFile as Dispatch<SetStateAction<File | null>>}
        file={file}
        setSequence={setSequence as Dispatch<SetStateAction<string>>}
        sequence={sequence}
        setSelectedChain={setSelectedChain as Dispatch<SetStateAction<string>>}
        selectedChain={selectedChain}
        selectedModelId={selectedModelId}
        setSelectedModelId={setSelectedModelId}
        params={params}
        setParams={setParams as Dispatch<SetStateAction<Params>>}
        setResults={setResults}
      />

      <Submission
        modelId={selectedModelId}
        input={input as string | null} // Dynamically set input
        flag={flag} // Dynamically set flag
        params={params}
        results={results}
        setResults={setResults}
      />
      
      {(resultsReady || isProcessing) && (
        <Results 
          results={results} 
          selectedChain={selectedChain} 
          isLoading={isProcessing && !resultsReady}
        />
      )}
    </>
  );
}
