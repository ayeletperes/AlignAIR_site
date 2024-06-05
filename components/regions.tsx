import React from 'react';
// Copyright (c) 2021 William Lees

// This source code, and any executable file compiled or derived from it, is governed by the European Union Public License v. 1.2,
// the English version of which is available here: https://perma.cc/DK5U-NDVE

function* chunks(l: string, n: number) {
    for (let i = 0; i < l.length; i += n) {
      yield l.slice(i, i + n);
    }
  }


function ntDiff(s1: string, s2: string): number {
    let diffs = 0;
    const row = Array.from(s1.toUpperCase()).map((char, index) => [char, s2.toUpperCase()[index]]);
  
    for (const [char1, char2] of row) {
      if (char1 !== char2 && !['X', 'N'].includes(char1) && !['X', 'N'].includes(char2)) {
        diffs += 1;
      }
    }
  
    diffs += Math.abs(s1.length - s2.length);
    return diffs;
  }
  
function distributeCdr(cdr: string, length: number): string {
    const cdrDiv = Math.floor(cdr.length / 2);
  
    if (2 * cdrDiv === cdr.length) {
      return cdr.slice(0, cdrDiv) + '.'.repeat(length - cdr.length) + cdr.slice(cdrDiv);
    } else {
      return cdr.slice(0, cdrDiv + 1) + '.'.repeat(length - cdr.length) + cdr.slice(cdrDiv + 1);
    }
  }
  
function matchScore(target: string, matchList: string[][], thresh: number): [number, number][] {
    const res: [number, number][] = [];
    for (let i = 0; i < target.length - matchList.length + 1; i++) {
      let score = 0;
      for (let j = 0; j < matchList.length; j++) {
        if (matchList[j].includes(target[i + j])) {
          score += 1;
        }
      }
      if (score >= thresh) {
        res.push([i, score]);
      }
    }
    return res;
  }
  
function numberFromTrp(seq: string, nextP: number, gapped: string, trpPos: number): [number | null, string | null] {
    gapped += distributeCdr(seq.slice(nextP, trpPos - 2), 12);
    gapped += seq.slice(trpPos - 2, trpPos + 1);
    nextP = trpPos + 1;
  
    gapped += seq.slice(nextP, nextP + 14);
    nextP += 14;
  
    let foundMotif = false;
    let matchIndex = 0;
    const motifRange = seq.slice(nextP + 10, nextP + 21);
  
    for (const match of matchScore(motifRange, [['K', 'R'], ['L', 'I', 'V', 'F', 'T', 'A'], ['T', 'S', 'I', 'A']], 2)) {
      const cysRange = seq.slice(nextP + 10 + match[0] + 26, nextP + 10 + match[0] + 29);
      if (cysRange.includes('C')) {
        matchIndex = nextP + 10 + match[0];
        foundMotif = true;
        break;
      }
    }
  
    if (!foundMotif) return [null, null];
  
    const cdr2Leader = gapped.slice(49, 54);
    const confidence = matchScore(cdr2Leader, [['L'], ['E'], ['W'], ['I'], ['G']], 0);
    const confidenceScore = confidence.length > 0 ? confidence[0][1] : 0;
  
    const cdr2 = seq.slice(nextP, matchIndex - 10);
    gapped += distributeCdr(cdr2, 10);
    gapped += seq.slice(matchIndex - 10);
  
    const cIndex = seq.slice(matchIndex + 26, matchIndex + 29).indexOf('C');
    if (cIndex < 2) {
      gapped = gapped.slice(0, 72) + '.'.repeat(2 - cIndex) + gapped.slice(72);
    }
  
    return [confidenceScore, gapped];
  }
  
function numberIghv(seq: string): [string | null, string] {
    let gapped = '';
  
    if (!seq.slice(21, 23).includes('C')) {
      return [null, 'First conserved cysteine not found'];
    }
  
    if (seq[21] === 'C') {
      gapped += seq.slice(0, 9) + '.' + seq.slice(9, 25);
      var nextP = 25;
    } else {
      gapped += seq.slice(0, 26);
      nextP = 26;
    }
  
    if (!seq.slice(33, 42).includes('W')) {
      return [null, 'Conserved Trp not found'];
    }
  
    const trpPos = Array.from(seq.slice(33, 42)).map((char, index) => char === 'W' ? 33 + index : -1).filter(pos => pos !== -1);
  
    let maxConf = -1;
    let bestResult = '';
    for (const pos of trpPos) {
      const [confidence, result] = numberFromTrp(seq, nextP, gapped, pos);
      if (confidence !== null && confidence > maxConf) {
        bestResult = result!;
        maxConf = confidence;
      }
    }
  
    if (maxConf >= 0) {
      return [bestResult, ''];
    } else {
      return [null, 'CDR2 or 2nd Cys not found'];
    }
  }
  
function insertSpace(seq: string, pos: number): string {
    return seq.slice(0, pos) + ' ' + seq.slice(pos);
  }
  
const prettyHeader = `
            FR1-IMGT          CDR1-IMGT       FR2-IMGT     CDR2-IMGT                 FR3-IMGT
            (1-26)            (27-38)        (39-55)       (56-65)                  (66-104)
1       10        20         30         40        50         60         70        80        90        100     
.........|.........|...... ...|........ .|.........|..... ....|..... ....|.........|.........|.........|....`;
  
function prettyGapped(seq: string): string {
    seq = insertSpace(seq, 65);
    seq = insertSpace(seq, 55);
    seq = insertSpace(seq, 38);
    seq = insertSpace(seq, 26);
  
    return `${prettyHeader}\n${seq}`;
  }

function splitRegions(seq: string): {[key: string]: string} {
    const regions = ['FR1', 'CDR1', 'FR2', 'CDR2', 'FR3', 'CDR3'];
    const regionStarts = [1, 27, 39, 56, 66, 105];
    const regionEnds = [26, 38, 55, 65, 104, seq.length];
    
    const regionSeq = regions.reduce((acc, region, i) => {
        const regionSeq = seq.slice(regionStarts[i] - 1, regionEnds[i]);
        return {...acc, [region]: regionSeq};
    }, {});

    return regionSeq;
}

function findRegionIndices(gappedAaRegions: string[], ungappedAaSeq: string, ungappedNtSeq: string): { region: string, ntIndices: [number, number] }[] {
    let currentAaIndex = 0;
    const ntIndices: { region: string, ntIndices: [number, number] }[] = [];
  
    for (const region of gappedAaRegions) {
      const regionUngapped = region.replace(/\./g, '');
      const startAaIndex = ungappedAaSeq.indexOf(regionUngapped, currentAaIndex);
  
      if (startAaIndex === -1) {
        throw new Error(`Region ${regionUngapped} not found in ungapped AA sequence.`);
      }
  
      const endAaIndex = startAaIndex + regionUngapped.length;
      const startNtIndex = startAaIndex * 3;
      const endNtIndex = endAaIndex * 3;
  
      ntIndices.push({
        region,
        ntIndices: [startNtIndex, endNtIndex]
      });
  
      currentAaIndex = endAaIndex;
    }
  
    return ntIndices;
  }

  function concatenateChunks(chunks: string[]): string {
    return chunks.join('');
  }

  
function findRegionIndicesInChunks(gappedAaRegions: string[], ungappedAaChunks: string[], ungappedNtChunks: string[]): { region: string, ntIndices: [number, number] }[] {
    const ungappedAaSeq = concatenateChunks(ungappedAaChunks);
    const ungappedNtSeq = concatenateChunks(ungappedNtChunks);
  
    let currentAaIndex = 0;
    const ntIndices: { region: string, ntIndices: [number, number] }[] = [];
  
    for (const region of gappedAaRegions) {
      const regionUngapped = region.replace(/\./g, '');
      const startAaIndex = ungappedAaSeq.indexOf(regionUngapped, currentAaIndex);
  
      if (startAaIndex === -1) {
        throw new Error(`Region ${regionUngapped} not found in ungapped AA sequence.`);
      }
  
      const endAaIndex = startAaIndex + regionUngapped.length;
      const startNtIndex = startAaIndex * 3;
      const endNtIndex = endAaIndex * 3;
  
      ntIndices.push({
        region,
        ntIndices: [startNtIndex, endNtIndex]
      });
  
      currentAaIndex = endAaIndex;
    }
  
    return ntIndices;
  }

  function findRegionIndicesForNtChunks(gappedAaRegions: {[key: string]: string}, ungappedAaChunks: string[], ungappedNtChunks: string[]): { ntChunk: string, regions: { region: string, ntIndices: [number, number] }[] }[] {
    
    const ungappedAaSeq = concatenateChunks(ungappedAaChunks);
    const ungappedNtSeq = concatenateChunks(ungappedNtChunks);
  
    const result: { ntChunk: string, regions: { region: string, ntIndices: [number, number] }[] }[] = [];
  
    for (const ntChunk of ungappedNtChunks) {
      const startNtIndex = ungappedNtSeq.indexOf(ntChunk);
      const endNtIndex = startNtIndex + ntChunk.length;
  
      const chunkRegions: { region: string, ntIndices: [number, number] }[] = [];
  
      Object.entries(gappedAaRegions).forEach(([region, sequence]) => {
        const regionUngapped = sequence.replace(/\./g, '');
        const startAaIndex = ungappedAaSeq.indexOf(regionUngapped);
        const endAaIndex = startAaIndex + regionUngapped.length;
  
        if (endAaIndex * 3 > startNtIndex && startAaIndex * 3 < endNtIndex) {
          const startRegionIndex = Math.max(startAaIndex * 3, startNtIndex);
          const endRegionIndex = Math.min(endAaIndex * 3, endNtIndex);
  
          chunkRegions.push({
            region,
            ntIndices: [startRegionIndex, endRegionIndex]
          });
        }
      })
  
      result.push({ ntChunk, regions: chunkRegions });
    }
  
    return result;
  }
  
function checkConservedResidues(aa: string): string {
    const notes: string[] = [];
  
    if (aa.length < 104) {
      return 'Sequence truncated before second cysteine';
    }
  
    if (aa.includes('*') && aa.indexOf('*') <= 103) {
      notes.push('Stop codon in V-REGION before 2nd cysteine');
    }
  
    if (aa[22] !== 'C') {
      notes.push('First cysteine not found');
    }
  
    if (aa[40] !== 'W') {
      notes.push('Conserved Trp not found');
    }
  
    if (aa[103] !== 'C') {
      notes.push('Second cysteine not found');
    }
  
    return notes.join(', ');
  }
  
function gapAlign(seq: string, ref: string): string {
    const seqI = seq[Symbol.iterator]();
    let res = '';
    let started = false;
  
    for (const r of ref) {
      if (r !== '.') {
        started = true;
        try {
          res += seqI.next().value;
        } catch {
          res += '.';
        }
      } else {
        if (started) {
          res += '.';
        } else {
          try {
            res += seqI.next().value;
          } catch {
            res += '.';
          }
        }
      }
    }
  
    while (true) {
      try {
        res += seqI.next().value;
      } catch {
        break;
      }
    }
  
    let i = res.length - 1;
    while (i >= 0 && res[i] === '.') {
      i -= 1;
    }
  
    return res.slice(0, i + 1);
  }
  
function gapAlignAa(seq: string, ref: string): string {
    const seqI = seq[Symbol.iterator]();
    let res = '';
    let started = false;
  
    for (const r of ref) {
      if (r !== '.') {
        started = true;
        try {
          res += seqI.next().value;
        } catch {
          break;
        }
      } else {
        if (started) {
          res += '.';
        } else {
          try {
            res += seqI.next().value;
          } catch {
            break;
          }
        }
      }
    }
  
    while (true) {
      try {
        res += seqI.next().value;
      } catch {
        break;
      }
    }
  
    return res;
  }


function gapAlignAaFromNt(aaSeq: string, ntGapped: string): string {
    const aaGapped = ntGapped.match(/.{3}|.{1,2}$/g)!.map((codon, i) => i === ntGapped.length / 3 ? aaSeq.slice(i) : codon.includes('.') ? '.'.repeat(codon.length / 3) : aaSeq[i]).join('');
    return aaGapped;
  }
  
function numberIghvFromNt(ntSeq: string): [string | null, string] {
    const aaSeq = ntSeq.match(/.{3}|.{1,2}$/g)!.map(codon => {
      const lookup: {[key: string]: string} = {
        'AAA': 'K', 'AAC': 'N', 'AAG': 'K', 'AAT': 'N', 'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
        'AGA': 'R', 'AGC': 'S', 'AGG': 'R', 'AGT': 'S', 'ATA': 'I', 'ATC': 'I', 'ATG': 'M', 'ATT': 'I',
        'CAA': 'Q', 'CAC': 'H', 'CAG': 'Q', 'CAT': 'H', 'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
        'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R', 'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
        'GAA': 'E', 'GAC': 'D', 'GAG': 'E', 'GAT': 'D', 'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
        'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G', 'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
        'TAA': '*', 'TAC': 'Y', 'TAG': '*', 'TAT': 'Y', 'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
        'TGA': '*', 'TGC': 'C', 'TGG': 'W', 'TGT': 'C', 'TTA': 'L', 'TTC': 'F', 'TTG': 'L', 'TTT': 'F',
      };
      return lookup[codon] || 'X';
    }).join('');
  
    const [aaGapped, status] = numberIghv(aaSeq);
    if (aaGapped) {
      const ntGapped = gapAlign(ntSeq, aaGapped);
      return [ntGapped, status];
    } else {
      return [null, status];
    }
  }
  
export { 
    ntDiff, 
    distributeCdr, 
    matchScore, 
    numberFromTrp, 
    numberIghv, 
    insertSpace, 
    prettyHeader, 
    prettyGapped, 
    checkConservedResidues, 
    gapAlign, 
    gapAlignAa, 
    gapAlignAaFromNt, 
    numberIghvFromNt,
    splitRegions,
    findRegionIndices,
    findRegionIndicesInChunks,
    findRegionIndicesForNtChunks
  };
  