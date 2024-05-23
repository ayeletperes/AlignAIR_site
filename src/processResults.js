import React, {useState} from 'react';

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
  

export function TabSetResults({results}){
  // for each sequence in the results create a tab
  const [activeTab, setActiveTab] = useState("query 0");
  // console.log(activeTab)
  const handleClick = (index) => {
    setActiveTab(index);
  };
  return (
    <>
      <div className="tab">
        {Object.entries(results).map(([index, sequence]) => (
          <button key={index} className={`button${activeTab === index ? ' active' : ''}`} onClick={() => handleClick(index)}>{sequence.name}</button>
        ))}
      </div>

      {Object.entries(results).map(([index, sequence]) => (
        // console.log(index), 
        <div key={index} id={sequence.name} className={`tabcontent${activeTab === index ? ' active' : ''}`}>
          <ResultsHTMLTable results={sequence} />
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