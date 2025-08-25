import React, { useState, useRef, useEffect } from 'react';
import { translateDNAtoAA } from '@/utils/alignment/translateUtils';
import { ReferenceLoader, SegmentKey } from '@/lib/data/ReferenceLoader';
import { logger } from '@/utils/logger';
import { GetSequenceMismatchIdx } from '@/utils/alignment/mismatchUtils';
import { splitSequence } from '@/utils/alignment/splitSequence';

interface GermlineSequenceParams {
  matcher: any;
  results: any;
  segment: SegmentKey;
  ReferenceLoader: ReferenceLoader;
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
  ReferenceLoader,
  indelCounts,
  call_id = 0,
  k = 15,
  s = 30,
}: GermlineSequenceParams): string => {
  // Normalize segment keys to match results object (results use lowercase keys: v_call, v_sequence_start, etc.)
  const segLower = (segment as string).toLowerCase();
  const calls = results?.[`${segLower}_call`] || results?.[`${segment}_call`];
  const call: string | undefined = Array.isArray(calls) ? calls[call_id] : calls;

  // Resolve raw sequence string (results.sequence can be a string or an object with .sequence)
  
  const rawSequence: string =
    typeof results?.sequence?.sequence === 'string'
      ? results.sequence.sequence
      : typeof results?.sequence === 'string'
      ? results.sequence
      : '';

  const startKey = `${segLower}_sequence_start`;
  const endKey = `${segLower}_sequence_end`;
  const segStart: number | undefined = results?.[startKey] ?? results?.[`${segment}_sequence_start`];
  const segEnd: number | undefined = results?.[endKey] ?? results?.[`${segment}_sequence_end`];

  // Resolve reference allele
  const referenceSequence: string =
    (call && (ReferenceLoader.getSequenceByLabel(segment, call, 'iuis') || ReferenceLoader.getAllele(segment, call))) ||
    '';

  try {
    if (!rawSequence || call == null || segStart == null || segEnd == null || !matcher?.match) {
      // Fallback to slicing by germline bounds in results or full reference
      if (segment === 'V') {
        const vEnd = results?.v_germline_end ?? referenceSequence.length;
        return referenceSequence.slice(0, vEnd);
      } else if (segment === 'D') {
        const dStart = results?.d_germline_start ?? 0;
        const dEnd = results?.d_germline_end ?? referenceSequence.length;
        return referenceSequence.slice(dStart, dEnd);
      } else {
        const jStart = results?.j_germline_start ?? 0;
        const jEnd = results?.j_germline_end ?? referenceSequence.length;
        return referenceSequence.slice(jStart, jEnd);
      }
    }

    const mappings: Mappings[] = matcher.match(
      [rawSequence],
      [segStart],
      [segEnd],
      [call],
      indelCounts,
      k,
      s,
      segment
    );
    const map0 = mappings && mappings[0];
    if (!map0) throw new Error('No mapping returned');
    const { start_in_ref: refStart, end_in_ref: refEnd } = map0;

    if (segment === 'V') {
      // For V, slice from start to refEnd
      return referenceSequence.slice(0, refEnd);
    }
    // For D/J, slice refStart..refEnd
    return referenceSequence.slice(refStart, refEnd);
  } catch (e) {
    // Graceful fallback
    if (segment === 'V') {
      const vEnd = results?.v_germline_end ?? referenceSequence.length;
      return referenceSequence.slice(0, vEnd);
    } else if (segment === 'D') {
      const dStart = results?.d_germline_start ?? 0;
      const dEnd = results?.d_germline_end ?? referenceSequence.length;
      return referenceSequence.slice(dStart, dEnd);
    } else {
      const jStart = results?.j_germline_start ?? 0;
      const jEnd = results?.j_germline_end ?? referenceSequence.length;
      return referenceSequence.slice(jStart, jEnd);
    }
  }
};

// GetSequenceMismatchIdx moved to mismatchUtils.ts - import from there if needed

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

// splitSequence function now imported from ./splitSequence

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
  splitedNP2?: number[];
  setSplitedNP2?: (splitedNP2: number[]) => void;
}

export const SelectWidgetVertical: React.FC<SelectWidgetVerticalProps> = ({
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
  indelCounts,
  splitedNP2,
  setSplitedNP2
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

  // When results or call changes (e.g., switching tabs), reset the open/focus state
  useEffect(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
  }, [results, call]);

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

  // inside SelectWidgetVertical
  const selectedIndex = alleles.indexOf(selectedAllele);
  const safeSelectedIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const updateSequenceData = React.useCallback((index: number) => {
    if (index === selectedIndex) return; // nothing to do
    const allele = alleles[index];
    setSelectedAllele(allele);

    const seq = getGermlineSequence({
      results,
      segment: call.charAt(0).toUpperCase() as SegmentKey,
      ReferenceLoader: reference,
      call_id: index,
      matcher,
      indelCounts
    });

    setSelected(seq);
    setGermline({ ...germline, [call]: seq });

    const seqSlice = results.sequence.sequence.slice(
      results[`${call.charAt(0)}_sequence_start`],
      results[`${call.charAt(0)}_sequence_end`]
    );
    setMismatch(GetSequenceMismatchIdx(seqSlice, seq, maxCharsPerRow));
    setSplitedSeq(splitSequence(seq, maxCharsPerRow));

    // Only recompute D np2 map if D selection changed
    if (call === 'd_call' && setSplitedNP2) {
      const { v_sequence_end: vEnd, d_sequence_end: dEnd, j_sequence_start: jStart } = results;
      const dRegionSequence = results.sequence.sequence.slice(vEnd, jStart);
      const splitDLocal = splitSequence(dRegionSequence, maxCharsPerRow);

      let chunkStart = vEnd;
      const np2CountsInDChunks = splitDLocal.map(chunk => {
        const chunkEnd = chunkStart + chunk.length;
        const overlapStart = Math.max(chunkStart, dEnd);
        const overlapEnd = Math.min(chunkEnd, jStart);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        chunkStart += chunk.length;
        return overlap;
      });
      setSplitedNP2(np2CountsInDChunks);
    }
  }, [alleles, selectedIndex, call, results, reference, matcher, indelCounts, maxCharsPerRow, setSplitedNP2, setGermline, setMismatch, setSelected, setSplitedSeq]);


  const handleOptionSelect = (index: number) => {
    updateSequenceData(index);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
          <CompactLikelihoodBadge likelihood={(likelihoods && likelihoods[safeSelectedIndex]) || 0} />
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
