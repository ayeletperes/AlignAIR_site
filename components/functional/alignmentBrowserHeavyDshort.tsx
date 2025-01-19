import React, { useState, useEffect } from 'react';
import { SelectWidgetVertical2, splitSequence, GetSequenceMismatchIdx } from '../ui/customSelect';
import {AlignedBlock} from './alignedSequence';
import {translateDNAtoAA} from './translateDNA';
import {numberIghv, splitRegions, findRegionIndicesForNtChunks} from '../pages/regions';
import {anchorIGHJ} from '../reference'

interface AlignmentBrowserProps {
    results: any;
    referenceAlleles: any;
  }

  
export const AlignmentBrowserHeavyDshort: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
    
    // if the germline does not start from 0, or there are indels in the sequence. then susspend the alignment view
    if (results.ar_indels > 0) {//
      return (
        <>
        <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
        <span role="img" aria-label="building" style={{fontSize: '24px'}}>🏗️</span>
        {/* <svg
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
        </svg> */}
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
    
    const maxCharsPerRow = 72;
    const [selectedSequenceV, setSelectedSequenceV] = useState<string>('');
    const [selectedSequenceD, setSelectedSequenceD] = useState<string>('');
    const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');
    const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
    const [selectedAlleleD, setSelectedAlleleD] = useState<string>(results.d_call[0]);
    const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);
    const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
    const [splitedSequenceD, setSplitedSequenceD] = useState<string[]>([]);
    const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);
    const [mismatchV, setMismatchV] = useState<{ [key: number]: number[] }>({});
    const [mismatchD, setMismatchD] = useState<{ [key: number]: number[] }>({});
    const [mismatchJ, setMismatchJ] = useState<{ [key: number]: number[] }>({});
    const [splitedGVAA, setSplitedGVAA] = useState<string[]>([]);
    const [splitedGDAA, setSplitedGDAA] = useState<string[]>([]);
    const [splitedGJAA, setSplitedGJAA] = useState<string[]>([]);
    const [germline, setGermline] = useState<{ [key: string]: string }>({});
    const [germlineAA, setGermlineAA] = useState<string>('');

    let sequence = results.sequence.slice(results.v_sequence_start);

    // if the sequence is short on the 5' padd with N for the translation, and then remove.
    
    let sequenceAA = translateDNAtoAA(sequence);
    let paddSize = 0;
    if(results.v_germline_start>0){
        paddSize = results.v_germline_start;
        const padding = '.'.repeat(paddSize);
        sequence = padding + sequence;
        sequenceAA = translateDNAtoAA(sequence);
    }
    
    
    let vSeqStart = results.v_sequence_start;
    const vSeqEnd = results.v_sequence_end - vSeqStart;
    const dSeqStart = results.v_sequence_end - vSeqStart;
    const dSeqEnd = results.j_sequence_start - vSeqStart;
    const jSeqStart = results.j_sequence_start - vSeqStart;
    const jSeqEnd = results.j_sequence_end - vSeqStart;
    vSeqStart = vSeqStart-results.v_sequence_start;
    
    let vAAIndex: number = Math.floor(vSeqEnd / 3);
    let jAAIndex: number = Math.floor(jSeqStart / 3);
    
    let sequenceV: string = sequenceAA.slice(0, vAAIndex);
    let sequenceD: string = sequenceAA.slice(vAAIndex, jAAIndex);
    let sequenceJ: string = sequenceAA.slice(jAAIndex);

    let remainingV = vSeqEnd-(sequenceV.length*3);
    let remainingD = jSeqStart-((sequenceV.length+sequenceD.length)*3);
    
    let splitGAA = false;
    
    if(remainingV==2){
      // add the aa to the V. else add it to the D
      vAAIndex = vAAIndex+1;
      sequenceV = sequenceAA.slice(0, vAAIndex);
      
      // remainingV = 1;
      if(remainingD==2){
        // add the aa to the D. else add it to the J
        jAAIndex = jAAIndex+1;
        
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex)
        
        // remainingD = 1;
      }else{
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex)
      }
      splitGAA = true;
    }else{
      sequenceV = sequenceAA.slice(0, vAAIndex);
      if(remainingD==2){
        jAAIndex = jAAIndex+1;
        // add the aa to the D. else add it to the J
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        
        sequenceJ = sequenceAA.slice(jAAIndex)

        // remainingD = 1;
      }else{
        sequenceD = sequenceAA.slice(vAAIndex, jAAIndex);
        sequenceJ = sequenceAA.slice(jAAIndex)
      }
      splitGAA = true;
    }
    
    
    
    

    
    
    const splitV = splitSequence(sequence.slice(vSeqStart,vSeqEnd), maxCharsPerRow)
    
    const splitVAA = splitSequence(sequenceV, maxCharsPerRow/3)
    const splitD = splitSequence(sequence.slice(vSeqEnd,jSeqStart), maxCharsPerRow)
    const splitDAA = splitSequence(sequenceD, maxCharsPerRow/3)
    const splitJ = splitSequence(sequence.slice(jSeqStart), maxCharsPerRow)
    const splitJAA = splitSequence(sequenceJ, maxCharsPerRow/3)
    const np1 = dSeqStart - (vSeqEnd);
    const np2 = jSeqStart - (dSeqEnd);

    const [gappedAA, gappNotes] = numberIghv(sequenceV);
    
    let Vregions = null;
    let Jregions = null;
    let Dregions = null;
    if(gappNotes===''){
      const regionGappedAA = gappedAA? splitRegions(gappedAA): {'':""};
      Vregions = findRegionIndicesForNtChunks(regionGappedAA, splitVAA, splitV)

      Dregions = [
        {
          ntChunk: splitD[0],
          regions: [
            {
              region:'CDR3',
              ntIndices: [0, splitD[0].length]
            }
          ]
        }
      ]
      // get the end of the cdr3
      const anchor = results.j_call[0]?anchorIGHJ[results.j_call[0]]:null;
      if(anchor){
        const janchoridx = anchor - results.j_germline_start
        Jregions = [
          {
            ntChunk: splitJ[0],
            regions: [
              {
                region:'CDR3',
                ntIndices: [0, janchoridx]
              },
              {
                region:'FR4',
                ntIndices: [janchoridx, splitJ[0].length]
              },
            ]
          }
        ]
      }

      
    }
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
        setMismatchV(GetSequenceMismatchIdx(sequence.slice(vSeqStart,vSeqEnd), selectedSequenceV, maxCharsPerRow));
        setMismatchJ(GetSequenceMismatchIdx(sequence.slice(jSeqStart), selectedSequenceJ, maxCharsPerRow));
    }, [results, selectedSequenceV, selectedSequenceJ]);
  
 
    useEffect(() => {
      if(selectedSequenceV && selectedSequenceD && selectedSequenceJ&& splitGAA){
        const gr = {
          v_call: selectedSequenceV,
          j_call: selectedSequenceJ,
          np1: sequence.slice(vSeqEnd, dSeqStart),
          np2: sequence.slice(dSeqEnd, jSeqStart),
        }
        setGermline(gr);
        
        const sequenceGermline = gr['v_call'] + gr['np1'] + gr['np2'] + gr['j_call'];
        
        let germlineAAPad = translateDNAtoAA(sequenceGermline);
        setGermlineAA(germlineAAPad)
  
        if(results.v_germline_start>0){
            const padding = 'N'.repeat(results.v_germline_start);
            const sequencePad = padding + sequenceGermline;
            germlineAAPad = translateDNAtoAA(sequencePad);
            // remove all the padding 'X'
            germlineAAPad = germlineAAPad.replace(/X/g, '');
            setGermlineAA(germlineAAPad);
        }
        
        setSplitedGVAA(splitSequence(germlineAAPad.slice(0, vAAIndex), maxCharsPerRow/3));
        setSplitedGDAA(splitSequence(germlineAAPad.slice(vAAIndex, jAAIndex), maxCharsPerRow/3));
        setSplitedGJAA(splitSequence(germlineAAPad.slice(jAAIndex), maxCharsPerRow/3));
      }
    }, [selectedSequenceV, selectedSequenceD, selectedSequenceJ, splitGAA]);

    const rows = {
      header: 1,
      seq: 2,
      v: 3,
      d: 4,
      j: 5,
    };
    const vrow = ((splitedSequenceV.length*2) + rows.v -1)
    const drow = (index: number) => (index * 2) + vrow
    const drowG = (index: number) => drow(index) + 1
    const jrow = (index: number) => (index * 2) + (vrow + 2)
    const jrowG = (index: number) => jrow(index) + 1
    
    const renderVerticalView = () => (
      <div className="alignment-grid scrollbar-custom" style={{gridTemplateRows:`'${splitV.length*75}"px" ${splitD.length*75}"px" ${splitJ.length*75}"px"'`}}>

          <div className="subgrid-col1" style={{gridColumn:1}}>
            {splitV.map((chunk, index) => (
                <React.Fragment key={`input-allele-v-${index}`}>
                  {index === 0 && (
                    <div className="subgrid-col1-row" style={{gridRow:1}}>
                      <SelectWidgetVertical2
                          call='v_call'
                          chain='IGH'
                          results={results}
                          reference={referenceAlleles}
                          setSelected={setSelectedSequenceV}
                          selected={selectedSequenceV}
                          selectedAllele={selectedAlleleV}
                          setSelectedAllele={setSelectedAlleleV}
                          setSplitedSeq={setSplitedSequenceV}
                          maxCharsPerRow={maxCharsPerRow}
                          setMismatch={setMismatchV}
                          setGermline={setGermline}
                          germline={germline}
                          setGermlineAA={setGermlineAA}
                          setSplittedGAA={setSplitedGVAA}
                          splitStart={0}
                          splitEnd={vAAIndex}
                      />
                    
                    </div>
                    )
                  }
                  {index > 0 && (
                    <div className="subgrid-col1-row" style={{gridRow:index+1, color:"black"}}>
                    {selectedAlleleV}
                    </div>
                  )}
                </React.Fragment>
            ))}
            
            
            
              
          </div>
          <div className="subgrid-col2" style={{gridColumn:2, gridTemplateRows:`repeat(${splitV.length},"20px")`, gridTemplateColumns:`repeat(${maxCharsPerRow},"15px")`}}>
            {splitV.map((chunk, index) => (
                <React.Fragment key={`input-sequence-v-${index}`}>
                    
                    {Vregions?
                      <AlignedBlock sequence={chunk} regions={Vregions[index]} aasequence={splitVAA[index]} germline={splitedSequenceV[index]} aagermline={splitedGVAA[index]} mismatch={mismatchV[index]} />:
                      <AlignedBlock sequence={chunk} regions={Vregions} aasequence={splitVAA[index]} germline={splitedSequenceV[index]} aagermline={splitedGVAA[index]} mismatch={mismatchV[index]} />}
                    
                </React.Fragment>
            ))}
          </div>

          <div className="subgrid-col2" style={{gridColumn:2, height:`${splitD.length*75}"px"`,gridTemplateRows:`repeat(${splitD.length},"20px")`, gridTemplateColumns:`repeat(${maxCharsPerRow},"15px")`}}>
            {splitD.map((chunk, index) => (
              <React.Fragment key={`input-sequence-d-${index}`}>
              {splitD.length === 1 ? (
                      <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np1={np1} np2={np2} remainingNucPrev={remainingV} remainingNucCur={remainingD}/>
                  ) : splitD.length > 1 && index === 0 ? (
                      <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np1={np1} remainingNucPrev={remainingV} />
                  ) : splitD.length > 1 && (splitD.length - 1) === index ? (
                      <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np2={np2} remainingNucCur={remainingD}/>
                  ) : splitD.length > 1 && splitD.length < index && index > 0 ? (
                      <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} />
                  ) : null}

              </React.Fragment>
            ))}
          </div>

          <div className="subgrid-col1" style={{gridColumn:1}}>
            {splitJ.map((chunk, index) => (
                <React.Fragment key={`input-allele-j-${index}`}>
                  {index === 0 && (
                    <div className="subgrid-col1-row" style={{gridRow:1}}>
                      <SelectWidgetVertical2
                          call='j_call'
                          chain='IGH'
                          results={results}
                          reference={referenceAlleles}
                          setSelected={setSelectedSequenceJ}
                          selected={selectedSequenceJ}
                          selectedAllele={selectedAlleleJ}
                          setSelectedAllele={setSelectedAlleleJ}
                          setSplitedSeq={setSplitedSequenceJ}
                          maxCharsPerRow={maxCharsPerRow}
                          setMismatch={setMismatchJ}
                          setGermline={setGermline}
                          germline={germline}
                          setGermlineAA={setGermlineAA}
                          setSplittedGAA={setSplitedGJAA}
                          splitStart={jAAIndex}
                          splitEnd={sequenceJ.length}
                      />
                    
                    </div>
                    )
                  }
                  {index > 0 && (
                    <div className="subgrid-col1-row" style={{gridRow:index+1, color:"black"}}>
                    {selectedAlleleJ}
                    </div>
                  )}
                </React.Fragment>
            ))}
          </div>
          <div className="subgrid-col2" style={{gridColumn:2, gridTemplateRows:`repeat(${splitJ.length},"20px")`, gridTemplateColumns:`repeat(${maxCharsPerRow},"15px")`}}>
            {splitJ.map((chunk, index) => (
                <React.Fragment key={`input-sequence-v-${index}`}>
                    
                    <AlignedBlock sequence={chunk} regions={Jregions ? Jregions[index] : Dregions} aasequence={splitJAA[index]} germline={splitedSequenceJ[index]} aagermline={splitedGJAA[index]} mismatch={mismatchJ[index]} remainingNucPrev={remainingD}/>
                    
                </React.Fragment>
            ))}
          </div>
      </div>
      
  );

if(selectedSequenceV && selectedSequenceD && selectedSequenceJ && splitedGVAA.length>0 && splitedGDAA.length>0 && splitedGJAA.length>0 && sequenceJ!="" && sequenceD!="" && sequenceV!="" && sequence!="" && sequenceAA!="" && germlineAA!="" && splitDAA.length>0 && splitVAA.length>0 && splitJAA.length>0){  
      
      return (
      <div>
          <div className='bg-white relative overflow-x-auto'>
          {renderVerticalView()}
          </div>
          <div className='alignment-legend'>
              <div style={{backgroundColor:'#F09EA7', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>FR1</div>
              <div style={{backgroundColor:'#F6CA94', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>CDR1</div>
              <div style={{backgroundColor:'#FAFABE', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>FR2</div>
              <div style={{backgroundColor:'#C1EBC0', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>CDR2</div>
              <div style={{backgroundColor:'#C7CAFF', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>FR3</div>
              <div style={{backgroundColor:'#CDABEB', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>CDR3</div>
              <div style={{backgroundColor:'#F6C2F3', gridRow:1}}>''</div>
              <div className="text-center text-lg font-semibold text-black" style={{gridRow:1}}>FR4</div>
            </div>
      </div>
      );
  }
  }
  
  