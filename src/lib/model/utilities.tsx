import { FastKmerDensityExtractor } from '@/lib/preprocessing/LongSequence/FastKmerDensityExtractor';
import {
  ReferenceLoader,
  SegmentKey,
  ReferenceJson,
} from '@/lib/data/ReferenceLoader';
import { fetchReferenceJson } from '@/lib/data/referenceCache';
import { getModelById,  getModelsByChainType} from '@/lib/model/modelMetadataLoader';
import * as tf from '@tensorflow/tfjs';
import { logger } from '@/utils/logger';

// Lazy load ONNX Runtime to avoid SSR issues and improve error handling
let onnx: any = null;
const loadOnnx = async () => {
  if (typeof window === 'undefined') {
    // Server-side rendering, skip loading ONNX Runtime
    logger.info('Server-side detected, skipping ONNX Runtime loading');
    return null;
  }
  
  if (!onnx) {
    try {
      logger.info('Loading ONNX Runtime...');
      
      // Use globally loaded ONNX Runtime
      if (typeof window !== 'undefined' && (window as any).ort) {
        onnx = (window as any).ort;
        logger.info('Using globally loaded ONNX Runtime');
      } else {
        throw new Error('ONNX Runtime not available, please ensure the script is loaded');
      }
      
      // Set WASM paths before creating any sessions
      if (onnx?.env?.wasm) {
        onnx.env.wasm.wasmPaths = '/wasm/';
        // Multi-threaded WASM requires SharedArrayBuffer, which requires
        // cross-origin isolation (COOP/COEP). Fall back to single-thread otherwise.
        const isCrossOriginIsolated =
          typeof window !== 'undefined' && (window as any).crossOriginIsolated === true;
        const hwConcurrency =
          (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4;
        onnx.env.wasm.numThreads = isCrossOriginIsolated
          ? Math.max(1, Math.min(hwConcurrency, 8))
          : 1;
        onnx.env.wasm.simd = true;    // enable SIMD if available

        logger.info('ONNX WASM environment configured:', {
          wasmPaths: onnx.env.wasm.wasmPaths,
          numThreads: onnx.env.wasm.numThreads,
          simd: onnx.env.wasm.simd,
          crossOriginIsolated: isCrossOriginIsolated,
          hardwareConcurrency: hwConcurrency
        });
      }
      
      logger.info('ONNX Runtime loaded successfully');
    } catch (error) {
      logger.error('Failed to load ONNX Runtime:', error);
      return null;
    }
  }
  return onnx;
};

// model class

export interface ChainConfig {
  name: 'heavy' | 'light' | 'trb';
  k: number;
  maxLength: number;
  allowedMismatches: number;
  modelPath: string;
  modelMetadataPath?: string;
  orientationModelPath: string;
  modelId?: string;
}

export interface ModelWarmupOptions {
  enabled?: boolean;
  inputShape?: number[];
  warmupRuns?: number;
  logWarmupTimes?: boolean;
}

export class ModelLoader {
  private chainConfig: ChainConfig;
  private candidateExtractor: FastKmerDensityExtractor | null = null;
  private model: tf.GraphModel | null = null;
  private modelMetadata: any | null = null;
  private orientationModel: any | null = null;

  // reference loader
  private referenceLoader?: ReferenceLoader;
  
  // Keep old fields for getters, now fed from the new loader
  private referenceAlleles: any | null = null;
  private dataConfig: Record<string, any> | null = null;

  private isWarmedUp: boolean = false;
  private warmupStats: { times: number[]; avgTime: number } | null = null;
  private modelId: string | null = null;

  constructor(chainConfig: ChainConfig) {
    this.chainConfig = chainConfig;
  }

  public async initialize(warmupOptions?: ModelWarmupOptions): Promise<void> {
    logger.info(`Initializing ${this.chainConfig.name} chain model...`);
    await this.loadModel();
    await this.loadMetadata();
    await this.loadOrientationModel();
    await this.loadReferencesAndInitializeExtractor();
    
    if (warmupOptions?.enabled !== false) {
      await this.warmUpModel(warmupOptions);
    }
    
    logger.info(`${this.chainConfig.name} chain model initialized.`);
  }

  public async loadModel(): Promise<void> {
    logger.info(`Loading model for ${this.chainConfig.name} chain from ${this.chainConfig.modelPath}...`);
    try {
      this.model = await tf.loadGraphModel(this.chainConfig.modelPath);
      logger.info(`Model for ${this.chainConfig.name} chain loaded successfully.`);
    } catch (error) {
      let errorMessage = 'An unknown error occurred while loading the model.';
      if (error instanceof Error) {
        errorMessage = `Failed to load main model for ${this.chainConfig.name} chain from path: ${this.chainConfig.modelPath}.
Ensure the file exists and the path is correct.
Original error: ${error.message}`;
      }
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Warm up the TensorFlow.js model to improve first inference performance
   */
  public async warmUpModel(options?: ModelWarmupOptions): Promise<void> {
    if (!this.model) {
      logger.warn('Cannot warm up model: model not loaded');
      return;
    }

    if (this.isWarmedUp) {
      logger.info('Model already warmed up');
      return;
    }

    const {
      inputShape = [1, 576],
      warmupRuns = 3,
      logWarmupTimes = true
    } = options || {};

    logger.info(`Warming up ${this.chainConfig.name} model with ${warmupRuns} runs...`);
    
    const warmupTimes: number[] = [];
    const backend = tf.getBackend();
    
    if (backend === 'webgl') {
      await this.prepareWebGLContext();
    }
    
    const dummyInput = tf.randomUniform(inputShape, 0, 100, 'int32');
    
    try {
      for (let i = 0; i < warmupRuns; i++) {
        const startTime = performance.now();
        const predictions = this.model.predict(dummyInput) as tf.Tensor | tf.Tensor[];
        if (Array.isArray(predictions)) {
          if (backend === 'webgl') {
            await Promise.all(predictions.map(p => p.data()));
          }
          predictions.forEach(p => p.dispose());
        } else {
          if (backend === 'webgl') {
            await predictions.data();
          }
          predictions.dispose();
        }
        if (i === 0 && backend === 'webgl') {
          await tf.nextFrame();
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
        warmupTimes.push(duration);
        if (logWarmupTimes) {
          logger.info(`Warmup run ${i + 1}/${warmupRuns}: ${duration.toFixed(2)}ms`);
        }
      }
      
      const avgTime = warmupTimes.reduce((a, b) => a + b, 0) / warmupTimes.length;
      const improvement = warmupTimes.length > 1 ? 
        ((warmupTimes[0] - warmupTimes[warmupTimes.length - 1]) / warmupTimes[0] * 100) : 0;
      
      this.warmupStats = { times: warmupTimes, avgTime };
      this.isWarmedUp = true;
      
      if (logWarmupTimes) {
        logger.info(`Model warmup completed. Average time: ${avgTime.toFixed(2)}ms`);
        logger.info(`First run: ${warmupTimes[0].toFixed(2)}ms, Last run: ${warmupTimes[warmupTimes.length - 1].toFixed(2)}ms`);
        if (improvement > 0) {
          logger.info(`Performance improvement: ${improvement.toFixed(1)}%`);
        }
        logger.info(`Backend: ${backend}, GPU: ${backend === 'webgl' ? 'Yes' : 'No'}`);
      }
      
    } catch (error) {
      logger.error('Error during model warmup:', error);
    } finally {
      dummyInput.dispose();
    }
  }

  /**
   * Prepare WebGL context and force shader compilation
   */
  private async prepareWebGLContext(): Promise<void> {
    try {
      const testTensor = tf.scalar(1);
      const result = tf.add(testTensor, tf.scalar(1));
      await result.data();
      testTensor.dispose();
      result.dispose();
      await tf.nextFrame();
    } catch (error) {
      logger.warn('WebGL context preparation failed:', error);
    }
  }

  /**
   * Get memory usage information for the loaded models
   */
  public getMemoryInfo(): {
    tensorflow: { numTensors: number; numBytes: number };
    modelSize?: number;
    backend: string;
  } {
    const tfMemory = tf.memory();
    let modelSize: number | undefined;
    if (this.model) {
      try {
        const modelArtifacts = (this.model as any).modelArtifacts;
        if (modelArtifacts && modelArtifacts.weightData) {
          modelSize = modelArtifacts.weightData.byteLength;
        }
      } catch {
        // ignore
      }
    }
    return {
      tensorflow: {
        numTensors: tfMemory.numTensors,
        numBytes: tfMemory.numBytes
      },
      modelSize,
      backend: tf.getBackend()
    };
  }

  /**
   * Dispose of the model and free memory
   */
  public dispose(): void {
    logger.info(`Disposing ${this.chainConfig.name} model...`);
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    if (this.orientationModel) {
      this.orientationModel = null;
    }
    this.isWarmedUp = false;
    this.warmupStats = null;
    if (typeof (globalThis as any).gc === 'function') {
      (globalThis as any).gc();
    }
    logger.info(`${this.chainConfig.name} model disposed`);
  }

  /**
   * Get warmup statistics
   */
  public getWarmupStats(): { times: number[]; avgTime: number } | null {
    return this.warmupStats;
  }

  /**
   * Check if model is warmed up
   */
  public isModelWarmedUp(): boolean {
    return this.isWarmedUp;
  }

  public async loadMetadata(): Promise<void> {
    logger.info(`Loading model Metadata for ${this.chainConfig.name} chain...`);
    try {
      
      if (this.chainConfig.modelId) {
        this.modelId = this.chainConfig.modelId;
      } else {
        const availableModels = await getModelsByChainType(this.chainConfig.name);
        if (!availableModels || availableModels.length === 0) {
          throw new Error(`No models available for chain type: ${this.chainConfig.name}`);
        }
        this.modelId = availableModels[0].id;
      }
      this.modelMetadata = await getModelById(this.modelId);
      
      if (!this.modelMetadata) {
        throw new Error(`Failed to load metadata for model ${this.modelId}`);
      }
      logger.info(`Model Metadata for ${this.chainConfig.name} chain loaded successfully.`);
    } catch (error) {
      let errorMessage = 'An unknown error occurred while loading the model metadata.';
      if (error instanceof Error) {
        errorMessage = `Failed to load main model metadata for ${this.chainConfig.name} chain.
Original error: ${error.message}`;
      }
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private async loadOrientationModel(): Promise<void> {
    if (!this.chainConfig.orientationModelPath || typeof this.chainConfig.orientationModelPath !== 'string') {
      const errorMsg = `Invalid orientation model path for ${this.chainConfig.name} chain: ${this.chainConfig.orientationModelPath}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    logger.info(`Loading orientation model for ${this.chainConfig.name} chain from ${this.chainConfig.orientationModelPath}...`);
    const onnxRuntime = await loadOnnx();
    if (!onnxRuntime) {
      const errorMsg = `ONNX Runtime not available for ${this.chainConfig.name} chain, orientation model cannot be loaded. Please ensure ONNX Runtime is properly installed and accessible.`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    try {
      try {
        const { getOrLoadOrientationModel } = await import('@/lib/preprocessing/Orientation/utilities');
        this.orientationModel = await getOrLoadOrientationModel(this.chainConfig.name, this.chainConfig.orientationModelPath);
        if (!this.orientationModel) {
          throw new Error(`Failed to load orientation model from shared cache for ${this.chainConfig.name} chain`);
        }
        logger.info(`Orientation model for ${this.chainConfig.name} chain loaded successfully, using shared cache.`);
      } catch (importError) {
        logger.warn(`Failed to use shared orientation cache, loading directly: ${importError}`);
        const orientationPath = String(this.chainConfig.orientationModelPath);
        if (!orientationPath || orientationPath === 'undefined' || orientationPath === 'null') {
          throw new Error(`Invalid orientation model path: ${orientationPath}`);
        }
        try {
          this.orientationModel = await onnxRuntime.InferenceSession.create(orientationPath);
          if (!this.orientationModel) {
            throw new Error(`ONNX Runtime returned null for orientation model at ${orientationPath}`);
          }
          logger.info(`Orientation model for ${this.chainConfig.name} chain loaded successfully, direct load.`);
        } catch (onnxError) {
          const errorMsg = `Failed to create ONNX inference session for ${orientationPath}: ${onnxError}`;
          logger.error(errorMsg);
          throw new Error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = `Failed to load orientation model for ${this.chainConfig.name} chain: ${error}`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  // ReferenceLoader
  private async loadReferencesAndInitializeExtractor(): Promise<void> {
    logger.info(`Loading references for ${this.chainConfig.name} chain...`);
    const referencePath = this.modelMetadata?.referencePath;
    try {
      
      const toPaths = (rp: unknown): string[] => {
        if (Array.isArray(rp)) return rp as string[];
        if (typeof rp === "string") {
          return rp.split(",").map(s => s.trim()).filter(Boolean);
        }
        throw new Error("referencePath must be a string or string[]");
      };
  
      const paths = toPaths(referencePath);
      // Fetch reference payloads via IndexedDB cache; each path is a large
      // static germline JSON, so a warm load skips network + parse.
      const payloads: any[] = await Promise.all(paths.map(fetchReferenceJson));
      const refLoader = new ReferenceLoader(payloads);
      await refLoader.load();
      // Keep references around in the shapes your code expects
      const bundle = refLoader.getBundle();
      this.referenceAlleles = refLoader.getLegacyReferenceMap(); // legacy-compatible shape
      this.referenceLoader = refLoader;

      // Build ordered reference sequences for extractor
      const collect = (seg: SegmentKey): string[] => {
        const names = refLoader.getNames(seg);
        const seqs = refLoader.getSeqs(seg) || {};
        return names.map(n => seqs[n]).filter(Boolean) as string[];
      };

      const refSequences: string[] = [
        ...collect('V'),
        ...collect('D'),
        ...collect('J'),
      ];

      if (refSequences.length === 0) {
        throw new Error(`No reference sequences found for ${this.chainConfig.name} chain.`);
      }

      this.initializeCandidateExtractor(refSequences);
    } catch (error) {
      throw new Error(
        `Failed to load references for ${this.chainConfig.name} chain: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }


  public initializeCandidateExtractor(referenceSequences: string[]): void {
    logger.info(`Initializing candidate extractor for ${this.chainConfig.name} chain...`);
    this.candidateExtractor = new FastKmerDensityExtractor(
      this.chainConfig.k,
      this.chainConfig.maxLength,
      this.chainConfig.allowedMismatches
    );
    this.candidateExtractor.fit(referenceSequences);
    logger.info(`Candidate extractor initialized.`);
  }

  public getCandidateExtractor(): FastKmerDensityExtractor | null {
    return this.candidateExtractor;
  }

  public getModel(): tf.GraphModel | null {
    return this.model;
  }

  public getModelOutputs(): any {
    return this.model?.outputs;
  }

  public getModelId(): string | null {
    return this.modelId;
  }

  public getModelMetadata(): any | null {
    return this.modelMetadata;
  }

  public getOrientationModel(): any | null {
    return this.orientationModel;
  }

  public getReferenceAlleles(): any | null {
    // Return legacy-shaped reference map for compatibility
    return this.referenceAlleles;
  }

  public getReferenceLoader(): ReferenceLoader | null {
    return this.referenceLoader;
  }

  public getDataConfig(): Record<string, any> | null {
    // Encoder properties map, includes allele indices and reverse mapping
    return this.dataConfig;
  }

  public getModelIO(back: any = null): any {
    if (!this.model) {
      logger.error('Model is not loaded.');
      return null;
    }

    const inputs = this.model.inputs.map((input) => ({
      name: input.name,
      shape: input.shape,
      dtype: input.dtype,
    }));

    const outputs: any = this.model.outputs.map((output) => ({
      name: output.name,
      shape: output.shape,
      dtype: output.dtype,
    }));

    logger.info('Model Inputs:', inputs);
    logger.info('Model Outputs:', outputs);

    if (back) {
      return { inputs, outputs };
    }
  }

  /**
   * Get optimal warmup options based on model and system characteristics
   */
  public getOptimalWarmupOptions(): ModelWarmupOptions {
    const backend = tf.getBackend();
    const isWebGL = backend === 'webgl';
    
    let warmupRuns = 2;
    let inputShape = [1, this.chainConfig.maxLength];
    
    if (isWebGL) {
      warmupRuns = 3;
    } else if (backend === 'cpu') {
      warmupRuns = 1;
    }
    
    if (this.chainConfig.maxLength > 1000) {
      warmupRuns = Math.min(warmupRuns + 1, 4);
    }
    
    return {
      enabled: true,
      inputShape,
      warmupRuns,
      logWarmupTimes: true
    };
  }
}
