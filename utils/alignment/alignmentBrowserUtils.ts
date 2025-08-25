/**
 * Shared Utilities for Alignment Browser Components
 * Consolidates common functions used across VDJ, VJ, and DShort browsers
 */

import { translateDNAtoAA } from '@/utils/alignment/translateUtils';
import { GetSequenceMismatchIdx } from '@/utils/alignment/mismatchUtils';

/**
 * Common validation for alignment results
 */
export const validateAlignmentResults = (results: any): boolean => {
  return !!(results && results.sequence && 
           typeof results.v_sequence_start === 'number' && 
           typeof results.j_sequence_end === 'number');
};

/**
 * Common validation error component props
 */
export const VALIDATION_ERROR_MESSAGE = {
  title: "Invalid Results",
  message: "The alignment results are missing required data. Please email support@alignair.ai."
};

/**
 * Common indel warning component props
 */
export const INDEL_WARNING_MESSAGE = {
  title: "Indel Detected",
  message: "This sequence contains insertions or deletions that may affect alignment visualization."
};

/**
 * Process sequence with padding for germline start
 */
export const processSequenceWithPadding = (
  originalSequence: string,
  vSeqStart: number,
  jSeqEnd: number,
  vGermlineStart?: number
): { sequence: string; sequenceAA: string; paddSize: number } => {
  let sequence = originalSequence.slice(vSeqStart, jSeqEnd);
  let paddSize = 0;
  
  // Add padding if germline start > 0
  if (vGermlineStart && vGermlineStart > 0) {
    paddSize = vGermlineStart;
    const padding = '.'.repeat(paddSize);
    sequence = padding + sequence;
  }
  
  const sequenceAA = translateDNAtoAA(sequence);
  
  return { sequence, sequenceAA, paddSize };
};

/**
 * Calculate adjusted sequence positions
 */
export const calculateAdjustedPositions = (
  results: any,
  paddSize: number
) => {
  const vSeqStart = results.v_sequence_start;
  return {
    vSeqEnd: results.v_sequence_end - vSeqStart + paddSize,
    dSeqStart: results.d_sequence_start ? results.d_sequence_start - vSeqStart + paddSize : undefined,
    dSeqEnd: results.d_sequence_end ? results.d_sequence_end - vSeqStart + paddSize : undefined,
    jSeqStart: results.j_sequence_start - vSeqStart + paddSize,
    jSeqEnd: results.j_sequence_end - vSeqStart + paddSize
  };
};

/**
 * Calculate mismatches for a segment
 */
export const calculateSegmentMismatches = (
  segmentSequence: string,
  referenceSequence: string,
  maxCharsPerRow: number = 100
): { [key: number]: number[] } => {
  return GetSequenceMismatchIdx(
    segmentSequence,
    referenceSequence,
    maxCharsPerRow
  );
};

/**
 * Create reference map with Short-D option for heavy chain
 */
export const createReferenceWithShortD = (referenceAlleles: any) => {
  return {
    ...referenceAlleles.D,
    ["Short-D"]: { sequence: "", anchor: 0, iuis: "", iglabel: "", asc: "" }
  };
};

/**
 * Common legend configuration
 */
export const LEGEND_CONFIG = {
  segments: [
    { name: 'V Region', color: 'bg-purple-500' },
    { name: 'D Region', color: 'bg-blue-500' },
    { name: 'J Region', color: 'bg-green-500' }
  ],
  patterns: [
    { name: 'Match', description: 'Matching nucleotides', style: 'bg-white text-black' },
    { name: 'Mismatch', description: 'Mismatched nucleotides', style: 'bg-red-500 text-white' },
    { name: 'Gap', description: 'Gaps in alignment', style: 'bg-gray-300 text-gray-600' }
  ]
};

/**
 * Get legend for specific segments (V, D, J or V, J)
 */
export const getLegendForSegments = (hasD: boolean) => {
  const segments = hasD 
    ? LEGEND_CONFIG.segments 
    : LEGEND_CONFIG.segments.filter(s => s.name !== 'D Region');
    
  return {
    segments,
    patterns: LEGEND_CONFIG.patterns
  };
};

/**
 * Common styling classes
 */
export const ALIGNMENT_STYLES = {
  container: "bg-white p-6 rounded-lg shadow-lg",
  title: "text-xl font-bold text-gray-800 mb-4",
  warning: "flex items-center space-x-3 bg-yellow-100 p-4 rounded-md",
  warningIcon: "text-2xl",
  warningTitle: "text-lg font-semibold text-black",
  warningMessage: "text-sm text-black",
  selectorContainer: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",
  alignmentContainer: "border rounded-lg p-4 bg-gray-50",
  legend: "mt-4 p-3 bg-gray-100 rounded-lg"
};

/**
 * Extract allele selection data for selectors
 */
export const extractAlleleData = (results: any, segment: 'v' | 'd' | 'j') => {
  const calls = results[`${segment}_call`];
  const likelihoods = results[`${segment}_likelihood`];
  
  if (!calls || calls.length === 0) {
    return null;
  }
  
  return { calls, likelihoods };
};