import React from 'react';
import { DetailsList, PivotItem, DetailsListLayoutMode, SelectionMode, Stack } from '@fluentui/react';
import {VerticalBarChart2} from './Charts';

/**
   * Renders a results table for a given index, values, and tabset.
   *
   * @param {number} index - The index of the results table.
   * @param {object} values - The values for the results table.
   * @param {boolean} tabset - Indicates whether the results table is part of a tabset.
   * @returns {JSX.Element} The rendered results table.
   */
export default function interactiveResults(index, values, tabset) {
    const columnHeaderStyles = {
      root: {
        selectors: {
          ":hover": {
            background: "white",
          },
        },
      },
    };
  
    const sequenceName = values?.name || '';
    const sequenceLength = values?.sequence?.length || 0;
  
    const columns = [
      { key: 'vAlleles', name: 'V Alleles', fieldName: 'vAlleles', minWidth: 200, height: 400, maxWidth: 300, isResizable: false, isMultiline: true },
      { key: 'dAlleles', name: 'D Alleles', fieldName: 'dAlleles', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true },
      { key: 'jAlleles', name: 'J Alleles', fieldName: 'jAlleles', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true },
    ];
  
    const items = [
      {
        key: 'alleles',
        vAlleles: values?.v_allele?.map(item => item.index).join(', '),
        dAlleles: values?.d_allele?.map(item => item.index).join(', '),
        jAlleles: values?.j_allele?.map(item => item.index).join(', ')
      },
      {
        key: 'confidence',
        vAlleles: <VerticalBarChart2 ChartData={values?.v_allele} color='#627CEF' />,
        dAlleles: <VerticalBarChart2 ChartData={values?.d_allele} color='#0E7878' />,
        jAlleles: <VerticalBarChart2 ChartData={values?.j_allele} color='#C19C00' />,
        height: 400
      },
    ];
  
    const getPivotItemContent = () => {
      return (
        <Stack key={index}>
          <label className="ms-font-l ms-fontWeight-light">Sequence Name: {sequenceName}, Sequence Length: {sequenceLength}</label>
          <DetailsList
            items={items}
            columns={columns}
            setKey="set"
            selectionMode={SelectionMode.none}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            styles={columnHeaderStyles}
            onRenderRow={(props, defaultRender) => {
              const height = props.item.key === 'confidence' ? 200 : 40;
              return defaultRender({
                ...props,
                styles: {
                  root: {
                    height: height,
                    selectors: {
                      ":hover": {
                        background: "white",
                      },
                    },
                  }
                }
              })
            }}
          />
        </Stack>
      );
    };
  
    return (
      <PivotItem key={index} headerText={index}>
        {tabset ? getPivotItemContent() : getPivotItemContent()}
      </PivotItem>
    );
  };
  

//     // TODO: change the sequence once we have the new model. then the sequence should be cut based on the start.
//     // assuming all the sequences at the moment start from the first base.
//     // we should change this once we have the new model.
//     // dectect all the regions. CDR3 by conserved amino acid in position 104 and the junction starts one before. 
//     // The functionality is dependent on V-J being in frame (Junction modulo three), No stop codon in the sequence.
//     // sequence statistics. first table: Productive, Stop Codon, V-J frame. Second table: CDR3 sequence and positions.
//     // const columns2 = [
//     //   { key: 'productive', name: 'Productive', fieldName: 'productive', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true },
//     //   { key: 'vj_in_frame', name: 'V J in frame', fieldName: 'vj_in_frame', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true, },
//     //   { key: 'stop_codon', name: 'Stop Codon', fieldName: 'stop_codon', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true, },
//     //   { key: 'cdr3_sequence', name: 'CDR3-IMGT', fieldName: 'cdr3_sequence', minWidth: 200, maxWidth: 300, isResizable: false, isMultiline: true, },
//     // ];
//     // const items2 = [
//     //   {
//     //     key: 'stats',
//     //     productive: v_allele?.map((item) => item.index).join(', '),
//     //     vj_in_frame: d_allele?.map((item) => item.index).join(', '),
//     //     stop_codon: j_allele?.map((item) => item.index).join(', '),
//     //     cdr3_sequence: j_allele?.map((item) => item.index).join(', '),
//     //   },
//     // ];
//           {/* <br />
//           <DetailsList
//             items={items2}
//             columns={columns2}
//             setKey="set"
//             selectionMode={SelectionMode.none}
//             layoutMode={DetailsListLayoutMode.fixedColumns}
//             styles={columnHeaderStyles}
//           /> */}
