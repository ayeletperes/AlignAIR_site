/**
 * Path-rewriting layer for running the site's pipeline in Node.
 *
 * The pipeline expects model artifacts and reference JSON at server-absolute
 * paths like `/models/alignment/.../model.json` and `/dataconfig/X.json`.
 * Browsers resolve these against the site origin; Node needs them rewritten
 * to filesystem absolute paths under a base directory (the repo's public/).
 *
 * Responsibilities:
 *   1. Resolve a base public directory (passed in by `align` from --models-dir).
 *   2. Monkey-patch globalThis.fetch so `/foo.json` reads from disk.
 *   3. Wrap @tensorflow/tfjs `loadGraphModel` so `/foo/model.json` reads from disk.
 *
 * Keeping these patches isolated here means the imported pipeline modules
 * stay unchanged. `setPublicDir()` is called by the align command before any
 * pipeline code runs.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';
// @ts-ignore — types may be missing depending on tfjs-node minor version
import * as tfn from '@tensorflow/tfjs-node';

let publicDir: string | null = null;

export const setPublicDir = (dir: string): void => {
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs)) {
    throw new Error(`models directory not found: ${abs}`);
  }
  publicDir = abs;
};

export const getPublicDir = (): string => {
  if (!publicDir) {
    throw new Error('publicDir not set — call setPublicDir() first');
  }
  return publicDir;
};

const resolveOnDisk = (urlOrPath: string): string => {
  // Already absolute or file:// — leave alone.
  if (urlOrPath.startsWith('file://')) return urlOrPath.replace('file://', '');
  if (path.isAbsolute(urlOrPath) && !urlOrPath.startsWith('/models/') && !urlOrPath.startsWith('/dataconfig/') && !urlOrPath.startsWith('/wasm/')) {
    return urlOrPath;
  }
  // Server-absolute path relative to public/.
  const rel = urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
  return path.join(getPublicDir(), rel);
};

// -----------------------------------------------------------------------------
// fetch shim
// -----------------------------------------------------------------------------
const originalFetch = globalThis.fetch?.bind(globalThis);

const fetchShim: typeof fetch = async (input: any, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : (input as Request).url;

  // Pass through anything that's already a real URL.
  if (/^https?:/.test(url) || /^file:\/\//.test(url)) {
    if (!originalFetch) {
      throw new Error(`no upstream fetch available for ${url}`);
    }
    return originalFetch(input, init);
  }

  // Path-style: read from disk.
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    try {
      const onDisk = resolveOnDisk(url);
      const body = fs.readFileSync(onDisk);
      const headers = new Headers({
        'content-type': onDisk.endsWith('.json')
          ? 'application/json'
          : onDisk.endsWith('.onnx') || onDisk.endsWith('.bin')
            ? 'application/octet-stream'
            : 'application/octet-stream',
      });
      return new Response(body, { status: 200, statusText: 'OK', headers });
    } catch (e: any) {
      return new Response(null, { status: 404, statusText: `not found: ${url} (${e.message})` });
    }
  }

  if (originalFetch) {
    return originalFetch(input, init);
  }
  throw new Error(`fetch unsupported in Node for: ${url}`);
};

(globalThis as any).fetch = fetchShim;

// -----------------------------------------------------------------------------
// TF.js model loading — register an IO router so server-absolute paths
// resolve to the tfjs-node filesystem handler. This is the documented
// extension point; we can't reassign tf.loadGraphModel directly since the
// module export is a getter.
// -----------------------------------------------------------------------------
tf.io.registerLoadRouter((urlOrPath: string | string[]) => {
  if (Array.isArray(urlOrPath)) return null;
  if (typeof urlOrPath !== 'string') return null;
  if (!(urlOrPath.startsWith('/') || urlOrPath.startsWith('./'))) return null;
  const onDisk = resolveOnDisk(urlOrPath);
  const modelJson = onDisk.endsWith('model.json') ? onDisk : path.join(onDisk, 'model.json');
  if (!fs.existsSync(modelJson)) return null;
  return (tfn as any).io.fileSystem(modelJson);
});

// -----------------------------------------------------------------------------
// ONNX model loading — wrap InferenceSession.create so server-absolute paths
// resolve to disk before being passed to onnxruntime-node.
// -----------------------------------------------------------------------------
const ort = (globalThis as any).ort;
if (ort?.InferenceSession?.create) {
  const originalCreate = ort.InferenceSession.create.bind(ort.InferenceSession);
  ort.InferenceSession.create = async (modelPath: any, options?: any) => {
    if (typeof modelPath === 'string' && (modelPath.startsWith('/') || modelPath.startsWith('./'))) {
      const onDisk = resolveOnDisk(modelPath);
      if (!fs.existsSync(onDisk)) {
        throw new Error(`ONNX model not found at ${onDisk}`);
      }
      return originalCreate(onDisk, options);
    }
    return originalCreate(modelPath, options);
  };
}
