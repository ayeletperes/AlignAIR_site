import React, {useState, useEffect, useRef} from 'react';
import { extractGermline } from './postProcessing';

export function ResultsHTMLTable({results}) {
  //console.log(results)
  return (
    <>
      <table className="styled-table" style={{overflowX:'auto'}}>
        <thead>
          <tr>
            <th>Sequence ID</th>
            <th>V call</th>
            <th>D call</th>
            <th>J call</th>
            <th>V likelihood</th>
            <th>D likelihood</th>
            <th>J likelihood</th>
            <th>Productivity</th>
            <th>Mutation rate</th>
            <th>Indels</th>
            <th>V sequence start</th>
            <th>V sequence end</th>
            <th>D sequence start</th>
            <th>D sequence end</th>
            <th>J sequence start</th>
            <th>J sequence end</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{results.name}</td>
            <td>{results.v_call.join(", ")}</td>
            <td>{results.d_call.join(", ")}</td>
            <td>{results.j_call.join(", ")}</td>
            <td>{results.v_likelihoods.join(", ")}</td>
            <td>{results.d_likelihoods.join(", ")}</td>
            <td>{results.j_likelihoods.join(", ")}</td>
            <td>{results.productive ? "True" : "False"}</td>
            <td>{results.mutation_rate}</td>
            <td>{results.ar_indels}</td>
            <td>{results.v_sequence_start}</td>
            <td>{results.v_sequence_end}</td>
            <td>{results.d_sequence_start}</td>
            <td>{results.d_sequence_end}</td>
            <td>{results.j_sequence_start}</td>
            <td>{results.j_sequence_end}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function getColor(likelihood) {
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

function SelectWidget({call, results, reference, setSelected, selected, selectedAllele, setSelectedAllele}){
  const alleles = results[call];
  const likelihoods = results[`${call.charAt(0)}_likelihoods`];

  const handleChange = (event) => {
    const allele = event.target.value;
    setSelectedAllele(allele);
    const index = alleles.indexOf(allele);
    const k = call === 'd_call' ? 5 : 15;
    const seq = extractGermline.getGermlineSequence({results:results, segment:call.charAt(0), referenceAlleles:reference[call], call_id:index, k:k});
    setSelected(seq);
    
    const alleleElement = document.querySelector(`.allele.${call}`);
    
    alleleElement.textContent = seq;

    const likelihoodElement = document.querySelector(`.likelihood.${call}`);
    likelihoodElement.textContent = Number(likelihoods[index].toFixed(3));
    likelihoodElement.style.width = likelihoods[index] * 100 + 100 + 'px';
    likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
    
  }

  return (
    <>
      <select value={selectedAllele}  onChange={handleChange} style={{fontSize:"18px"}}> 
        {alleles.map((allele, index) => (
          <option key={index} value={allele}>
            {allele}
          </option>
        ))}
      </select>
    </>
  );
}

function SelectWidgetVertical({call, results, reference, setSelected, selected, selectedAllele, setSelectedAllele, setSplitedSeq}){
  const alleles = results[call];
  const likelihoods = results[`${call.charAt(0)}_likelihoods`];

  const handleChange = (event) => {
    const allele = event.target.value;
    setSelectedAllele(allele);
    const index = alleles.indexOf(allele);
    const k = call === 'd_call' ? 5 : 15;
    const seq = extractGermline.getGermlineSequence({results:results, segment:call.charAt(0), referenceAlleles:reference[call], call_id:index, k:k});
    setSelected(seq);
    const splitedSeq = splitSequence(seq, 70);
    setSplitedSeq(splitedSeq);

    splitedSeq.map((seq, index) => {
      let alleleElement = document.querySelector(`.allele.${call}-${index}`);
      alleleElement.textContent = seq;
      // alleleElement = document.querySelector(`.alignment-label.${call}-${index}`);
      // alleleElement.textContent = allele;
    });

    const likelihoodElement = document.querySelector(`.likelihood.${call}`);
    likelihoodElement.textContent = Number(likelihoods[index].toFixed(3));
    likelihoodElement.style.width = likelihoods[index] * 100 + 100 + 'px';
    likelihoodElement.style.backgroundColor = getColor(likelihoods[index]);
    
  }

  return (
    <>
      <select value={selectedAllele}  onChange={handleChange} style={{fontSize:"18px"}}> 
        {alleles.map((allele, index) => (
          <option key={index} value={allele}>
            {allele}
          </option>
        ))}
      </select>
    </>
  );
}

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
const getRegionColor = (regionName) => {
  if (regionName.startsWith('FR')) {
    return regionColors['FR'];
  } else if (regionName.startsWith('CDR')) {
    return regionColors['CDR'];
  } else {
    return regionColors['Junction'];
  }
};

function splitSequence(sequence, maxCharsPerRow){
  const numRows = Math.ceil(sequence.length / maxCharsPerRow)
  const chunkSize = Math.ceil(sequence.length / numRows);
  
  const chunks = [];
  for (let i = 0; i < sequence.length; i += chunkSize) {
    chunks.push(sequence.slice(i, i + chunkSize));
  }
  return chunks;
};

function AlignmentBrowser({ results, referenceAlleles }) {
  const [selectedSequenceV, setSelectedSequenceV] = useState('');
  const [selectedSequenceD, setSelectedSequenceD] = useState('');
  const [selectedSequenceJ, setSelectedSequenceJ] = useState('');
  
  const [selectedAlleleV, setSelectedAlleleV] = useState(results.v_call[0]);
  const [selectedAlleleD, setSelectedAlleleD] = useState(results.d_call[0]);
  const [selectedAlleleJ, setSelectedAlleleJ] = useState(results.j_call[0]);
  
  const [selectedLikelihoodV, setSelectedLikelihoodV] = useState(results.v_likelihoods[0]);
  const [selectedLikelihoodD, setSelectedLikelihoodD] = useState(results.d_likelihoods[0]);
  const [selectedLikelihoodJ, setSelectedLikelihoodJ] = useState(results.j_likelihoods[0]);
  
  const maxCharsPerRow = 70;
  
  const [splitedSequenceV, setSplitedSequenceV] = useState([]);
  const [splitedSequenceD, setSplitedSequenceD] = useState([]);
  const [splitedSequenceJ, setSplitedSequenceJ] = useState([]);

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
  },[selectedSequenceV, selectedSequenceD, selectedSequenceJ])

  const rows = {
        header: 1,
        seq: 2,
        v: 3,
        d: 4,
        j: 5,
      }

  const [isVerticalView, setIsVerticalView] = useState(false);
  
  const toggleView = () => {
    setIsVerticalView(!isVerticalView);
    
  };

  
  // console.log(splitSequence(selectedSequenceV, rowsVertical))
  // console.log(splitSequence(selectedSequenceD, rowsVertical))
  // console.log(splitSequence(selectedSequenceJ, rowsVertical))

  const d_left_margin = results.d_sequence_start;
  const j_left_margin = results.j_sequence_start ;
  
  

  const renderVerticalView = () => (
    <div className="alignment-browser vertical-view">
      <div className="alignment-label" style={{ gridRow: 1 }}>Allele</div>
      <div className="alignment-label" style={{ gridColumn: 2, gridRow: 1 }}>Likelihood</div>

      {splitSequence(results.sequence.slice(0,results.v_sequence_end), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-v-${index}`}>
          
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + 2, gridColumn:1 }}>
            <span className={`alignment-label v_input-${index}`}>V</span>
          </div>
          
          <div className="sequence input-sequence-v" style={{ gridRow: (index * 2) + 2 }}>
            <span className="sequence">{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      <div className="alignment-label" style={{ gridRow: rows.v }}>
          <SelectWidgetVertical
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
      <div className="bar" style={{gridRow: rows.v}}>
        <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Number(selectedLikelihoodV.toFixed(3))}</div>
      </div>

      {splitedSequenceV.map((chunk, index) => (
        <React.Fragment key={`v-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label`} style={{ gridRow: (index * 2) + rows.v, gridColumn:1 }}>
              <span className={`alignment-label v_call-${index}`}>{selectedAlleleV}</span>
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + rows.v }}>
            <span className={`allele v_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      {splitSequence(results.sequence.slice(results.v_sequence_end+1,results.j_sequence_start), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-d-${index}`}>
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1), gridColumn:1 }}>
            <span className={`alignment-label d_input-${index}`}>D</span>
          </div>
          
          <div className="sequence input-sequence-d" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v -1) }}>
            <span className="sequence" style={{color:'gray'}}>{chunk.slice(0,(results.d_sequence_start-results.v_sequence_end-1))}</span>
            <span className="sequence">{chunk.slice((results.d_sequence_start-results.v_sequence_end-1), (results.d_sequence_end-results.v_sequence_end-1))}</span>
            <span className="sequence" style={{color:'gray'}}>{chunk.slice((results.d_sequence_end-results.v_sequence_end))}</span>
          </div>
        </React.Fragment>
      ))}

      <div className="alignment-label" style={{ gridRow: (splitedSequenceV.length*2)+ rows.v }}>
        <SelectWidgetVertical
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
      
      <div className="bar" style={{gridRow: (splitedSequenceV.length*2) + rows.v}}>
        <div className="likelihood d_call" style={{gridRow: (splitedSequenceV.length*2) + rows.v, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Number(selectedLikelihoodD.toFixed(3))}</div>
      </div>
      
      {splitedSequenceD.map((chunk, index) => (
        <React.Fragment key={`d-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label d_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), gridColumn:1 }}>
              {selectedAlleleD}
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + rows.v), marginLeft: `${d_left_margin-(results.v_sequence_end+1)}ch`}}>
            <span className={`allele d_call-${index}`}>{chunk}</span>
          </div>
        </React.Fragment>
      ))}


      {splitSequence(results.sequence.slice(results.j_sequence_start,results.j_sequence_end), maxCharsPerRow).map((chunk, index) => (
        <React.Fragment key={`input-sequence-j-${index}`}>
          <div className={`alignment-label`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1), gridColumn:1 }}>
            <span className={`alignment-label j_input-${index}`}>J</span>
          </div>
          <div className="sequence input-sequence-j" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v -1) }}>
            <span className="sequence">{chunk}</span>
          </div>
        </React.Fragment>
      ))}

      <div className="alignment-label" style={{ gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v) }}>
        <SelectWidgetVertical
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
      
      <div className="bar" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v)}}>
        <div className="likelihood j_call" style={{gridRow: ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Number(selectedLikelihoodJ.toFixed(3))}</div>
      </div>
      
      {splitedSequenceJ.map((chunk, index) => (
        <React.Fragment key={`j-sequence-${index}`}>
          {index > 0 && (
            <div className={`alignment-label j_call-${index}`} style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v), gridColumn:1 }}>
              {selectedAlleleJ}
            </div>
          )}
          <div className="sequence" style={{ gridRow: (index * 2) + ((splitedSequenceV.length*2) + (splitedSequenceD.length*2) + rows.v)}}>
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
      <button id="toggleWrap" className="alignment-btn" onClick={toggleView}>
        {isVerticalView ? 'Horizontal view' : 'Vertical view'}
      </button>
      {isVerticalView ? renderVerticalView() : renderHorizontalView()}
    </div>
  );
}






export function TabSetResults({results, referenceAlleles}){
  // for each sequence in the results create a tab
  const [activeTab, setActiveTab] = useState("query 0");
  // console.log(activeTab)
  const handleClick = (index) => {
    setActiveTab(index);
  };
  return (
    <>
      <div className="tab">
        {Object.entries(results).map(([index, item]) => (
          <button key={index} className={`button${activeTab === index ? ' active' : ''}`} onClick={() => handleClick(index)}>{item.name}</button>
        ))}
      </div>

      {Object.entries(results).map(([index, item]) => (
        // console.log(index), 
        <div key={index} id={item.name} className={`tabcontent${activeTab === index ? ' active' : ''}`}>
          <ResultsHTMLTable results={item} />
          <br/>
          <AlignmentBrowser results={item} referenceAlleles={referenceAlleles}/>
        </div>
      ))}
    </>
  );
}

// add a function that process the results into a downloadable table
export function ResultsTSVTable({results}) {
  const data = Object.entries(results).map(([index, sequence]) => {  
    return {
      sequence_id: sequence.name,
      sequence: sequence.sequence,
      v_call: sequence.v_call.join(", "),
      d_call: sequence.d_call.join(", "),
      j_call: sequence.j_call.join(", "),
      productive: results.productive ? "true" : "false",
      v_likelihoods: sequence.v_likelihoods.join(", "),
      d_likelihoods: sequence.d_likelihoods.join(", "),
      j_likelihoods: sequence.j_likelihoods.join(", "),
      mutation_rate: sequence.mutation_rate,
      sequence_alignment: sequence.sequence.substring(sequence.v_sequence_start, sequence.j_sequence_end + 1),
      v_sequence_start: sequence.v_sequence_start,
      v_sequence_end: sequence.v_sequence_end,
      d_sequence_start: sequence.d_sequence_start,
      d_sequence_end: sequence.d_sequence_end,
      j_sequence_start:sequence.j_sequence_start,
      j_sequence_end: sequence.j_sequence_end,
      ar_indels: sequence.ar_indels,
    };
  });
  return data;
}

export function DownloadResultsTable({results}) {
  const data = ResultsTSVTable({results});
  const headers = Object.keys(data[0]);
  const tsv = data.map(row => headers.map(header => row[header]).join('\t')).join('\n');
  const blob = new Blob([tsv], {type: 'text/tsv'});
  const url = URL.createObjectURL(blob);
  return (
    <>
      <a href={url} download="results.tsv">Download Results</a>
    </>
    
  );
}

