import React, { useState } from 'react';
import { translateDNAtoAA } from '@components/results/alignment/utils/translateUtils';
import { Allele, Segment } from '@components/reference/utilities';

interface GermlineSequenceParams {
  matcher: any;
  results: any;
  segment: string;
  referenceAlleles: Segment;
  call_id?: number;
  k?: number;
  s?: number;
}

interface Mappings {
  start_in_seq: number;
  end_in_seq: number;
  start_in_ref: number;
  end_in_ref: number;
}

export const getGermlineSequence = ({
  matcher,
  results,
  segment,
  referenceAlleles,
  call_id = 0,
  k = 15,
  s = 30,
}: GermlineSequenceParams): string => {
  const call = results[`${segment}_call`][call_id];
  
  const mappings: Mappings[] = matcher.match(
    [results.sequence],
    [results[`${segment}_sequence_start`]],
    [results[`${segment}_sequence_end`]],
    [call],
    k,
    s,
    segment
  );
  const { start_in_seq: start, end_in_seq: end, start_in_ref: refStart, end_in_ref: refEnd } = mappings[0];
  const referenceSequence = referenceAlleles[call].sequence;
  if (segment === 'v') {
    return referenceSequence.slice(0, refEnd);
  } else {
    return referenceSequence.slice(refStart, refEnd);
  }
};

export const GetSequenceMismatchIdx = (sequence: string, germline: string, maxCharsPerRow: number) => {
  let mismatch: { [key: number]: number[] } = {}; // Initialize mismatch as a dictionary

  for (let i = 0; i < sequence.length; i++) {
    if(!['N', '-', '.'].includes(sequence[i])){
      if (sequence[i] !== germline[i]) {
        const row = Math.floor(i / maxCharsPerRow); // Calculate the row
        const col = i % maxCharsPerRow; // Calculate the column

        // If the row doesn't exist in the mismatch dictionary, initialize it as an empty array
        if (!mismatch[row]) {
          mismatch[row] = [];
        }

        mismatch[row].push(col); // Push the column index into the corresponding row array
      }
  }
  }
  return mismatch;
};


export function getColor(likelihood: number): string {
  if (likelihood > 0.9) {
    return '#baffc9';
  } else if (likelihood > 0.8) {
    return '#bae1ff';
  } else if (likelihood > 0.7) {
    return '#eecbff';
  } else if (likelihood > 0.6) {
    return '#f7e7b4';
  } else if (likelihood > 0.5) {
    return '#ffdfba';
  } else {
    return '#ffb3ba';
  }
}


export function splitSequence(sequence: string, maxCharsPerRow: number){
  // const numRows = Math.ceil(sequence.length / maxCharsPerRow)
  // const chunkSize = Math.ceil(sequence.length / numRows);
  
  const chunks = [];
  for (let i = 0; i < sequence.length; i += maxCharsPerRow) {
    chunks.push(sequence.slice(i, i + maxCharsPerRow));
  }
  return chunks;
};
const SmallPillWithText: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <svg width="30" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    {/* Square Shape */}
    <rect x="0" y="0" width="60" height="40" fill={color} />
    {/* Text on Square */}
    <text x="0" y="20" fontFamily="sans" fontSize="18" fill="black" textAnchor="start" alignmentBaseline="middle">
      {text}
    </text>
  </svg>
);

const SmallPillWithText2: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    {/* Square Shape */}
    <rect x="0" y="0" width="60" height="40" fill={color} />
    {/* Text on Square */}
    <text x="0" y="20" fontFamily="sans" fontSize="16" fill="white" textAnchor="start" dominantBaseline="middle">
      {text}
    </text>
  </svg>
);


// Define the type for results and reference based on your actual data structure
interface SelectWidgetVerticalProps {
  call: string;
  chain: string;
  results: any;
  reference: any;
  setSelected: (seq: string) => void;
  selected: string;
  selectedAllele: string;
  setSelectedAllele: (allele: string) => void;
  setSplitedSeq: (splitedSeq: string[]) => void;
  maxCharsPerRow: number;
  setMismatch: (mismatch: { [key: number]: number[] }) => void;
  setGermline: (germline: { [key: string]: string}) => void;
  germline: { [key: string]: string};
  setGermlineAA: (germlineAA: string) => void;
  setSplittedGAA: (splittedGAA: string[]) => void;
  splitStart: number;
  splitEnd: number;
  matcher: any;
}

export const SelectWidgetVertical2: React.FC<SelectWidgetVerticalProps> = ({
  call,
  chain,
  results,
  reference,
  setSelected,
  selected,
  selectedAllele,
  setSelectedAllele,
  setSplitedSeq,
  maxCharsPerRow,
  setMismatch,
  setGermline,
  germline,
  setGermlineAA,
  setSplittedGAA,
  splitStart,
  splitEnd,
  matcher,
}) => {
    const alleles: string[] = results[call];
    
    const likelihoods: number[] = results[`${call.charAt(0)}_likelihood`];
    
    const [open, setOpen] = useState(false);

  const handleChange = (index: number) => {
    
    setOpen(false);
    const allele = alleles[index];
    
    setSelectedAllele(allele);
    // const k = call === 'd_call' ? 5 : 15;

    const seq = getGermlineSequence({
      results: results,
      segment: call.charAt(0).toLowerCase(),
      referenceAlleles: reference,
      call_id: index,
      matcher: matcher
    });
    
    setSelected(seq);
    setGermline({[call]: seq});
    const mismatch = GetSequenceMismatchIdx(results.sequence.slice(results[call.charAt(0) + "_sequence_start"],results[call.charAt(0) + "_sequence_end"]), seq, maxCharsPerRow);
    setMismatch(mismatch);
    const splitedSeq = splitSequence(seq, maxCharsPerRow);
    setSplitedSeq(splitedSeq);
    splitedSeq.forEach((seq, index) => {
      const alleleElement = document.querySelector(`.allele.${call}-${index}`) as HTMLElement;
      if (alleleElement) {
        alleleElement.textContent = seq;
      }
    });
    let sequenceGermline = '' 
    if(chain==='heavy'){
      sequenceGermline = germline['v_call'] + germline['np1'] + germline['d_call'] + germline['np2'] + germline['j_call'];
    }else{
      sequenceGermline = germline['v_call'] + germline['np1'] + germline['j_call'];
    }
    
    let seqAA = translateDNAtoAA(sequenceGermline);
    setGermlineAA(seqAA)

    if(results.v_germline_start>0){
        const padding = 'N'.repeat(results.v_germline_start);
        const sequencePad = padding + sequenceGermline;
        seqAA = translateDNAtoAA(sequencePad);
        // remove all the padding 'X'
        seqAA = seqAA.replace(/X/g, '');
        setGermlineAA(seqAA);
    }
    setSplittedGAA(splitSequence(seqAA.slice(splitStart, splitEnd), maxCharsPerRow/3));
  };

  const handleButtonClick = () => {
    setOpen(!open);
  };

  const handleOptionSelect = (index: number) => {
    setSelectedAllele(alleles[index]);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="cursor-default relative  rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
        style={{ width: "200px", fontSize: '16px',   maxWidth: "200px", // Controls the maximum width of the text
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",}}
      >
        <div className="flex items-center space-x-3">
          {selected ? (
            <SmallPillWithText
              text={Number(likelihoods[alleles.indexOf(selectedAllele)].toFixed(3)).toString()}
              color={getColor(likelihoods[alleles.indexOf(selectedAllele)])} // Example color
            />
          ) : null}
          <span className="block truncate" style={{fontSize:'14px', color:"black"}}>{selectedAllele}</span>
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </span>
      </button>
      <div
        className="absolute mt-1 rounded-md bg-white shadow-lg"
        style={{ display: open ? 'block' : 'none', width: "300px" }}
      >
        <ul
          className="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
          role="listbox"
          aria-labelledby="assigned-to-label"
        >
          {alleles.map((allele, index) => (
            <li
              key={index}
              onClick={() => handleChange(index)}
              className={`max-h-56 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5 cursor-pointer ${
                allele === selectedAllele ? 'text-white bg-indigo-600 cursor-default select-none relative py-2 pl-4 pr-9' : 'text-gray-900 select-none relative py-2 pl-3 pr-9'
              }`}
              role="option"
              aria-selected={allele === selectedAllele}
            >
              <div className="flex items-center justify-between">
                <span className="block truncate">{allele}</span>
                <SmallPillWithText2
                  text={Number(likelihoods[index].toFixed(3)).toString()}
                  color={getColor(likelihoods[index])} // Example color
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


