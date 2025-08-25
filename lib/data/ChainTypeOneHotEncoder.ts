// TODO: implement GenAIRR enum .
import * as tf from "@tensorflow/tfjs";

export type ChainType = string;
export type OneHot = number[];
export type OneHotBatch = number[][];

function isTensor(x: unknown): x is tf.Tensor {
  return !!x && typeof x === "object" && "shape" in (x as any) && "dtype" in (x as any);
}

export class ChainTypeOneHotEncoder {
  private readonly chainTypes: ChainType[];
  private readonly typeToIndex: Map<ChainType, number>;
  private readonly indexToType: ChainType[];

  constructor(chainTypes: ChainType[]) {
    if (!Array.isArray(chainTypes) || chainTypes.length === 0) {
      throw new Error("chainTypes must be a non-empty array.");
    }
    // Deduplicate and sort for deterministic ordering.
    // TODO: when using a real enum, sort by the enum numeric value if needed.
    const sorted = Array.from(new Set(chainTypes)).sort();
    this.chainTypes = sorted;
    this.typeToIndex = new Map(sorted.map((ct, i) => [ct, i]));
    this.indexToType = sorted;
  }

  /** Dimension of the one-hot vectors. */
  size(): number {
    return this.chainTypes.length;
  }

  /** Encode a single chain type into a one-hot vector. */
  private encodeSingle(chainType: ChainType): OneHot {
    const index = this.typeToIndex.get(chainType);
    if (index === undefined) {
      const valid = this.chainTypes.join(", ");
      throw new Error(`Chain type '${chainType}' not recognized. Valid types: ${valid}.`);
    }
    const vec = new Array(this.chainTypes.length).fill(0);
    vec[index] = 1;
    return vec;
  }

  /** Encode one or many chain types into one-hot vector(s). */
  encode(chainType: ChainType | ChainType[]): OneHot | OneHotBatch {
    if (Array.isArray(chainType)) {
      return chainType.map(ct => this.encodeSingle(ct));
    }
    return this.encodeSingle(chainType);
  }

  /** Optional convenience that returns a tf.Tensor. */
  encodeToTensor(chainType: ChainType | ChainType[]): tf.Tensor2D | tf.Tensor1D {
    if (Array.isArray(chainType)) {
      const mat = chainType.map(ct => this.encodeSingle(ct));
      return tf.tensor2d(mat, [mat.length, this.size()], "float32");
    }
    const vec = this.encodeSingle(chainType);
    return tf.tensor1d(vec, "float32");
  }

  /** Decode a single one-hot vector back to a chain type. */
  private decodeSingleArray(vec: OneHot): ChainType {
    if (vec.length !== this.chainTypes.length) {
      throw new Error(
        `One-hot length ${vec.length} does not match class count ${this.chainTypes.length}.`
      );
    }
    let maxIdx = 0;
    let maxVal = -Infinity;
    for (let i = 0; i < vec.length; i++) {
      const v = vec[i];
      if (v > maxVal) {
        maxVal = v;
        maxIdx = i;
      }
    }
    return this.indexToType[maxIdx];
  }

  /** Decode from arrays, accepts 1D or 2D arrays. */
  decodeArray(oneHot: OneHot | OneHotBatch): ChainType | ChainType[] {
    if (Array.isArray(oneHot) && oneHot.length > 0 && Array.isArray(oneHot[0])) {
      return (oneHot as OneHotBatch).map(vec => this.decodeSingleArray(vec));
    }
    return this.decodeSingleArray(oneHot as OneHot);
  }

  /** Decode directly from a tf.Tensor of logits or one-hots. */
  decodeTensor(t: tf.Tensor): ChainType | ChainType[] {
    return tf.tidy(() => {
      const s = tf.squeeze(t); // e.g., [1, K] -> [K]
      const k = s.shape[s.shape.length - 1];
      if (k !== this.chainTypes.length) {
        throw new Error(
          `Last dimension ${k} does not match class count ${this.chainTypes.length}.`
        );
      }

      // Rank 1, shape [K]
      if (s.rank === 1) {
        const idx = s.argMax().dataSync()[0];
        return this.indexToType[idx];
      }

      // Rank 2, shape [N, K]
      if (s.rank === 2) {
        const idxs = s.argMax(1).arraySync() as number[];
        return idxs.map(i => this.indexToType[i]);
      }

      // Higher rank, flatten to [-1, K] and decode per row.
      const flat = s.reshape([-1, k]);
      const idxs = flat.argMax(1).arraySync() as number[];
      return idxs.map(i => this.indexToType[i]);
    });
  }

  /**
   * Unified decode. Accepts a tf.Tensor, a 1D array, or a 2D array.
   * Returns a single ChainType for single vectors, or an array for batches.
   */
  decode(input: tf.Tensor | OneHot | OneHotBatch): ChainType | ChainType[] {
    if (isTensor(input)) {
      return this.decodeTensor(input);
    }
    return this.decodeArray(input);
  }

  /** For logging and debugging. */
  toString(): string {
    return `ChainTypeOneHotEncoder(chainTypes=[${this.chainTypes.join(", ")}])`;
  }
}
