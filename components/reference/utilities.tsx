import { fastaFileReader, SequenceRecord } from '@components/preprocessing/utilities/sequenceReaders';
import { getFilePath } from '@components/preprocessing/utilities/getFilePath';

export interface Allele {
  sequence?: string;
  anchor?: number; // Optional, for J segments
  iuisName?: string; // Optional, for V segments
}

export interface Segment {
  [key: string]: Allele | undefined;
  "Short-D"?: Allele;
}

type ChainData = {
  heavy: {
    reference: {
      V: Segment;
      D: Segment;
      J: Segment;
    }
  };
  light: {
    reference: {
      V: Segment;
      J: Segment;
    };
    kappa: {
      V: Segment;
      J: Segment;
    };
    lambda: {
      V: Segment;
      J: Segment;
    };
  };
};

export async function loadReferenceData(): Promise<ChainData> {
  const fetchFile = async (path: string): Promise<string> => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch file at ${path}: ${response.statusText}`);
    }
    return response.text();
  };

  const loadFasta = async (path: string): Promise<Segment> => {
    const content = await fetchFile(path);
    const sequences = fastaFileReader(content);

    const segment: Segment = {};
    Object.entries(sequences).forEach(([id, sequence]) => {
      segment[id] = { sequence };
    });

    return segment;
  };

  const loadTable = async (path: string): Promise<Record<string, string>> => {
    const content = await fetchFile(path);
    const rows = content.trim().split('\n').slice(1); // Remove header
    const table: Record<string, string> = {};
    for (const row of rows) {
      const [key, value] = row.split(/\t/);
      table[key] = value;
    }
    return table;
  };

  const enrichSegment = (segment: Segment, table: Record<string, string>, key: 'iuisName' | 'anchor') => {
    for (const alleleId in segment) {
      if (segment.hasOwnProperty(alleleId)) {
        const allele = segment[alleleId];
        if (allele) {
          if (key === 'anchor') {
            allele[key] = parseInt(table[alleleId], 10);
          } else {
            allele[key] = table[alleleId];
          }
        }
      }
    }
  };

  const sortSegmentByName = (segment: Segment): Segment => {
    return Object.fromEntries(
      Object.entries(segment).sort(([alleleA], [alleleB]) => alleleA.localeCompare(alleleB))
    );
  };

  const heavyV = await loadFasta('reference/heavy/ighv.fasta');
  const iuisTable = await loadTable('reference/heavy/ighv_iuis.tsv');
  enrichSegment(heavyV, iuisTable, 'iuisName');

  const heavyD = await loadFasta('reference/heavy/ighd.fasta');
  const heavyJ = await loadFasta('reference/heavy/ighj.fasta');
  const anchorTable = await loadTable('reference/heavy/ighj_anchor.tsv');
  enrichSegment(heavyJ, anchorTable, 'anchor');

  const heavyChain = {
    V: sortSegmentByName(heavyV),
    D: sortSegmentByName(heavyD),
    J: sortSegmentByName(heavyJ),
  };

  const lightV_IGK = await loadFasta('reference/light/igkv.fasta');
  const lightJ_IGK = await loadFasta('reference/light/igkj.fasta');
  const lightV_IGK_iuisTable = await loadTable('reference/light/igkv_iuis.tsv');
  const lightJ_IGK_anchorTable = await loadTable('reference/light/igkj_anchor.tsv');
  enrichSegment(lightV_IGK, lightV_IGK_iuisTable, 'iuisName');
  enrichSegment(lightJ_IGK, lightJ_IGK_anchorTable, 'anchor');

  const lightV_IGL = await loadFasta('reference/light/iglv.fasta');
  const lightJ_IGL = await loadFasta('reference/light/iglj.fasta');
  const lightV_IGL_iuisTable = await loadTable('reference/light/iglv_iuis.tsv');
  const lightJ_IGL_anchorTable = await loadTable('reference/light/iglj_anchor.tsv');
  enrichSegment(lightV_IGL, lightV_IGL_iuisTable, 'iuisName');
  enrichSegment(lightJ_IGL, lightJ_IGL_anchorTable, 'anchor');

  const lightChain = {
    V: { ...sortSegmentByName(lightV_IGK), ...sortSegmentByName(lightV_IGL) },
    J: { ...sortSegmentByName(lightJ_IGK), ...sortSegmentByName(lightJ_IGL) },
  };

  return {
    heavy: { reference: heavyChain },
    light: {
      reference: lightChain,
      kappa: { V: lightV_IGK, J: lightJ_IGK },
      lambda: { V: lightV_IGL, J: lightJ_IGL },
    },
  };
}
