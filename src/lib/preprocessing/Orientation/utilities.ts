import { logger } from '@/utils/logger';

// Types and Interfaces
export interface OrientationPipeline {
  run(sequences: string[]): Promise<string[]>;
}

// Orientation model cache
const orientationModelCache = new Map<string, any>();

// Lazy load ONNX Runtime to avoid import issues
let onnx: any = null;
const loadOnnxRuntime = async () => {
  // Browser: window.ort (loaded via <script> tag). Node: globalThis.ort
  // (set by the CLI bootstrap via require('onnxruntime-node')).
  const hasGlobalOrt =
    (typeof window !== 'undefined' && (window as any).ort) ||
    (typeof globalThis !== 'undefined' && (globalThis as any).ort);
  if (!hasGlobalOrt) return null;

  if (!onnx) {
    try {
      if (typeof window !== 'undefined' && (window as any).ort) {
        onnx = (window as any).ort;
        logger.info('Using globally loaded ONNX Runtime (browser)');
      } else if ((globalThis as any).ort) {
        onnx = (globalThis as any).ort;
        logger.info('Using globally loaded ONNX Runtime (Node)');
      } else {
        throw new Error('ONNX Runtime not available - please ensure the script is loaded');
      }
      
      // Set WASM paths for proper loading
      if (onnx?.env?.wasm) {
        onnx.env.wasm.wasmPaths = '/wasm/';
        logger.info('ONNX WASM paths configured');
      }
      
      logger.info('ONNX Runtime loaded successfully via dynamic import');
    } catch (error) {
      logger.error('Failed to load ONNX Runtime:', error);
      return null;
    }
  }
  return onnx;
};

// Constants
const complement: Record<string, string> = { 
  A: 'T', T: 'A', C: 'G', G: 'C', N: 'N' 
};

// Basic sequence transformation functions
export function reverseSequence(seq: string): string {
  return seq.split('').reverse().join('');
}

export function complementSequence(seq: string): string {
  return seq.split('').map((base) => complement[base] || base).join('');
}

export function reverseComplementSequence(seq: string): string {
  return complementSequence(reverseSequence(seq));
}

export function fixSingleOrientation(seq: string, orientation: string): string {
  switch (orientation) {
    case 'Normal':
      return seq;
    case 'Reversed':
      return reverseSequence(seq);
    case 'Complement':
      return complementSequence(seq);
    case 'Reverse Complement':
      return reverseComplementSequence(seq);
    default:
      throw new Error(`Unrecognized Orientation Label: ${orientation}`);
  }
}

// ONNX Model Functions
export async function inspectModel(path: string): Promise<void> {
  try {
    const onnxRuntime = await loadOnnxRuntime();
    if (!onnxRuntime) {
      throw new Error('ONNX Runtime not available for model inspection');
    }
    
    const session = await onnxRuntime.InferenceSession.create(path);
    
    logger.info('Model Inputs:');
    session.inputNames.forEach((name: string) => {
      logger.info(`- Name: ${name}`);
    });

    logger.info('Model Outputs:');
    session.outputNames.forEach((name: string) => {
      logger.info(`- Name: ${name}`);
    });

  } catch (error) {
    logger.error('Failed to inspect the model:', error);
  }
}

export async function runModel(
  pipeline: any,
  sequences: string[]
): Promise<string[]> {
  if (!Array.isArray(sequences) || sequences.length === 0) {
    throw new Error('Invalid input sequences for model inference');
  }
  
  const onnxRuntime = await loadOnnxRuntime();
  if (!onnxRuntime) {
    throw new Error('ONNX Runtime not available for model inference');
  }
  
  const inputTensor = new onnxRuntime.Tensor('string', sequences, [sequences.length, 1]);
  const feeds = { string_input: inputTensor };
  
  try {
    // Try 'label' first, then fallback to 'output_label'
    let results;
    try {
      results = await pipeline.run(feeds, ['label']);
      return results.label.data as string[];
    } catch (labelError) {
      logger.info('Trying output_label instead of label...');
      results = await pipeline.run(feeds, ['output_label']);
      return results.output_label.data as string[];
    }
  } catch (error) {
    logger.error('Error during model inference. Reinitializing session...');
    throw error;
  }
}

// Main fixOrientation function - supports both sync and async usage
export async function fixOrientation(
  pipeline: any,
  sequences: string[]
): Promise<string[]> {
  if (!pipeline) {
    throw new Error('Invalid orientation pipeline');
  }
  
  try {
    const orientations = await runModel(pipeline, sequences);
    const fixedSequences = sequences.map((sequence, index) =>
      fixSingleOrientation(sequence, orientations[index])
    );
    return fixedSequences;
  } catch (error) {
    logger.error('Error during orientation fixing:', error);
    throw error;
  }
}

/**
 * Get or load an orientation model (shared across alignment models of the same chain)
 */
export async function getOrLoadOrientationModel(chainType: string, orientationModelPath: string): Promise<any> {
  // Validate parameters
  if (!chainType || typeof chainType !== 'string') {
    throw new Error(`Invalid chain type: ${chainType}`);
  }
  
  if (!orientationModelPath || typeof orientationModelPath !== 'string') {
    throw new Error(`Invalid orientation model path for ${chainType} chain: ${orientationModelPath}`);
  }

  const cacheKey = `orientation-${chainType}`;
  
  // Check if orientation model is already cached
  const cached = orientationModelCache.get(cacheKey);
  if (cached) {
    logger.info(`[OrientationCache] Using cached orientation model for ${chainType} chain`);
    return cached;
  }
  
  // Load orientation model if not cached
  logger.info(`[OrientationCache] Loading orientation model for chain type: "${chainType}"`);
  logger.info(`[OrientationCache] Orientation model path: "${orientationModelPath}"`);
  
  try {
    // Allow Node execution where the CLI bootstrap has set globalThis.ort.
    if (typeof window === 'undefined' && !((globalThis as any).ort)) {
      logger.warn('ONNX Runtime not available on server side, skipping orientation model load');
      throw new Error('Server side rendering - ONNX not available');
    }

    // Load ONNX Runtime lazily
    const onnxRuntime = await loadOnnxRuntime();
    if (!onnxRuntime) {
      throw new Error('ONNX Runtime not available for orientation model loading');
    }

    // Ensure the path is a valid string before passing to ONNX Runtime
    const validatedPath = String(orientationModelPath);
    
    // Additional validation for the path
    if (!validatedPath || validatedPath === 'undefined' || validatedPath === 'null') {
      throw new Error(`Invalid orientation model path: ${validatedPath}`);
    }
    
    // Ensure the path starts with a forward slash and is properly formatted
    if (!validatedPath.startsWith('/')) {
      throw new Error(`Orientation model path must be absolute: ${validatedPath}`);
    }
    
    logger.info(`[OrientationCache] Attempting to load ONNX model from: ${validatedPath}`);
    
    const orientationModel = await onnxRuntime.InferenceSession.create(validatedPath);
    
    // Cache the orientation model (these are never evicted)
    orientationModelCache.set(cacheKey, orientationModel);
    logger.info(`[OrientationCache] Orientation model for ${chainType} chain cached successfully`);
    
    return orientationModel;
  } catch (error) {
    logger.error(`[OrientationCache] Failed to load orientation model: ${error}`);
    throw error;
  }
}

// Utility function for direct orientation application (when orientations are already known)
export function applyOrientations(sequences: string[], orientations: string[]): string[] {
  if (sequences.length !== orientations.length) {
    throw new Error('Sequences and orientations arrays must have same length');
  }
  
  return sequences.map((sequence, index) =>
    fixSingleOrientation(sequence, orientations[index])
  );
}