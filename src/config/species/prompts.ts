/**
 * Species Prompts Configuration
 *
 * Contains user-facing prompts and descriptions for species selection
 * to guide users in choosing the appropriate species for their analysis.
 */

import type { Species } from './config';

export interface SpeciesPrompt {
  title: string;
  description: string;
  guidance: string;
  examples: string[];
  limitations?: string[];
  recommendedFor: string[];
}

export const SPECIES_PROMPTS: Record<Species, SpeciesPrompt> = {
  human: {
    title: "Human (Homo sapiens)",
    description: "Comprehensive immunoglobulin and T-cell receptor models trained on human repertoire data",
    guidance: "Select Human if you are analyzing sequences from human samples, including blood, tissue samples, or cell lines derived from human sources.",
    examples: [
      "Human PBMC sequences",
      "Human B-cell repertoires",
      "Human T-cell receptor sequences",
      "Clinical samples from human patients",
      "Human cell line sequences (Jurkat, Ramos, etc.)"
    ],
    recommendedFor: [
      "Clinical research studies",
      "Human immunology research",
      "Vaccine development studies",
      "Autoimmune disease research",
      "Cancer immunotherapy research"
    ]
  },
  rhesus_macaque: {
    title: "Rhesus Macaque (Macaca mulatta)",
    description: "Non-human primate immunoglobulin models optimized for rhesus macaque sequences",
    guidance: "Select Rhesus Macaque if you are analyzing sequences from rhesus macaque (Macaca mulatta) samples. Currently limited to heavy chain analysis only.",
    examples: [
      "Rhesus macaque PBMC sequences",
      "Non-human primate research samples",
      "Vaccine studies in macaque models",
      "Preclinical immunology studies"
    ],
    limitations: [
      "Only heavy chain (IGH) models available",
      "Light chain and TCR models not yet supported",
      "Limited reference database compared to human"
    ],
    recommendedFor: [
      "Preclinical vaccine studies",
      "Non-human primate research",
      "Translational immunology studies",
      "Comparative immunology research"
    ]
  }
} as const;

export function getSpeciesPrompt(species: Species): SpeciesPrompt {
  return SPECIES_PROMPTS[species];
}

export function getAllSpeciesPrompts(): Record<Species, SpeciesPrompt> {
  return SPECIES_PROMPTS;
}

// Helper function to format species selection prompt for UI
export function formatSpeciesSelectionPrompt(): string {
  return `
Please select the species that matches your sequence data:

**Important**: Selecting the correct species is crucial for accurate analysis. The models are specifically trained on sequences from each species and will provide optimal results only when the correct species is selected.

**If you're unsure about your sequence origin:**
- Check your sample metadata or experimental protocol
- Human sequences are most common in clinical and research settings
- Rhesus macaque sequences typically come from preclinical studies
- Contact your data provider if the species is unclear

**Note**: Using the wrong species model may result in:
- Incorrect allele assignments
- Poor sequence alignment quality
- Misleading mutation rate calculations
- Invalid productivity predictions
  `.trim();
}