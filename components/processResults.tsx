import React, { useState, useEffect } from 'react';
import { extractGermline } from './postProcessing';
import { SelectWidgetVertical2, getColor, splitSequence} from './customSelect';
import {translateDNAtoAA} from './translateDNA';
import {AlignmentBrowserLight} from './alignmentBrowserLight';
import {ResultsHTMLTable} from './resultsHTMLTable';


// function highlightMismatches(sequence, germlineSequence){
//   let highlightedSequence = '';

//     for (let i = 0; i < sequence.length; i++) {
//       if (sequence[i] === germlineSequence[i]) {
//         highlightedSequence += `<span class="match">${sequence[i]}</span>`;
//       } else {
//         highlightedSequence += `<span class="mismatch">${sequence[i]}</span>`;
//       }
//     }

//     return highlightedSequence;
// }

// interface SelectWidgetProps {
//   call: string; 
//   results: any;
//   reference: any;
//   setSelected: (seq: string) => void;
//   selected: string;
//   selectedAllele: string;
//   setSelectedAllele: (allele: string) => void;
// }

// const SelectWidget: React.FC<SelectWidgetProps> = ({
//   call,
//   results,
//   reference,
//   setSelected,
//   selected,
//   selectedAllele,
//   setSelectedAllele,
// }) => {
//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const allele = event.target.value;
//     setSelectedAllele(allele);
//     const alleles: string[] = results[call];
//     const index = alleles.indexOf(allele);
//     const k = call === 'd_call' ? 5 : 15;
//     const seq = extractGermline.getGermlineSequence({
//       results: results,
//       segment: call.charAt(0),
//       referenceAlleles: reference[call],
//       call_id: index,
//       k: k,
//     });
//     setSelected(seq);

//     const alleleElement = document.querySelector(`.allele.${call}`) as HTMLElement;

//     if (alleleElement) {
//       alleleElement.textContent = seq;
//     }

//     const likelihoods: number[] = results[`${call.charAt(0)}_likelihoods`];
//     const likelihoodElement = document.querySelector(`.likelihood.${call}`) as HTMLElement;

//     if (likelihoodElement) {
//       likelihoodElement.textContent = Number(likelihoods[index].toFixed(3)).toString();
//       likelihoodElement.style.width = `${likelihoods[index] * 100 + 100}px`;
//       likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
//     }
//   };

//   return (
//     <select value={selectedAllele} onChange={handleChange} style={{ fontSize: '18px' }}>
//       {results[call].map((allele: string, index: number) => (
//         <option key={index} value={allele}>
//           {allele}
//         </option>
//       ))}
//     </select>
//   );
// };

// interface SelectWidgetVerticalProps {
//   call: string;
//   results: any;
//   reference: any;
//   setSelected: (seq: string) => void;
//   selected: string;
//   selectedAllele: string;
//   setSelectedAllele: (allele: string) => void;
//   setSplitedSeq: (splitedSeq: string[]) => void;
// }

// const SmallPillWithText: React.FC<{ text: string; color: string }> = ({ text, color }) => (
//   <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">
//     {/* Pill Shape */}
//     <rect x="5" y="5" rx="20" ry="20" width="90" height="30" fill={color} />
//     {/* Text on Pill */}
//     <text x="50" y="25" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">
//       {text}
//     </text>
//   </svg>
// );

// const SelectWidgetVertical: React.FC<SelectWidgetVerticalProps> = ({
//   call,
//   results,
//   reference,
//   setSelected,
//   selected,
//   selectedAllele,
//   setSelectedAllele,
//   setSplitedSeq,
// }) => {
//   const alleles: string[] = results[call];
//   const likelihoods: number[] = results[`${call.charAt(0)}_likelihoods`];

//   const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const allele = event.target.value;
//     setSelectedAllele(allele);
//     const index = alleles.indexOf(allele);
//     const k = call === 'd_call' ? 5 : 15;
//     const seq = extractGermline.getGermlineSequence({
//       results: results,
//       segment: call.charAt(0),
//       referenceAlleles: reference[call],
//       call_id: index,
//       k: k,
//     });
//     setSelected(seq);
//     const splitedSeq = splitSequence(seq, 70);
//     setSplitedSeq(splitedSeq);

//     splitedSeq.forEach((seq, index) => {
//       const alleleElement = document.querySelector(`.allele.${call}-${index}`) as HTMLElement;
//       if (alleleElement) {
//         alleleElement.textContent = seq;
//       }
//     });

//     const likelihoodElement = document.querySelector(`.likelihood.${call}`) as HTMLElement;
//     if (likelihoodElement) {
//       likelihoodElement.textContent = Number(likelihoods[index].toFixed(3)).toString();
//       likelihoodElement.style.width = `${likelihoods[index] * 100 + 100}px`;
//       likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
//     }
//   };

//   return (
//     <select value={selectedAllele} onChange={handleChange} style={{ fontSize: '18px' }}>
//       {alleles.map((allele: string, index: number) => (
//         <option
//           key={index}
//           value={allele}
//           style={{
//             backgroundImage: `url('data:image/svg+xml;utf8,${encodeURIComponent(
//               `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40" viewBox="0 0 100 40">${encodeURIComponent(
//                 `<rect x="5" y="5" rx="20" ry="20" width="90" height="30" fill="${getColor(likelihoods[index])}" />` +
//                   `<text x="50" y="25" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">${Number(likelihoods[index].toFixed(3)).toString()}</text>`
//               )}</svg>`
//             )}')`,
//             backgroundRepeat: 'no-repeat',
//             backgroundSize: 'contain',
//             paddingLeft: '20px',
//           }}
//         >
//           {/* {allele} */}
//         </option>
//       ))}
//     </select>
//   );
// };

export const regions = {
  'FR1-IMGT': [0, 78], 
  'CDR1-IMGT': [78, 114], 
  'FR2-IMGT': [114, 165], 
  'CDR2-IMGT': [165, 195], 
  'FR3-IMGT': [195, 312], 
  // 'CDR3-IMGT': [312, null], 
  // 'FR4-IMGT': [null, null], 
  // 'Junction': [309, null]
};

const regionColors = {
  'FR': 'blue',
  'CDR': 'green',
  'Junction': 'orange' // Added color for Junction
};

// Function to get the color based on the region name
const getRegionColor = (regionName: string) => {
  if (regionName.startsWith('FR')) {
    return regionColors['FR'];
  } else if (regionName.startsWith('CDR')) {
    return regionColors['CDR'];
  } else {
    return regionColors['Junction'];
  }
};

// interface AlignmentBrowserProps {
//   results: any;
//   referenceAlleles: any;
// }

// const AlignmentBrowser: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
//   if (results.v_germline_start !== 0 || results.ar_indels > 0) {
//     return (
//       <>
//       <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
//       <svg
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M17 8.75C17 8.33579 16.6642 8 16.25 8H14.5V5.75C14.5 5.33579 14.1642 5 13.75 5H10.25C9.83579 5 9.5 5.33579 9.5 5.75V8H7.75C7.33579 8 7 8.33579 7 8.75V21.25C7 21.6642 7.33579 22 7.75 22H16.25C16.6642 22 17 21.6642 17 21.25V8.75ZM9.5 19.25C9.5 18.8358 9.83579 18.5 10.25 18.5H13.75C14.1642 18.5 14.5 18.8358 14.5 19.25V20H9.5V19.25ZM11 15.25C11 14.8358 11.3358 14.5 11.75 14.5H12.25C12.6642 14.5 13 14.8358 13 15.25V18.5H11V15.25ZM16 13H8V10.75C8 10.3358 8.33579 10 8.75 10H15.25C15.6642 10 16 10.3358 16 10.75V13Z"
//           fill="currentColor"
//         />
//       </svg>
//         <div>
//           <p className="text-lg font-semibold text-black">Work in progress!</p>
//           <p className="text-sm text-black">
//             We are working on alignment view for 5' trimmed sequences, and sequences containing indels.
//           </p>
//         </div>
//       </div>
//       </>
//     );
//   }

//   const [selectedSequenceV, setSelectedSequenceV] = useState<string>('');
//   const [selectedSequenceD, setSelectedSequenceD] = useState<string>('');
//   const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');

//   const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
//   const [selectedAlleleD, setSelectedAlleleD] = useState<string>(results.d_call[0]);
//   const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);

//   const [selectedLikelihoodV, setSelectedLikelihoodV] = useState<number>(results.v_likelihoods[0]);
//   const [selectedLikelihoodD, setSelectedLikelihoodD] = useState<number>(results.d_likelihoods[0]);
//   const [selectedLikelihoodJ, setSelectedLikelihoodJ] = useState<number>(results.j_likelihoods[0]);

//   const maxCharsPerRow = 69;

//   const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
//   const [splitedSequenceD, setSplitedSequenceD] = useState<string[]>([]);
//   const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);

//   useEffect(() => {
//     setSelectedSequenceV(
//       referenceAlleles['v_call'][results.v_call[0]].slice(results.v_germline_start, results.v_germline_end)
//     );

//     setSelectedSequenceD(
//       referenceAlleles['d_call'][results.d_call[0]].slice(results.d_germline_start, results.d_germline_end)
//     );

//     setSelectedSequenceJ(
//       referenceAlleles['j_call'][results.j_call[0]].slice(results.j_germline_start, results.j_germline_end)
//     );
//   }, [results, referenceAlleles]);

//   useEffect(() => {
//     setSplitedSequenceV(splitSequence(selectedSequenceV, maxCharsPerRow));
//     setSplitedSequenceD(splitSequence(selectedSequenceD, maxCharsPerRow));
//     setSplitedSequenceJ(splitSequence(selectedSequenceJ, maxCharsPerRow));
//   }, [selectedSequenceV, selectedSequenceD, selectedSequenceJ]);

//   const rows = {
//     header: 1,
//     seq: 3,
//     v: 4,
//     d: 5,
//     j: 6,
//   };

//   const [isVerticalView, setIsVerticalView] = useState<boolean>(false);
  
//   const toggleView = () => {
//     setIsVerticalView(!isVerticalView);
    
//   };

//   const d_left_margin = results.d_sequence_start;
//   const j_left_margin = results.j_sequence_start ;
  
//   const sequenceAA = translateDNAtoAA(results.sequence);

//   const renderVerticalView = () => (
//     <div className="alignment-browser vertical-view">
//       <div className="alignment-label" style={{ gridRow: 1 }}>Allele</div>
//       <div className="alignment-label" style={{ gridColumn: 2, gridRow: 1 }}>Likelihood</div>

//       {splitSequence(sequenceAA.slice(0,(results.v_sequence_end)), maxCharsPerRow).map((chunk, index) => (
//         <React.Fragment key={`input-sequence-v-${index}`}>
          
//           <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
//             <span className={`alignment-label v_input-${index}`}>V</span>
//           </div>
          
//           <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2, gridColumn:2 }}>
//             <span className="sequence">{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}

//       {splitSequence(results.sequence.slice(0,results.v_sequence_end), maxCharsPerRow).map((chunk, index) => (
//         <React.Fragment key={`input-sequence-v-${index}`}>
          
//           <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
//             <span className={`alignment-label v_input-${index}`}>V</span>
//           </div>
          
//           <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2, gridColumn:2 }}>
//             <span className="sequence">{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}

//       <div className="alignment-label" style={{ gridRow: rows.v }}>
//           <SelectWidgetVertical
//             call='v_call'
//             results={results}
//             reference={referenceAlleles}
//             setSelected={setSelectedSequenceV}
//             selected={selectedSequenceV}
//             selectedAllele={selectedAlleleV}
//             setSelectedAllele={setSelectedAlleleV}
//             setSplitedSeq={setSplitedSequenceV}
//           />
//         </div>

//       <div className="bar" style={{gridRow: rows.v}}>
//         <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
//       </div>

//       {splitedSequenceV.map((chunk, index) => (
//         <React.Fragment key={`v-sequence-${index}`}>
//           {index > 0 && (
//             <div className={`alignment-label`} style={{ gridRow: (index * 2) + rows.v, gridColumn:1 }}>
//               <span className={`alignment-label v_call-${index}`}>{selectedAlleleV}</span>
//             </div>
//           )}
//           <div className="sequence" style={{ gridRow: (index * 2) + rows.v, gridColumn:2 }}>
//             <span className={`allele v_call-${index}`}>{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}

//       {splitSequence(results.sequence.slice(results.v_sequence_end+1,results.j_sequence_start), maxCharsPerRow).map((chunk, index) => (
//         <React.Fragment key={`input-sequence-d-${index}`}>
//           <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:1 }}>
//             <span className={`alignment-label d_input-${index}`}>D</span>
//           </div>
          
//           <div className="sequence input-sequence-d" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:2 }}>
//             <span className="sequence" style={{color:'gray'}}>{chunk.slice(0,(results.d_sequence_start-results.v_sequence_end-1))}</span>
//             <span className="sequence">{chunk.slice((results.d_sequence_start-results.v_sequence_end-1), (results.d_sequence_end-results.v_sequence_end-1))}</span>
//             <span className="sequence" style={{color:'gray'}}>{chunk.slice((results.d_sequence_end-results.v_sequence_end))}</span>
//           </div>
//         </React.Fragment>
//       ))}

//       <div className="alignment-label" style={{ gridRow: (splitedSequenceV.length*2)+ rows.v }}>
//         <SelectWidgetVertical2
//           call='d_call'
//           results={results}
//           reference={referenceAlleles}
//           setSelected={setSelectedSequenceD}
//           selected={selectedSequenceD}
//           selectedAllele={selectedAlleleD}
//           setSelectedAllele={setSelectedAlleleD}
//           setSplitedSeq={setSplitedSequenceD}
//         />
//       </div>
      
//       <div className="bar" style={{gridRow: (splitedSequenceV.length*2) + rows.v}}>
//         <div className="likelihood d_call" style={{gridRow: (splitedSequenceV.length*2) + rows.v, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
//       </div>
      
//       {splitedSequenceD.map((chunk, index) => (
//         <React.Fragment key={`d-sequence-${index}`}>
//           {index > 0 && (
//             <div className={`alignment-label d_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:1 }}>
//               {selectedAlleleD}
//             </div>
//           )}
//           <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:2, marginLeft: `${d_left_margin-(results.v_sequence_end)}ch`}}>
//             <span className={`allele d_call-${index}`}>{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}


//       {splitSequence(results.sequence.slice(results.j_sequence_start,results.j_sequence_end), maxCharsPerRow).map((chunk, index) => (
//         <React.Fragment key={`input-sequence-j-${index}`}>
//           <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1), gridColumn:1 }}>
//             <span className={`alignment-label j_input-${index}`}>J</span>
//           </div>
//           <div className="sequence input-sequence-j" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1), gridColumn:2 }}>
//             <span className="sequence">{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}

//       <div className="alignment-label" style={{ gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v) }}>
//         <SelectWidgetVertical2
//           call='j_call'
//           results={results}
//           reference={referenceAlleles}
//           setSelected={setSelectedSequenceJ}
//           selected={selectedSequenceJ}
//           selectedAllele={selectedAlleleJ}
//           setSelectedAllele={setSelectedAlleleJ}
//           setSplitedSeq={setSplitedSequenceJ}
//         />
//       </div>
      
//       <div className="bar" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v)}}>
//         <div className="likelihood j_call" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
//       </div>
      
//       {splitedSequenceJ.map((chunk, index) => (
//         <React.Fragment key={`j-sequence-${index}`}>
//           {index > 0 && (
//             <div className={`alignment-label j_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), gridColumn:1 }}>
//               {selectedAlleleJ}
//             </div>
//           )}
//           <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), gridColumn:2}}>
//             <span className={`allele j_call-${index}`}>{chunk}</span>
//           </div>
//         </React.Fragment>
//       ))}
//     </div>
//   );

//   const renderHorizontalView = () => (
//     <div className="alignment-browser">
//             <div className="alignment-label" style={{gridRow: rows.header}}>Allele</div>
//          <div className="alignment-label" style={{gridColumn:2, gridRow: rows.header}}>Likelihood</div>
//          <div className="sequence input-sequence" style={{gridRow: rows.seq}}>{results.sequence}</div>
//                  <div className="alignment-label" style={{gridRow: rows.v}}>
//            <SelectWidget
//             call='v_call'
//             results={results}
//             reference={referenceAlleles}
//             setSelected={setSelectedSequenceV}
//             selected={selectedSequenceV}
//             selectedAllele={selectedAlleleV}
//             setSelectedAllele={setSelectedAlleleV}
//           />
//         </div>
//         <div className="bar" style={{gridRow: rows.v}}>
//           <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
//         </div>
//         <div className="sequence" style={{gridRow: rows.v}}>
//           <span className="allele v_call" style={{gridRow: rows.v}}>{selectedSequenceV}</span>
//         </div>
//         <div className="alignment-label" style={{gridRow: rows.d}}>
//           <SelectWidget
//             call='d_call'
//             results={results}
//             reference={referenceAlleles}
//             setSelected={setSelectedSequenceD}
//             selected={selectedSequenceD}
//             selectedAllele={selectedAlleleD}
//             setSelectedAllele={setSelectedAlleleD}
//           />
//         </div>
//         <div className="bar" style={{gridRow: rows.d}}>
//           <div className="likelihood d_call" style={{gridRow: rows.d, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
//         </div>
//         <div className="sequence" style={{gridRow: rows.d, marginLeft: `${d_left_margin}ch`}}>
//           <span className="allele d_call" style={{gridRow: rows.d}}>{selectedSequenceD}</span>
//         </div>
//         <div className="alignment-label" style={{gridRow: rows.j}}>
//           <SelectWidget
//             call='j_call'
//             results={results}
//             reference={referenceAlleles}
//             setSelected={setSelectedSequenceJ}
//             selected={selectedSequenceJ}
//             selectedAllele={selectedAlleleJ}
//             setSelectedAllele={setSelectedAlleleJ}
//           />
//         </div>
//         <div className="bar" style={{gridRow: rows.j}}>
//           <div className="likelihood j_call" style={{gridRow: rows.j, width:`${Math.round(selectedLikelihoodJ*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
//         </div>
//         <div className="sequence" style={{gridRow: rows.j, marginLeft: `${j_left_margin}ch`}}>
//           <span className="allele j_call" style={{gridRow: rows.j}}>{selectedSequenceJ}</span>
//         </div>
//       </div>
//   );

//   return (
//     <div>
//       <button id="toggleWrap" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={toggleView}>
//         {isVerticalView ? 'Horizontal view' : 'Vertical view'}
//       </button>
//       <div className='bg-white relative overflow-x-auto'>
//         {isVerticalView ? renderVerticalView() : renderHorizontalView()}
//       </div>
//       <div className='bg-white relative overflow-x-auto'>
//         {renderVerticalView()}
//       </div>
//     </div>
//   );
// }







