/**
   * Creates a results table based on the provided calls.
   *
   * @param {Object} calls - The calls object containing name, sequence, and results properties.
   * @returns {Array} - An array of objects representing the results table.
   */
export default function staticResults(calls) {
    const data = Object.entries(calls).map(([index, value]) => {  
      const { name, sequence, v_allele, d_allele, j_allele} = value ?? {};
      return {
        sequence_id: name,
        sequence: sequence,
        v_call: v_allele?.map((item) => item.index).join(','),
        d_call: d_allele?.map((item) => item.index).join(','),
        j_call: j_allele?.map((item) => item.index).join(','),
        v_confidence: v_allele?.map((item) => item.prob).join(','),
        d_confidence: d_allele?.map((item) => item.prob).join(','),
        j_confidence: j_allele?.map((item) => item.prob).join(','),
      };
    });
    return data;

}