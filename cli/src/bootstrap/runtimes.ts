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

// Polyfill `util.isNullOrUndefined` — removed in Node 23 but still referenced
// by @tensorflow/tfjs-node 4.x (nodejs_kernel_backend.js uses it inside
// `executeSingleOutput`, called from every `model.predict()` invocation).
// Without this shim, predict throws "isNullOrUndefined is not a function".
//
// Must run BEFORE `@tensorflow/tfjs-node` is required — that's why we use
// require() rather than `import`. ES imports get hoisted to the top of the
// module, so the polyfill in import-statement form would land after the
// tfjs-node side-effect import.
{
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodeUtil = require('util');
  if (typeof nodeUtil.isNullOrUndefined !== 'function') {
    nodeUtil.isNullOrUndefined = (v: unknown) => v === null || v === undefined;
  }
}

// Side-effect require: registers the 'tensorflow' backend with TF.js.
// Requiring this BEFORE any other module that imports '@tensorflow/tfjs'
// is what makes the native backend the default.
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@tensorflow/tfjs-node');

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
