import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import { logger } from '@components/utils/logger';

export async function initializeBackend(setBackendMessage: (message: string) => void) {
  try {
    await tf.setBackend('webgl');
    await tf.ready();

    // ✅ Ensure WebGL is actually in use before setting the message
    if (tf.getBackend() === 'webgl') {
      setBackendMessage("⚡ Running on GPU (WebGL)");
      if (process.env.NODE_ENV === 'development') {
        logger.log("✅ Using WebGL backend");
      }
      return;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn("❌ WebGL not available, trying WASM...");
    }
  }

  try {
    await tf.setBackend('wasm');
    await tf.ready();

    if (tf.getBackend() === 'wasm') {
      setBackendMessage("⚡ Running on WASM (WebAssembly)");
      if (process.env.NODE_ENV === 'development') {
        logger.log("✅ Using WASM backend");
      }
      return;
    }
  } catch (wasmError) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn("❌ WASM not available, switching to CPU...");
    }
  }

  // ✅ Fallback to CPU
  await tf.setBackend('cpu');
  await tf.ready();
  setBackendMessage("🐢 Running on CPU (Considerably slower)");

  if (process.env.NODE_ENV === 'development') {
    logger.log("✅ Using CPU backend (fallback)");
  }
}
