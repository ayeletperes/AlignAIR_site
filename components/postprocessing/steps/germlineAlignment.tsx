import { HeuristicReferenceMatcher } from '@components/postprocessing/heuristicmatching/heuristicMatcher';
import { Allele, Segment } from '@components/reference/utilities';


class AlleleAlignmentStep {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public alignWithGermline(
    segments: Record<string, [number[], number[], string[]]>,
    referenceAllelesMap: Record<string, Segment>,
    sequences: string[],
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
    console.log('Aligning with germline alleles...');

    // Extract start and end segments for V, D, and J genes
    const segments: Record<string, [number[], number[], string[]]> = {};
    const genes = chain=="heavy"? ['v', 'd', 'j']: ['v', 'j'];
    for (const gene of genes) {
      segments[gene] = [
        processedPredictions[`${gene}_sequence_start`],
        processedPredictions[`${gene}_sequence_end`],
        processedPredictions[`${gene}_call`],
      ];
    }

    // Align with germline alleles
    const germlineAlignments = this.alignWithGermline(
      segments,
      referenceAllelesMap,
      sequences
    );

    return germlineAlignments;
  }
}

export { AlleleAlignmentStep };
