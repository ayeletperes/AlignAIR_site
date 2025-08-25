/**
 * Main alignment context for state management
 * Provides centralized state for the alignment process
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  AppState, 
  AlignmentInput, 
  ProcessingParams, 
  ChainType, 
  ModelPreloadStatus,
  ProcessingState,
  AlignmentResult,
  AlignmentError
} from '@/types/alignment';
import { AppConfig } from '@/config/app.config';
import { ErrorHandler } from '@/utils/errorHandler';

// Action types
type AlignmentAction =
  | { type: 'SET_INPUT'; payload: AlignmentInput | null }
  | { type: 'SET_CHAIN'; payload: ChainType }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_PARAMS'; payload: ProcessingParams }
  | { type: 'UPDATE_MODEL_STATUS'; payload: { chain: ChainType; status: ModelPreloadStatus[ChainType] } }
  | { type: 'START_PROCESSING'; payload?: { step?: string } }
  | { type: 'UPDATE_PROCESSING'; payload: Partial<ProcessingState> }
  | { type: 'COMPLETE_PROCESSING'; payload: AlignmentResult }
  | { type: 'ERROR_PROCESSING'; payload: AlignmentError }
  | { type: 'RESET_PROCESSING' }
  | { type: 'ADD_RESULT'; payload: AlignmentResult }
  | { type: 'CLEAR_RESULTS' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_MODAL'; payload: boolean };

// Initial state
const initialState: AppState = {
  form: {
    selectedChain: AppConfig.ui.defaultChain,
    selectedModelId: '', // Let user choose, don't force default
    input: null,
    params: AppConfig.processing.defaultParams,
    isValid: false,
    validationErrors: []
  },
  processing: {
    isProcessing: false,
    currentStep: 'idle',
    progress: [],
    error: null
  },
  models: {
    heavy: 'idle',
    light: 'idle',
    trb: 'idle'
  },
  results: [],
  ui: {
    theme: AppConfig.ui.theme.defaultTheme,
    sidebarOpen: false,
    modalOpen: false
  }
};

// Reducer function
function alignmentReducer(state: AppState, action: AlignmentAction): AppState {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        form: {
          ...state.form,
          input: action.payload,
          isValid: validateForm({ ...state.form, input: action.payload }),
          validationErrors: getValidationErrors({ ...state.form, input: action.payload })
        }
      };

    case 'SET_CHAIN':
      return {
        ...state,
        form: {
          ...state.form,
          selectedChain: action.payload,
          isValid: validateForm({ ...state.form, selectedChain: action.payload }),
          validationErrors: getValidationErrors({ ...state.form, selectedChain: action.payload })
        }
      };

    case 'SET_MODEL':
      return {
        ...state,
        form: {
          ...state.form,
          selectedModelId: action.payload,
          isValid: validateForm({ ...state.form, selectedModelId: action.payload }),
          validationErrors: getValidationErrors({ ...state.form, selectedModelId: action.payload })
        }
      };

    case 'SET_PARAMS':
      return {
        ...state,
        form: {
          ...state.form,
          params: action.payload
        }
      };

    case 'UPDATE_MODEL_STATUS':
      return {
        ...state,
        models: {
          ...state.models,
          [action.payload.chain]: action.payload.status
        }
      };

    case 'START_PROCESSING':
      return {
        ...state,
        processing: {
          isProcessing: true,
          currentStep: 'validating',
          progress: [{
            step: 'validating',
            progress: 0,
            message: action.payload?.step || 'Starting processing...',
            timestamp: Date.now()
          }],
          error: null,
          startTime: Date.now()
        }
      };

    case 'UPDATE_PROCESSING':
      return {
        ...state,
        processing: {
          ...state.processing,
          ...action.payload,
          progress: action.payload.progress 
            ? [...state.processing.progress, ...action.payload.progress]
            : state.processing.progress
        }
      };

    case 'COMPLETE_PROCESSING':
      return {
        ...state,
        processing: {
          ...state.processing,
          isProcessing: false,
          currentStep: 'complete',
          endTime: Date.now()
        },
        results: [...state.results, action.payload]
      };

    case 'ERROR_PROCESSING':
      return {
        ...state,
        processing: {
          ...state.processing,
          isProcessing: false,
          currentStep: 'error',
          error: action.payload,
          endTime: Date.now()
        }
      };

    case 'RESET_PROCESSING':
      return {
        ...state,
        processing: {
          isProcessing: false,
          currentStep: 'idle',
          progress: [],
          error: null
        }
      };

    case 'ADD_RESULT':
      return {
        ...state,
        results: [...state.results, action.payload]
      };

    case 'CLEAR_RESULTS':
      return {
        ...state,
        results: [],
        form: {
          ...state.form,
          isValid: validateForm({ ...state.form, input: state.form.input }),
          validationErrors: getValidationErrors({ ...state.form, input: state.form.input })
        }
      };

    case 'SET_THEME':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload
        }
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen
        }
      };

    case 'SET_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          modalOpen: action.payload
        }
      };

    default:
      return state;
  }
}

// Validation functions
function validateForm(form: AppState['form']): boolean {
  return form.input !== null && form.selectedModelId !== '' && form.validationErrors.length === 0;
}

function getValidationErrors(form: AppState['form']): string[] {
  const errors: string[] = [];
  
  if (!form.input) {
    errors.push('Input is required');
  } else if (form.input.type === 'sequence' && form.input.content.trim() === '') {
    errors.push('Sequence cannot be empty');
  } else if (form.input.type === 'file' && !form.input.file) {
    errors.push('File is required');
  }
  
  if (!form.selectedModelId) {
    errors.push('Model selection is required');
  }

  return errors;
}

// Context creation
const AlignmentContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AlignmentAction>;
  actions: {
    setInput: (input: AlignmentInput | null) => void;
    setChain: (chain: ChainType) => void;
    setModel: (modelId: string) => void;
    setParams: (params: ProcessingParams) => void;
    updateModelStatus: (chain: ChainType, status: ModelPreloadStatus[ChainType]) => void;
    startProcessing: (step?: string) => void;
    updateProcessing: (update: Partial<ProcessingState>) => void;
    completeProcessing: (result: AlignmentResult) => void;
    errorProcessing: (error: AlignmentError) => void;
    resetProcessing: () => void;
    clearResults: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    toggleSidebar: () => void;
    setModal: (open: boolean) => void;
  };
} | null>(null);

// Provider component
interface AlignmentProviderProps {
  children: React.ReactNode;
}

export function AlignmentProvider({ children }: AlignmentProviderProps) {
  const [state, dispatch] = useReducer(alignmentReducer, initialState);

  // Action creators
  const actions = {
    setInput: useCallback((input: AlignmentInput | null) => {
      dispatch({ type: 'SET_INPUT', payload: input });
    }, []),

    setChain: useCallback((chain: ChainType) => {
      dispatch({ type: 'SET_CHAIN', payload: chain });
    }, []),

    setModel: useCallback((modelId: string) => {
      dispatch({ type: 'SET_MODEL', payload: modelId });
    }, []),

    setParams: useCallback((params: ProcessingParams) => {
      dispatch({ type: 'SET_PARAMS', payload: params });
    }, []),

    updateModelStatus: useCallback((chain: ChainType, status: ModelPreloadStatus[ChainType]) => {
      dispatch({ type: 'UPDATE_MODEL_STATUS', payload: { chain, status } });
    }, []),

    startProcessing: useCallback((step?: string) => {
      dispatch({ type: 'START_PROCESSING', payload: step ? { step } : undefined });
    }, []),

    updateProcessing: useCallback((update: Partial<ProcessingState>) => {
      dispatch({ type: 'UPDATE_PROCESSING', payload: update });
    }, []),

    completeProcessing: useCallback((result: AlignmentResult) => {
      dispatch({ type: 'COMPLETE_PROCESSING', payload: result });
    }, []),

    errorProcessing: useCallback((error: AlignmentError) => {
      dispatch({ type: 'ERROR_PROCESSING', payload: error });
    }, []),

    resetProcessing: useCallback(() => {
      dispatch({ type: 'RESET_PROCESSING' });
    }, []),

    clearResults: useCallback(() => {
      dispatch({ type: 'CLEAR_RESULTS' });
    }, []),

    setTheme: useCallback((theme: 'light' | 'dark') => {
      dispatch({ type: 'SET_THEME', payload: theme });
      localStorage.setItem(AppConfig.ui.theme.storageKey, theme);
    }, []),

    toggleSidebar: useCallback(() => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }, []),

    setModal: useCallback((open: boolean) => {
      dispatch({ type: 'SET_MODAL', payload: open });
    }, [])
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(AppConfig.ui.theme.storageKey) as 'light' | 'dark';
    if (savedTheme && savedTheme !== state.ui.theme) {
      actions.setTheme(savedTheme);
    }
  }, []);

  return (
    <AlignmentContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AlignmentContext.Provider>
  );
}

// Hook for using the context
export function useAlignment() {
  const context = useContext(AlignmentContext);
  if (!context) {
    throw new Error('useAlignment must be used within an AlignmentProvider');
  }
  return context;
}

// Selectors for specific state slices
export const useAlignmentSelectors = () => {
  const { state } = useAlignment();
  
  return {
    // Form selectors
    input: state.form.input,
    selectedChain: state.form.selectedChain,
    selectedModelId: state.form.selectedModelId,
    params: state.form.params,
    isFormValid: state.form.isValid,
    validationErrors: state.form.validationErrors,
    
    // Processing selectors
    isProcessing: state.processing.isProcessing,
    currentStep: state.processing.currentStep,
    processingProgress: state.processing.progress,
    processingError: state.processing.error,
    processingTime: state.processing.startTime && state.processing.endTime 
      ? state.processing.endTime - state.processing.startTime 
      : null,
    
    // Model selectors
    modelStatus: state.models,
    currentModelStatus: state.models[state.form.selectedChain],
    
    // Results selectors
    results: state.results,
    latestResult: state.results[state.results.length - 1] || null,
    
    // UI selectors
    theme: state.ui.theme,
    sidebarOpen: state.ui.sidebarOpen,
    modalOpen: state.ui.modalOpen
  };
};