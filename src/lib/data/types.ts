// Core types for DataConfig implementation
export interface Allele {
  name: string;
  sequence: string; // ungapped_seq equivalent
  family?: string;
}

export interface ConfigMetadata {
  has_d: boolean;
  chain_type: 'heavy' | 'light' | 'trb';
  species?: string;
  locus?: string;
}

export interface DataConfig {
  name?: string;
  metadata: ConfigMetadata;
  
  // Allele dictionaries (grouped by family) 
  v_alleles: Record<string, Allele[]>;
  d_alleles?: Record<string, Allele[]>;
  j_alleles: Record<string, Allele[]>;
  c_alleles?: Record<string, Allele[]>;
  
  // Usage frequencies
  family_use_dict?: Record<string, number>;
  gene_use_dict?: Record<string, number>;
  
  // Methods
  allele_list(gene_segment: string): Allele[];
  number_of_v_alleles(): number;
  number_of_d_alleles(): number;
  number_of_j_alleles(): number;
}

export interface AlleleMapping {
  allele_count: number;
  allele_call_ohe: Record<string, number>;
  reverse_mapping: Record<number, string>;
}

export interface PropertiesMap {
  V: AlleleMapping;
  D?: AlleleMapping;  
  J: AlleleMapping;
}