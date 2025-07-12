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
        CDR1: "#4ECDC4",    // Modern teal
        CDR2: "#96CEB4",    // Soft green
        CDR3: "#FF9FF3",    // Modern pink
        FR1: "#FF6B8A",     // Coral pink
        FR2: "#45B7D1",     // Modern blue
        FR3: "#FECA57",     // Warm yellow
        FR4: "#54A0FF",     // Bright blue
        };

const CharacterTooltip: React.FC<{ 
    char: string; 
    position: number; 
    type: 'sequence' | 'aa' | 'germline' | 'region';
    region?: string;
    isMismatch?: boolean;
}> = ({ char, position, type, region, isMismatch }) => {
    let tooltipText = '';
    
    switch (type) {
        case 'sequence':
            tooltipText = `Position ${position}: ${char}${isMismatch ? ' (Mismatch)' : ''}`;
            break;
        case 'aa':
            tooltipText = `Amino Acid ${position}: ${char}${isMismatch ? ' (Variant)' : ''}`;
            break;
        case 'germline':
            tooltipText = `Germline ${position}: ${char}`;
            break;
        case 'region':
            tooltipText = `Region: ${region}`;
            break;
    }
    
    return (
        <div className="tooltip-content">
            {tooltipText}
        </div>
    );
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
                                                className="alignment-region alignment-cdr-indicator"
                                                style={{
                                                        gridRow: 1,
                                                        backgroundColor: regionColors[region.region],
                                                        position: 'relative',
                                                        boxShadow: `0 2px 4px ${regionColors[region.region]}40`,
                                                }}
                                                title={`${region.region} region`}
                                        >
                                                <div className="cdr-marker">●</div>
                                        </span>
                                );
                        }else{
                                modifiedRegions.push(
                                        <span 
                                                key={j} 
                                                className="alignment-region" 
                                                style={{
                                                        gridRow: 1, 
                                                        backgroundColor: regionColors[region.region],
                                                        boxShadow: `0 1px 3px ${regionColors[region.region]}30`,
                                                }}
                                                title={`${region.region} region`}
                                        />
                                
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
            
            const isMismatch = aasequence[j] !== aagermline[j] && aasequence[j] !== "X";
            const className = isMismatch ? "alignment-mismatch" : "alignment-char";
            
            modifiedAasequence.push(
                <span 
                    key={i} 
                    className={`${className} aa-char`}
                    style={{gridRow:2}}
                    title={`AA Position ${j + 1}: ${aasequence[j]}${isMismatch ? ' (Variant)' : ''}`}
                    data-position={j + 1}
                    data-type="amino-acid"
                >
                    {aasequence[j]}
                </span>
            );
            j++;
        } else {
            modifiedAasequence.push(<span key={"AA" + i} className="alignment-hidden" style={{gridRow:2}}>{sequence[i]}</span>);
        }
    }

    if(remainingNucCur==2){
        
        let i = sequence.length-1;
        let j = aasequence.length-1;
        
        const isMismatch = aasequence[j] !== aagermline[j] && aasequence[j] !== "X";
        const className = isMismatch ? "alignment-mismatch" : "alignment-char";
        
        modifiedAasequence.push(<span key={"AA" + i} className="alignment-hidden" style={{gridRow:2}}>{sequence[i]}</span>);
        modifiedAasequence.push(
            <span 
                key={i} 
                className={`${className} aa-char`}
                style={{gridRow:2}}
                title={`AA Position ${j + 1}: ${aasequence[j]}${isMismatch ? ' (Variant)' : ''}`}
            >
                {aasequence[j]}
            </span>
        );
    }

    const modifiedSequence: (string | JSX.Element)[] = [];
    const modifiedGermline: (string | JSX.Element)[] = [];
    
    if (np1) {
        for (let i = 0; i < np1; i++) {
            modifiedSequence.push(<span key={i} className="alignment-np np-region" style={{ gridRow:3}} title={`NP1 addition: ${sequence[i]}`}>{sequence[i]}</span>);
            modifiedGermline.push(<span key={i} className="alignment-hidden" style={{ gridRow:4 }}>{sequence[i]}</span>);
        }
    }

    for (let i = np1 ?? 0; i < sequenceLength; i++) {
        let mismatchIdx = i - (np1 ?? 0);
        const isMismatch = mismatch?.includes(mismatchIdx);
        const className = isMismatch ? "alignment-mismatch" : "alignment-char";
        
        modifiedSequence.push(
            <span 
                key={i} 
                className={`${className} nt-char`}
                style={{ gridRow:3}}
                title={`Position ${i + 1}: ${sequence[i]}${isMismatch ? ' (Mismatch with germline)' : ''}`}
                data-position={i + 1}
                data-type="nucleotide"
            >
                {sequence[i]}
            </span>
        );
    }

    if (germline) {
        for (let i = 0; i < germline.length; i++) {
            modifiedGermline.push(<span key={i} className="alignment-char germline-char" style={{ gridRow:4}} title={`Germline Position ${i + 1}: ${germline[i]}`} data-position={i + 1} data-type="germline">{germline[i]}</span>);
        }
    }

    if (np2) {
        
        for (let i = sequenceLength; i < sequence.length; i++) {
            modifiedSequence.push(<span key={i} className="alignment-np np-region" style={{gridRow:3}} title={`NP2 addition: ${sequence[i]}`}>{sequence[i]}</span>);
            modifiedGermline.push(<span key={i} className="alignment-hidden" style={{gridRow:4}}>{sequence[i]}</span>);
        }
    }

    return (
        <div className="subgrid-col2-row modern-aligned-block">
            <div className="region-row">
                {modifiedRegions.map((char, index) => (
                    <React.Fragment key={`region-${index}`}>{char}</React.Fragment>
                ))}
            </div>

            <div className="aa-row">
                {modifiedAasequence.map((char, index) => (
                    <React.Fragment key={`aa-${index}`}>{char}</React.Fragment>
                ))}
            </div>
        
            <div className="nt-row">
                {modifiedSequence.map((char, index) => (
                    <React.Fragment key={`nt-${index}`}>{char}</React.Fragment>
                ))}
            </div>
        
            <div className="germline-row">
                {modifiedGermline.map((char, index) => (
                    <React.Fragment key={`germline-${index}`}>{char}</React.Fragment>
                ))}
            </div>
        </div>
    );
};
