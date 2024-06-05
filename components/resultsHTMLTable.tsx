import React from 'react';


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
              {results.v_call.length>0? <td className="px-4 py-2">{results.v_call.join(', ')}</td>:<td className="px-4 py-2">{''}</td>}
              {hasD && results.d_call.length>0 ? <td className="px-4 py-2">{results.d_call.join(', ')}</td> : <td className="px-4 py-2">{''}</td>}
              {results.j_call.length>0? <td className="px-4 py-2">{results.j_call.join(', ')}</td>:<td className="px-4 py-2">{''}</td>}
              {results.v_likelihoods!=null? <td className="px-4 py-2">{results.v_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td>:<td className="px-4 py-2">{''}</td>}
              {hasD && results.d_likelihoods!=null? <td className="px-4 py-2">{results.d_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td> : <td className="px-4 py-2">{''}</td>}
              {results.j_likelihoods!=null? <td className="px-4 py-2">{results.j_likelihoods.map((value: number) => formatLikelihood(value)).join(', ')}</td>:<td className="px-4 py-2">{''}</td>}
              <td className="px-4 py-2">{results.productive ? 'True' : 'False'}</td>
              <td className="px-4 py-2">{formatLikelihood(Number(results.mutation_rate))}</td>
              <td className="px-4 py-2">{results.ar_indels}</td>
              {results.v_sequence_start!=null? <td className="px-4 py-2">{results.v_sequence_start}</td>: <td className="px-4 py-2">{''}</td>}
              {results.v_sequence_end!=null? <td className="px-4 py-2">{results.v_sequence_end}</td>: <td className="px-4 py-2">{''}</td>}
              {hasD && results.d_sequence_start!=null? <td className="px-4 py-2">{results.d_sequence_start}</td> : <td className="px-4 py-2">{''}</td>}
              {hasD && results.d_sequence_end!=null? <td className="px-4 py-2">{results.d_sequence_end}</td> : <td className="px-4 py-2">{''}</td>}
              {results.j_sequence_start!=null?<td className="px-4 py-2">{results.j_sequence_start}</td>:<td className="px-4 py-2">{''}</td>}
              {results.j_sequence_end!=null?<td className="px-4 py-2">{results.j_sequence_end}</td>:<td className="px-4 py-2">{''}</td>}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }