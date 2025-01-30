import React from 'react';


interface AlignedBlockProps {
    sequence: string;
    regions: any;
    aasequence: string;
    germline: string;
    aagermline: string;
    mismatch?: number[];
    np1?: number;
    np2?: number;
    remainingNucPrev?: number;
    remainingNucCur?: number;
}

const regionColors: {[key: string]: string} = {
        CDR1: "#F6CA94",
        CDR2: "#C1EBC0",
        CDR3: "#CDABEB",
        FR1: "#F09EA7",
        FR2: "#FAFABE",
        FR3: "#C7CAFF",
        FR4: "#F6C2F3",
        };

export const AlignedBlock: React.FC<AlignedBlockProps> = ({ sequence, regions, aasequence, germline, aagermline, mismatch, np1 = 0, np2 = 0, remainingNucPrev = 0, remainingNucCur = 0 }) => {
    const sequenceLength = sequence.length - (np2 ?? 0);
    const modifiedAasequence: (string | JSX.Element)[] = [];
    const modifiedRegions: (string | JSX.Element)[] = [];
    let aaStart = 0;

    if(regions){
        const regionsIDX = regions.regions;
        
        for (let i = 0; i < regionsIDX.length; i++) {
                const region = regionsIDX[i];
                
                
                for (let j = region.ntIndices[0]; j < region.ntIndices[1]; j++) {
                        if(region.region.startsWith("CDR")){
                                modifiedRegions.push(
                                        <span
                                                key={j}
                                                className="alignment-char"
                                                style={{
                                                        gridRow: 1,
                                                        backgroundColor: regionColors[region.region],
                                                        color: `${regionColors[region.region]}`,
                                                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
                                                }}
                                        >
                                                /
                                        </span>
                                );
                        }else{
                                modifiedRegions.push(
                                        <span key={j} className="alignment-char" style={{gridRow:1, backgroundColor:regionColors[region.region]}}>{''}</span>
                                
                                );
                        }
                }
        }
    }else{
        for (let i = 0; i < sequence.length; i++) {
                modifiedRegions.push(<span key={i} className="alignment-hidden" style={{gridRow:1}}>{sequence[i]}</span>);
        }
    }
    
    for (let i = remainingNucPrev, j = aaStart; i < (sequence.length); i++) {
        if ((i - 1) % 3 === 0 && j <= aasequence.length) {
            if(aasequence[j] === aagermline[j] || aasequence[j] === "X"){
                modifiedAasequence.push(<span key={i} className="alignment-char" style={{gridRow:2}}>{aasequence[j]}</span>);
            }else{
                modifiedAasequence.push(<span key={i} className="alignment-mismatch" style={{gridRow:2}}>{aasequence[j]}</span>);
            }
            j++;
        } else {
            modifiedAasequence.push(<span key={"AA" + i} className="alignment-hidden" style={{gridRow:2}}>{sequence[i]}</span>);
        }
    }

    if(remainingNucCur==2){
        
        let i = sequence.length-1;
        let j = aasequence.length-1;
        
        if(aasequence[j] === aagermline[j] || aasequence[j] === "X"){
                modifiedAasequence.push(<span key={"AA" + i} className="alignment-hidden" style={{gridRow:2}}>{sequence[i]}</span>);
                modifiedAasequence.push(<span key={i} className="alignment-char" style={{gridRow:2}}>{aasequence[j]}</span>);
        }else{
                modifiedAasequence.push(<span key={"AA" + i} className="alignment-hidden" style={{gridRow:2}}>{sequence[i]}</span>);
                modifiedAasequence.push(<span key={i} className="alignment-mismatch" style={{gridRow:2}}>{aasequence[j]}</span>);
        }
    }

    const modifiedSequence: (string | JSX.Element)[] = [];
    const modifiedGermline: (string | JSX.Element)[] = [];
    
    if (np1) {
        for (let i = 0; i < np1; i++) {
            modifiedSequence.push(<span key={i} className="alignment-np" style={{ gridRow:3}}>{sequence[i]}</span>);
            modifiedGermline.push(<span key={i} className="alignment-hidden" style={{ gridRow:4 }}>{sequence[i]}</span>);
        }
    }

    for (let i = np1 ?? 0; i < sequenceLength; i++) {
        let mismatchIdx = i - (np1 ?? 0);
        if (mismatch?.includes(mismatchIdx)) {
            modifiedSequence.push(<span key={i} className="alignment-mismatch" style={{ gridRow:3}}>{sequence[i]}</span>);
        } else {
            modifiedSequence.push(<span key={i} className="alignment-char" style={{ gridRow:3}}>{sequence[i]}</span>);
        }
    }

    if (germline) {
        for (let i = 0; i < germline.length; i++) {
            modifiedGermline.push(<span key={i} className="alignment-char" style={{ gridRow:4}}>{germline[i]}</span>);
        }
    }

    if (np2) {
        for (let i = sequenceLength; i < sequence.length; i++) {
            modifiedSequence.push(<span key={i} className="alignment-np" style={{gridRow:3}}>{sequence[i]}</span>);
            modifiedGermline.push(<span key={i} className="alignment-hidden" style={{gridRow:4}}>{sequence[i]}</span>);
        }
    }

    return (
        <div className="subgrid-col2-row">
                
                {modifiedRegions.map((char, index) => (
                    <React.Fragment key={index}>{char}</React.Fragment>
                ))}

                {modifiedAasequence.map((char, index) => (
                    <React.Fragment key={index}>{char}</React.Fragment>
                ))}
            
                {modifiedSequence.map((char, index) => (
                    <React.Fragment key={index}>{char}</React.Fragment>
                ))}
            
                {modifiedGermline.map((char, index) => (
                    <React.Fragment key={index}>{char}</React.Fragment>
                ))}
            
        </div>
    );
};
