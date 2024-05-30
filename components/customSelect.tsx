import React, { useState } from 'react';
import { extractGermline } from './postProcessing';


function getColor(likelihood: number): string {
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


function splitSequence(sequence: string, maxCharsPerRow: number){
  const numRows = Math.ceil(sequence.length / maxCharsPerRow)
  const chunkSize = Math.ceil(sequence.length / numRows);
  
  const chunks = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }
  return chunks;
};
const SmallPillWithText: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    {/* Square Shape */}
    <rect x="0" y="0" width="60" height="40" fill={color} />
    {/* Text on Square */}
    <text x="20" y="20" fontFamily="sans" fontSize="16" fill="white" textAnchor="middle" alignmentBaseline="middle">
      {text}
    </text>
  </svg>
);

const SmallPillWithText2: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
    {/* Square Shape */}
    <rect x="0" y="0" width="60" height="40" fill={color} />
    {/* Text on Square */}
    <text x="5" y="20" fontFamily="sans" fontSize="16" fill="white" textAnchor="start" dominantBaseline="middle">
      {text}
    </text>
  </svg>
);


// Define the type for results and reference based on your actual data structure
interface SelectWidgetVerticalProps {
  call: string;
  results: any;
  reference: any;
  setSelected: (seq: string) => void;
  selected: string;
  selectedAllele: string;
  setSelectedAllele: (allele: string) => void;
  setSplitedSeq: (splitedSeq: string[]) => void;
}

export const SelectWidgetVertical2: React.FC<SelectWidgetVerticalProps> = ({
  call,
  results,
  reference,
  setSelected,
  selected,
  selectedAllele,
  setSelectedAllele,
  setSplitedSeq,
}) => {
    const alleles: string[] = results[call];
    const likelihoods: number[] = results[`${call.charAt(0)}_likelihoods`];
    const [open, setOpen] = useState(false);

  const handleChange = (index: number) => {
    setOpen(false);
    const allele = alleles[index];
    setSelectedAllele(allele);
    const k = call === 'd_call' ? 5 : 15;
    const seq = extractGermline.getGermlineSequence({
      results: results,
      segment: call.charAt(0),
      referenceAlleles: reference[call],
      call_id: index,
      k: k,
    });
    setSelected(seq);
    const splitedSeq = splitSequence(seq, 70);
    setSplitedSeq(splitedSeq);
    splitedSeq.forEach((seq, index) => {
      const alleleElement = document.querySelector(`.allele.${call}-${index}`) as HTMLElement;
      if (alleleElement) {
        alleleElement.textContent = seq;
      }
    });

    // const likelihoodElement = document.querySelector(`.likelihood.${call}`) as HTMLElement;
    // if (likelihoodElement) {
    //   likelihoodElement.textContent = Number(likelihoods[index].toFixed(3)).toString();
    //   likelihoodElement.style.width = `${likelihoods[index] * 100 + 100}px`;
    //   likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
    // }
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
        className="cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
        style={{ fontSize: '18px' }}
      >
        <div className="flex items-center space-x-3">
          {selected ? (
            <SmallPillWithText
              text={Number(likelihoods[alleles.indexOf(selectedAllele)].toFixed(3)).toString()}
              color={getColor(likelihoods[alleles.indexOf(selectedAllele)])} // Example color
            />
          ) : null}
          <span className="block truncate">{selectedAllele}</span>
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
        className="absolute mt-1 w-full rounded-md bg-white shadow-lg"
        style={{ display: open ? 'block' : 'none' }}
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
              {/* <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                {allele === selectedAllele ? (
                  <svg
                    className="h-5 w-5 text-indigo-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                ) : null}
              </span> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


