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
import { submitAlignmentRequestById, AlignmentPhase } from '@/lib/submission/alignmentSubmission';

// Map internal pipeline phases to the orchestrator's ProcessingStep enum and a
// user-visible label. Keeping this here (not in alignmentSubmission) so the
// pipeline stays UI-agnostic.
const PHASE_TO_STEP: Record<AlignmentPhase, { step: ProcessingStep; message: string }> = {
  'loading-model': { step: 'validating', message: 'Loading model…' },
  'tokenizing': { step: 'preprocessing', message: 'Tokenizing sequences…' },
  'inferring': { step: 'inference', message: 'Running alignment inference…' },
  'postprocessing': { step: 'postprocessing', message: 'Finalizing results…' },
  'complete': { step: 'complete', message: 'Processing complete!' },
};

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

      // Phase is the source of truth for which step is highlighted; the
      // numeric progress only drives the progress-bar width.
      let currentStep: ProcessingStep = 'validating';
      let currentMessage = 'Loading model…';

      const setPhase = (phase: AlignmentPhase) => {
        const mapped = PHASE_TO_STEP[phase];
        currentStep = mapped.step;
        currentMessage = mapped.message;
      };

      const setProgress = (progress: number) => {
        updateStep(currentStep, progress, currentMessage);
      };

      // Call the real alignment submission function
      let result: any = await submitAlignmentRequestById(
        selectedModelId,
        input.type === 'file' ? (input as any).file : input.content,
        input.type as 'file' | 'sequence',
        params,
        { setProgress, setPhase }
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
