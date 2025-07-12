import { FastKmerDensityExtractor } from '@components/preprocessing/longsequences/fastKmerDensityExtractor';
import { loadReferenceDataForModel } from '@components/reference/utilities';
import { getModelById } from '@components/model/modelMetadataLoader';
import * as onnx from 'onnxruntime-web';
import { env } from 'onnxruntime-web';
import * as tf from '@tensorflow/tfjs';
import { logger } from '@components/utils/logger';

// model class

export interface ChainConfig {
  name: 'heavy' | 'light' | 'trb';
  k: number;
  maxLength: number;
  allowedMismatches: number;
  modelPath: string; // Path to the main model file
  modelMetadataPath?: string; // Path to the model metadata file (optional, now handled by new system)
  orientationModelPath: string; // Path to the orientation model file
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
  private referenceAlleles: any | null = null;
  private dataConfig: Record<string, any> | null = null;
  private isWarmedUp: boolean = false;
  private warmupStats: { times: number[]; avgTime: number } | null = null;
  private modelId: string | null = null;
  constructor(chainConfig: ChainConfig) {
    this.chainConfig = chainConfig;
  }

  public async initialize(warmupOptions?: ModelWarmupOptions): Promise<void> {
    logger.log(`Initializing ${this.chainConfig.name} chain model...`);
    await this.loadModel();
    await this.loadMetadata();
    await this.loadOrientationModel();
    await this.loadReferencesAndInitializeExtractor();
    
    // Warm up the model if requested
    if (warmupOptions?.enabled !== false) {
      await this.warmUpModel(warmupOptions);
    }
    
    logger.log(`${this.chainConfig.name} chain model initialized.`);
  }

  public async loadModel(): Promise<void> {
    logger.log(`Loading model for ${this.chainConfig.name} chain from ${this.chainConfig.modelPath}...`);
    try {
      //await tf.setBackend('tensorflow'); only in testing mode
      this.model = await tf.loadGraphModel(this.chainConfig.modelPath);
      logger.log(`Model for ${this.chainConfig.name} chain loaded successfully.`);
    } catch (error) {
      // Ensure error is an instance of Error and extract the message
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
      logger.log('Model already warmed up');
      return;
    }

    const {
      inputShape = [1, 576], // Default based on maxLength
      warmupRuns = 3,
      logWarmupTimes = true
    } = options || {};

    logger.log(`Warming up ${this.chainConfig.name} model with ${warmupRuns} runs...`);
    
    const warmupTimes: number[] = [];
    const backend = tf.getBackend();
    
    // WebGL-specific optimizations
    if (backend === 'webgl') {
      await this.prepareWebGLContext();
    }
    
    // Create dummy input tensor with the expected shape
    const dummyInput = tf.randomUniform(inputShape, 0, 100, 'int32');
    
    try {
      for (let i = 0; i < warmupRuns; i++) {
        const startTime = performance.now();
        
        // Run inference
        const predictions = this.model.predict(dummyInput) as tf.Tensor | tf.Tensor[];
        
        // Ensure computation is complete by accessing data
        if (Array.isArray(predictions)) {
          // For WebGL backend, force GPU sync by reading data
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
        
        // Additional WebGL sync for first run to ensure shader compilation
        if (i === 0 && backend === 'webgl') {
          await tf.nextFrame();
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        warmupTimes.push(duration);
        
        if (logWarmupTimes) {
          logger.log(`Warmup run ${i + 1}/${warmupRuns}: ${duration.toFixed(2)}ms`);
        }
      }
      
      const avgTime = warmupTimes.reduce((a, b) => a + b, 0) / warmupTimes.length;
      const improvement = warmupTimes.length > 1 ? 
        ((warmupTimes[0] - warmupTimes[warmupTimes.length - 1]) / warmupTimes[0] * 100) : 0;
      
      this.warmupStats = { times: warmupTimes, avgTime };
      this.isWarmedUp = true;
      
      if (logWarmupTimes) {
        logger.log(`Model warmup completed. Average time: ${avgTime.toFixed(2)}ms`);
        logger.log(`First run: ${warmupTimes[0].toFixed(2)}ms, Last run: ${warmupTimes[warmupTimes.length - 1].toFixed(2)}ms`);
        if (improvement > 0) {
          logger.log(`Performance improvement: ${improvement.toFixed(1)}%`);
        }
        logger.log(`Backend: ${backend}, GPU: ${backend === 'webgl' ? 'Yes' : 'No'}`);
      }
      
    } catch (error) {
      logger.error('Error during model warmup:', error);
    } finally {
      // Clean up dummy input
      dummyInput.dispose();
    }
  }

  /**
   * Prepare WebGL context and force shader compilation
   */
  private async prepareWebGLContext(): Promise<void> {
    try {
      // Create a small tensor operation to force WebGL context creation
      const testTensor = tf.scalar(1);
      const result = tf.add(testTensor, tf.scalar(1));
      await result.data(); // Force GPU sync
      testTensor.dispose();
      result.dispose();
      
      // Force next frame to ensure context is ready
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
    
    // Estimate model size if available
    let modelSize: number | undefined;
    if (this.model) {
      try {
        // Try to estimate model size based on parameters
        const modelArtifacts = (this.model as any).modelArtifacts;
        if (modelArtifacts && modelArtifacts.weightData) {
          modelSize = modelArtifacts.weightData.byteLength;
        }
      } catch (error) {
        // Estimation failed, ignore
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
    logger.log(`Disposing ${this.chainConfig.name} model...`);
    
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    
    if (this.orientationModel) {
      // ONNX models don't have a standard dispose method, but we can null the reference
      this.orientationModel = null;
    }
    
    this.isWarmedUp = false;
    this.warmupStats = null;
    
    // Force garbage collection if available
    if (typeof (globalThis as any).gc === 'function') {
      (globalThis as any).gc();
    }
    
    logger.log(`${this.chainConfig.name} model disposed`);
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
    logger.log(`Loading model Metadata for ${this.chainConfig.name} chain...`);
    try {
      // Determine model ID from chain type
      const modelIdMap: Record<string, string> = {
        'heavy': 'igh-v1.0',
        'light': 'igl-v1.0',
        'trb': 'tcrb-v1.0'
      };
      
      this.modelId = modelIdMap[this.chainConfig.name];
      if (!this.modelId) {
        throw new Error(`Unknown chain type: ${this.chainConfig.name}`);
      }
      
      this.modelMetadata = await getModelById(this.modelId);
      if (!this.modelMetadata) {
        throw new Error(`Failed to load metadata for model ${this.modelId}`);
      }
      
      logger.log(`Model Metadata for ${this.chainConfig.name} chain loaded successfully.`);
    } catch (error) {
      // Ensure error is an instance of Error and extract the message
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
    logger.log(`Loading orientation model for ${this.chainConfig.name} chain from ${this.chainConfig.orientationModelPath}...`);
    try {
      this.orientationModel = await onnx.InferenceSession.create(this.chainConfig.orientationModelPath); // add options options
      logger.log(`Orientation model for ${this.chainConfig.name} chain loaded successfully.`);
    } catch (error) {
      logger.error(`Failed to load orientation model: ${error}`);
    }
  }

  private async loadReferencesAndInitializeExtractor(): Promise<void> {
    logger.log(`Loading references for ${this.chainConfig.name} chain...`);
    try {
      const references = await loadReferenceDataForModel(this.modelId);
      this.referenceAlleles = Object.freeze(references.reference);
      this.dataConfig = references;
      if (this.referenceAlleles) {
        const refSequences = [
          ...Object.values(references.reference.V).map((allele: any) => allele.sequence),
          ...(references.reference.D ? Object.values(references.reference.D).map((allele: any) => allele.sequence) : []),
          ...Object.values(references.reference.J).map((allele: any) => allele.sequence),
        ];
  
        this.initializeCandidateExtractor(refSequences);
      } else {
        throw new Error(`No references found for ${this.chainConfig.name} chain.`);
      }
    } catch (error) {
      throw new Error(`Failed to load references for ${this.chainConfig.name} chain: ${error}`);
    }
  }

  public initializeCandidateExtractor(referenceSequences: string[]): void {
    logger.log(`Initializing candidate extractor for ${this.chainConfig.name} chain...`);
    this.candidateExtractor = new FastKmerDensityExtractor(
      this.chainConfig.k,
      this.chainConfig.maxLength,
      this.chainConfig.allowedMismatches
    );
    this.candidateExtractor.fit(referenceSequences);
    logger.log(`Candidate extractor initialized.`);
  }

  public getCandidateExtractor(): FastKmerDensityExtractor | null {
    return this.candidateExtractor;
  }

  public getModel(): tf.GraphModel | null {
    return this.model;
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
    return this.referenceAlleles;
  }

  public getDataConfig(): Record<string, any> | null {
    return this.dataConfig;
  }

  public getModelIO(back: any=null): any {
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

    logger.log('Model Inputs:', inputs);
    logger.log('Model Outputs:', outputs);

    if(back){
      return {inputs, outputs};
    }
  }

  /**
   * Get optimal warmup options based on model and system characteristics
   */
  public getOptimalWarmupOptions(): ModelWarmupOptions {
    const backend = tf.getBackend();
    const isWebGL = backend === 'webgl';
    
    // Default warmup configuration
    let warmupRuns = 2;
    let inputShape = [1, this.chainConfig.maxLength];
    
    // Adjust based on backend capabilities
    if (isWebGL) {
      // WebGL benefits from more warmup runs due to shader compilation
      warmupRuns = 3;
    } else if (backend === 'cpu') {
      // CPU backend is more consistent, fewer runs needed
      warmupRuns = 1;
    }
    
    // Adjust based on model complexity (estimate based on max length)
    if (this.chainConfig.maxLength > 1000) {
      warmupRuns = Math.min(warmupRuns + 1, 4); // Cap at 4 runs
    }
    
    return {
      enabled: true,
      inputShape,
      warmupRuns,
      logWarmupTimes: true
    };
  }
}
