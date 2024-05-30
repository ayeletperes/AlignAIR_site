import React, { useState, useEffect } from 'react';
import { extractGermline } from './postProcessing';
import { SelectWidgetVertical2 } from './customSelect';

function formatLikelihood(value: number) {
  // Adjust this condition as needed
  if (value < 0.001) {
    return value.toExponential(2);
  } else {
    return value.toFixed(3);
  }
}

interface ResultsHTMLTableProps {
  results: any;
}
// Number(likelihoods[index].toFixed(3))
export function ResultsHTMLTable({ results }: ResultsHTMLTableProps) {
  // check if d_call key in results
  const hasD = 'd_call' in results;

  return (
    <div className="relative overflow-x-auto scrollbar-custom">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse my-6 font-sans min-w-[400px] shadow-md sm:rounded-lg">
        <thead>
          <tr className="bg-purple-600 text-white border-b-2 border-purple-600">
            <th className="px-4 py-2">Sequence ID</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">V call</th>
            <th className="px-4 py-2">D call</th>
            <th className="px-4 py-2">J call</th>
            <th className="px-4 py-2">V likelihood</th>
            <th className="px-4 py-2">D likelihood</th>
            <th className="px-4 py-2">J likelihood</th>
            <th className="px-4 py-2">Productivity</th>
            <th className="px-4 py-2">Mutation rate</th>
            <th className="px-4 py-2">Indels</th>
            <th className="px-4 py-2">V sequence start</th>
            <th className="px-4 py-2">V sequence end</th>
            <th className="px-4 py-2">D sequence start</th>
            <th className="px-4 py-2">D sequence end</th>
            <th className="px-4 py-2">J sequence start</th>
            <th className="px-4 py-2">J sequence end</th>
          </tr>
        </thead>
        
        <tbody className="bg-white border-b-2 border-purple-600">
          <tr>
            <td className="px-4 py-2">{results.name}</td>
            {hasD? <td className="px-4 py-2">{'IGH'}</td> : <td className="px-4 py-2">{results.type}</td>}
            <td className="px-4 py-2">{results.v_call.join(', ')}</td>
            {hasD? <td className="px-4 py-2">{results.d_call.join(', ')}</td> : <td className="px-4 py-2">{''}</td>}
            <td className="px-4 py-2">{results.j_call.join(', ')}</td>
            <td className="px-4 py-2">{results.v_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td>
            {hasD? <td className="px-4 py-2">{results.d_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td> : <td className="px-4 py-2">{''}</td>}
            <td className="px-4 py-2">{results.j_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td>
            <td className="px-4 py-2">{results.productive ? 'True' : 'False'}</td>
            <td className="px-4 py-2">{formatLikelihood(Number(results.mutation_rate))}</td>
            <td className="px-4 py-2">{results.ar_indels}</td>
            <td className="px-4 py-2">{results.v_sequence_start}</td>
            <td className="px-4 py-2">{results.v_sequence_end}</td>
            {hasD? <td className="px-4 py-2">{results.d_sequence_start}</td> : <td className="px-4 py-2">{''}</td>}
            {hasD? <td className="px-4 py-2">{results.d_sequence_end}</td> : <td className="px-4 py-2">{''}</td>}
            <td className="px-4 py-2">{results.j_sequence_start}</td>
            <td className="px-4 py-2">{results.j_sequence_end}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

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

interface SelectWidgetProps {
  call: string; 
  results: any;
  reference: any;
  setSelected: (seq: string) => void;
  selected: string;
  selectedAllele: string;
  setSelectedAllele: (allele: string) => void;
}

const SelectWidget: React.FC<SelectWidgetProps> = ({
  call,
  results,
  reference,
  setSelected,
  selected,
  selectedAllele,
  setSelectedAllele,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const allele = event.target.value;
    setSelectedAllele(allele);
    const alleles: string[] = results[call];
    const index = alleles.indexOf(allele);
    const k = call === 'd_call' ? 5 : 15;
    const seq = extractGermline.getGermlineSequence({
      results: results,
      segment: call.charAt(0),
      referenceAlleles: reference[call],
      call_id: index,
      k: k,
    });
    setSelected(seq);

    const alleleElement = document.querySelector(`.allele.${call}`) as HTMLElement;

    if (alleleElement) {
      alleleElement.textContent = seq;
    }

    const likelihoods: number[] = results[`${call.charAt(0)}_likelihoods`];
    const likelihoodElement = document.querySelector(`.likelihood.${call}`) as HTMLElement;

    if (likelihoodElement) {
      likelihoodElement.textContent = Number(likelihoods[index].toFixed(3)).toString();
      likelihoodElement.style.width = `${likelihoods[index] * 100 + 100}px`;
      likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
    }
  };

  return (
    <select value={selectedAllele} onChange={handleChange} style={{ fontSize: '18px' }}>
      {results[call].map((allele: string, index: number) => (
        <option key={index} value={allele}>
          {allele}
        </option>
      ))}
    </select>
  );
};

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

function splitSequence(sequence: string, maxCharsPerRow: number){
  const numRows = Math.ceil(sequence.length / maxCharsPerRow)
  const chunkSize = Math.ceil(sequence.length / numRows);
  
  const chunks = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }
  return chunks;
};

interface AlignmentBrowserProps {
  results: any;
  referenceAlleles: any;
}

const AlignmentBrowser: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
  
  const [selectedSequenceV, setSelectedSequenceV] = useState<string>('');
  const [selectedSequenceD, setSelectedSequenceD] = useState<string>('');
  const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');

  const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
  const [selectedAlleleD, setSelectedAlleleD] = useState<string>(results.d_call[0]);
  const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);

  const [selectedLikelihoodV, setSelectedLikelihoodV] = useState<number>(results.v_likelihoods[0]);
  const [selectedLikelihoodD, setSelectedLikelihoodD] = useState<number>(results.d_likelihoods[0]);
  const [selectedLikelihoodJ, setSelectedLikelihoodJ] = useState<number>(results.j_likelihoods[0]);

  const maxCharsPerRow = 70;

  const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
  const [splitedSequenceD, setSplitedSequenceD] = useState<string[]>([]);
  const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSequenceV(
      referenceAlleles['v_call'][results.v_call[0]].slice(results.v_germline_start, results.v_germline_end)
    );

    setSelectedSequenceD(
      referenceAlleles['d_call'][results.d_call[0]].slice(results.d_germline_start, results.d_germline_end)
    );

    setSelectedSequenceJ(
      referenceAlleles['j_call'][results.j_call[0]].slice(results.j_germline_start, results.j_germline_end)
    );
  }, [results, referenceAlleles]);

  useEffect(() => {
    setSplitedSequenceV(splitSequence(selectedSequenceV, maxCharsPerRow));
    setSplitedSequenceD(splitSequence(selectedSequenceD, maxCharsPerRow));
    setSplitedSequenceJ(splitSequence(selectedSequenceJ, maxCharsPerRow));
  }, [selectedSequenceV, selectedSequenceD, selectedSequenceJ]);

  const rows = {
    header: 1,
    seq: 2,
    v: 3,
    d: 4,
    j: 5,
  };

  const [isVerticalView, setIsVerticalView] = useState<boolean>(false);
  
  const toggleView = () => {
    setIsVerticalView(!isVerticalView);
    
  };

  const d_left_margin = results.d_sequence_start;
  const j_left_margin = results.j_sequence_start ;
  
  

  const renderVerticalView = () => (
    <div className="alignment-browser vertical-view">
      <div className="alignment-label" style={{ gridRow: 1 }}>Allele</div>
      {/* <div className="alignment-label" style={{ gridColumn: 2, gridRow: 1 }}>Likelihood</div> */}

      {splitSequence(results.sequence.slice(0,results.v_sequence_end), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-v-${index}`}>
          
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
            <span className={`alignment-label v_input-${index}`}>V</span>
          </div>
          
          <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2, gridColumn:2 }}>
            <span className="sequence">{chunk}</span>
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
          />
        </div>

      {/* <div className="bar" style={{gridRow: rows.v}}>
        <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
      </div> */}

      {splitedSequenceV.map((chunk, index) => (
        <React.Fragment key={`v-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label`} style={{ gridRow: (index * 2) + rows.v, gridColumn:1 }}>
              <span className={`alignment-label v_call-${index}`}>{selectedAlleleV}</span>
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + rows.v, gridColumn:2 }}>
            <span className={`allele v_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      {splitSequence(results.sequence.slice(results.v_sequence_end+1,results.j_sequence_start), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-d-${index}`}>
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:1 }}>
            <span className={`alignment-label d_input-${index}`}>D</span>
          </div>
          
          <div className="sequence input-sequence-d" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:2 }}>
            <span className="sequence" style={{color:'gray'}}>{chunk.slice(0,(results.d_sequence_start-results.v_sequence_end-1))}</span>
            <span className="sequence">{chunk.slice((results.d_sequence_start-results.v_sequence_end-1), (results.d_sequence_end-results.v_sequence_end-1))}</span>
            <span className="sequence" style={{color:'gray'}}>{chunk.slice((results.d_sequence_end-results.v_sequence_end))}</span>
          </div>
        </React.Fragment>
      ))}

      <div className="alignment-label" style={{ gridRow: (splitedSequenceV.length*2)+ rows.v }}>
        <SelectWidgetVertical2
          call='d_call'
          results={results}
          reference={referenceAlleles}
          setSelected={setSelectedSequenceD}
          selected={selectedSequenceD}
          selectedAllele={selectedAlleleD}
          setSelectedAllele={setSelectedAlleleD}
          setSplitedSeq={setSplitedSequenceD}
        />
      </div>
      
      {/* <div className="bar" style={{gridRow: (splitedSequenceV.length*2) + rows.v}}>
        <div className="likelihood d_call" style={{gridRow: (splitedSequenceV.length*2) + rows.v, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
      </div>
       */}
      {splitedSequenceD.map((chunk, index) => (
        <React.Fragment key={`d-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label d_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:1 }}>
              {selectedAlleleD}
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:2, marginLeft: `${d_left_margin-(results.v_sequence_end)}ch`}}>
            <span className={`allele d_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}


      {splitSequence(results.sequence.slice(results.j_sequence_start,results.j_sequence_end), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-j-${index}`}>
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1), gridColumn:1 }}>
            <span className={`alignment-label j_input-${index}`}>J</span>
          </div>
          <div className="sequence input-sequence-j" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1), gridColumn:2 }}>
            <span className="sequence">{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      <div className="alignment-label" style={{ gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v) }}>
        <SelectWidgetVertical2
          call='j_call'
          results={results}
          reference={referenceAlleles}
          setSelected={setSelectedSequenceJ}
          selected={selectedSequenceJ}
          selectedAllele={selectedAlleleJ}
          setSelectedAllele={setSelectedAlleleJ}
          setSplitedSeq={setSplitedSequenceJ}
        />
      </div>
      
      {/* <div className="bar" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v)}}>
        <div className="likelihood j_call" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
      </div>
       */}
      {splitedSequenceJ.map((chunk, index) => (
        <React.Fragment key={`j-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label j_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), gridColumn:1 }}>
              {selectedAlleleJ}
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), gridColumn:2}}>
            <span className={`allele j_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const renderHorizontalView = () => (
    <div className="alignment-browser">
            <div className="alignment-label" style={{gridRow: rows.header}}>Allele</div>
         <div className="alignment-label" style={{gridColumn:2, gridRow: rows.header}}>Likelihood</div>
         <div className="sequence input-sequence" style={{gridRow: rows.seq}}>{results.sequence}</div>
                 <div className="alignment-label" style={{gridRow: rows.v}}>
           <SelectWidget
            call='v_call'
            results={results}
            reference={referenceAlleles}
            setSelected={setSelectedSequenceV}
            selected={selectedSequenceV}
            selectedAllele={selectedAlleleV}
            setSelectedAllele={setSelectedAlleleV}
          />
        </div>
        <div className="bar" style={{gridRow: rows.v}}>
          <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
        </div>
        <div className="sequence" style={{gridRow: rows.v}}>
          <span className="allele v_call" style={{gridRow: rows.v}}>{selectedSequenceV}</span>
        </div>
        <div className="alignment-label" style={{gridRow: rows.d}}>
          <SelectWidget
            call='d_call'
            results={results}
            reference={referenceAlleles}
            setSelected={setSelectedSequenceD}
            selected={selectedSequenceD}
            selectedAllele={selectedAlleleD}
            setSelectedAllele={setSelectedAlleleD}
          />
        </div>
        <div className="bar" style={{gridRow: rows.d}}>
          <div className="likelihood d_call" style={{gridRow: rows.d, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
        </div>
        <div className="sequence" style={{gridRow: rows.d, marginLeft: `${d_left_margin}ch`}}>
          <span className="allele d_call" style={{gridRow: rows.d}}>{selectedSequenceD}</span>
        </div>
        <div className="alignment-label" style={{gridRow: rows.j}}>
          <SelectWidget
            call='j_call'
            results={results}
            reference={referenceAlleles}
            setSelected={setSelectedSequenceJ}
            selected={selectedSequenceJ}
            selectedAllele={selectedAlleleJ}
            setSelectedAllele={setSelectedAlleleJ}
          />
        </div>
        <div className="bar" style={{gridRow: rows.j}}>
          <div className="likelihood j_call" style={{gridRow: rows.j, width:`${Math.round(selectedLikelihoodJ*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
        </div>
        <div className="sequence" style={{gridRow: rows.j, marginLeft: `${j_left_margin}ch`}}>
          <span className="allele j_call" style={{gridRow: rows.j}}>{selectedSequenceJ}</span>
        </div>
      </div>
  );

  return (
    <div>
      {/* <button id="toggleWrap" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={toggleView}>
        {isVerticalView ? 'Horizontal view' : 'Vertical view'}
      </button>
      <div className='bg-white relative overflow-x-auto'>
        {isVerticalView ? renderVerticalView() : renderHorizontalView()}
      </div> */}
      <div className='bg-white relative overflow-x-auto'>
        {renderVerticalView()}
      </div>
    </div>
  );
}

const AlignmentBrowserLight: React.FC<AlignmentBrowserProps> = ({ results, referenceAlleles }) => {
  
  const [selectedSequenceV, setSelectedSequenceV] = useState<string>('');
  const [selectedSequenceJ, setSelectedSequenceJ] = useState<string>('');

  const [selectedAlleleV, setSelectedAlleleV] = useState<string>(results.v_call[0]);
  const [selectedAlleleJ, setSelectedAlleleJ] = useState<string>(results.j_call[0]);

  const [selectedLikelihoodV, setSelectedLikelihoodV] = useState<number>(results.v_likelihoods[0]);
  const [selectedLikelihoodJ, setSelectedLikelihoodJ] = useState<number>(results.j_likelihoods[0]);

  const maxCharsPerRow = 70;

  const [splitedSequenceV, setSplitedSequenceV] = useState<string[]>([]);
  const [splitedSequenceJ, setSplitedSequenceJ] = useState<string[]>([]);

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

  const rows = {
    header: 1,
    seq: 2,
    v: 3,
    j: 4,
  };

  const [isVerticalView, setIsVerticalView] = useState<boolean>(false);
  
  const toggleView = () => {
    setIsVerticalView(!isVerticalView);
    
  };

  const j_left_margin = results.j_sequence_start ;
  
  

  const renderVerticalView = () => (
    <div className="alignment-browser vertical-view">
      <div className="alignment-label" style={{ gridRow: 1 }}>Allele</div>
      {/* <div className="alignment-label" style={{ gridColumn: 2, gridRow: 1 }}>Likelihood</div> */}

      {splitSequence(results.sequence.slice(0,results.v_sequence_end), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-v-${index}`}>
          
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
            <span className={`alignment-label v_input-${index}`}>V</span>
          </div>
          
          <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2, gridColumn: 2 }}>
            <span className="sequence">{chunk}</span>
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
          />
        </div>
      {/* <div className="bar" style={{gridRow: rows.v}}>
        <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
      </div> */}

      {splitedSequenceV.map((chunk, index) => (
        <React.Fragment key={`v-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label`} style={{ gridRow: (index * 2) + rows.v, gridColumn:1 }}>
              <span className={`alignment-label v_call-${index}`}>{selectedAlleleV}</span>
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + rows.v, gridColumn: 2 }}>
            <span className={`allele v_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      {splitSequence(results.sequence.slice(results.v_sequence_end+1), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-j-${index}`}>
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:1 }}>
            <span className={`alignment-label j_input-${index}`}>J</span>
          </div>
          
          <div className="sequence input-sequence-j" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn: 2 }}>
            <span className="sequence" style={{color:'gray'}}>{chunk.slice(0,(results.j_sequence_start-results.v_sequence_end-1))}</span>
            <span className="sequence">{chunk.slice((results.j_sequence_start-results.v_sequence_end-1), (results.j_sequence_end-results.v_sequence_end-1))}</span>
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
        />
      </div>
      
      {/* <div className="bar" style={{gridRow: (splitedSequenceV.length*2) + rows.v}}>
        <div className="likelihood d_call" style={{gridRow: (splitedSequenceV.length*2) + rows.v, width:`${Math.round(selectedLikelihoodJ*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
      </div> */}
      
      {splitedSequenceJ.map((chunk, index) => (
        <React.Fragment key={`j-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label j_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:1 }}>
              {selectedAlleleJ}
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn: 2, marginLeft: `${j_left_margin-(results.v_sequence_end+1)}ch`}}>
            <span className={`allele j_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  // const renderHorizontalView = () => (
  //   <div className="alignment-browser">
  //           <div className="alignment-label" style={{gridRow: rows.header}}>Allele</div>
  //        <div className="alignment-label" style={{gridColumn:2, gridRow: rows.header}}>Likelihood</div>
  //        <div className="sequence input-sequence" style={{gridRow: rows.seq}}>{results.sequence}</div>
  //                <div className="alignment-label" style={{gridRow: rows.v}}>
  //          <SelectWidget
  //           call='v_call'
  //           results={results}
  //           reference={referenceAlleles}
  //           setSelected={setSelectedSequenceV}
  //           selected={selectedSequenceV}
  //           selectedAllele={selectedAlleleV}
  //           setSelectedAllele={setSelectedAlleleV}
  //         />
  //       </div>
  //       <div className="bar" style={{gridRow: rows.v}}>
  //         <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
  //       </div>
  //       <div className="sequence" style={{gridRow: rows.v}}>
  //         <span className="allele v_call" style={{gridRow: rows.v}}>{selectedSequenceV}</span>
  //       </div>
  //       <div className="alignment-label" style={{gridRow: rows.d}}>
  //         <SelectWidget
  //           call='d_call'
  //           results={results}
  //           reference={referenceAlleles}
  //           setSelected={setSelectedSequenceD}
  //           selected={selectedSequenceD}
  //           selectedAllele={selectedAlleleD}
  //           setSelectedAllele={setSelectedAlleleD}
  //         />
  //       </div>
  //       <div className="bar" style={{gridRow: rows.d}}>
  //         <div className="likelihood d_call" style={{gridRow: rows.d, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
  //       </div>
  //       <div className="sequence" style={{gridRow: rows.d, marginLeft: `${d_left_margin}ch`}}>
  //         <span className="allele d_call" style={{gridRow: rows.d}}>{selectedSequenceD}</span>
  //       </div>
  //       <div className="alignment-label" style={{gridRow: rows.j}}>
  //         <SelectWidget
  //           call='j_call'
  //           results={results}
  //           reference={referenceAlleles}
  //           setSelected={setSelectedSequenceJ}
  //           selected={selectedSequenceJ}
  //           selectedAllele={selectedAlleleJ}
  //           setSelectedAllele={setSelectedAlleleJ}
  //         />
  //       </div>
  //       <div className="bar" style={{gridRow: rows.j}}>
  //         <div className="likelihood j_call" style={{gridRow: rows.j, width:`${Math.round(selectedLikelihoodJ*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
  //       </div>
  //       <div className="sequence" style={{gridRow: rows.j, marginLeft: `${j_left_margin}ch`}}>
  //         <span className="allele j_call" style={{gridRow: rows.j}}>{selectedSequenceJ}</span>
  //       </div>
  //     </div>
  // );

  return (
    <div>
      {/* <button id="toggleWrap" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={toggleView}>
        {isVerticalView ? 'Horizontal view' : 'Vertical view'}
      </button>
      <div className='bg-white relative overflow-x-auto'>
        {isVerticalView ? renderVerticalView() : renderHorizontalView()}
      </div> */}
      <div className='bg-white relative overflow-x-auto'>
        {renderVerticalView()}
      </div>
    </div>
  );
}



interface TabSetResultsProps {
  results: any;
  referenceAlleles: any;
}

export const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceAlleles }) => {
  const [activeTab, setActiveTab] = useState<string>('query 0');
  const hasD = 'd_call' in results['query 0'];
  const AlignmentView = hasD ? AlignmentBrowser : AlignmentBrowserLight;

  const handleClick = (index: string) => {
    setActiveTab(index);
  };

  return (
    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="tab">
        {Object.entries(results).map(([index, item]: [string, any]) => (
          <button
            className={`inline-block p-4 border-b-2 rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 ${
              activeTab === index ? 'border-purple-600 text-white-600' : 'border-transparent'
            }`}
            key={index}
            id={index}
            type="button"
            role="tab"
            aria-controls={index}
            aria-selected={activeTab === index}
            onClick={() => handleClick(index)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {Object.entries(results).map(([index, item]: [string, any]) => (
        <div
          key={index}
          id={item.name}
          className={`p-4 bg-gray-50 dark:bg-gray-800 ${
            activeTab === index ? '' : 'hidden'
          }`}
          role="tabpanel"
          aria-labelledby={index}
        >
          <ResultsHTMLTable results={item} />
          <br />
          <AlignmentView results={item} referenceAlleles={referenceAlleles} />
        </div>
      ))}
    </div>
  );
};

// export const TabSetResults: React.FC<TabSetResultsProps> = ({ results, referenceAlleles }) => {
//   const [activeTab, setActiveTab] = useState<string>('query 0');
//   const hasD = 'd_call' in results;
//   // console.log(activeTab)
//   const handleClick = (index: string) => {
//     setActiveTab(index);
//   };
//   const AlignmentView = hasD? AlignmentBrowser : AlignmentBrowserLight;

//   return (
//     <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
//       <div className="tab">
//         {Object.entries(results).map(([index, item]: [string, any]) => (
//           // <button key={index} className={`button${activeTab === index ? ' active' : ''}`} onClick={() => handleClick(index)}>{item.name}</button>
//           // <button key={index} className='inline-block p-4 border-b-2 rounded-t-lg' onClick={() => handleClick(index)}>{item.name}</button>
//           <button className="inline-block p-4 border-b-2 rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" 
//           key={index}
//           id={index} 
//           data-tabs-target={`#${index}`}
//           type="button" 
//           role="tab" 
//           aria-controls={index}
//           aria-selected="false">{item.name}</button>
//         ))}
//       </div>
//       {Object.entries(results).map(([index, item]: [string, any]) => (
//         // console.log(index), 
//         // <div key={index} id={item.name} className={`tabcontent${activeTab === index ? ' active' : ''}`}>
//         <div key={index} id={item.name} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" role="tabpanel" aria-labelledby="profile-tab">
//           <ResultsHTMLTable results={item} />
//           <br/>
//           <AlignmentView results={item} referenceAlleles={referenceAlleles}/>
//         </div>
//       ))}
      
//     </div>
//   );
// }


// add a function that process the results into a downloadable table
interface ResultsTSVTableProps {
  results: any;
}

export function ResultsTSVTable({ results }: ResultsTSVTableProps) {
  const hasD = 'd_call' in results;
  const data = Object.entries(results).map(([index, sequence]: [string, any]) => { // Add type annotation for 'sequence'
    return {
      sequence_id: (sequence as { name: string }).name,
      sequence: sequence.sequence,
      type: hasD? 'IGH' : sequence.type,
      v_call: sequence.v_call.join(', '),
      d_call: hasD? sequence.d_call.join(', ') : '',
      j_call: sequence.j_call.join(', '),
      productive: sequence.productive ? 'true' : 'false',
      v_likelihoods: sequence.v_likelihoods.join(', '),
      d_likelihoods: hasD? sequence.d_likelihoods.join(', '):'',
      j_likelihoods: sequence.j_likelihoods.join(', '),
      mutation_rate: sequence.mutation_rate,
      sequence_alignment: sequence.sequence.substring(sequence.v_sequence_start, sequence.j_sequence_end + 1),
      v_sequence_start: sequence.v_sequence_start,
      v_sequence_end: sequence.v_sequence_end,
      d_sequence_start: hasD? sequence.d_sequence_start: '',
      d_sequence_end: hasD? sequence.d_sequence_end: '',
      j_sequence_start: sequence.j_sequence_start,
      j_sequence_end: sequence.j_sequence_end,
      ar_indels: sequence.ar_indels,
    };
  });
  return data;
}

interface DownloadResultsTableProps {
  results: any;
}

export function DownloadResultsTable({ results }: DownloadResultsTableProps) {
  const handleDownload = () => {
    const data: { [key: string]: any }[] = ResultsTSVTable({ results });
    const headers = Object.keys(data[0]);
    const tsvContent = [
      headers.join('\t'), // Join headers with tab
      ...data.map(row => headers.map(header => row[header]).join('\t')) // Map each row to TSV format
    ].join('\n'); // Join all rows with newline
  
    const blob = new Blob([tsvContent], { type: 'text/tsv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'results.tsv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
      <button className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={handleDownload}>
        Download Results
      </button>
    </div>
  );
}

