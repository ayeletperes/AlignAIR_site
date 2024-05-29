// import { IGHV, IGHD, IGHJ, IGHVnameConvert } from "./Reference";

// interface AlleleCallOHEItem {
//   name: string;
//   sequence: string;
// }

// interface AlleleCallOHE {
//     [key: string]: AlleleCallOHEItem[];
// };

export class FastaReader {
  queryToDict(fastaContent: string): { [key: string]: { name: string; sequence: string } } {
    const fastaLines = fastaContent.split('\n');
    const dataDict: { [key: string]: { name: string; sequence: string } } = {};
    let currentKey = '';
    let currentValue = '';
    let currentQuery = 0;

    fastaLines.forEach((line, index) => {
      if (index === 0 && !line.startsWith('>')) {
        currentKey = 'seq 1';
        dataDict['query ' + currentQuery] = { name: currentKey, sequence: '' };
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

  fastaToDict(fastaContent: string): { [key: string]: string } {
    const fastaLines = fastaContent.split('\n');
    const dataDict: { [key: string]: string } = {};
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

//   sortAndReturnDict(fastaContent: string): { alleleCallOHE: AlleleCallOHE; sortedDataDict: { [key: string]: string } } {
//     const dataDict = this.fastaToDict(fastaContent);
//     const sortedDataDict: { [key: string]: string } = Object.keys(dataDict)
//         .sort()
//         .reduce((obj: { [key: string]: string }, key) => {
//             obj[key] = dataDict[key];
//             return obj;
//         }, {});

//     const alleleCallOHE: AlleleCallOHE = {}; // Change the type from 'never[]' to 'AlleleCallOHE'
//     Object.keys(sortedDataDict).forEach((allele, index) => {
//         alleleCallOHE[allele] = { // Add index signature for type 'string'
//         name: allele,
//         sequence: sortedDataDict[allele],
//         };
//     });

//     return { alleleCallOHE, sortedDataDict };
//   }

//   processFastaContents(IGHV: string, IGHD: string, IGHJ: string, IGHVnameConvert: { [key: string]: string }) {
//     const { alleleCallOHE: vAlleleCallOHE, sortedDataDict: sortedIGHVDataDict } = this.sortAndReturnDict(IGHV);
//     // go over each name in the vAlleleCallOHE and convert the name to the IGHVnameConvert
//     Object.keys(vAlleleCallOHE).forEach(key => {
//       vAlleleCallOHE[key].name = IGHVnameConvert[vAlleleCallOHE[key].name];
//     });

//     const { alleleCallOHE: dAlleleCallOHE, sortedDataDict: sortedIGHDDataDict } = this.sortAndReturnDict(IGHD);
//     dAlleleCallOHE[Object.keys(dAlleleCallOHE).length] = { name: "Short-D", sequence: "" };
//     const { alleleCallOHE: jAlleleCallOHE, sortedDataDict: sortedIGHJDataDict } = this.sortAndReturnDict(IGHJ);

//     return {
//       vAlleleCallOHE,
//       sortedIGHVDataDict,
//       dAlleleCallOHE,
//       sortedIGHDDataDict,
//       jAlleleCallOHE,
//       sortedIGHJDataDict,
//     };
//   }
}

const fastaReader = new FastaReader();
// const {
//   vAlleleCallOHE,
//   sortedIGHVDataDict,
//   dAlleleCallOHE,
//   sortedIGHDDataDict,
//   jAlleleCallOHE,
//   sortedIGHJDataDict,
// } = fastaReader.processFastaContents(IGHV, IGHD, IGHJ, IGHVnameConvert);

export {
  fastaReader,
//   vAlleleCallOHE,
//   sortedIGHVDataDict,
//   dAlleleCallOHE,
//   sortedIGHDDataDict,
//   jAlleleCallOHE,
//   sortedIGHJDataDict,
};
