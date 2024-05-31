import React, { useState, useEffect, use } from 'react';
import { SelectWidgetVertical2, splitSequence, GetSequenceMismatchIdx } from './customSelect';
import {AlignedSequence, AlignedGermlineSequence} from './alignedSequence';
import {translateDNAtoAA} from './translateDNA';

interface AlignmentBrowserProps {
    results: any;
    referenceAlleles: any;
  }

  
export const AlignmentBrowserLight: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
    
    // if the germline does not start from 0, or there are indels in the sequence. then susspend the alignment view
    if (results.v_germline_start !== 0 || results.ar_indels > 0) {
      return (
        <>
        <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 8.75C17 8.33579 16.6642 8 16.25 8H14.5V5.75C14.5 5.33579 14.1642 5 13.75 5H10.25C9.83579 5 9.5 5.33579 9.5 5.75V8H7.75C7.33579 8 7 8.33579 7 8.75V21.25C7 21.6642 7.33579 22 7.75 22H16.25C16.6642 22 17 21.6642 17 21.25V8.75ZM9.5 19.25C9.5 18.8358 9.83579 18.5 10.25 18.5H13.75C14.1642 18.5 14.5 18.8358 14.5 19.25V20H9.5V19.25ZM11 15.25C11 14.8358 11.3358 14.5 11.75 14.5H12.25C12.6642 14.5 13 14.8358 13 15.25V18.5H11V15.25ZM16 13H8V10.75C8 10.3358 8.33579 10 8.75 10H15.25C15.6642 10 16 10.3358 16 10.75V13Z"
            fill="currentColor"
          />
        </svg>
          <div>
            <p className="text-lg font-semibold text-black">Work in progress!</p>
            <p className="text-sm text-black">
              We are working on alignment view for 5' trimmed sequences, and sequences containing indels.
            </p>
          </div>
        </div>
        </>
      );
    }
    
    const maxCharsPerRow = 48;
    const [selectedSequenceV, setSelectedSequenceV] = useState<string>('');
    const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');
    const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
    const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);
    const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
    const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);
    const [mismatchV, setMismatchV] = useState<{ [key: number]: number[] }>({});
    const [mismatchJ, setMismatchJ] = useState<{ [key: number]: number[] }>({});

    const sequenceAA = translateDNAtoAA(results.sequence);
    
    const vAAIndex: number = Math.floor(results.v_sequence_end / 3);
    const jAAIndex: number = Math.floor((results.v_sequence_end) / 3);
    const sequenceV: string = sequenceAA.slice(0, vAAIndex);
    const sequenceJ: string = sequenceAA.slice(jAAIndex);
    const splitV = splitSequence(results.sequence.slice(0,results.v_sequence_end), maxCharsPerRow)
    const splitVAA = splitSequence(sequenceV, maxCharsPerRow/3)
    const splitJ = splitSequence(results.sequence.slice(results.v_sequence_end), maxCharsPerRow)
    const splitJAA = splitSequence(sequenceJ, maxCharsPerRow/3)
    const np1 = results.j_sequence_start - (results.v_sequence_end);
    const reamningV = results.v_sequence_end-sequenceV.length*3;

    useEffect(() => {
      setSelectedSequenceV(
        referenceAlleles['v_call'][results.v_call[0]].slice(results.v_germline_start, results.v_germline_end)
      );
  
      setSelectedSequenceJ(
        referenceAlleles['j_call'][results.j_call[0]].slice(results.j_germline_start, results.j_germline_end)
      );
    }, [results, referenceAlleles]);
    
    useEffect(() => {
      setSplitedSequenceV(splitSequence(selectedSequenceV, maxCharsPerRow));
      setSplitedSequenceJ(splitSequence(selectedSequenceJ, maxCharsPerRow));
    }, [selectedSequenceV, selectedSequenceJ]);
    
    useEffect(() => {
        setMismatchV(GetSequenceMismatchIdx(results.sequence.slice(0,results.v_sequence_end), selectedSequenceV, maxCharsPerRow));
        setMismatchJ(GetSequenceMismatchIdx(results.sequence.slice(results.j_sequence_start), selectedSequenceJ, maxCharsPerRow));
    }, [results, selectedSequenceV, selectedSequenceJ]);
  
 
    const rows = {
      header: 1,
      seq: 2,
      v: 3,
      j: 4,
    };
    
    const j_left_margin = results.j_sequence_start ;
    if(selectedSequenceV){
        const renderVerticalView = () => (
        <div className="alignment-browser vertical-view">
            <div className="alignment-label" style={{ gridRow: 1 }}>Allele</div>
            
            
            {splitV.map((chunk, index) => (
            <React.Fragment key={`input-sequence-v-${index}`}>
                <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
                <span className={`alignment-label v_input-${index}`}>V</span>
                </div>
                <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2, gridColumn: 2 }}>
                <AlignedSequence sequence={chunk} aasequence={splitVAA[index]} mismatch={mismatchV[index]}/>
                </div>
            </React.Fragment>
            ))}

            
            <div className="alignment-label" style={{ gridRow: rows.v }}>
                <SelectWidgetVertical2
                call='v_call'
                results={results}
                reference={referenceAlleles}
                setSelected={setSelectedSequenceV}
                selected={selectedSequenceV}
                selectedAllele={selectedAlleleV}
                setSelectedAllele={setSelectedAlleleV}
                setSplitedSeq={setSplitedSequenceV}
                maxCharsPerRow={maxCharsPerRow}
                setMismatch={setMismatchV}
                />
            </div>
    
            
            {splitedSequenceV.map((chunk, index) => (
            <React.Fragment key={`v-sequence-${index}`}>
                {index > 0 && (
                <div className={`alignment-label`} style={{ gridRow: (index * 2) + rows.v, gridColumn:1 }}>
                    <span className={`alignment-label v_call-${index}`}>{selectedAlleleV}</span>
                </div>
                )}
                <div className="sequence" style={{ gridRow: (index * 2) + rows.v, gridColumn: 2 }}>
                {/* <span className={`allele v_call-${index}`}>{chunk}</span> */}

                <div className="alignment-container">
                <div className="alignment-row" style={{gridRow:1}}>
                    {chunk.split('').map((char, index) => (
                        <span key={index} className="alignment-char" style={{gridRow:1, gridColumn:index}}>
                        {char}
                        </span>
                    ))}
                    </div>
                </div>


                </div>
            </React.Fragment>
            ))}
    
            {splitJ.map((chunk, index) => (
            <React.Fragment key={`input-sequence-j-${index}`}>
                <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:1 }}>
                <span className={`alignment-label j_input-${index}`}>J</span>
                </div>
                
                <div className="sequence input-sequence-j" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn: 2 }}>
                    <AlignedSequence sequence={chunk} aasequence={splitJAA[index]} mismatch={mismatchJ[index]} np1={np1} remainingNuc={reamningV}/>
                {/* <span className="sequence" style={{color:'gray'}}>{chunk.slice(0,(results.j_sequence_start-results.v_sequence_end-1))}</span>
                <span className="sequence">{chunk.slice((results.j_sequence_start-results.v_sequence_end-1), (results.j_sequence_end-results.v_sequence_end-1))}</span> */}
                </div>
            </React.Fragment>
            ))}
    
            <div className="alignment-label" style={{ gridRow: (splitedSequenceV.length*2)+ rows.v }}>
            <SelectWidgetVertical2
                call='j_call'
                results={results}
                reference={referenceAlleles}
                setSelected={setSelectedSequenceJ}
                selected={selectedSequenceJ}
                selectedAllele={selectedAlleleJ}
                setSelectedAllele={setSelectedAlleleJ}
                setSplitedSeq={setSplitedSequenceJ}
                maxCharsPerRow={maxCharsPerRow}
                setMismatch={setMismatchJ}
            />
            </div>
            
            {splitedSequenceJ.map((chunk, index) => (
            <React.Fragment key={`j-sequence-${index}`}>
                {index > 0 && (
                <div className={`alignment-label j_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:1 }}>
                    {selectedAlleleJ}
                </div>
                )}
                <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn: 2}}>
                    <AlignedGermlineSequence sequence={chunk} np1={np1}/>
                {/* <div className="alignment-container j_call-${index}">
                <div className="alignment-row j_call-${index}" style={{gridRow:1}}>
                    {chunk.split('').map((char, index) => (
                        <span key={index} className="alignment-char j_call-${index}" style={{gridRow:1, gridColumn:index}}>
                        {char}
                        </span>
                    ))}
                    </div>
                </div> */}
                </div>
            </React.Fragment>
            ))}
        </div>
        );
    
        return (
        <div>
            <div className='bg-white relative overflow-x-auto'>
            {renderVerticalView()}
            </div>
        </div>
        );
    }
  }
  
  