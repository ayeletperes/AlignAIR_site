import { useMemo } from 'react';
import { numberIghv, splitRegions, findRegionIndicesForNtChunks } from '@/utils/alignment/regions';

type GridCell = { 
  i: number; 
  nt: string; 
  aa?: string; 
  region?: string;
  [k: string]: any 
};

type NtSpan = [number, number];
type RowRegion = { region: string; ntIndices: NtSpan };
type RowRegions = { regions: RowRegion[] };

interface UseAlignmentRegionsProps {
  Vrows: GridCell[][];
  Drows: GridCell[][];
  Jrows: GridCell[][];
  results: any;
  referenceLoader: any;
}

interface AlignmentRegions {
  VrowsR: GridCell[][];
  DrowsR: GridCell[][];
  JrowsR: GridCell[][];
  Vregions: any;
  Jregions: any;
}

const MAXCOLS = 45;

/**
 * Utility functions for region processing
 */
const span = (start: number, end: number): NtSpan => [start, end];

const chunkRows = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

function applyRegions(rows: GridCell[][], regions: RowRegions[] | null): GridCell[][] {
  if (!regions || regions.length === 0) return rows;

  const lastIdx = regions.length - 1;
  
  return rows.map((line, ri) => {
    const regObj = regions[Math.min(ri, lastIdx)];
    const regList = regObj?.regions ?? [];
    if (!regList.length) return line;
    const out = line.map(c => ({ ...c }));
    
    for (const rr of regList) {
       for (let j = 0; j < out.length; j++) {
         const cellIndex = out[j].i;
         if (cellIndex >= rr.ntIndices[0] && cellIndex < rr.ntIndices[1]) {
           out[j].region = rr.region;
         }
       }
     }
    return out;
  });
}

function makeDRegionsAllCdr3(rows: GridCell[][]): RowRegions[] {
  return rows.map(r => ({
    regions: [{ region: 'CDR3', ntIndices: span(r[0].i, (r[r.length - 1].i+1)) }]
  }));
}

function makeJRegionsFromAnchor(rows: GridCell[][], jAnchorLocal: number): RowRegions[] {
  let remain = jAnchorLocal; // CDR3 length in nt across entire J block
  const out: RowRegions[] = [];
  for (const r of rows) {
    const len = r.length;
    const cdr3EndHere = Math.max(0, Math.min(len, remain));
    const firstIdx = r[0].i;
    const lastIdx = (r[r.length - 1].i+1);
    const regions: RowRegion[] = [];
    if (cdr3EndHere > 0) regions.push({ region: 'CDR3', ntIndices: span(firstIdx, firstIdx + cdr3EndHere) });
    if (cdr3EndHere < len) regions.push({ region: 'FR4',  ntIndices: span(firstIdx + cdr3EndHere, lastIdx) });
    out.push({ regions });
    remain -= len;
  }
  return out;
}

/**
 * Custom hook to handle alignment region processing
 * Extracts region calculation logic from AlignmentBrowser component
 */
export const useAlignmentRegions = ({ 
  Vrows, 
  Drows, 
  Jrows, 
  results, 
  referenceLoader 
}: UseAlignmentRegionsProps): AlignmentRegions => {

  // Calculate V regions using IGHV numbering
  const Vregions = useMemo(() => {
    const vAA = Vrows.map(r => r.map(c => c.aa ?? '').join('').replace(/\s/g, '')).join('');
    const [gappedAA, gNotes] = numberIghv(vAA);
    
    if (gNotes !== '') return null;
    
    const vAArows = Vrows.map(r => r.map(c => c.aa ?? '').join('').replace(/\s/g, ''));
    const vNTrows = Vrows.map(r => r.map(c => c.nt).join(''));
    return findRegionIndicesForNtChunks(splitRegions(gappedAA || ''), vAArows, vNTrows);
  }, [Vrows]);

  // Calculate J regions using anchor positions
  const Jregions = useMemo(() => {
    const jCall = results.j_call?.[0];
    if (!jCall || Jrows.length === 0) return null;

    const anchor = referenceLoader.getAnchorByLabel('J', jCall, 'iuis');
    if (anchor == null) return null;

    // Global J start is the first index in the first J row
    const globalStartJ = Jrows[0][0].i;

    // Map anchor from germline coordinates into aligned nt indices
    const jAnchorIdx = anchor - results.j_germline_start + globalStartJ;

    return Jrows.map(row => {
      const rowStart = row[0].i;                       // inclusive
      const rowEnd = row[row.length - 1].i + 1;        // exclusive
      const ntChunk = row.map(c => c.nt).join('');

      // Clamp split to this row
      const split = Math.min(Math.max(jAnchorIdx, rowStart), rowEnd);

      const regions: { region: string, ntIndices: [number, number] }[] = [];
      if (split > rowStart) regions.push({ region: 'CDR3', ntIndices: [rowStart, split] });
      if (rowEnd > split) regions.push({ region: 'FR4', ntIndices: [split, rowEnd] });

      return { ntChunk, regions };
    });
  }, [Jrows, results.j_call, results.j_germline_start, referenceLoader]);

  // Apply regions to rows
  const processedRegions = useMemo(() => {
    // V regions processing
    const VregionsT: RowRegions[] | null = Vregions
      ? Vregions.map((row: any) => ({
          regions: (row.regions || []).map((r: any) => ({
            region: r.region,
            ntIndices: [r.ntIndices[0], r.ntIndices[1]] as [number, number]
          }))
        }))
      : null;
    const VrowsR = applyRegions(Vrows, VregionsT);

    // D regions - mark all as CDR3
    const DregionsAll = makeDRegionsAllCdr3(Drows);
    const DrowsR = applyRegions(Drows, DregionsAll);

    // J regions - split by anchor across rows
    let JrowsR = Jrows;
    const jCall = results?.j_call?.[0];
    const jAnchorAbs = jCall ? referenceLoader.getAnchorByLabel('J', jCall, 'iuis') : null;

    if (typeof jAnchorAbs === 'number') {
      const jAnchorLocal = jAnchorAbs - results.j_germline_start; // convert to J-block coords
      const JregionsAll = makeJRegionsFromAnchor(Jrows, jAnchorLocal);
      JrowsR = applyRegions(Jrows, JregionsAll);
    } else {
      // Fallback if you only have a single-row Jregions object
      const Jr: RowRegions[] | null = Jregions
        ? Jregions.map((row: any) => ({
            regions: (row.regions || []).map((r: any) => ({
              region: r.region,
              ntIndices: [r.ntIndices[0], r.ntIndices[1]] as [number, number]
            }))
          }))
        : null;
      JrowsR = applyRegions(Jrows, Jr);
    }

    return { VrowsR, DrowsR, JrowsR };
  }, [Vrows, Drows, Jrows, Vregions, Jregions, results, referenceLoader]);

  return {
    ...processedRegions,
    Vregions,
    Jregions
  };
};