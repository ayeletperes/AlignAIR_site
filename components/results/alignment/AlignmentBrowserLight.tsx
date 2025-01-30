// components/results/alignment/AlignmentBrowserLight.tsx

import React, { useState, useEffect } from 'react';
import { SelectWidgetVertical2 } from '@components/results/alignment/utils/customSelect';
import { splitSequence } from '@components/results/alignment/utils/splitSequence';
import { GetSequenceMismatchIdx } from '@components/results/alignment/utils/mismatchUtils';
import { translateDNAtoAA } from '@components/results/alignment/utils/translateUtils';
import { AlignedBlock } from '@components/results/alignment/AlignedBlock';
import { numberIghv, splitRegions, findRegionIndicesForNtChunks } from '@components/results/alignment/utils/regions';
import { HeuristicReferenceMatcher } from '@components/postprocessing/heuristicmatching/heuristicMatcher';

interface AlignmentBrowserProps {
    results: any;
    referenceAlleles: any;
  }

  
export const AlignmentBrowserLight: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
    
    
    if (results.ar_indels > 0) {//results.v_germline_start !== 0 || 
      return (
        <>
        <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
        <span role="img" aria-label="building" style={{fontSize: '24px'}}>🏗️</span>
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
    const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');
    const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
    const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);
    const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
    const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);
    const [mismatchV, setMismatchV] = useState<{ [key: number]: number[] }>({});
    const [mismatchJ, setMismatchJ] = useState<{ [key: number]: number[] }>({});
    const [splitedGVAA, setSplitedGVAA] = useState<string[]>([]);
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
    const vSeqEnd = results.v_sequence_end - vSeqStart + paddSize;
    const jSeqStart = results.j_sequence_start - vSeqStart + paddSize;
    const jSeqEnd = results.j_sequence_end - vSeqStart + paddSize;
    vSeqStart = vSeqStart-results.v_sequence_start;

    

    let vAAIndex: number = Math.floor(vSeqEnd / 3);
    
    let sequenceV: string = sequenceAA.slice(0, vAAIndex);
    let sequenceJ: string = sequenceAA.slice(vAAIndex) ;
    
    let remainingV = vSeqEnd-(sequenceV.length*3);
    
    let splitGAA = false;
    
    if(remainingV==2){
      // add the aa to the V. else add it to the D
      vAAIndex = vAAIndex+1;
      sequenceV = sequenceAA.slice(0, vAAIndex);
      sequenceJ = sequenceAA.slice(vAAIndex)
      splitGAA = true;
    }else{
      sequenceV = sequenceAA.slice(0, vAAIndex);
      sequenceJ = sequenceAA.slice(vAAIndex)
      splitGAA = true;
    }
    
    
    
    

    
    
    const splitV = splitSequence(sequence.slice(vSeqStart,vSeqEnd), maxCharsPerRow)
    
    const splitVAA = splitSequence(sequenceV, maxCharsPerRow/3)
    const splitJ = splitSequence(sequence.slice(vSeqEnd), maxCharsPerRow)
    const splitJAA = splitSequence(sequenceJ, maxCharsPerRow/3)
    const np1 = jSeqStart - (vSeqEnd);

    const [gappedAA, gappNotes] = numberIghv(sequenceV);
    
    let Vregions = null;
    let Jregions = null;
    if(gappNotes===''){
      const regionGappedAA = gappedAA? splitRegions(gappedAA): {'':""};
      Vregions = findRegionIndicesForNtChunks(regionGappedAA, splitVAA, splitV)
      // get the end of the cdr3
      const anchor = results.j_call[0]?referenceAlleles.J[results.j_call[0]].anchor:null;
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
        referenceAlleles.V[results.v_call[0]].sequence.slice(0, results.v_germline_end)
      );
      
      setSelectedSequenceJ(
        referenceAlleles.J[results.j_call[0]].sequence.slice(results.j_germline_start, results.j_germline_end)
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
      if(selectedSequenceV && selectedSequenceJ&& splitGAA){
        const gr = {
          v_call: selectedSequenceV,
          j_call: selectedSequenceJ,
          np1: sequence.slice(vSeqEnd, jSeqStart),
        }
        setGermline(gr);
        
        const sequenceGermline = gr['v_call'] + gr['np1'] + gr['j_call'];
        
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
        setSplitedGJAA(splitSequence(germlineAAPad.slice(vAAIndex), maxCharsPerRow/3));
      }
    }, [selectedSequenceV, selectedSequenceJ, splitGAA]);
    // to get the mismatch in the amino level we need to create the complete AA sequence, by adding the np region to the D sequence
    // and then calculate the mismatch.

    const matcher: any = {};
    if (referenceAlleles) {
      ['V', 'J'].forEach((segment: string) => {
          matcher[segment] = new HeuristicReferenceMatcher(referenceAlleles[segment]);
      });
    }
 
    const rows = {
      header: 1,
      seq: 2,
      v: 3,
      j: 4,
    };
    const vrow = ((splitedSequenceV.length*3)-rows.v*2-1)
    
    const renderVerticalView = () => (
        <div className="alignment-grid scrollbar-custom" style={{gridTemplateRows:`'${splitV.length*75}"px" ${splitJ.length*75}"px"'`}}>

            <div className="subgrid-col1" style={{gridColumn:1}}>
              {splitV.map((chunk, index) => (
                  <React.Fragment key={`input-allele-v-${index}`}>
                    {index === 0 && (
                      <div className="subgrid-col1-row" style={{gridRow:1}}>
                        <SelectWidgetVertical2
                            call='v_call'
                            chain='light'
                            results={results}
                            reference={referenceAlleles.V}
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
                            matcher={matcher.V}
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

            <div className="subgrid-col1" style={{gridColumn:1}}>
              {splitJ.map((chunk, index) => (
                  <React.Fragment key={`input-allele-j-${index}`}>
                    {index === 0 && (
                      <div className="subgrid-col1-row" style={{gridRow:1}}>
                        <SelectWidgetVertical2
                            call='j_call'
                            chain='light'
                            results={results}
                            reference={referenceAlleles.J}
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
                            splitStart={vAAIndex}
                            splitEnd={vAAIndex+sequenceJ.length}
                            matcher={matcher.J}
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
                      
                      <AlignedBlock sequence={chunk} regions={Jregions ? Jregions[index] : Jregions} aasequence={splitJAA[index]} germline={splitedSequenceJ[index]} aagermline={splitedGJAA[index]} mismatch={mismatchJ[index]} remainingNucPrev={remainingV} np1={np1}/>
                      
                  </React.Fragment>
              ))}
            </div>
        </div>
        
    );

  if(selectedSequenceV && selectedSequenceJ && splitedGVAA.length>0 && splitedGJAA.length>0 && 
    sequenceJ!="" && sequenceV!="" && sequence!="" && sequenceAA!="" && germlineAA!="" && splitVAA.length>0 && splitJAA.length>0){  
        
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
  
  