import { AlignSeq} from './Charts';


export default function testAlignment(){
    const index = 'seq_0';
    const germline = "ACTGGGGAGGTGTA";
    const germlineAnnotation = "IGHV4-3*03";
    const alignedSeq = "ACTAGGGAGGTGTA";
    const alignedAnnotation = "IGHV4-3*01";

    return (
      <div key='alignment'>
        <h1>Sequence Alignment</h1>
        <AlignSeq index={index} sequence={alignedSeq} germline={germline} germlineAnnotation={germlineAnnotation} alignedAnnotation={alignedAnnotation} />
      </div>
    );
};
