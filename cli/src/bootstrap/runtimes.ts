/**
 * Bootstrap Node-side ML runtimes before any pipeline code runs.
 *
 * Two responsibilities:
 *
 * 1. Register the TF.js Node backend by importing @tensorflow/tfjs-node.
 *    This auto-binds the native libtensorflow backend so subsequent
 *    `tf.loadGraphModel`, `tf.tensor`, `model.predict` calls run on CPU
 *    via the C++ runtime instead of failing with no backend available.
 *
 * 2. Expose onnxruntime-node as `globalThis.ort` so the existing browser
 *    detection in src/lib/model/utilities.tsx (which reads `window.ort`
 *    or `globalThis.ort` after a small patch) finds a runtime without
 *    needing a separate ModelLoader fork.
 */

// Side-effect import: registers the 'tensorflow' backend with TF.js.
// Importing this BEFORE any other module that imports '@tensorflow/tfjs'
// is what makes the native backend the default.
import '@tensorflow/tfjs-node';

// Provide ONNX runtime to the pipeline via the same lookup it uses in
// the browser. Lazily required so we don't pay the load cost for
// subcommands that don't need it (list-models, model-info).
const installOnnxOnDemand = (): void => {
  if ((globalThis as any).ort) return;
  const ort = require('onnxruntime-node');
  (globalThis as any).ort = ort;
};

// Eager install: cheap, and avoids ordering surprises if a command later
// transitions from "didn't need ONNX" to "needed ONNX" mid-execution.
installOnnxOnDemand();
