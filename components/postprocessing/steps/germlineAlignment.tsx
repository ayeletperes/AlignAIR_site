import { HeuristicReferenceMatcher } from '@components/postprocessing/heuristicmatching/heuristicMatcher';
import { Allele, Segment } from '@components/reference/utilities';
import { logger } from '@components/utils/logger';

class AlleleAlignmentStep {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public alignWithGermline(
    segments: Record<string, [number[], number[], string[]]>,
    referenceAllelesMap: Record<string, Segment>,
    sequences: string[],
    indelCounts: number[],
    k: number = 15,
    s: number = 30
  ): Record<string, any[]> {
    const germlineAlignments: Record<string, any[]> = {};

    for (const gene in segments) {
      const referenceAlleles: Segment = referenceAllelesMap[gene.toUpperCase()];
      if (gene === 'd') {
        referenceAlleles["Short-D"] = {sequence:""}; // Add 'Short-D' for D genes
      }
      
      const [starts, ends, calls] = segments[gene];
      const matcher = new HeuristicReferenceMatcher(referenceAlleles);

      const mappings = matcher.match(
        sequences,
        starts,
        ends,
        calls.map(allele => allele[0]), // Extract first allele for each
        indelCounts,
        k,
        s,
        gene
      );

      germlineAlignments[gene] = mappings;
    }

    return germlineAlignments;
  }

  public execute(
    chain: string,
    processedPredictions: any,
    referenceAllelesMap: Record<string, Segment>,
    sequences: string[],
): any {
    logger.log('Aligning with germline alleles...');

    // Extract start and end segments for V, D, and J genes
    const segments: Record<string, [number[], number[], string[]]> = {};
    const genes = chain=="light"? ['v', 'j'] : ['v', 'd', 'j'];
    for (const gene of genes) {
      segments[gene] = [
        processedPredictions[`${gene}_sequence_start`],
        processedPredictions[`${gene}_sequence_end`],
        processedPredictions[`${gene}_call`],
      ];
    }
    const indelCounts = processedPredictions['indel_count'];

    // Align with germline alleles
    const germlineAlignments = this.alignWithGermline(
      segments,
      referenceAllelesMap,
      sequences,
      indelCounts
    );

    return germlineAlignments;
  }
}

export { AlleleAlignmentStep };
