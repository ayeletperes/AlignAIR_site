// add a function that process the results into a downloadable table
import React from 'react';


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