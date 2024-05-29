import React, { useRef} from 'react';
import Tooltip from './toolTip';

export default function SequenceInput({selectedChain, setSequence, sequence}){
    const sequenceInputRef = useRef(null);

    const example_sequences = {
        IGH:"CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
        IGK:"CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG",
        IGL:"CAGGTGCAGCTGCAGGAGTCGGGCCCAGGACTGGTGAAGCCTCCGGGGACCCTGTCCCTCACCTGCGCTGTCTCTGGTGGCTCCATCAGCAGTAGTAACTGGTGGAGTTGGGTCCGCCAGCCCCCAGGGAAGGGGCTGGAGTGGATTGGGGAAATCTATCATAGTCGGAGCACCAACTACAACCCGTCCCTCAAGAGTCGAGTCACCATATCAGTAGACAAGTCCAAGAACCAGTTCTCCCTGAAGCTGAGCTCTGTGACCGCCGCGGACACGGCCGTGTATTACTGTGCGAGCACACCTCCGGGTGTATTACTATGGTTCGGGGAGTTATTAGGCCCGATTTGGGTGGTCGACCCCTGGGGCCAGGGAACCCTGGTCACCGTCTCCTCAG"
    };

    const handleExample = () => {
        if (selectedChain) {
          sequenceInputRef.current.value = example_sequences[selectedChain];
          setSequence(sequenceInputRef.current.value);
        }
    };
    
    const clear = () => {
        sequenceInputRef.current.value = '';
        setSequence(sequenceInputRef.current.value);
    }

    const tooltipText = "Enter a sequence of nucleotides in the text area; it can be in FASTA format. You can also use the 'Example Sequence' button to load an example sequence. Multiple sequences must be added in FASTA format.";
    return (
        <>
            <div className="row">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p>Enter a sequence  </p>
                    <Tooltip tooltipText={tooltipText} />
                </div>
                <button className="example-button" onClick={handleExample} ref={sequenceInputRef}>Example Sequence</button>
            </div>
            <div className="sequence-text-area">
                <textarea id="sequenceInput" value={sequence} onChange={e => setSequence(e.target.value)}> </textarea>
                <button onClick={clear}>
                    <span id="clear-btn">Clear</span>
                </button>
            </div>
        </>
    )

}
