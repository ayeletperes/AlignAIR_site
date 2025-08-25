import { useState, useEffect, useMemo } from 'react';
import { translateDNAtoAA } from '@/utils/alignment/translateUtils';

type Chain = 'heavy' | 'light' | 'trb';
type GridCell = { 
  i: number; 
  nt: string; 
  gnt: string;
  seg: 'V' | 'D' | 'J';
  np: number;
  mismatch: boolean;
  aa?: string; 
  aaIndex?: number;
  [k: string]: any 
};

interface UseAlignmentDataProps {
  results: any;
  referenceLoader: any;
  chain?: Chain;
}

interface AlignmentData {
  // Processed sequence data
  win: string;
  padL: number;
  
  // Segment boundaries
  vEnd: number;
  dStart: number;
  dEnd: number;
  jStart: number;
  jEnd: number;
  
  // Selected alleles
  selV: string;
  selD: string;
  selJ: string;
  setSelV: (value: string) => void;
  setSelD: (value: string) => void;
  setSelJ: (value: string) => void;
  
  // Germline sequences
  gV: string;
  gD: string;
  gJ: string;
  germline: string;
  germlineAAFull: string;
  
  // Grid data
  grid: GridCell[];
  fullAA: string;
  
  // Chain info
  normalized: 'heavy' | 'light';
  hasD: boolean;
}

/**
 * Custom hook to extract and process alignment data from AlignmentBrowser component
 * Handles sequence processing, germline building, and grid creation
 */
export const useAlignmentData = ({ results, referenceLoader, chain = 'heavy' }: UseAlignmentDataProps): AlignmentData | null => {
  // Selected alleles state
  const [selV, setSelV] = useState(results.v_call?.[0] || '');
  const [selD, setSelD] = useState(results.d_call?.[0] || '');
  const [selJ, setSelJ] = useState(results.j_call?.[0] || '');

  const normalized: 'heavy' | 'light' = chain === 'trb' ? 'heavy' : chain;
  const hasD = normalized === 'heavy' && results?.d_call?.[0] && results.d_call[0] !== 'Short-D';

  // Update selected alleles when results change
  useEffect(() => {
    setSelV(results.v_call?.[0] || '');
    setSelJ(results.j_call?.[0] || '');
    if (hasD) {
      setSelD(results.d_call?.[0] || '');
    } else {
      setSelD('');
    }
  }, [results, hasD]);

  // Build window sequence with padding
  const { win, padL } = useMemo(() => {
    const raw = typeof results?.sequence === 'string' ? results.sequence
            : typeof results?.sequence?.sequence === 'string' ? results.sequence.sequence
            : '';

    let win = raw.slice(results.v_sequence_start, results.j_sequence_end);
    let padL = 0;
    
    if (results.v_germline_start > 0) {
      padL = results.v_germline_start;
      win = '.'.repeat(padL) + win;
    }
    
    return { win, padL };
  }, [results]);

  // Calculate segment boundaries
  const boundaries = useMemo(() => {
    const vEnd = results.v_sequence_end - results.v_sequence_start + padL;
    const dStart = hasD ? results.d_sequence_start - results.v_sequence_start + padL : vEnd;
    const dEnd = hasD ? results.d_sequence_end - results.v_sequence_start + padL : dStart;
    const jStart = results.j_sequence_start - results.v_sequence_start + padL;
    const jEnd = results.j_sequence_end - results.v_sequence_start + padL;
    
    return { vEnd, dStart, dEnd, jStart, jEnd };
  }, [results, padL, hasD]);

  // Get germline sequences
  const gV = useMemo(() => (
    referenceLoader.getSequenceByLabel('V', selV, 'iuis')?.slice(0, results.v_germline_end) ?? ''
  ), [referenceLoader, selV, results.v_germline_end]);

  const gD = useMemo(() => (
    hasD ? (referenceLoader.getSequenceByLabel('D', selD, 'iuis')?.slice(results.d_germline_start, results.d_germline_end) ?? '') : ''
  ), [referenceLoader, selD, hasD, results.d_germline_start, results.d_germline_end]);

  const gJ = useMemo(() => (
    referenceLoader.getSequenceByLabel('J', selJ, 'iuis')?.slice(results.j_germline_start, results.j_germline_end) ?? ''
  ), [referenceLoader, selJ, results.j_germline_start, results.j_germline_end]);

  // Build full germline sequence
  const germline = useMemo(() => {
    const np1 = win.slice(boundaries.vEnd, boundaries.dStart);
    const np2 = win.slice(boundaries.dEnd, boundaries.jStart);
    
    return hasD ? gV + np1 + gD + np2 + gJ : gV + (win.slice(boundaries.vEnd, boundaries.jStart)) + gJ;
  }, [hasD, gV, gD, gJ, win, boundaries]);

  const germlineAAFull = useMemo(() => translateDNAtoAA(germline), [germline]);

  // Build AA mapping and grid
  const { fullAA, grid } = useMemo(() => {
    const fullAA = translateDNAtoAA(win);
    const aaAt = new Map<number, { aa: string; idx: number }>();
    
    // Map AA positions (AA sits on the 2nd base of each codon)
    for (let k = 0; k < fullAA.length; k++) {
      const mid = k * 3 + 1;
      if (mid < win.length) aaAt.set(mid, { aa: fullAA[k], idx: k });
    }

    // Build grid cells
    const grid: GridCell[] = Array.from(win, (nt: string, i: number) => {
      const seg: GridCell['seg'] =
        i < boundaries.vEnd ? 'V' : i < boundaries.jStart ? 'D' : 'J';
      const np: GridCell['np'] =
        i >= boundaries.vEnd && i < boundaries.dStart ? 1 :
        i >= boundaries.dEnd && i < boundaries.jStart ? 2 : 0;

      const gnt = germline[i] ?? '';
      return {
        i,
        nt,
        gnt,
        seg,
        np,
        mismatch: gnt ? gnt !== nt : false,
        ...(aaAt.has(i) ? { aa: aaAt.get(i)!.aa, aaIndex: aaAt.get(i)!.idx } : {})
      };
    });

    return { fullAA, grid };
  }, [win, germline, boundaries]);

  // Return null if data is not ready
  if (!win || !referenceLoader) {
    return null;
  }

  return {
    win,
    padL,
    ...boundaries,
    selV,
    selD,
    selJ,
    setSelV,
    setSelD,
    setSelJ,
    gV,
    gD,
    gJ,
    germline,
    germlineAAFull,
    grid,
    fullAA,
    normalized,
    hasD
  };
};