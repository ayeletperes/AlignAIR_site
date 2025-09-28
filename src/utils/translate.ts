// utils/translate.ts
export type CodonMap = {
    aaIndex: number;          // 1-based AA position
    aa: string;               // translated letter
    cols: number[];           // NT column indices that formed this codon (len 3, gaps excluded)
    startCol: number;         // first NT column for this codon (where we print the AA letter)
  };
  
  const CODON: Record<string, string> = {
    TTT:"F",TTC:"F",TTA:"L",TTG:"L", TCT:"S",TCC:"S",TCA:"S",TCG:"S",
    TAT:"Y",TAC:"Y",TAA:"*",TAG:"*", TGT:"C",TGC:"C",TGA:"*",TGG:"W",
    CTT:"L",CTC:"L",CTA:"L",CTG:"L", CCT:"P",CCC:"P",CCA:"P",CCG:"P",
    CAT:"H",CAC:"H",CAA:"Q",CAG:"Q", CGT:"R",CGC:"R",CGA:"R",CGG:"R",
    ATT:"I",ATC:"I",ATA:"I",ATG:"M", ACT:"T",ACC:"T",ACA:"T",ACG:"T",
    AAT:"N",AAC:"N",AAA:"K",AAG:"K", AGT:"S",AGC:"S",AGA:"R",AGG:"R",
    GTT:"V",GTC:"V",GTA:"V",GTG:"V", GCT:"A",GCC:"A",GCA:"A",GCG:"A",
    GAT:"D",GAC:"D",GAA:"E",GAG:"E", GGT:"G",GGC:"G",GGA:"G",GGG:"G",
  };
  
  const isGap = (c: string) => c === "-" || c === "." || c === " ";
  
  function letterOrX(triplet: string): string {
    return /^[ACGT]{3}$/.test(triplet) ? (CODON[triplet] ?? "X") : "X";
  }
  
  /**
   * Map a gapped V-region NT string into codons and a column index map.
   * Gaps do not advance the within-codon count.
   * Incomplete trailing codons are ignored.
   */
  export function mapGappedNtToCodons(gappedNt: string) {
    const nts: string[] = [];
    const ntCols: number[] = [];               // column index for each non-gap base
    const col2codon: Array<number | null> = new Array(gappedNt.length).fill(null);
    for (let i = 0; i < gappedNt.length; i++) {
      const c = (gappedNt[i] || "").toUpperCase();
      if (!isGap(c)) { nts.push(c); ntCols.push(i); }
    }
  
    const codons: CodonMap[] = [];
    const aaSeq: string[] = [];
  
    let aaIndex = 1;
    for (let i = 0; i + 2 < nts.length; i += 3) {
      const triplet = nts[i] + nts[i + 1] + nts[i + 2];
      const cols = [ntCols[i], ntCols[i + 1], ntCols[i + 2]];
      const aa = letterOrX(triplet);
      const cm: CodonMap = { aaIndex, aa, cols, startCol: cols[0] };
      const codonId = codons.length;
      for (const col of cols) col2codon[col] = codonId;
      codons.push(cm);
      aaSeq.push(aa);
      aaIndex += 1;
    }
  
    return {
      codons,                 // array of {aaIndex, aa, cols[], startCol}
      col2codon,              // length = gappedNt.length, value is codon index or null
      aaSeq: aaSeq.join(""),  // compact AA string, no gaps
    };
  }
  