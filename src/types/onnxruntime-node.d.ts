declare module 'onnxruntime-node' {
    export class InferenceSession {
      constructor(options?: Record<string, any>);
      static create(path: string, options?: Record<string, any>): Promise<InferenceSession>;
      run(feeds: Record<string, any>): Promise<Record<string, any>>;
    }

  export function Tensor(arg0: string, sequences: string[], arg2: number[]) {
    throw new Error('Function not implemented.');
  }
  }
  