import React, {useState} from 'react';
// import { DetailsList, PivotItem, DetailsListLayoutMode, SelectionMode, Stack } from '@fluentui/react';
// import {VerticalBarChart2} from './Charts';

/**
   * Renders a results table for a given index, values, and tabset.
   *
   * @param {number} index - The index of the results table.
   * @param {object} values - The values for the results table.
   * @param {boolean} tabset - Indicates whether the results table is part of a tabset.
   * @returns {JSX.Element} The rendered results table.
   */
// export function interactiveResults(index, values, tabset) {
//     const columnHeaderStyles = {
//       root: {
//         selectors: {
//           ":hover": {
//             background: "white",
//           },
//         },
//       },
//     };
  
//     const sequenceName = values?.name || '';
//     const sequenceLength = values?.sequence?.length || 0;
  
//     const columns = [
//       { key: 'vAlleles', name: 'V Alleles', fieldName: 'vAlleles', minWidth: 200, height: 400, maxWidth: 300, isResizable: false, isMultiline: true },
//       { key: 'dAlleles', name: 'D Alleles', fieldName: 'dAlleles', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true },
//       { key: 'jAlleles', name: 'J Alleles', fieldName: 'jAlleles', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true },
//     ];
  
//     const items = [
//       {
//         key: 'alleles',
//         vAlleles: values?.v_allele?.map(item => item.index).join(', '),
//         dAlleles: values?.d_allele?.map(item => item.index).join(', '),
//         jAlleles: values?.j_allele?.map(item => item.index).join(', ')
//       },
//       {
//         key: 'confidence',
//         vAlleles: <VerticalBarChart2 ChartData={values?.v_allele} color='#627CEF' />,
//         dAlleles: <VerticalBarChart2 ChartData={values?.d_allele} color='#0E7878' />,
//         jAlleles: <VerticalBarChart2 ChartData={values?.j_allele} color='#C19C00' />,
//         height: 400
//       },
//     ];
  
//     const getPivotItemContent = () => {
//       return (
//         <Stack key={index}>
//           <label className="ms-font-l ms-fontWeight-light">Sequence Name: {sequenceName}, Sequence Length: {sequenceLength}</label>
//           <DetailsList
//             items={items}
//             columns={columns}
//             setKey="set"
//             selectionMode={SelectionMode.none}
//             layoutMode={DetailsListLayoutMode.fixedColumns}
//             styles={columnHeaderStyles}
//             onRenderRow={(props, defaultRender) => {
//               const height = props.item.key === 'confidence' ? 200 : 40;
//               return defaultRender({
//                 ...props,
//                 styles: {
//                   root: {
//                     height: height,
//                     selectors: {
//                       ":hover": {
//                         background: "white",
//                       },
//                     },
//                   }
//                 }
//               })
//             }}
//           />
//         </Stack>
//       );
//     };
  
//     return (
//       <PivotItem key={index} headerText={index}>
//         {tabset ? getPivotItemContent() : getPivotItemContent()}
//       </PivotItem>
//     );
//   };
  

export function ResultsTable({results}) {
  //console.log(results)
  return (
    <>
      <table className="styled-table">
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
          <button key={index} className="tablinks" onClick={() => handleClick(index)}>{sequence.name}</button>
        ))}
      </div>

      {Object.entries(results).map(([index, sequence]) => (
        // console.log(index), 
        <div key={index} id={sequence.name} className={`tabcontent${activeTab === index ? ' active' : ''}`}>
          <ResultsTable results={sequence} />
        </div>
      ))}
    </>
  );
}

