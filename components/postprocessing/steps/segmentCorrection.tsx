import * as tf from '@tensorflow/tfjs'; 
import { SequenceRecord } from '@components/preprocessing/utilities/sequenceReaders';

interface SegmentCorrectionParams {
    sequences: SequenceRecord;
    chain: 'heavy' | 'light';
    v_sequence_start: any;
    v_sequence_end: any;
    d_sequence_start: any | null;
    d_sequence_end: any | null;
    j_sequence_start: any;
    j_sequence_end: any;
}

interface CorrectedSegments {
    v_sequence_start: any;
    v_sequence_end: any;
    d_sequence_start: any | null;
    d_sequence_end: any | null;
    j_sequence_start: any;
    j_sequence_end: any;
}
  
const calculatePadSize = (sequence: string, maxLength: number = 576): number => {
    const totalPadding = maxLength - sequence.length;
    return Math.floor(totalPadding / 2);
  };


export const correctSegmentsForPaddings = (params: SegmentCorrectionParams): CorrectedSegments => {
    const { sequences, chain,  v_sequence_start, v_sequence_end, d_sequence_start, d_sequence_end, j_sequence_start, j_sequence_end } = params;
    
    const paddings = Object.values(sequences).map(sequence => calculatePadSize(sequence));
    const adjustedVStart = v_sequence_start.squeeze().sub(paddings).abs().round().arraySync();
    const adjustedVEnd = v_sequence_end.squeeze().sub(paddings).round().arraySync();
  
    const adjustedJStart = j_sequence_start.squeeze().sub(paddings).round().arraySync();
    const adjustedJEnd = j_sequence_end.squeeze().sub(paddings).round().arraySync();
  
    let adjustedDStart: tf.Tensor | null = null;
    let adjustedDEnd: tf.Tensor | null = null;
  
    if (chain === 'heavy' && d_sequence_start && d_sequence_end) {
      adjustedDStart = d_sequence_start.squeeze().sub(paddings).round().arraySync();
      adjustedDEnd = d_sequence_end.squeeze().sub(paddings).round().arraySync();
    }
  
    return {
      v_sequence_start: adjustedVStart,
      v_sequence_end: adjustedVEnd,
      d_sequence_start: adjustedDStart,
      d_sequence_end: adjustedDEnd,
      j_sequence_start: adjustedJStart,
      j_sequence_end: adjustedJEnd,
    };
  };
  