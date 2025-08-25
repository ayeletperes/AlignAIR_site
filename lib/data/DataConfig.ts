import { DataConfig as IDataConfig, ConfigMetadata, Allele } from './types';

export class DataConfig implements IDataConfig {
  name?: string;
  metadata: ConfigMetadata;
  v_alleles: Record<string, Allele[]> = {};
  d_alleles?: Record<string, Allele[]> = {};
  j_alleles: Record<string, Allele[]> = {};
  c_alleles?: Record<string, Allele[]> = {};
  family_use_dict?: Record<string, number> = {};
  gene_use_dict?: Record<string, number> = {};

  constructor(config: Partial<IDataConfig>) {
    this.name = config.name;
    this.metadata = config.metadata!;
    this.v_alleles = config.v_alleles || {};
    this.d_alleles = config.d_alleles;
    this.j_alleles = config.j_alleles || {};
    this.c_alleles = config.c_alleles;
    this.family_use_dict = config.family_use_dict;
    this.gene_use_dict = config.gene_use_dict;
  }

  // Python equivalent: _unfold_alleles
  private unfoldAlleles(geneSegment: string): Allele[] {
    const allelesDict = this.getAllelesDict(geneSegment);
    if (!allelesDict) return [];
    
    // Flatten all allele lists from all families
    return Object.values(allelesDict).flat();
  }

  private getAllelesDict(geneSegment: string): Record<string, Allele[]> | undefined {
    switch (geneSegment) {
      case 'v': return this.v_alleles;
      case 'd': return this.d_alleles;
      case 'j': return this.j_alleles;
      case 'c': return this.c_alleles;
      default: return undefined;
    }
  }

  // Python equivalent: allele_list
  allele_list(geneSegment: string): Allele[] {
    return this.unfoldAlleles(geneSegment);
  }

  // Count methods
  number_of_v_alleles(): number {
    return this.unfoldAlleles('v').length;
  }

  number_of_d_alleles(): number {
    return this.unfoldAlleles('d').length;
  }

  number_of_j_alleles(): number {
    return this.unfoldAlleles('j').length;
  }

  number_of_c_alleles(): number {
    return this.unfoldAlleles('c').length;
  }

  // Static factory methods for common configs
  static fromReferenceData(chain: 'heavy' | 'light' | 'trb', referenceData: any): DataConfig {
    const hasD = chain !== 'light';
    
    const config: Partial<IDataConfig> = {
      name: `${chain.toUpperCase()}_CONFIG`,
      metadata: {
        has_d: hasD,
        chain_type: chain
      },
      v_alleles: DataConfig.buildAlleleFamilies(referenceData.V || {}),
      j_alleles: DataConfig.buildAlleleFamilies(referenceData.J || {})
    };

    if (hasD && referenceData.D) {
      config.d_alleles = DataConfig.buildAlleleFamilies(referenceData.D);
    }

    return new DataConfig(config);
  }

  private static buildAlleleFamilies(referenceMap: Record<string, any>): Record<string, Allele[]> {
    const families: Record<string, Allele[]> = {};
    
    Object.entries(referenceMap).forEach(([alleleName, data]) => {
      // Extract family from allele name (e.g., "IGHV1-1*01" -> "IGHV1-1")
      const family = alleleName.split('*')[0];
      
      if (!families[family]) {
        families[family] = [];
      }
      
      families[family].push({
        name: alleleName,
        sequence: data.sequence || data,
        family: family
      });
    });

    return families;
  }

  copy(): DataConfig {
    return new DataConfig({
      name: this.name,
      metadata: { ...this.metadata },
      v_alleles: JSON.parse(JSON.stringify(this.v_alleles)),
      d_alleles: this.d_alleles ? JSON.parse(JSON.stringify(this.d_alleles)) : undefined,
      j_alleles: JSON.parse(JSON.stringify(this.j_alleles)),
      c_alleles: this.c_alleles ? JSON.parse(JSON.stringify(this.c_alleles)) : undefined,
      family_use_dict: { ...this.family_use_dict },
      gene_use_dict: { ...this.gene_use_dict }
    });
  }

  toString(): string {
    const parts = [this.name || 'Unnamed Data Config'];
    if (this.v_alleles) parts.push(`${this.number_of_v_alleles()} V Alleles`);
    if (this.d_alleles) parts.push(`${this.number_of_d_alleles()} D Alleles`);  
    if (this.j_alleles) parts.push(`${this.number_of_j_alleles()} J Alleles`);
    if (this.c_alleles) parts.push(`${this.number_of_c_alleles()} C Alleles`);
    return parts.join(' - ');
  }
}