import React, {useState, useEffect} from 'react';
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
    return 'green';
  } else if (likelihood > 0.8) {
    return 'blue';
  } else if (likelihood > 0.7) {
    return 'purple';
  } else if (likelihood > 0.6) {
    return 'yellow';
  } else if (likelihood > 0.5) {
    return 'orange';
  } else {
    return 'red';
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
    console.log(alleleElement.textContent);
    alleleElement.textContent = seq;

    const likelihoodElement = document.querySelector(`.likelihood.${call}`);
    likelihoodElement.textContent = Math.round(likelihoods[index] * 100)+'%';
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

function AlignmentBrowser({results, referenceAlleles}){
  const [selectedSequenceV, setSelectedSequenceV] = useState('');
  const [selectedSequenceD, setSelectedSequenceD] = useState('');
  const [selectedSequenceJ, setSelectedSequenceJ] = useState('');
  
  // const results = Object.entries(resultsObj)[0][1];

  const [selectedAlleleV, setSelectedAlleleV] = useState(results.v_call[0]);
  const [selectedAlleleD, setSelectedAlleleD] = useState(results.d_call[0]);
  const [selectedAlleleJ, setSelectedAlleleJ] = useState(results.j_call[0]);
  
  const [selectedLikelihoodV, setSelectedLikelihoodV] = useState(results.v_likelihoods[0]);
  const [selectedLikelihoodD, setSelectedLikelihoodD] = useState(results.d_likelihoods[0]);
  const [selectedLikelihoodJ, setSelectedLikelihoodJ] = useState(results.j_likelihoods[0]);
  
  useEffect(() => {
    setSelectedSequenceV(
      referenceAlleles['v_call'][results.v_call[0]].slice(results.v_germline_start, results.v_germline_end)
    );

    setSelectedSequenceD(
      referenceAlleles['d_call'][results.d_call[0]].slice(results.d_germline_start, results.d_germline_end)
    );
    console.log(results.j_germline_start, results.j_germline_end);
    setSelectedSequenceJ(
      referenceAlleles['j_call'][results.j_call[0]].slice(results.j_germline_start, results.j_germline_end)
    );
  }, [results, referenceAlleles]);

  
  const d_left_margin = results.d_sequence_start;
  const j_left_margin = results.j_sequence_start ;

  // const createRegionTags = () => {
  //   return Object.entries(regions).map(([regionName, [start, end]]) => {
  //     if (start === null) start = 0;
  //     if (end === null) end = results.sequence.length;
  //     // TODO fix for sequences that don't start at 0
  //     console.log(end, start)
  //     return (
  //       <span
  //         key={regionName}
  //         style={{
  //           gridColumn:3,
  //           left: `${start}ch`,
  //           width: `${end - start}ch`,
  //           backgroundColor: getRegionColor(regionName),
  //           color: 'white',
  //           textAlign: 'center',
  //           position: 'absolute',
  //           fontSize: '18px',
  //           // padding: '2px',
  //           borderRadius: '3px'
  //         }}
  //       >
  //         {regionName}
  //       </span>
  //     );
  //   });
  // };


  const rows = {
    header: 1,
    seq: 2,
    v: 3,
    d: 4,
    j: 5,
  }
  return (
    <>
      <div className="alignment-browser">

        <div className="alignment-label" style={{gridRow: rows.header}}>Allele</div>
        <div className="alignment-label" style={{gridColumn:2, gridRow: rows.header}}>Likelihood</div>
        {/* <div className="region-tags" style={{ gridColumn:3, gridRow: rows.header }}>
          {createRegionTags()}
        </div> */}

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
          <div className="likelihood v_call" style={{gridRow: rows.v, width:`${Math.round(selectedLikelihoodV*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodV)}`}}>{Math.round(selectedLikelihoodV*100)}%</div>
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
          <div className="likelihood d_call" style={{gridRow: rows.d, width:`${Math.round(selectedLikelihoodD*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodD)}`}}>{Math.round(selectedLikelihoodD*100)}%</div>
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
          <div className="likelihood j_call" style={{gridRow: rows.j, width:`${Math.round(selectedLikelihoodJ*100)+100}px`, backgroundColor:`${getColor(selectedLikelihoodJ)}`}}>{Math.round(selectedLikelihoodJ*100)}%</div>
        </div>
        <div className="sequence" style={{gridRow: rows.j, marginLeft: `${j_left_margin}ch`}}>
          <span className="allele j_call" style={{gridRow: rows.j}}>{selectedSequenceJ}</span>
        </div>
      </div>
    </>
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

