// components/results/utils/parseResults.ts

/**
 * Parses raw alignment results and sequences into a structured format for rendering.
 * @param results - Raw results object returned from alignment processing.
 * @param sequences - Raw sequences object.
 * @returns Parsed results mapped to their corresponding sequences.
 */
export const parseResults = (results: any, sequences: any) => {
    // Determine the number of sequences based on the sequences variable
    const numSequences = Object.keys(sequences).length;
    
    // Iterate over each sequence index and parse corresponding results
    return Array.from({ length: numSequences }, (_, i) => {
        
        const row = {
            sequence_id: Object.keys(sequences)[i], // Map sequence ID by index
            sequence: Object.values(sequences)[i], // Map sequence content by index
            v_call: results.v_call? results.v_call[i] : '',
            d_call: results.d_call? results.d_call[i] : '',
            j_call: results.j_call? results.j_call[i] : '',
            productive: results.productive? results.productive[i]===1 ? 'true' : 'false' : null,
            chain: results.type_ === null ? 'heavy' : results.type_ === 1 ? 'kappa' : 'lambda',
            v_sequence_start: results.v_sequence_start ? results.v_sequence_start[i] : null,
            v_sequence_end: results.v_sequence_end ? results.v_sequence_end[i] : null,
            d_sequence_start: results.d_sequence_start ? results.d_sequence_start[i] : null,
            d_sequence_end: results.d_sequence_end ? results.d_sequence_end[i] : null,
            j_sequence_start: results.j_sequence_start ? results.j_sequence_start[i] : null,
            j_sequence_end: results.j_sequence_end ? results.j_sequence_end[i] : null,
            v_germline_start: results.v_germline_start ? results.v_germline_start[i] : null,
            v_germline_end: results.v_germline_end ? results.v_germline_end[i] : null,
            d_germline_start: results.d_germline_start ? results.d_germline_start[i] : null,
            d_germline_end: results.d_germline_end ? results.d_germline_end[i] : null,
            j_germline_start: results.j_germline_start ? results.j_germline_start[i] : null,
            j_germline_end: results.j_germline_end ? results.j_germline_end[i] : null,
            v_likelihood: results.v_likelihood? results.v_likelihood[i] : [], // Store raw array, formatting done later
            d_likelihood: results.d_likelihood? results.d_likelihood[i] : [],
            j_likelihood: results.j_likelihood? results.j_likelihood[i] : [],
            mutation_rate: results.mutation_rate ? results.mutation_rate[i] : null,
            indel_count: results.indel_count ? results.indel_count[i] : null
        };
        return row;
    });
};