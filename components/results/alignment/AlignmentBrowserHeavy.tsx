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

  
export const AlignmentBrowserHeavy: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
    
    
    if (results.ar_indels > 0) {
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
    
    const maxCharsPerRow = 45;
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
    const [splitedNP2, setSplitedNP2] = useState<number[]>([]);

    referenceAlleles.D["Short-D"] = {sequence:"", anchor:0, iuis:"", iglabel:"", asc:""};
    
    let sequence = results.sequence.slice(results.v_sequence_start, results.j_sequence_end);

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
    const dSeqStart = results.d_sequence_start - vSeqStart + paddSize;
    const dSeqEnd = results.d_sequence_end - vSeqStart + paddSize;
    const jSeqStart = results.j_sequence_start - vSeqStart + paddSize;
    const jSeqEnd = results.j_sequence_end - vSeqStart + paddSize;
    vSeqStart = vSeqStart-results.v_sequence_start;

    

    let vAAIndex: number = Math.floor(vSeqEnd / 3);
    let jAAIndex: number = Math.floor(jSeqStart / 3);
    
    
    let sequenceV: string = sequenceAA.slice(0, vAAIndex); 
    let sequenceD: string = sequenceAA.slice(vAAIndex, jAAIndex) ;
    let sequenceJ: string = sequenceAA.slice(jAAIndex) ;
    
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

    // Compute how many np2 nucleotides are in each splitD chunk
    // np2 region: sequence.slice(dSeqEnd, jSeqStart)
    // D region in sequence: sequence.slice(vSeqEnd, jSeqStart)
    // For each chunk in splitD, determine its start/end in the D region, then map to full sequence
    let dRegionStart = vSeqEnd; // in full sequence
    let dRegionEnd = jSeqStart; // in full sequence
    let np2Start = dSeqEnd;     // in full sequence
    let np2End = jSeqStart;     // in full sequence
    let chunkStart = dRegionStart;
    const np2CountsInDChunks: number[] = splitD.map(chunk => {
        const chunkEnd = chunkStart + chunk.length;
        // Overlap with np2 region
        const overlapStart = Math.max(chunkStart, np2Start);
        const overlapEnd = Math.min(chunkEnd, np2End);
        const overlap = Math.max(0, overlapEnd - overlapStart);
        chunkStart += chunk.length;
        return overlap;
    });

    
    
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
        referenceAlleles.invertedV[results.v_call[0]].sequence.slice(0, results.v_germline_end)
      );
      
      setSelectedSequenceD(
        referenceAlleles.D[results.d_call[0]].sequence.slice(results.d_germline_start, results.d_germline_end)
      );
      
      setSelectedSequenceJ(
        referenceAlleles.J[results.j_call[0]].sequence.slice(results.j_germline_start, results.j_germline_end)
      );


    }, [results, referenceAlleles]);
    
    useEffect(() => {
      setSplitedSequenceV(splitSequence(selectedSequenceV, maxCharsPerRow));
      setSplitedSequenceD(splitSequence(selectedSequenceD, maxCharsPerRow));
      setSplitedSequenceJ(splitSequence(selectedSequenceJ, maxCharsPerRow));
      setSplitedNP2(np2CountsInDChunks)
    }, [selectedSequenceV, selectedSequenceD, selectedSequenceJ]);
    
    useEffect(() => {
        setMismatchV(GetSequenceMismatchIdx(sequence.slice(vSeqStart,vSeqEnd), selectedSequenceV, maxCharsPerRow));
        setMismatchD(GetSequenceMismatchIdx(sequence.slice(dSeqStart,dSeqEnd), selectedSequenceD, maxCharsPerRow));
        setMismatchJ(GetSequenceMismatchIdx(sequence.slice(jSeqStart), selectedSequenceJ, maxCharsPerRow));
    }, [results, selectedSequenceV, selectedSequenceD, selectedSequenceJ]);
  
    useEffect(() => {
      if(selectedSequenceV && selectedSequenceD && selectedSequenceJ&& splitGAA){
        const gr = {
          v_call: selectedSequenceV,
          d_call: selectedSequenceD,
          j_call: selectedSequenceJ,
          np1: sequence.slice(vSeqEnd, dSeqStart),
          np2: sequence.slice(dSeqEnd, jSeqStart),
        }
        setGermline(gr);
        const sequenceGermline = gr['v_call'] + gr['np1'] + gr['d_call'] + gr['np2'] + gr['j_call'];
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
    // to get the mismatch in the amino level we need to create the complete AA sequence, by adding the np region to the D sequence
    // and then calculate the mismatch.

    const matcher: any = {};
    if (referenceAlleles) {
      ['V', 'D', 'J'].forEach((segment: string) => {
          matcher[segment] = new HeuristicReferenceMatcher(referenceAlleles[segment]);
      });
    }

    const rows = {
      header: 1,
      seq: 2,
      v: 3,
      d: 4,
      j: 5,
    };
    
    
    const vrow = ((splitedSequenceV.length*3)-rows.v*2-1)
    const drow = (index: number) => (index * 2) + vrow
    const drowG = (index: number) => drow(index) + 1
    const jrow = (index: number) => (index * 2) + (vrow + (splitedSequenceD.length*4))
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
                            chain="heavy"
                            results={results}
                            reference={referenceAlleles.invertedV}
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
                            indelCounts={results.indel_count}
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
              {splitD.map((chunk, index) => (
                  <React.Fragment key={`input-allele-j-${index}`}>
                    {index === 0 && (
                      <div className="subgrid-col1-row" style={{gridRow:1}}>
                        <SelectWidgetVertical2
                            call='d_call'
                            chain="heavy"
                            results={results}
                            reference={referenceAlleles.D}
                            setSelected={setSelectedSequenceD}
                            selected={selectedSequenceD}
                            selectedAllele={selectedAlleleD}
                            setSelectedAllele={setSelectedAlleleD}
                            setSplitedSeq={setSplitedSequenceD}
                            maxCharsPerRow={maxCharsPerRow}
                            setMismatch={setMismatchD}
                            setGermline={setGermline}
                            germline={germline}
                            setGermlineAA={setGermlineAA}
                            setSplittedGAA={setSplitedGDAA}
                            splitStart={vAAIndex}
                            splitEnd={jAAIndex}
                            matcher={matcher.D}
                            indelCounts={results.indel_count}
                            splitedNP2={splitedNP2}
                            setSplitedNP2={setSplitedNP2}
                        />
                      
                      </div>
                      )
                    }
                    {index > 0 && (
                      <div className="subgrid-col1-row" style={{gridRow:index+1, color:"black"}}>
                      {selectedAlleleD}
                      </div>
                    )}
                  </React.Fragment>
              ))}
              
              
              
                
            </div>
            <div className="subgrid-col2" style={{gridColumn:2, height:`${splitD.length*75}"px"`,gridTemplateRows:`repeat(${splitD.length},"20px")`, gridTemplateColumns:`repeat(${maxCharsPerRow},"15px")`}}>
              {splitD.map((chunk, index) => (
                <React.Fragment key={`input-sequence-d-${index}`}>
                {splitD.length === 1 ? (
                        <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np1={np1} np2={np2} remainingNucPrev={remainingV} remainingNucCur={remainingD}/>
                    ) : splitD.length > 1 && index === 0 ? (
                        <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np1={np1} np2={splitedNP2[index]} remainingNucPrev={remainingV} />
                    ) : splitD.length > 1 && (splitD.length - 1) === index ? (
                        <AlignedBlock sequence={chunk} regions={Dregions ? Dregions[index] : Dregions} aasequence={splitDAA[index]} germline={splitedSequenceD[index]} aagermline={splitedGDAA[index]} mismatch={mismatchD[index]} np2={splitedNP2[index]} remainingNucCur={remainingD}/>
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
                            chain="heavy"
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
                            splitStart={jAAIndex}
                            splitEnd={jAAIndex+sequenceJ.length}
                            matcher={matcher.J}
                            indelCounts={results.indel_count}
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
        <div className="modern-alignment-container">
            {/* Enhanced Header with better visual separation */}
            <div className="alignment-header">
                <div className="alignment-title">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Sequence Alignment Viewer</h3>
                    <div className="alignment-info">
                        <span className="info-badge">
                            Heavy Chain | {results.v_call[0]} • {results.d_call[0]} • {results.j_call[0]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Alignment Grid with enhanced styling */}
            <div className='modern-alignment-grid'>
                <div className="alignment-viewer-container">
                    {renderVerticalView()}
                </div>
            </div>
            
            {/* Enhanced Legend with modern design */}
            <div className='modern-alignment-legend'>
                <div className="legend-title">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">Region Color Coding</h4>
                </div>
                <div className="legend-grid">
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#FF6B8A'}}></div>
                        <span className="legend-label">FR1</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#4ECDC4'}}></div>
                        <span className="legend-label">CDR1</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#45B7D1'}}></div>
                        <span className="legend-label">FR2</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#96CEB4'}}></div>
                        <span className="legend-label">CDR2</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#FECA57'}}></div>
                        <span className="legend-label">FR3</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#FF9FF3'}}></div>
                        <span className="legend-label">CDR3</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{backgroundColor:'#54A0FF'}}></div>
                        <span className="legend-label">FR4</span>
                    </div>
                </div>
            </div>
        </div>
        );
    }
  }
  
  