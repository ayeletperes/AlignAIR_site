/**
 * Custom hook for processing state management
 * Handles the alignment processing pipeline state
 */

import { useCallback, useEffect, useRef } from 'react';
import { ProcessingStep, ProcessingProgress, AlignmentResult } from '@/types/alignment';
import { AppConfig } from '@/config/app.config';
import { useAlignment } from '@/contexts/AlignmentContext';
import { ErrorHandler } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

interface ProcessingHooks {
  onStepChange?: (step: ProcessingStep) => void;
  onProgress?: (progress: ProcessingProgress) => void;
  onComplete?: (result: AlignmentResult) => void;
  onError?: (error: any) => void;
}

export function useProcessingState(hooks: ProcessingHooks = {}) {
  const { state, actions } = useAlignment();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const processing = state.processing;
  const { onStepChange, onProgress, onComplete, onError } = hooks;

  /**
   * Start processing with optional initial message
   */
  const startProcessing = useCallback((initialMessage?: string) => {
    actions.startProcessing(initialMessage);
    
    // Set overall timeout
    timeoutRef.current = setTimeout(() => {
      const timeoutError = ErrorHandler.createProcessingError(
        processing.currentStep,
        'Processing timed out',
        { timeout: AppConfig.processing.timeouts.inference }
      );
      actions.errorProcessing(timeoutError.toAlignmentError());
    }, AppConfig.processing.timeouts.inference);
    
    logger.info('[ProcessingState] Started processing');
  }, [actions, processing.currentStep]);

  /**
   * Update processing step and progress
   */
  const updateStep = useCallback((
    step: ProcessingStep, 
    progress: number, 
    message: string
  ) => {
    const progressUpdate: ProcessingProgress = {
      step,
      progress: Math.max(0, Math.min(100, progress)),
      message,
      timestamp: Date.now()
    };

    actions.updateProcessing({
      currentStep: step,
      progress: [progressUpdate]
    });

    onStepChange?.(step);
    onProgress?.(progressUpdate);
    
    logger.info(`[ProcessingState] Step: ${step} (${progress}%) - ${message}`);
  }, [actions, onStepChange, onProgress]);

  /**
   * Add progress update without changing step
   */
  const addProgress = useCallback((progress: number, message: string) => {
    const progressUpdate: ProcessingProgress = {
      step: processing.currentStep,
      progress: Math.max(0, Math.min(100, progress)),
      message,
      timestamp: Date.now()
    };

    actions.updateProcessing({
      progress: [progressUpdate]
    });

    onProgress?.(progressUpdate);
  }, [actions, processing.currentStep, onProgress]);

  /**
   * Complete processing with result
   */
  const completeProcessing = useCallback((result: AlignmentResult) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    actions.completeProcessing(result);
    onComplete?.(result);
    
    logger.info('[ProcessingState] Processing completed successfully');
  }, [actions, onComplete]);

  /**
   * Handle processing error
   */
  const errorProcessing = useCallback((error: any) => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const alignmentError = ErrorHandler.handle(error, 'ProcessingState');
    actions.errorProcessing(alignmentError);
    onError?.(alignmentError);
    
    logger.error('[ProcessingState] Processing failed:', alignmentError);
  }, [actions, onError]);

  /**
   * Reset processing state
   */
  const resetProcessing = useCallback(() => {
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    actions.resetProcessing();
    logger.info('[ProcessingState] Processing state reset');
  }, [actions]);

  /**
   * Get current progress percentage
   */
  const getCurrentProgress = useCallback((): number => {
    if (processing.progress.length === 0) return 0;
    return processing.progress[processing.progress.length - 1].progress;
  }, [processing.progress]);

  /**
   * Get processing duration
   */
  const getProcessingDuration = useCallback((): number | null => {
    if (!processing.startTime) return null;
    const endTime = processing.endTime || Date.now();
    return endTime - processing.startTime;
  }, [processing.startTime, processing.endTime]);

  /**
   * Get step-by-step progress
   */
  const getStepProgress = useCallback(() => {
    const steps: Record<ProcessingStep, { completed: boolean; progress: number; message?: string }> = {
      idle: { completed: false, progress: 0 },
      validating: { completed: false, progress: 0 },
      preprocessing: { completed: false, progress: 0 },
      inference: { completed: false, progress: 0 },
      postprocessing: { completed: false, progress: 0 },
      complete: { completed: false, progress: 0 },
      error: { completed: false, progress: 0 }
    };

    // Fill in progress from processing history
    processing.progress.forEach(p => {
      steps[p.step] = {
        completed: p.progress === 100,
        progress: p.progress,
        message: p.message
      };
    });

    // Mark completed steps
    const stepOrder: ProcessingStep[] = ['validating', 'preprocessing', 'inference', 'postprocessing'];
    const currentStepIndex = stepOrder.indexOf(processing.currentStep);
    
    stepOrder.forEach((step, index) => {
      if (index < currentStepIndex) {
        steps[step].completed = true;
        if (steps[step].progress < 100) {
          steps[step].progress = 100;
        }
      }
    });

    return steps;
  }, [processing.progress, processing.currentStep]);

  /**
   * Check if processing can be started
   */
  const canStartProcessing = useCallback((): boolean => {
    return !processing.isProcessing && state.form.isValid;
  }, [processing.isProcessing, state.form.isValid]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isProcessing: processing.isProcessing,
    currentStep: processing.currentStep,
    progress: processing.progress,
    error: processing.error,
    startTime: processing.startTime,
    endTime: processing.endTime,
    
    // Computed
    currentProgress: getCurrentProgress(),
    processingDuration: getProcessingDuration(),
    stepProgress: getStepProgress(),
    canStartProcessing: canStartProcessing(),
    
    // Actions
    startProcessing,
    updateStep,
    addProgress,
    completeProcessing,
    errorProcessing,
    resetProcessing
  };
}