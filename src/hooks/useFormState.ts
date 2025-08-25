/**
 * Custom hook for form state management
 * Provides consistent form handling across the application
 */

import { useCallback } from 'react';
import { useAlignment, useAlignmentSelectors } from '@/contexts/AlignmentContext';
import { ChainType, ProcessingParams, AlignmentInput } from '@/types/alignment';
import { AppConfig } from '@/config/app.config';

interface FormHandlers {
  setInput: (input: AlignmentInput | null) => void;
  setChain: (chain: ChainType) => void;
  setModel: (modelId: string) => void;
  setParams: (params: ProcessingParams) => void;
  clearForm: () => void;
  resetForm: () => void;
}

interface FormValidation {
  isValid: boolean;
  errors: string[];
  hasInput: boolean;
  hasValidChain: boolean;
  hasValidModel: boolean;
}

export function useFormState() {
  const { actions } = useAlignment();
  const {
    input,
    selectedChain,
    selectedModelId,
    params,
    isFormValid,
    validationErrors
  } = useAlignmentSelectors();

  // Form handlers
  const handlers: FormHandlers = {
    setInput: useCallback((input: AlignmentInput | null) => {
      actions.setInput(input);
    }, [actions]),

    setChain: useCallback((chain: ChainType) => {
      actions.setChain(chain);
    }, [actions]),

    setModel: useCallback((modelId: string) => {
      actions.setModel(modelId);
    }, [actions]),

    setParams: useCallback((params: ProcessingParams) => {
      actions.setParams(params);
    }, [actions]),

    clearForm: useCallback(() => {
      actions.setInput(null);
      actions.clearResults();
    }, [actions]),

    resetForm: useCallback(() => {
      actions.setInput(null);
      actions.setChain(AppConfig.ui.defaultChain);
      actions.setModel(''); // Let user choose, don't force default
      actions.setParams(AppConfig.processing.defaultParams);
      actions.clearResults();
    }, [actions])
  };

  // Form validation
  const validation: FormValidation = {
    isValid: isFormValid,
    errors: validationErrors,
    hasInput: input !== null,
    hasValidChain: selectedChain !== undefined && selectedChain !== null,
    hasValidModel: selectedModelId !== ''
  };

  // File handling helpers
  const fileHelpers = {
    getFile: () => input?.type === 'file' ? input.file : null,
    getSequence: () => input?.type === 'sequence' ? input.content : '',
    hasFile: () => input?.type === 'file',
    hasSequence: () => input?.type === 'sequence',
    clearFile: () => {
      if (input?.type === 'file') {
        actions.setInput(null);
      }
    },
    clearSequence: () => {
      if (input?.type === 'sequence') {
        actions.setInput(null);
      }
    }
  };

  return {
    // State
    input,
    selectedChain,
    selectedModelId,
    params,
    
    // Handlers
    ...handlers,
    
    // Validation
    ...validation,
    
    // File helpers
    ...fileHelpers
  };
} 