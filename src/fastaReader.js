import {IGHV,IGHD,IGHJ} from "./Reference";

export class FastaReader {
    
    queryToDict(fastaContent) {
        const fastaLines = fastaContent.split('\n');
        
        const dataDict = {};
        let currentKey = '';
        let currentValue = '';
        let currentQuery = 0;
        
        fastaLines.forEach((line, index) => {
            
            if (index === 0 && !line.startsWith('>')){
                currentKey = 'seq 1';
                dataDict['query ' + currentQuery] = { name: currentKey, sequence: ''};
            }
            if (line.startsWith('>')) {
                if (currentKey && currentValue) {
                    dataDict['query ' + currentQuery] = { name: currentKey, sequence: currentValue };
                    currentQuery += 1;
                }
                currentKey = line.slice(1).trim();
                currentValue = '';
            } else {
                currentValue += line.trim();
            }
        });
        if (currentKey && currentValue) {
            dataDict['query ' + currentQuery] = { name: currentKey, sequence: currentValue };
        }
        
        return dataDict;
    }

    fastaToDict(fastaContent) {
        const fastaLines = fastaContent.split('\n');
        const dataDict = {};
        let currentKey = '';
        let currentValue = '';
        fastaLines.forEach(line => {
            if (line.startsWith('>')) {
                if (currentKey && currentValue) {
                    dataDict[currentKey] = currentValue;
                }
                currentKey = line.slice(1).trim();
                currentValue = '';
            } else {
                currentValue += line.trim();
            }
        });
        if (currentKey && currentValue) {
            dataDict[currentKey] = currentValue;
        }
        return dataDict;
    }

    sortAndReturnDict(fastaContent) {
        const dataDict = this.fastaToDict(fastaContent);
        const sortedDataDict = Object.keys(dataDict).sort().reduce((obj, key) => {
            obj[key] = dataDict[key];
            return obj;
        }, {});

        const alleleCallOHE = {};
        Object.keys(sortedDataDict).forEach((allele, index) => {
            alleleCallOHE[index] = {
                name:allele,
                sequence:sortedDataDict[allele]
            };
        });

        return { alleleCallOHE, sortedDataDict };
    }

    processFastaContents(IGHV, IGHD, IGHJ) {
        const { alleleCallOHE: vAlleleCallOHE, sortedDataDict: sortedIGHVDataDict } = this.sortAndReturnDict(IGHV);
        const { alleleCallOHE: dAlleleCallOHE, sortedDataDict: sortedIGHDDataDict } = this.sortAndReturnDict(IGHD);
        dAlleleCallOHE[Object.keys(dAlleleCallOHE).length] = {name:"Short-D",sequence:""};
        const { alleleCallOHE: jAlleleCallOHE, sortedDataDict: sortedIGHJDataDict } = this.sortAndReturnDict(IGHJ);

        return {
            vAlleleCallOHE,
            sortedIGHVDataDict,
            dAlleleCallOHE,
            sortedIGHDDataDict,
            jAlleleCallOHE,
            sortedIGHJDataDict,
        };
    }
}

export const fastaReader = new FastaReader();
export const {
    vAlleleCallOHE,
    sortedIGHVDataDict,
    dAlleleCallOHE,
    sortedIGHDDataDict,
    jAlleleCallOHE,
    sortedIGHJDataDict,
} = fastaReader.processFastaContents(IGHV, IGHD, IGHJ);
