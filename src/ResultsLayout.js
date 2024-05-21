import React from 'react';
import { Pivot } from '@fluentui/react';
import DownloadResultsButton from './DownloadResultsButton';
import staticResults from './staticResults'
import interactiveResults from './interactiveResults'

export default function ResultsLayout({ results, fileName, predictionsAvailable}) {
    
    const tabsetOutput = Object.keys(results).length > 1 && Object.keys(results).length < 15;
    const fileOutput = Object.keys(results).length >= 15;

    if(fileOutput){
        return (
        <>
            <DownloadResultsButton results={results} fileName={fileName} predictionsAvailable={predictionsAvailable} staticResults={staticResults} />
        </>
        );
    }else{
        const pivotItems = Object.entries(results).map(([index, value]) => (
        interactiveResults(index, value, tabsetOutput)
        ));
        if (tabsetOutput) {
        return (
            <Pivot overflowBehavior="menu">
            {pivotItems}
            </Pivot>
        );
        } else{
        return pivotItems;
        }
    }
}