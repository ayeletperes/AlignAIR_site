/**
 * Class for extracting k-mer density and transforming it using Holt's smoothing technique.
 */
export class FastKmerDensityExtractor {
  private k: number;
  private maxLength: number;
  private allowedMismatches: number;
  private kmerSet: Set<string>;

  constructor(k: number, maxLength: number, allowedMismatches = 0) {
      this.k = k;
      this.maxLength = maxLength;
      this.allowedMismatches = allowedMismatches;
      this.kmerSet = new Set<string>();
  }

  private generateVariants(kmer: string, mismatches: number): Set<string> {
      if (mismatches === 0) {
          return new Set([kmer]);
      }

      const variants = new Set<string>();
      for (let i = 0; i < kmer.length; i++) {
          for (const char of ['A', 'C', 'G', 'T']) {
              if (char !== kmer[i]) {
                  const newVariant = kmer.slice(0, i) + char + kmer.slice(i + 1);
                  const subVariants = this.generateVariants(newVariant, mismatches - 1);
                  subVariants.forEach(variant => variants.add(variant));
              }
          }
      }
      return variants;
  }

  private createKmers(referenceSequences: string[]): void {
      for (const seq of referenceSequences) {
          for (let i = 0; i <= seq.length - this.k; i++) {
              const kmer = seq.slice(i, i + this.k);
              if (this.allowedMismatches > 0) {
                  const variants = this.generateVariants(kmer, this.allowedMismatches);
                  variants.forEach(variant => this.kmerSet.add(variant));
              } else {
                  this.kmerSet.add(kmer);
              }
          }
      }
  }

  fit(referenceSequences: string[]): void {
      this.createKmers(referenceSequences);
  }

  transformHolt(sequence: string, alpha = 0.05, beta = 0.01): { maxRegion: string; dHistory: number[] } {
      const sequenceLength = sequence.length;
      let maxDensity = 0;
      let maxRegionStart = 0;

      // Calculate the initial window density
      let currentDensity = 0;
      for (let i = 0; i < Math.min(this.maxLength, sequenceLength); i++) {
          if (this.kmerSet.has(sequence.slice(i, i + this.k))) {
              currentDensity++;
          }
      }

      // Initialize Holt's linear method parameters
      let level = currentDensity;
      let trend = 0;
      let holt = level + trend;
      maxDensity = holt;
      maxRegionStart = 0;

      // Sliding window over the sequence
      const dHistory: number[] = [holt];

      for (let i = 1; i <= sequenceLength - this.maxLength; i++) {
          // Adjust current density for the sliding window
          if (this.kmerSet.has(sequence.slice(i - 1, i - 1 + this.k))) {
              currentDensity--;
          }
          if (this.kmerSet.has(sequence.slice(i + this.maxLength - this.k, i + this.maxLength))) {
              currentDensity++;
          }

          // Update Holt's method parameters
          const prevLevel = level;
          level = alpha * currentDensity + (1 - alpha) * (level + trend);
          trend = beta * (level - prevLevel) + (1 - beta) * trend;
          holt = level + trend;

          // Update the max density and region start
          if (holt >= maxDensity) {
              maxDensity = holt;
              maxRegionStart = i;
          }

          dHistory.push(holt);
      }

      // Extract the region with the maximum density
      const maxRegion = sequence.slice(maxRegionStart, maxRegionStart + this.maxLength);

      return { maxRegion, dHistory };
  }
}

  