import React, { useState, useEffect } from 'react';

const AlignairPageResults = ({ submission }) => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch the results based on the submission
    // This is just a placeholder, replace it with your actual fetch logic
    const fetchResults = async () => {
      const resultData = await fetchResultsFromSubmission(submission);
      setResults(resultData);
    };

    fetchResults();
  }, [submission]);

  return (
    <div id="resultSection" className="result-section">
      <table>
        <thead>
          <tr>
            <th>vCall</th>
            <th>dCall</th>
            <th>jCall</th>
            <th>Productive</th>
            <th>vjInFrame</th>
            <th>Stop Codon</th>
          </tr>
        </thead>
        <tbody>
          {results.map((data, index) => (
            <tr key={index}>
              <td>{data.vCall}</td>
              <td>{data.dCall}</td>
              <td>{data.jCall}</td>
              <td>{data.productive}</td>
              <td>{data.vjInFrame}</td>
              <td>{data.stopCodon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlignairPageResults;