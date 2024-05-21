import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import BioMSA from "biomsa";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
/**
 * Renders a vertical bar chart.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.ChartData - The data for the chart.
 * @param {string} props.color - The color for the chart bars.
 * @returns {JSX.Element} The rendered vertical bar chart.
 */
export function VerticalBarChart2({ ChartData, color }) {
    const options = {
        plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
            label: function (data) {
                return "Confidence:" + data.formattedValue;
            },
            },
        },
        },
    };
    const data = {
        labels: ChartData.map((item) => item.index),
        datasets: [
        {
            data: ChartData.map((item) => item.prob),
            backgroundColor: color,
            borderWidth: 1,
        },
        ],
    };

    return <Bar data={data} options={options} />;
}

export function AlignSeq({index, sequence, germline, germlineAnnotation, alignedAnnotation}) {
    
    const [alignedSeq, setAlignedSeq] = useState([]);

    const alignmentArgs = {
        gapopen: -30,
        gapextend: -2,
        method: 'diag',
        type: 'nucleic',
        gapchar: '-',
        debug: false
    }

    useEffect(() => {
        const fetchAlignedSeq = async () => {
        const result = await BioMSA.align([germline, sequence], alignmentArgs)
        // console.log(result)
        setAlignedSeq(result[1]);
        };
        fetchAlignedSeq();
    }, [germline, sequence]);

    const nucleotides = germline.split('');

    // console.log(alignedSeq);
    let alignedRow = [];
    if (typeof alignedSeq === 'string') {
        alignedRow = alignedSeq.split('');
    }

    const matrixRows = [];
    matrixRows.push(
        <tr key="germline">
        <td>{germlineAnnotation}</td>
        {nucleotides.map((nucleotide, index) => (
            <td key={index}>{nucleotide}</td>
        ))}
        </tr>
    );

    matrixRows.push(
        <tr key="aligned">
        <td>{alignedAnnotation}</td>
        {nucleotides.map((nucleotide, index) => {
            const isGap = alignedRow[index] === '-';
            // console.log(alignedRow[index]);
            const isMismatch = alignedRow[index] !== nucleotide;

            const cellStyle = {
            color: isGap ? 'blue' : isMismatch ? 'red' : 'black',
            fontWeight: isMismatch ? 'bold' : 'normal',
            textAlign: 'center',
            };

            return <td key={index} style={cellStyle}>{isGap ? '-' : isMismatch? alignedRow[index]:'.'}</td>;
        })}
        </tr>
    );

    return (
        <div>
        <table>
            <tbody>{matrixRows}</tbody>
        </table>
        </div>
    );
}

/**
   * Renders a bar chart cell.
   *
   * @component
   * @param {Object[]} values - The values for the bar chart.
   * @param {string} color - The color of the bars.
   * @returns {JSX.Element} The rendered bar chart cell.
   */
export const BarChartCell = ({ values, color }) => {
    const points = values.map((item) => {
      return {
        x: item.index,
        y: item.prob,
        color: color,
      }
    });

    const yAxisTickFormat = (value) => {
      return value.toFixed(2);
    };

    return <VerticalBarChart
      culture={window.navigator.language}
      data={points}
      height={1200}
      width={300}
      hideLegend={true}
      enableReflow={true}
      hideLabels={true}
      rotateXAxisLables={90}
      yAxisTickFormat={yAxisTickFormat}
    />;
  };