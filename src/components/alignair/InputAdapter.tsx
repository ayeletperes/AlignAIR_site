/**
 * Input Adapter Component
 * Bridges old input components with new state management architecture
 */

import React from 'react';
import { useFormState } from '@/hooks/useFormState';
import { useResultsState } from '@/hooks/useResultsState';
import { useAlignment } from '@/contexts/AlignmentContext';
import { Species } from '@/config/species/config';
import { ParsedRecord } from '@/utils/preprocessing/sequenceParse';

// Import old input components
import FileInput from '@/components/inputs/fileInput';
import SequenceInput from '@/components/inputs/sequenceInput';
import ParamInput from '@/components/inputs/paramInput';

interface InputAdapterProps {
  selectedChain: string;
  selectedModelId?: string;
  setSelectedModelId?: (modelId: string) => void;
}

export function InputAdapter({
  selectedChain,
  selectedModelId,
  setSelectedModelId
}: InputAdapterProps) {
  const {
    input,
    params,
    selectedSpecies,
    setInput,
    setChain,
    setSpecies,
    setParams,
    getFile,
    getSequence,
    hasFile,
    hasSequence
  } = useFormState();

  const { clearResults } = useResultsState();
  const { actions } = useAlignment();

  // Convert new state format to old component props
  const file = getFile();
  const sequenceString = getSequence();
  const sequence: ParsedRecord[] = sequenceString ? sequenceString as ParsedRecord[] : [];

  // Handlers that bridge new state management with old component interface
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  const handleSetFile = async (newFile: File | null) => {
    if (newFile) {
      try {
        const content = await readFileAsText(newFile);
        setInput({
          type: 'file',
          file: newFile,
          content
        });
      } catch (e) {
        // Fallback: set without content if read fails
        setInput({ type: 'file', file: newFile });
      }
    } else {
      // Only clear input if current input is a file, not if it's a sequence
      if (hasFile()) {
        setInput(null);
      }
    }
    clearResults();
  };

  const handleSetSequence = (newSequence: ParsedRecord[]) => {
    if (newSequence.length > 0) {
      const content = newSequence;
      setInput({
        type: 'sequence',
        content,
        name: 'User Input'
      });
    } else {
      setInput(null);
      // Clear processing errors when clearing sequence
      actions.resetProcessing();
    }
    clearResults();
  };

  const handleSetSelectedSpecies = (species: Species) => {
    setSpecies(species);
    clearResults();
  };

  const handleSetSelectedChain = (chain: string) => {
    setChain(chain as any);
    clearResults();
  };

  const handleSetParams = (newParams: any) => {
    setParams(newParams);
    clearResults();
  };

  const handleSetResults = (newResults: any) => {
    // This would be handled by the processing orchestrator in the new architecture
    // For now, we can keep it as a no-op
  };

  const fileInfoRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <SequenceInput
        selectedChain={selectedChain}
        selectedSpecies={selectedSpecies}
        setSequence={handleSetSequence}
        sequence={sequence}
        isDisabled={file != null}
        setFile={handleSetFile}
        setResults={handleSetResults}
      />
      <FileInput 
        setFile={handleSetFile} 
        isDisabled={sequence.length > 0} 
        setSequence={handleSetSequence} 
        fileInfoRef={fileInfoRef} 
        setResults={handleSetResults}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <h4 className="text-4xl font-extrabold dark:text-white">Alignment Parameters</h4>
        <div>
          <ParamInput
            params={params}
            setParams={handleSetParams}
            isDisabled={selectedChain === 'light'}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={handleSetSelectedSpecies}
            setSelectedChain={handleSetSelectedChain}
            selectedChain={selectedChain}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            onModelChange={() => handleSetResults(null)}
          />
        </div>
      </div>
    </div>
  );
} 
