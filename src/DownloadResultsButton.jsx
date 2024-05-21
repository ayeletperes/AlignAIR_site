import React, {useEffect, useCallback} from 'react';
import { Stack, PrimaryButton } from '@fluentui/react';

const convertArrayOfObjectsToTSV = (data) => {
    const header = Object.keys(data[0]).join("\t");
    const rows = data.map((row) => Object.values(row).join("\t"));
    return [header, ...rows].join("\n");
  };
  
const DownloadResultsButton = ({ results, fileName, predictionsAvailable, staticResults }) => {
    const handleDownload = useCallback(() => {
        if (!predictionsAvailable) return;
    
        const annotations = staticResults(results);
        const tsvContent = "data:text/tsv;charset=utf-8," + encodeURIComponent(convertArrayOfObjectsToTSV(annotations));
        const downloadLink = document.createElement("a");
        downloadLink.href = tsvContent;
        downloadLink.download = `${fileName.split('.').slice(0, -1).join('.')}.tsv`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }, [results, fileName, predictionsAvailable, staticResults]);
  
    return predictionsAvailable ? (
      <>
        <Stack>
          <label>Download results as table: </label>
          <br />
          <PrimaryButton text="Download Results" onClick={handleDownload} />
        </Stack>
      </>
    ) : null;
};
  
export default DownloadResultsButton;