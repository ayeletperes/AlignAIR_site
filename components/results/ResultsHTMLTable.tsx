import React from 'react';
import { formatLikelihoodArray } from '@components/results/utils/formatResults';

interface ResultsHTMLTableProps {
  results: any;
  index: any;
  chain: any;
}

const ResultsHTMLTable: React.FC<ResultsHTMLTableProps> = ({ results, index, chain }) => {
  const hasD = chain === 'heavy';
  return (
    <div className="relative overflow-x-auto scrollbar-custom">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse my-6 font-sans min-w-[400px] shadow-md sm:rounded-lg">
        <thead>
          <tr className="bg-purple-600 text-white border-b-2 border-purple-600">
            <th className="px-4 py-2">Sequence ID</th>
            <th className="px-4 py-2">V Call</th>
            <th className="px-4 py-2">D Call</th>
            <th className="px-4 py-2">J Call</th>
            <th className="px-4 py-2">Productive</th>
            <th className="px-4 py-2">Chain</th>
            <th className="px-4 py-2">V Sequence Start</th>
            <th className="px-4 py-2">V Sequence End</th>
            <th className="px-4 py-2">D Sequence Start</th>
            <th className="px-4 py-2">D Sequence End</th>
            <th className="px-4 py-2">J Sequence Start</th>
            <th className="px-4 py-2">J Sequence End</th>
            <th className="px-4 py-2">Mutation Rate</th>
            <th className="px-4 py-2">Indels</th>
            <th className="px-4 py-2">V Likelihood</th>
            <th className="px-4 py-2">D Likelihood</th>
            <th className="px-4 py-2">J Likelihood</th>
          </tr>
        </thead>
        <tbody className="bg-white border-b-2 border-purple-600">
            <tr key={index}>
              <td className="px-4 py-2">{results.sequence_id}</td>
              <td className="px-4 py-2">{results.v_call?.join(',') || ''}</td>
              <td className="px-4 py-2">{hasD ? results.d_call?.join(',') || '' : ''}</td>
              <td className="px-4 py-2">{results.j_call?.join(',') || ''}</td>
              <td className="px-4 py-2">{results.productive}</td>
              <td className="px-4 py-2">{results.chain}</td>
              <td className="px-4 py-2">{results.v_sequence_start}</td>
              <td className="px-4 py-2">{results.v_sequence_end}</td>
              <td className="px-4 py-2">{results.d_sequence_start || ''}</td>
              <td className="px-4 py-2">{results.d_sequence_end || ''}</td>
              <td className="px-4 py-2">{results.j_sequence_start}</td>
              <td className="px-4 py-2">{results.j_sequence_end}</td>
              <td className="px-4 py-2">{results.mutation_rate}</td>
              <td className="px-4 py-2">{results.indel_count}</td>
              <td className="px-4 py-2">{formatLikelihoodArray(results.v_likelihood)}</td>
              <td className="px-4 py-2">{hasD ? formatLikelihoodArray(results.d_likelihood) : ''}</td>
              <td className="px-4 py-2">{formatLikelihoodArray(results.j_likelihood)}</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResultsHTMLTable;
