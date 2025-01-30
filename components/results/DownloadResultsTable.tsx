// components/results/DownloadResultsTable.tsx

import React from 'react';
import { formatLikelihoodArray } from '@components/results/utils/formatResults';

interface DownloadResultsTableProps {
  results: any;
}

const DownloadResultsTable: React.FC<DownloadResultsTableProps> = ({ results }) => {
  const handleDownload = () => {
    const headers = [
      'sequence_id',
      'sequence',
      'productive',
      'chain',
      'v_call',
      'd_call',
      'j_call',
      'v_sequence_start',
      'v_sequence_end',
      'd_sequence_start',
      'd_sequence_end',
      'j_sequence_start',
      'j_sequence_end',
      'v_germline_start',
      'v_germline_end',
      'd_germline_start',
      'd_germline_end',
      'j_germline_start',
      'j_germline_end',
      'v_likelihood',
      'd_likelihood',
      'j_likelihood',
      'mutation_rate',
      'indels',
      
    ];
    
    const rows = Object.entries(results).map(([seqID, result]: [string, any]) => [
      result.sequence_id,
      result.sequence,
      result.productive,
      result.chain,
      result.v_call?.join(', '),
      result.d_call?.join(', '),
      result.j_call?.join(', '),
      result.v_sequence_start,
      result.v_sequence_end,
      result.d_sequence_start,
      result.d_sequence_end,
      result.j_sequence_start,
      result.j_sequence_end,
      result.v_germline_start,
      result.v_germline_end,
      result.d_germline_start,
      result.d_germline_end,
      result.j_germline_start,
      result.j_germline_end,
      formatLikelihoodArray(result.v_likelihood || []),
      formatLikelihoodArray(result.d_likelihood || []),
      formatLikelihoodArray(result.j_likelihood || []),
      result.mutation_rate,
      result.indel_count
    ]);
    
    const tsvContent = [
      headers.join('\t'), // Join headers with tab
      ...rows.map(row => row.join('\t')) // Map each row to TSV format
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
      <button
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        onClick={handleDownload}
      >
        Download Results
      </button>
    </div>
  );
};

export default DownloadResultsTable;
