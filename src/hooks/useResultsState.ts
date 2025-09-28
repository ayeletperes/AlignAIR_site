/**
 * Custom hook for results state management
 * Provides consistent results handling across the application
 */

import { useCallback } from 'react';
import { useAlignment, useAlignmentSelectors } from '@/contexts/AlignmentContext';
import { AlignmentResult } from '@/types/alignment';

interface ResultsHandlers {
  clearResults: () => void;
  addResult: (result: AlignmentResult) => void;
  removeResult: (resultId: string) => void;
  clearAllResults: () => void;
}

interface ResultsState {
  results: AlignmentResult[];
  latestResult: AlignmentResult | null;
  hasResults: boolean;
  resultsCount: number;
}

export function useResultsState() {
  const { actions } = useAlignment();
  const { results, latestResult } = useAlignmentSelectors();

  // Results handlers
  const handlers: ResultsHandlers = {
    clearResults: useCallback(() => {
      actions.clearResults();
    }, [actions]),

    addResult: useCallback((result: AlignmentResult) => {
      // This would typically be handled by the processing orchestrator
      // But we provide it here for manual result management
      // TODO: Implement manual result addition if needed
    }, []),

    removeResult: useCallback((resultId: string) => {
      // This would require additional state management
      // For now, we only support clearing all results
      // TODO: Implement result removal if needed
    }, []),

    clearAllResults: useCallback(() => {
      actions.clearResults();
    }, [actions])
  };

  // Results state
  const state: ResultsState = {
    results,
    latestResult,
    hasResults: results.length > 0,
    resultsCount: results.length
  };

  // Results utilities
  const utilities = {
    getResultById: (resultId: string) => results.find(r => r.id === resultId),
    getResultsByChain: (chainType: string) => results.filter(r => r.chainType === chainType),
    getResultsByModel: (modelId: string) => results.filter(r => r.modelId === modelId),
    getProcessingTime: () => {
      if (!latestResult) return null;
      return latestResult.processingTime;
    },
    getConfidence: () => {
      if (!latestResult) return null;
      return latestResult.confidence;
    },
    getProductivity: () => {
      if (!latestResult) return null;
      return latestResult.productivity;
    }
  };

  return {
    // State
    ...state,
    
    // Handlers
    ...handlers,
    
    // Utilities
    ...utilities
  };
} 