import {Allele, Segment} from '@components/reference/utilities';
import { logger } from '@components/utils/logger';

export function translateVCallToIuisNames(
    vCall: string[][], // Nested array of alleles
    referenceMap: Segment // Reference map of alleles
  ): string[][] {
    logger.log('Translating allele to IUIS naming...');

    return vCall.map(alleleGroup =>
        alleleGroup.map(allele => {
          const referenceEntry = referenceMap[allele];
          return referenceEntry?.iuisName || allele; // Ensure it always returns a string
        })
    );
  }