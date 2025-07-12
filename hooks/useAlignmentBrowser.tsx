import { useState, useEffect, useMemo, useCallback } from 'react';
import { splitSequence } from '@components/results/alignment/utils/splitSequence';
import { GetSequenceMismatchIdx } from '@components/results/alignment/utils/mismatchUtils';
import { translateDNAtoAA } from '@components/results/alignment/utils/translateUtils';
import { numberIghv, splitRegions, findRegionIndicesForNtChunks } from '@components/results/alignment/utils/regions';
import { logger } from '@components/utils/logger';

interface AlignmentData {
  results: any;
  referenceAlleles: any;
  maxCharsPerRow?: number;
}

interface AlignmentState {
  selectedSequenceV: string;
  selectedSequenceD: string;
  selectedSequenceJ: string;
  selectedAlleleV: string;
  selectedAlleleD: string;
  selectedAlleleJ: string;
  splitedSequenceV: string[];
  splitedSequenceD: string[];
  splitedSequenceJ: string[];
  mismatchV: { [key: number]: number[] };
  mismatchD: { [key: number]: number[] };
  mismatchJ: { [key: number]: number[] };
  splitedGVAA: string[];
  splitedGDAA: string[];
  splitedGJAA: string[];
  germline: { [key: string]: string };
  germlineAA: string;
  splitedNP2: number[];
}

export const useAlignmentBrowser = ({ results, referenceAlleles, maxCharsPerRow = 45 }: AlignmentData) => {
  // State management
  const [state, setState] = useState<AlignmentState>({
    selectedSequenceV: '',
    selectedSequenceD: '',
    selectedSequenceJ: '',
    selectedAlleleV: results.v_call[0],
    selectedAlleleD: results.d_call[0],
    selectedAlleleJ: results.j_call[0],
    splitedSequenceV: [],
    splitedSequenceD: [],
    splitedSequenceJ: [],
    mismatchV: {},
    mismatchD: {},
    mismatchJ: {},
    splitedGVAA: [],
    splitedGDAA: [],
    splitedGJAA: [],
    germline: {},
    germlineAA: '',
    splitedNP2: []
  });

  // Memoized computations
  const sequenceData = useMemo(() => {
    if (!results) return null;

    let sequence = results.sequence.slice(results.v_sequence_start, results.j_sequence_end);
    let sequenceAA = translateDNAtoAA(sequence);
    let paddSize = 0;

    if (results.v_germline_start > 0) {
      paddSize = results.v_germline_start;
      const padding = '.'.repeat(paddSize);
      sequence = padding + sequence;
      sequenceAA = translateDNAtoAA(sequence);
    }

    const vSeqStart = 0;
    const vSeqEnd = results.v_sequence_end - results.v_sequence_start + paddSize;
    const dSeqStart = results.d_sequence_start - results.v_sequence_start + paddSize;
    const dSeqEnd = results.d_sequence_end - results.v_sequence_start + paddSize;
    const jSeqStart = results.j_sequence_start - results.v_sequence_start + paddSize;
    const jSeqEnd = results.j_sequence_end - results.v_sequence_start + paddSize;

    let vAAIndex = Math.floor(vSeqEnd / 3);
    let jAAIndex = Math.floor(jSeqStart / 3);

    let sequenceV = sequenceAA.slice(0, vAAIndex);
    let sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
    let sequenceJ = sequenceAA.slice(jAAIndex);

    const remainingV = vSeqEnd - (sequenceV.length * 3);
    const remainingD = jSeqStart - ((sequenceV.length + sequenceD.length) * 3);

    // Handle amino acid splitting logic
    if (remainingV === 2) {
      vAAIndex = vAAIndex + 1;
      sequenceV = sequenceAA.slice(0, vAAIndex);

      if (remainingD === 2) {
        jAAIndex = jAAIndex + 1;
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex);
      } else {
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex);
      }
    } else {
      sequenceV = sequenceAA.slice(0, vAAIndex);
      if (remainingD === 2) {
        jAAIndex = jAAIndex + 1;
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex);
      } else {
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex);
      }
    }

    return {
      sequence,
      sequenceAA,
      sequenceV,
      sequenceD,
      sequenceJ,
      vSeqStart,
      vSeqEnd,
      dSeqStart,
      dSeqEnd,
      jSeqStart,
      jSeqEnd,
      vAAIndex,
      jAAIndex,
      paddSize
    };
  }, [results]);

  const splitData = useMemo(() => {
    if (!sequenceData) return null;

    const { sequence, sequenceV, sequenceD, sequenceJ, vSeqStart, vSeqEnd, jSeqStart } = sequenceData;

    const splitV = splitSequence(sequence.slice(vSeqStart, vSeqEnd), maxCharsPerRow);
    const splitVAA = splitSequence(sequenceV, maxCharsPerRow / 3);
    const splitD = splitSequence(sequence.slice(vSeqEnd, jSeqStart), maxCharsPerRow);
    const splitDAA = splitSequence(sequenceD, maxCharsPerRow / 3);
    const splitJ = splitSequence(sequence.slice(jSeqStart), maxCharsPerRow);
    const splitJAA = splitSequence(sequenceJ, maxCharsPerRow / 3);

    return {
      splitV,
      splitVAA,
      splitD,
      splitDAA,
      splitJ,
      splitJAA
    };
  }, [sequenceData, maxCharsPerRow]);

  const np2Data = useMemo(() => {
    if (!sequenceData || !splitData) return null;

    const { vSeqEnd, dSeqEnd, jSeqStart } = sequenceData;
    const { splitD } = splitData;

    let chunkStart = vSeqEnd;
    const np2CountsInDChunks: number[] = splitD.map(chunk => {
      const chunkEnd = chunkStart + chunk.length;
      const overlapStart = Math.max(chunkStart, dSeqEnd);
      const overlapEnd = Math.min(chunkEnd, jSeqStart);
      const overlap = Math.max(0, overlapEnd - overlapStart);
      chunkStart += chunk.length;
      return overlap;
    });

    return { np2CountsInDChunks };
  }, [sequenceData, splitData]);

  const regionsData = useMemo(() => {
    if (!sequenceData || !splitData || !results) return null;

    const { sequenceV } = sequenceData;
    const { splitV, splitVAA, splitD, splitJ } = splitData;

    const [gappedAA, gappNotes] = numberIghv(sequenceV);

    let Vregions = null;
    let Jregions = null;
    let Dregions = null;

    if (gappNotes === '') {
      const regionGappedAA = gappedAA ? splitRegions(gappedAA) : { '': '' };
      Vregions = findRegionIndicesForNtChunks(regionGappedAA, splitVAA, splitV);

      Dregions = [
        {
          ntChunk: splitD[0],
          regions: [
            {
              region: 'CDR3',
              ntIndices: [0, splitD[0].length]
            }
          ]
        }
      ];

      const anchor = results.j_call[0] ? referenceAlleles.J[results.j_call[0]].anchor : null;
      if (anchor) {
        const janchoridx = anchor - results.j_germline_start;
        Jregions = [
          {
            ntChunk: splitJ[0],
            regions: [
              {
                region: 'CDR3',
                ntIndices: [0, janchoridx]
              },
              {
                region: 'FR4',
                ntIndices: [janchoridx, splitJ[0].length]
              }
            ]
          }
        ];
      }
    }

    return { Vregions, Jregions, Dregions };
  }, [sequenceData, splitData, results, referenceAlleles]);

  // Effects for state updates
  useEffect(() => {
    if (!results || !referenceAlleles) return;

    setState(prev => ({
      ...prev,
      selectedSequenceV: referenceAlleles.V[results.v_call[0]]?.sequence?.slice(0, results.v_germline_end) || '',
      selectedSequenceD: referenceAlleles.D[results.d_call[0]]?.sequence?.slice(results.d_germline_start, results.d_germline_end) || '',
      selectedSequenceJ: referenceAlleles.J[results.j_call[0]]?.sequence?.slice(results.j_germline_start, results.j_germline_end) || ''
    }));
  }, [results, referenceAlleles]);

  useEffect(() => {
    if (!state.selectedSequenceV || !state.selectedSequenceD || !state.selectedSequenceJ) return;

    setState(prev => ({
      ...prev,
      splitedSequenceV: splitSequence(state.selectedSequenceV, maxCharsPerRow),
      splitedSequenceD: splitSequence(state.selectedSequenceD, maxCharsPerRow),
      splitedSequenceJ: splitSequence(state.selectedSequenceJ, maxCharsPerRow)
    }));
  }, [state.selectedSequenceV, state.selectedSequenceD, state.selectedSequenceJ, maxCharsPerRow]);

  useEffect(() => {
    if (!sequenceData || !state.selectedSequenceV || !state.selectedSequenceD || !state.selectedSequenceJ) return;

    const { vSeqStart, vSeqEnd, dSeqStart, dSeqEnd, jSeqStart } = sequenceData;

    setState(prev => ({
      ...prev,
      mismatchV: GetSequenceMismatchIdx(
        sequenceData.sequence.slice(vSeqStart, vSeqEnd),
        state.selectedSequenceV,
        maxCharsPerRow
      ),
      mismatchD: GetSequenceMismatchIdx(
        sequenceData.sequence.slice(dSeqStart, dSeqEnd),
        state.selectedSequenceD,
        maxCharsPerRow
      ),
      mismatchJ: GetSequenceMismatchIdx(
        sequenceData.sequence.slice(jSeqStart),
        state.selectedSequenceJ,
        maxCharsPerRow
      )
    }));
  }, [results, state.selectedSequenceV, state.selectedSequenceD, state.selectedSequenceJ, sequenceData, maxCharsPerRow]);

  // Action handlers
  const updateSelectedSequence = useCallback((segment: 'V' | 'D' | 'J', sequence: string, allele: string) => {
    setState(prev => ({
      ...prev,
      [`selectedSequence${segment}`]: sequence,
      [`selectedAllele${segment}`]: allele
    }));
  }, []);

  const updateGermline = useCallback((germlineData: { [key: string]: string }) => {
    setState(prev => ({
      ...prev,
      germline: germlineData
    }));
  }, []);

  return {
    state,
    sequenceData,
    splitData,
    np2Data,
    regionsData,
    updateSelectedSequence,
    updateGermline,
    setState
  };
}; 