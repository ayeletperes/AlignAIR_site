import React, { useState, useRef, useEffect } from 'react';
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
  indelCounts: number[];
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
  indelCounts,
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
    indelCounts,
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
    return '#10B981'; // Emerald
  } else if (likelihood > 0.8) {
    return '#3B82F6'; // Blue
  } else if (likelihood > 0.7) {
    return '#8B5CF6'; // Purple
  } else if (likelihood > 0.6) {
    return '#F59E0B'; // Amber
  } else if (likelihood > 0.5) {
    return '#EF4444'; // Red
  } else {
    return '#6B7280'; // Gray
  }
}

export function splitSequence(sequence: string, maxCharsPerRow: number){
  const chunks = [];
  for (let i = 0; i < sequence.length; i += maxCharsPerRow) {
    chunks.push(sequence.slice(i, i + maxCharsPerRow));
  }
  return chunks;
};

// Compact likelihood badge component
const CompactLikelihoodBadge: React.FC<{ likelihood: number }> = ({ likelihood }) => {
  const color = getColor(likelihood);
  const percentage = Math.round(likelihood * 100);
  
  return (
    <span 
      className="compact-likelihood-badge"
      style={{ backgroundColor: color }}
      title={`Likelihood: ${percentage}%`}
    >
      {percentage}%
    </span>
  );
};

// Compact chevron icon
const CompactChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (

    <svg 
      className={`compact-chevron ${isOpen ? 'open' : ''}`}
      fill="currentColor" 
      stroke="none" 
      viewBox="0 0 20 20"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
        fillRule="evenodd"
      />
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
  indelCounts: number[];
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
  indelCounts
}) => {
  const alleles: string[] = results[call];
  const likelihoods: number[] = results[`${call.charAt(0)}_likelihood`];
  
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleOptionSelect(focusedIndex);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < alleles.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : alleles.length - 1
          );
        }
        break;
    }
  };

  const updateSequenceData = (index: number) => {
    const allele = alleles[index];
    console.log(allele);
    setSelectedAllele(allele);

    const seq = getGermlineSequence({
      results: results,
      segment: call.charAt(0).toLowerCase(),
      referenceAlleles: reference,
      call_id: index,
      matcher: matcher,
      indelCounts: indelCounts
    });
    console.log(seq);
    setSelected(seq);
    setGermline({[call]: seq});
    
    const mismatch = GetSequenceMismatchIdx(
      results.sequence.slice(
        results[call.charAt(0) + "_sequence_start"],
        results[call.charAt(0) + "_sequence_end"]
      ), 
      seq, 
      maxCharsPerRow
    );
    setMismatch(mismatch);
    
    const splitedSeq = splitSequence(seq, maxCharsPerRow);
    setSplitedSeq(splitedSeq);
    
    // Update DOM elements
    splitedSeq.forEach((seq, seqIndex) => {
      const alleleElement = document.querySelector(`.allele.${call}-${seqIndex}`) as HTMLElement;
      if (alleleElement) {
        alleleElement.textContent = seq;
      }
    });
    
    // Update germline AA sequence
    let sequenceGermline = '';
    if (chain === 'heavy') {
      sequenceGermline = germline['v_call'] + germline['np1'] + germline['d_call'] + germline['np2'] + germline['j_call'];
    } else {
      sequenceGermline = germline['v_call'] + germline['np1'] + germline['j_call'];
    }
    
    let seqAA = translateDNAtoAA(sequenceGermline);
    setGermlineAA(seqAA);

    if (results.v_germline_start > 0) {
      const padding = 'N'.repeat(results.v_germline_start);
      const sequencePad = padding + sequenceGermline;
      seqAA = translateDNAtoAA(sequencePad);
      seqAA = seqAA.replace(/X/g, '');
      setGermlineAA(seqAA);
    }
    
    setSplittedGAA(splitSequence(seqAA.slice(splitStart, splitEnd), maxCharsPerRow / 3));
  };

  const handleOptionSelect = (index: number) => {
    updateSequenceData(index);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectedIndex = alleles.indexOf(selectedAllele);

  return (
    <>
      <style jsx>{`
        .compact-select-container {
          position: relative;
          width: 100%;
          height: 100%;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .compact-select-trigger {
          width: 100%;
          height: 150%;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(102, 126, 234, 0.3);
          border-radius: 6px;
          padding: 4px 8px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .compact-select-trigger:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }

        .compact-select-trigger:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
        }

        .compact-select-content {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
            gap: 3px; 
        }

        .compact-select-text {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: -0.025em;
          grid-column: 2;
        }

        .compact-likelihood-badge {
          padding: 1px 8px;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          min-width: 24px;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          grid-column: 1;
        }

        .compact-chevron {
          width: 5px;
          height: 5px;
          color: #6b7280;
          transition: transform 0.15s ease;
          grid-column: 3;
          justify-self: end;
        }

        .compact-chevron.open {
          transform: rotate(180deg);
        }

        .compact-select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          margin-top: 2px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          max-height: 200px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(-5px) scale(0.95);
          transition: all 0.15s ease;
          pointer-events: none;
        }

        .compact-select-dropdown.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .compact-options-list {
          max-height: 200px;
          overflow-y: auto;
          padding: 4px;
        }

        .compact-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.1s ease;
          gap: 8px;
        }

        .compact-option-item:hover,
        .compact-option-item.focused {
          background: rgba(102, 126, 234, 0.08);
        }

        .compact-option-item.selected {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .compact-option-item.selected .compact-likelihood-badge {
          background: rgba(255, 255, 255, 0.25) !important;
          color: white !important;
        }

        .compact-option-text {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .compact-option-item.selected .compact-option-text {
          color: white;
        }

        .compact-options-list::-webkit-scrollbar {
          width: 4px;
        }

        .compact-options-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .compact-options-list::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.3);
          border-radius: 2px;
        }

        .compact-options-list::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.5);
        }
      `}</style>

      <div className="compact-select-container" ref={selectRef}>
        <div
          className="compact-select-trigger"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Select ${call.replace('_', ' ')}`}
        >
          <CompactLikelihoodBadge likelihood={likelihoods[selectedIndex]} />
          <span className="compact-select-text">{selectedAllele}</span>
          <CompactChevronIcon isOpen={isOpen} />
        </div>

        <div className={`compact-select-dropdown ${isOpen ? 'open' : ''}`}>
          <ul 
            className="compact-options-list"
            role="listbox"
            aria-label={`${call.replace('_', ' ')} options`}
          >
            {alleles.map((allele, index) => (
              <li
                key={`${allele}-${index}`}
                className={`compact-option-item ${
                  allele === selectedAllele ? 'selected' : ''
                } ${focusedIndex === index ? 'focused' : ''}`}
                onClick={() => handleOptionSelect(index)}
                role="option"
                aria-selected={allele === selectedAllele}
                aria-label={`${allele}, likelihood ${Math.round(likelihoods[index] * 100)}%`}
              >
                <span className="compact-option-text">{allele}</span>
                <CompactLikelihoodBadge likelihood={likelihoods[index]} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};


