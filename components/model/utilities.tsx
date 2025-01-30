import { FastKmerDensityExtractor } from '@components/preprocessing/longsequences/fastKmerDensityExtractor';
import { loadReferenceData } from '@components/reference/utilities';
import { readMetadata } from '@components/preprocessing/utilities/readMetadata';
import * as onnx from 'onnxruntime-web';
import { env } from 'onnxruntime-web';
import * as tf from '@tensorflow/tfjs';
import { logger } from '@components/utils/logger';

// model class

export interface ChainConfig {
  name: 'heavy' | 'light';
  k: number;
  maxLength: number;
  allowedMismatches: number;
  modelPath: string; // Path to the main model file
  modelMetadataPath: string; // Path to the model metadata file
  orientationModelPath: string; // Path to the orientation model file
}

export class ModelLoader {
  private chainConfig: ChainConfig;
  private candidateExtractor: FastKmerDensityExtractor | null = null;
  private model: tf.GraphModel | null = null;
  private modelMetadata: any | null = null;
  private orientationModel: any | null = null;
  private referenceAlleles: Record<string, any> | null = null;
  private dataConfig: Record<string, any> | null = null;

  constructor(chainConfig: ChainConfig) {
    this.chainConfig = chainConfig;
  }

  public async initialize(): Promise<void> {
    logger.log(`Initializing ${this.chainConfig.name} chain model...`);
    await this.loadModel();
    await this.loadMetadata();
    await this.loadOrientationModel();
    await this.loadReferencesAndInitializeExtractor();
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

  public async loadMetadata(): Promise<void> {
    logger.log(`Loading model Metadata for ${this.chainConfig.name} chain from ${this.chainConfig.modelMetadataPath}...`);
    try {
      if(this.chainConfig.modelMetadataPath){
        this.modelMetadata = readMetadata(this.chainConfig.modelMetadataPath);
        logger.log(`Model Metadata for ${this.chainConfig.name} chain loaded successfully.`);
      }else{
        logger.log('Model Metadata path is not provided.');
      }
    } catch (error) {
      // Ensure error is an instance of Error and extract the message
      let errorMessage = 'An unknown error occurred while loading the model metadata.';
      if (error instanceof Error) {
        errorMessage = `Failed to load main model metadata for ${this.chainConfig.name} chain from path: ${this.chainConfig.modelMetadataPath}. 
        Ensure the file exists and the path is correct. 
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
      const references = await loadReferenceData();
      this.referenceAlleles = references[this.chainConfig.name].reference;
      this.dataConfig = references[this.chainConfig.name];
      if (this.referenceAlleles) {
        const refSequences = [
          ...Object.values(this.referenceAlleles.V).map((allele: any) => allele.sequence),
          ...(this.referenceAlleles.D ? Object.values(this.referenceAlleles.D).map((allele: any) => allele.sequence) : []),
          ...Object.values(this.referenceAlleles.J).map((allele: any) => allele.sequence),
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

  public getModelMetadata(): any | null {
    return this.modelMetadata;
  }

  public getOrientationModel(): any | null {
    return this.orientationModel;
  }

  public getReferenceAlleles(): Record<string, any> | null {
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
}
