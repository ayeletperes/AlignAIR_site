import React from 'react';

interface AlignedSequenceProps {
  sequence: string;
  aasequence: string;
  mismatch?: number[];
  np1?: number;
  np2?: number;
  remainingNuc?: number;
}

export const AlignedSequence: React.FC<AlignedSequenceProps> = ({sequence, aasequence, mismatch, np1=0, np2=0, remainingNuc=0}) => {
    // Create an array to hold the modified second row
      const sequenceLength = sequence.length - (np2 ?? 0);

      const modifiedAasequence: (string | JSX.Element)[] = [];
      
      // if we have any remaining nucleotides, then we need to calcualte the position of the AA of the np in the sequence. 
      let aaStart = 0;
      let ntStart = 0;
      if(remainingNuc>0){
        
        if(remainingNuc===1){
            modifiedAasequence.push(aasequence[0]);
            modifiedAasequence.push(<span key={0} className="alignment-hidden">X</span>);
            aaStart = 1;
            ntStart = 2;
        }else{
            if(remainingNuc===2){
                modifiedAasequence.push(aasequence[0]);
                aaStart = 1;
                ntStart = 1;
            }
        }
        }
      // Iterate through the sequence to match the alignment
      for (let i = ntStart, j = aaStart; i < sequence.length; i++) {
          let  aaIdx = i - ntStart;
          if ((aaIdx - 1) % 3 === 0 && j < aasequence.length) {
              modifiedAasequence.push(aasequence[j]);
              j++;
          } else {
              modifiedAasequence.push(<span key={i} className="alignment-hidden">{sequence[i]}</span>);
          }
      }
      
      const modifiedSequence: (string | JSX.Element)[] = [];

      // if np1 then add it to the beginning of the sequence and remove the np from the sequence length
        if (np1) {
            for (let i = 0; i < np1; i++) {
                modifiedSequence.push(<span key={i} className="alignment-np">{sequence[i]}</span>);
            }
        }
        
        

        for (let i = np1 ?? 0; i < sequenceLength; i++) {
            let mismatchIdx = i -(np1 ?? 0);
            if (mismatch?.includes(mismatchIdx)) {
                modifiedSequence.push(<span key={i} className="alignment-mismatch">{sequence[i]}</span>);
            } else {
                modifiedSequence.push(sequence[i]);
            }
        }
  
        // if np2 then add it to the end of the sequence
        if (np2) {
            for (let i = sequenceLength+1; i < sequence.length + np2; i++) {
                modifiedSequence.push(<span key={i} className="alignment-np">{sequence[i]}</span>);
            }
        }
  
      return (
      <div className="alignment-container">
          <div className="alignment-row" style={{gridRow:1}}>
          {modifiedAasequence.map((char, index) => (
              <span key={index} className="alignment-char" style={{gridRow:1, gridColumn:index}}>
              {char}
              </span>
          ))}
          </div>
          <div className="alignment-row" style={{gridRow:2}}>
          {modifiedSequence.map((char, index) => (
              <span key={index} className="alignment-char" style={{gridRow:2, gridColumn:index}}>
              {char}
              </span>
          ))}
          </div>
      </div>
      );
  };
  

  interface AlignedGermlineSequenceProps {
    sequence: string;
    np1?: number;
    np2?: number;
  }
  
export const AlignedGermlineSequence: React.FC<AlignedGermlineSequenceProps> = ({sequence, np1=0, np2=0}) => {
    const sequenceLength = sequence.length - (np2 ?? 0);
    const modifiedSequence: (string | JSX.Element)[] = [];
    // if np1 then add it to the beginning of the sequence and remove the np from the sequence length
    if (np1) {
        for (let i = 0; i < np1; i++) {
            modifiedSequence.push(<span key={i} className="alignment-hidden">{sequence[i]}</span>);
        }
    }
    for (let i = 0; i < sequenceLength; i++) {
        modifiedSequence.push(sequence[i]);
    }
    // if np2 then add it to the end of the sequence
    if (np2) {
        for (let i = sequenceLength+1; i < sequence.length + np2; i++) {
            modifiedSequence.push(<span key={i} className="alignment-hidden">{sequence[i]}</span>);
        }
    }

    return (
        <div className="alignment-container">
            <div className="alignment-row" style={{gridRow:1}}>
            {modifiedSequence.map((char, index) => (
                <span key={index} className="alignment-char" style={{gridRow:1, gridColumn:index}}>
                {char}
                </span>
            ))}
            </div>
        </div>
    );
}