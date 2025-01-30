// TODO: Implement this step. This will require to add an option to upload a genotype file in the UI.
// and to allow to read it in the preprocessing pipeline.
// class IsInGenotype {
//     private vAlleles: Set<string> = new Set();
//     private dAlleles: Set<string> = new Set();
//     private jAlleles: Set<string> = new Set();
  
//     constructor(dataConfig: any) {
//       if (dataConfig instanceof DataConfig) {
//         if (dataConfig.v_alleles) {
//           this.vAlleles = new Set(
//             Object.values(dataConfig.v_alleles).flat().map((allele: any) => allele.name)
//           );
//         }
//         if (dataConfig.d_alleles) {
//           this.dAlleles = new Set(
//             Object.values(dataConfig.d_alleles).flat().map((allele: any) => allele.name)
//           );
//         }
//         if (dataConfig.j_alleles) {
//           this.jAlleles = new Set(
//             Object.values(dataConfig.j_alleles).flat().map((allele: any) => allele.name)
//           );
//         }
//       } else if (dataConfig instanceof DataConfigLibrary) {
//         this.vAlleles = new Set(dataConfig.referenceAlleleNames('v'));
//         this.dAlleles = new Set(dataConfig.referenceAlleleNames('d'));
//         this.jAlleles = new Set(dataConfig.referenceAlleleNames('j'));
//       } else if (dataConfig instanceof GenotypeYamlParser) {
//         this.vAlleles = new Set(dataConfig.v);
//         this.dAlleles = new Set(dataConfig.d);
//         this.jAlleles = new Set(dataConfig.j);
//       } else {
//         throw new Error("Invalid dataConfig type");
//       }
//     }
  
//     isInGenotype(allele: string): boolean {
//       const alleleType = allele.startsWith("V") ? this.vAlleles : allele.startsWith("D") ? this.dAlleles : this.jAlleles;
//       return alleleType.has(allele);
//     }
//   }
  
// class GenotypeBasedLikelihoodAdjustmentStep {
//     private vAlleleNameToIndex: Record<string, number> | null = null;
//     private dAlleleNameToIndex: Record<string, number> | null = null;
//     private jAlleleNameToIndex: Record<string, number> | null = null;
//     private genotypeChecker: IsInGenotype | null = null;

//     constructor(private name: string) {}

//     private initializeAlleleIndexTranslationMaps(dataConfigLibrary: DataConfigLibrary): void {
//         const alleleDict = {
//         v: dataConfigLibrary.getAlleleDict('v').sort(),
//         d: [...dataConfigLibrary.getAlleleDict('d').sort(), 'Short-D'],
//         j: dataConfigLibrary.getAlleleDict('j').sort(),
//         };

//         for (const gene of ['v', 'd', 'j']) {
//         this[`${gene}AlleleNameToIndex`] = Object.fromEntries(
//             alleleDict[gene].map((name, index) => [name, index])
//         );
//         }
//     }

//     private boundedRedistribution(predictedAlleles: Record<string, number>): Record<string, number> {
//         const genotypeAlleles = this.genotypeAlleles(predictedAlleles);
//         const nonGenotypeAlleles = this.nonGenotypeAlleles(predictedAlleles);

//         const totalGenotypeLikelihood = Object.values(genotypeAlleles).reduce((a, b) => a + b, 0);
//         const totalNonGenotypeLikelihood = Object.values(nonGenotypeAlleles).reduce((a, b) => a + b, 0);

//         if (totalGenotypeLikelihood > 0) {
//         const redistributionFactor = totalNonGenotypeLikelihood / totalGenotypeLikelihood;
//         Object.keys(genotypeAlleles).forEach(key => {
//             genotypeAlleles[key] = Math.min(1, genotypeAlleles[key] + genotypeAlleles[key] * redistributionFactor);
//         });
//         }

//         return genotypeAlleles;
//     }

//     private genotypeAlleles(predictedAlleles: Record<string, number>): Record<string, number> {
//         return Object.fromEntries(
//         Object.entries(predictedAlleles).filter(([allele]) => this.genotypeChecker?.isInGenotype(allele))
//         );
//     }

//     private nonGenotypeAlleles(predictedAlleles: Record<string, number>): Record<string, number> {
//         return Object.fromEntries(
//         Object.entries(predictedAlleles).filter(([allele]) => !this.genotypeChecker?.isInGenotype(allele))
//         );
//     }

//     execute(predictObject: any): any {
//         if (!predictObject.scriptArguments.customGenotype) {
//         console.log('No custom genotype provided, skipping likelihood adjustment.');
//         return predictObject;
//         }

//         console.log('Adjusting Likelihood Given Genotype...');

//         this.genotypeChecker = new IsInGenotype(
//         predictObject.scriptArguments.customGenotype || predictObject.dataConfigLibrary
//         );

//         this.initializeAlleleIndexTranslationMaps(predictObject.dataConfigLibrary);

//         for (const allele of ['v', 'd', 'j']) {
//         const processed = predictObject.processedPredictions[`${allele}_allele`].map((row: number[]) => {
//             const dictForm = Object.fromEntries(row.map((value, index) => [index, value]));
//             return this.boundedRedistribution(dictForm);
//         });
//         predictObject.processedPredictions[`${allele}_allele`] = processed.map(Object.values);
//         }

//         return predictObject;
//     }
// }
