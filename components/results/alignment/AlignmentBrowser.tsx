import React, { useMemo } from 'react';
import { SelectWidgetVertical } from '@/utils/alignment/customSelect';
import { validateAlignmentResults, VALIDATION_ERROR_MESSAGE, ALIGNMENT_STYLES } from '@/utils/alignment/alignmentBrowserUtils';
import AlignedBlock from './AlignedBlock';
import { HeuristicReferenceMatcher } from '@/lib/postprocessing/HeuristicMatching/HeuristicMatcher';
import { useAlignmentData } from '@/hooks/useAlignmentData';
import { useAlignmentRegions } from '@/hooks/useAlignmentRegions';

const MAXCOLS = 45;
type Segment = 'V' | 'D' | 'J';
type Chain = 'heavy' | 'light' | 'trb';

interface Props {
  results: any;
  referenceLoader: any;
  chain?: Chain;
}

const chunkRows = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const AlignmentBrowserVDJ: React.FC<Props> = ({ 
  results, 
  referenceLoader, 
  chain = 'heavy' 
}) => {
  // Validation
  if (!validateAlignmentResults(results)) {
    return (
      <div className={ALIGNMENT_STYLES.warning}>
        <span role="img" aria-label="warning" className={ALIGNMENT_STYLES.warningIcon}>⚠️</span>
        <div>
          <p className={ALIGNMENT_STYLES.warningTitle}>{VALIDATION_ERROR_MESSAGE.title}</p>
          <p className={ALIGNMENT_STYLES.warningMessage}>{VALIDATION_ERROR_MESSAGE.message}</p>
        </div>
      </div>
    );
  }

  if (results.indel_count > 0) {
    return (
      <div className="flex items-center space-x-3 bg-purple-100 p-4 rounded-md">
        <span role="img" aria-label="building" style={{ fontSize: 24 }}>🏗️</span>
        <div>
          <p className="text-lg font-semibold text-black">Work in progress!</p>
          <p className="text-sm text-black">Alignment for 5′ trims / indels is being implemented.</p>
        </div>
      </div>
    );
  }

  // Use custom hooks for data processing
  const alignmentData = useAlignmentData({ results, referenceLoader, chain });
  
  if (!alignmentData) {
    return null; // Data not ready
  }

  const {
    grid,
    vEnd,
    jStart,
    jEnd,
    selV,
    selD,
    selJ,
    setSelV,
    setSelD,
    setSelJ,
    gV,
    gD,
    gJ,
    normalized,
    hasD
  } = alignmentData;

  // Chunk grid into visual rows
  const Vrows = chunkRows(grid.slice(0, vEnd), MAXCOLS);
  const Drows = hasD ? chunkRows(grid.slice(vEnd, jStart), MAXCOLS) : [];
  const Jrows = chunkRows(grid.slice(jStart, jEnd), MAXCOLS);

  // Process regions using custom hook
  const { VrowsR, DrowsR, JrowsR } = useAlignmentRegions({
    Vrows,
    Drows, 
    Jrows,
    results,
    referenceLoader
  });

  // Heuristic matcher for selectors
  const matcher = useMemo(() => {
    const m: any = {};
    if (referenceLoader) {
      (['V', 'D', 'J'] as Segment[]).forEach(seg => {
        const seqs = referenceLoader.getSeqs(seg) || {};
        const useSeqs = seg === 'D' ? referenceLoader.addShortD(seqs) : seqs;
        m[seg] = new HeuristicReferenceMatcher(useSeqs);
      });
    }
    return m;
  }, [referenceLoader]);

  // Ready guard
  if (VrowsR.length === 0 || JrowsR.length === 0) return null;

  const rowHeight = '"20px"';
  const columnWidth = '"15px"';

  return (
    <div className="modern-alignment-container">
      <div className="alignment-header">
        <div className="alignment-title">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sequence Alignment Viewer</h3>
          <div className="alignment-info">
            <span className="info-badge">
              {normalized === 'light' ? 'Light Chain' : 'Heavy Chain'} | {results.v_call?.[0]} {hasD ? `• ${results.d_call?.[0]}` : ''} • {results.j_call?.[0]}
            </span>
          </div>
        </div>
      </div>

      <div className='modern-alignment-grid'>
        <div className="alignment-grid scrollbar-custom">

          {/* V selector + rows */}
          <div className="subgrid-col1" style={{ gridColumn: 1 }}>
            {VrowsR.map((_, i) => (
              <React.Fragment key={`vsel-${i}`}>
                {i === 0 ? (
                  <div className="subgrid-col1-row" style={{ gridRow: 1 }}>
                    <SelectWidgetVertical
                      call="v_call"
                      chain={normalized}
                      results={results}
                      reference={referenceLoader}
                      setSelected={() => { /* no-op, grid is global */ }}
                      selected={gV}
                      selectedAllele={selV}
                      setSelectedAllele={setSelV}
                      setSplitedSeq={() => {}}
                      maxCharsPerRow={MAXCOLS}
                      setMismatch={() => {}}
                      setGermline={() => {}}
                      germline={{}}
                      setGermlineAA={() => {}}
                      setSplittedGAA={() => {}}
                      splitStart={0}
                      splitEnd={Math.floor(vEnd / 3)}
                      matcher={matcher.V}
                      indelCounts={results.indel_count}
                    />
                  </div>
                ) : (
                  <div className="subgrid-col1-row" style={{ gridRow: i + 1, color: 'black' }}>{selV}</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="subgrid-col2" style={{ gridColumn: 2, gridTemplateRows: `repeat(${VrowsR.length}, ${rowHeight})`, gridTemplateColumns: `repeat(${MAXCOLS}, ${columnWidth})` }}>
            {VrowsR.map((row, i) => (
              <AlignedBlock key={`v-${i}`} row={row} />
            ))}
          </div>

          {/* D selector + rows (only if present) */}
          {hasD && (
            <>
              <div className="subgrid-col1" style={{ gridColumn: 1 }}>
                {DrowsR.map((_, i) => (
                  <React.Fragment key={`dsel-${i}`}>
                    {i === 0 ? (
                      <div className="subgrid-col1-row" style={{ gridRow: 1 }}>
                        <SelectWidgetVertical
                          call="d_call"
                          chain={normalized}
                          results={results}
                          reference={referenceLoader}
                          setSelected={() => {}}
                          selected={gD}
                          selectedAllele={selD}
                          setSelectedAllele={setSelD}
                          setSplitedSeq={() => {}}
                          maxCharsPerRow={MAXCOLS}
                          setMismatch={() => {}}
                          setGermline={() => {}}
                          germline={{}}
                          setGermlineAA={() => {}}
                          setSplittedGAA={() => {}}
                          splitStart={Math.floor(vEnd / 3)}
                          splitEnd={Math.floor(jStart / 3)}
                          matcher={matcher.D}
                          indelCounts={results.indel_count}
                        />
                      </div>
                    ) : (
                      <div className="subgrid-col1-row" style={{ gridRow: i + 1, color: 'black' }}>{selD}</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="subgrid-col2" style={{ gridColumn: 2, gridTemplateRows: `repeat(${DrowsR.length}, ${rowHeight})`, gridTemplateColumns: `repeat(${MAXCOLS}, ${columnWidth})` }}>
                {DrowsR.map((row, i) => (
                  <AlignedBlock key={`d-${i}`} row={row} />
                ))}
              </div>
            </>
          )}

          {/* J selector + rows */}
          <div className="subgrid-col1" style={{ gridColumn: 1 }}>
            {JrowsR.map((_, i) => (
              <React.Fragment key={`jsel-${i}`}>
                {i === 0 ? (
                  <div className="subgrid-col1-row" style={{ gridRow: 1 }}>
                    <SelectWidgetVertical
                      call="j_call"
                      chain={normalized}
                      results={results}
                      reference={referenceLoader}
                      setSelected={() => {}}
                      selected={gJ}
                      selectedAllele={selJ}
                      setSelectedAllele={setSelJ}
                      setSplitedSeq={() => {}}
                      maxCharsPerRow={MAXCOLS}
                      setMismatch={() => {}}
                      setGermline={() => {}}
                      germline={{}}
                      setGermlineAA={() => {}}
                      setSplittedGAA={() => {}}
                      splitStart={Math.floor(jStart / 3)}
                      splitEnd={Math.floor(jEnd / 3)}
                      matcher={matcher.J}
                      indelCounts={results.indel_count}
                    />
                  </div>
                ) : (
                  <div className="subgrid-col1-row" style={{ gridRow: i + 1, color: 'black' }}>{selJ}</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="subgrid-col2" style={{ gridColumn: 2, gridTemplateRows: `repeat(${JrowsR.length}, ${rowHeight})`, gridTemplateColumns: `repeat(${MAXCOLS}, ${columnWidth})` }}>
            {JrowsR.map((row, i) => (
              <AlignedBlock key={`j-${i}`} row={row} />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className='modern-alignment-legend'>
        <div className="legend-title">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Region Color Coding</h4>
        </div>
        <div className="legend-grid">
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#FF6B8A'}}></div><span className="legend-label">FR1</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#4ECDC4'}}></div><span className="legend-label">CDR1</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#45B7D1'}}></div><span className="legend-label">FR2</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#96CEB4'}}></div><span className="legend-label">CDR2</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#FECA57'}}></div><span className="legend-label">FR3</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#FF9FF3'}}></div><span className="legend-label">CDR3</span></div>
          <div className="legend-item"><div className="legend-color" style={{backgroundColor:'#54A0FF'}}></div><span className="legend-label">FR4</span></div>
        </div>
      </div>
    </div>
  );
};

export default AlignmentBrowserVDJ;