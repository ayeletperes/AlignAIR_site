/**
 * Processing Orchestrator Component
 * Manages the alignment processing pipeline
 */

import { useCallback } from 'react';
import { useProcessingState } from '@/hooks/useProcessingState';
import { useAlignmentSelectors } from '@/contexts/AlignmentContext';
import { AlignmentResult, ProcessingStep } from '@/types/alignment';
import { ErrorHandler } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import { submitAlignmentRequestById } from '@/lib/submission/alignmentSubmission';

/**
 * Hook to use the processing orchestrator
 */
export function useProcessingOrchestrator() {
  const { input, selectedModelId, params, isFormValid } = useAlignmentSelectors();
  
  const {
    startProcessing,
    updateStep,
    addProgress,
    completeProcessing,
    errorProcessing,
    isProcessing
  } = useProcessingState({
    onStepChange: (step: ProcessingStep) => {
      logger.info(`[ProcessingOrchestrator] Step changed to: ${step}`);
    },
    onComplete: (_result: AlignmentResult) => {
      logger.info('[ProcessingOrchestrator] Processing completed successfully');
    },
    onError: (error: any) => {
      logger.error('[ProcessingOrchestrator] Processing error:', error);
    }
  });

  /**
   * Main processing function
   */
  const processAlignment = useCallback(async (): Promise<void> => {
    logger.info('[ProcessingOrchestrator] processAlignment called', {
      isFormValid,
      hasInput: !!input,
      isProcessing,
      selectedModelId
    });
    
    if (!isFormValid || !input || isProcessing || !selectedModelId) {
      logger.warn('[ProcessingOrchestrator] Cannot start processing - invalid state');
      return;
    }

    try {
      // Start processing
      startProcessing('Initializing alignment...');

      // Prepare form data for submission
      const formData = {
        modelId: selectedModelId,
        input: input.type === 'file' ? (input as any).file : input.content,
        flag: input.type as 'file' | 'sequence',
        params: params
      };

      // Create progress callback that updates our processing state
      const setProgress = (progress: number) => {
        let step: ProcessingStep = 'preprocessing';
        let message = 'Processing...';
        
        if (progress <= 20) {
          step = 'validating';
          message = 'Loading model...';
        } else if (progress <= 40) {
          step = 'preprocessing';
          message = 'Processing sequences...';
        } else if (progress <= 70) {
          step = 'inference';
          message = 'Running alignment analysis...';
        } else if (progress < 100) {
          step = 'postprocessing';
          message = 'Finalizing results...';
        } else {
          step = 'complete';
          message = 'Processing complete!';
        }
        
        updateStep(step, progress, message);
      };

      // Call the real alignment submission function
      let result: any = await submitAlignmentRequestById(
        formData,
        setProgress
      );
      
      // Create result object compatible with both AlignmentResult interface and Results component
      result = {
        id: `result-${Date.now()}`,
        modelId: selectedModelId,
        timestamp: Date.now(),
        ...result
      };

      // Complete processing
      updateStep('complete', 100, 'Processing complete!');
      completeProcessing(result);

    } catch (error) {
      const alignmentError = ErrorHandler.handle(error instanceof Error ? error : new Error(String(error)), 'ProcessingOrchestrator');
      errorProcessing(alignmentError);
    }
  }, [
    isFormValid, 
    input, 
    isProcessing, 
    selectedModelId, 
    params,
    startProcessing,
    updateStep,
    addProgress,
    completeProcessing,
    errorProcessing
  ]);

  return {
    processAlignment,
    isProcessing
  };
}

export function ProcessingOrchestrator(): null {
  // This component doesn't render anything visible - it's purely for logic
  // The actual processing logic is now in the useProcessingOrchestrator hook
  return null;
}
