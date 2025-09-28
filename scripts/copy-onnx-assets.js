/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFileSyncSafe(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`[postinstall] Copied: ${src} -> ${dest}`);
  } catch (err) {
    console.warn(`[postinstall] Skip copy (missing?): ${src} -> ${dest}\n`, err.message);
  }
}

function main() {
  try {
    const projectRoot = process.cwd();
    const nm = path.join(projectRoot, 'node_modules');

    // Copy ONNX Runtime UMD bundle to public so it can be loaded at runtime
    const onnxUmdSrc = path.join(nm, 'onnxruntime-web', 'dist', 'ort.min.js');
    const onnxDestDir = path.join(projectRoot, 'public', 'onnx');
    ensureDirSync(onnxDestDir);
    const onnxUmdDest = path.join(onnxDestDir, 'ort.min.js');
    copyFileSyncSafe(onnxUmdSrc, onnxUmdDest);

    // Optionally ensure WASM assets are present (if not already checked in)
    const wasmSrcDir = path.join(nm, 'onnxruntime-web', 'dist');
    const wasmDestDir = path.join(projectRoot, 'public', 'wasm');
    ensureDirSync(wasmDestDir);
    const wasmFiles = [
      // WASM binaries and loaders
      'ort-wasm-simd-threaded.wasm',
      'ort-wasm-simd-threaded.jsep.wasm',
      'ort-wasm-simd-threaded.mjs',
      'ort-wasm-simd-threaded.jsep.mjs',
    ];
    for (const f of wasmFiles) {
      const src = path.join(wasmSrcDir, f);
      const dest = path.join(wasmDestDir, f);
      if (!fs.existsSync(dest)) {
        copyFileSyncSafe(src, dest);
      }
    }

    console.log('[postinstall] ONNX assets are ready.');
  } catch (err) {
    console.warn('[postinstall] Failed to copy ONNX assets:', err);
  }
}

main();
