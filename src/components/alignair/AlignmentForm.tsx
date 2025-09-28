/**
 * Alignment Form Component
 * Integrates the original form.tsx with new state management architecture
 */

import React from 'react';
import { useFormState } from '@/hooks/useFormState';
import { useProcessingState } from '@/hooks/useProcessingState';
import { useModelPreloader } from '@/hooks/useModelPreloader';
import { useResultsState } from '@/hooks/useResultsState';
import { useProcessingOrchestrator } from './ProcessingOrchestrator';
import { InputAdapter } from './InputAdapter';
import { MemoryOptimizer } from '@/utils/memoryOptimizer';
import { logger } from '@/utils/logger';

export function AlignmentForm() {
  // Form state management
  const {
    selectedChain,
    selectedModelId,
    isValid: isFormValid,
    errors: validationErrors,
    hasInput,
    setModel,
    clearForm
  } = useFormState();
  
  // Processing state management
  const { canStartProcessing, resetProcessing } = useProcessingState();
  
  // Model preloading
  const { isAnyModelLoading } = useModelPreloader();
  
  // Processing orchestrator
  const { processAlignment, isProcessing: orchestratorProcessing } = useProcessingOrchestrator();
  
  // Results state
  const { hasResults } = useResultsState();

  const handleFormSubmit = async (e: React.FormEvent) => {
    // Prevent any form submission - all submission should happen through button click only
    e.preventDefault();
    e.stopPropagation();
    logger.info('Form submit event prevented - use button instead');
  };

  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    logger.info('Button clicked manually by user');
    
    if (!canStartProcessing || orchestratorProcessing || isAnyModelLoading()) {
      logger.info('Cannot start - conditions not met');
      return;
    }

    // Directly call the processing function instead of dispatching form events
    try {
      await processAlignment();
    } catch (error) {
      logger.error('Failed to start processing:', error);
    }
  };

  const handleSetSelectedModelId = (modelId: string) => {
    setModel(modelId);
  };

  // Your original form JSX with the same beautiful design
  return (
    <section>
      <form onSubmit={handleFormSubmit}>
        <div className="relative pt-32 pb-10 md:pt-40 md:pb-16">
          <div className="max-w-6xl mx-auto px-2 sm:px-2">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              <span id="alignair" className="text-black dark:text-white">
                AlignAIR <sub className="text-black dark:text-white text-sm align-baseline">beta</sub>
              </span>
            </h1>
          </div>
          
          {/* Input components using adapter */}
          <InputAdapter 
            selectedChain={selectedChain}
            selectedModelId={selectedModelId}
            setSelectedModelId={handleSetSelectedModelId}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
            <div className="flex justify-center">
              {!hasResults ? (
                <button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={!canStartProcessing || orchestratorProcessing || isAnyModelLoading()}
                  className={`px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 ${
                    canStartProcessing && !orchestratorProcessing && !isAnyModelLoading()
                      ? 'bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  }`}
                >
                  {(orchestratorProcessing)
                    ? 'Processing...' 
                    : isAnyModelLoading()
                    ? 'Loading Models...'
                    : !isFormValid
                    ? 'Please provide input'
                    : 'Start Alignment Analysis'
                  }
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    clearForm();
                    resetProcessing();
                    // Perform memory cleanup
                    MemoryOptimizer.performCleanup();
                  }}
                  disabled={orchestratorProcessing || isAnyModelLoading()}
                  className="px-8 py-3 text-lg font-medium rounded-lg transition-all duration-200 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  Reset Results
                </button>
              )}
            </div>
            
            {!isFormValid && hasInput && !hasResults && (
              <div className="mt-4 text-center">
                <p className="text-sm text-red-500 dark:text-red-400">
                  Please check your input and ensure all required fields are completed.
                </p>
                {validationErrors.length > 0 && (
                  <ul className="mt-2 text-xs text-red-500 dark:text-red-400">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
