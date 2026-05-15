/**
 * Path-rewriting layer for running the site's pipeline in Node.
 *
 * The pipeline expects model artifacts and reference JSON at server-absolute
 * paths like `/models/alignment/.../model.json` and `/dataconfig/X.json`.
 * Browsers resolve these against the site origin; Node needs them rewritten
 * to local file paths. We support two modes:
 *
 *   - **URL mode (default).** Paths resolve to a per-user cache under
 *     ~/.alignair/cache/, downloading from a base URL (default
 *     https://alignair.ai) on first use. See cache.ts.
 *   - **Filesystem mode.** When the user passes `--models-dir <path>`, paths
 *     resolve to files under that local directory. Used for offline / dev
 *     runs against a repo checkout.
 *
 * Three integration points:
 *   1. globalThis.fetch shim so `/foo.json` reads from cache/disk.
 *   2. tf.io.registerLoadRouter so `tf.loadGraphModel('/foo')` reads from
 *      the cache via the tfjs-node filesystem IO handler.
 *   3. ort.InferenceSession.create wrap so server-absolute ONNX paths
 *      resolve to disk before onnxruntime-node sees them.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';
// @ts-ignore — types may be missing depending on tfjs-node minor version
import * as tfn from '@tensorflow/tfjs-node';
import { cachePath, ensureFile, ensureTfBundle, setCacheConfig } from '../cache';

type Mode = { kind: 'fs'; dir: string } | { kind: 'url' };

let mode: Mode = { kind: 'url' };

/** Configure the resolver for filesystem mode (a public/ dir). */
export const setPublicDir = (dir: string): void => {
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs)) {
    throw new Error(`models directory not found: ${abs}`);
  }
  mode = { kind: 'fs', dir: abs };
};

/** Configure the resolver for URL mode (downloaded + cached). */
export const setRemote = (opts: { baseUrl?: string; cacheDir?: string }): void => {
  setCacheConfig(opts);
  mode = { kind: 'url' };
};

const resolveFsPath = (urlOrPath: string): string => {
  if (urlOrPath.startsWith('file://')) return urlOrPath.replace('file://', '');
  if (mode.kind !== 'fs') throw new Error('not in filesystem mode');
  const rel = urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
  return path.join(mode.dir, rel);
};

/**
 * Synchronous resolver used by the fetch shim and IO router. In URL mode this
 * only succeeds if the file has already been pre-warmed (via ensureFile /
 * ensureTfBundle). The wrappers call those async helpers first to populate
 * the cache, then this is just a path-join.
 */
const resolveLocal = (urlPath: string): string => {
  if (mode.kind === 'fs') return resolveFsPath(urlPath);
  return cachePath(urlPath);
};

// -----------------------------------------------------------------------------
// fetch shim — used by referenceCache.fetchReferenceJson for /dataconfig/*.json.
// We pre-warm the cache on miss, then return the on-disk bytes.
// -----------------------------------------------------------------------------
const originalFetch = globalThis.fetch?.bind(globalThis);

const fetchShim: typeof fetch = async (input: any, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : (input as Request).url;

  if (/^https?:/.test(url) || /^file:\/\//.test(url)) {
    if (!originalFetch) throw new Error(`no upstream fetch available for ${url}`);
    return originalFetch(input, init);
  }

  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    try {
      let onDisk: string;
      if (mode.kind === 'fs') {
        onDisk = resolveFsPath(url);
      } else {
        onDisk = await ensureFile(url);
      }
      const body = fs.readFileSync(onDisk);
      const headers = new Headers({
        'content-type': onDisk.endsWith('.json')
          ? 'application/json'
          : 'application/octet-stream',
      });
      return new Response(body, { status: 200, statusText: 'OK', headers });
    } catch (e: any) {
      return new Response(null, { status: 404, statusText: `not found: ${url} (${e.message})` });
    }
  }

  if (originalFetch) return originalFetch(input, init);
  throw new Error(`fetch unsupported in Node for: ${url}`);
};

(globalThis as any).fetch = fetchShim;

// -----------------------------------------------------------------------------
// TF.js graph-model loading. We can't return an IO handler that does async
// work (the router is sync), so we resolve+cache inside the handler by
// returning an *adapter* IO handler whose load() awaits the bundle download.
// -----------------------------------------------------------------------------
const buildAsyncFileSystemHandler = (urlPath: string): tf.io.IOHandler => ({
  load: async () => {
    let modelJsonPath: string;
    if (mode.kind === 'fs') {
      modelJsonPath = path.join(resolveFsPath(urlPath));
      if (!modelJsonPath.endsWith('model.json')) modelJsonPath = path.join(modelJsonPath, 'model.json');
    } else {
      modelJsonPath = await ensureTfBundle(urlPath);
    }
    if (!fs.existsSync(modelJsonPath)) {
      throw new Error(`model.json not found at ${modelJsonPath}`);
    }
    const fsHandler = (tfn as any).io.fileSystem(modelJsonPath);
    return fsHandler.load();
  },
});

tf.io.registerLoadRouter((urlOrPath: string | string[]) => {
  if (Array.isArray(urlOrPath)) return null;
  if (typeof urlOrPath !== 'string') return null;
  if (!(urlOrPath.startsWith('/') || urlOrPath.startsWith('./'))) return null;
  return buildAsyncFileSystemHandler(urlOrPath);
});

// -----------------------------------------------------------------------------
// ONNX model loading — wrap InferenceSession.create so server-absolute paths
// resolve to disk (cache + download in URL mode) before being handed to
// onnxruntime-node.
// -----------------------------------------------------------------------------
const ort = (globalThis as any).ort;
if (ort?.InferenceSession?.create) {
  const originalCreate = ort.InferenceSession.create.bind(ort.InferenceSession);
  ort.InferenceSession.create = async (modelPath: any, options?: any) => {
    if (typeof modelPath === 'string' && (modelPath.startsWith('/') || modelPath.startsWith('./'))) {
      let onDisk: string;
      if (mode.kind === 'fs') {
        onDisk = resolveFsPath(modelPath);
      } else {
        onDisk = await ensureFile(modelPath);
      }
      if (!fs.existsSync(onDisk)) {
        throw new Error(`ONNX model not found at ${onDisk}`);
      }
      return originalCreate(onDisk, options);
    }
    return originalCreate(modelPath, options);
  };
}

/** Compatibility shim used by older code paths in this CLI. */
export const getPublicDir = (): string => {
  if (mode.kind !== 'fs') throw new Error('getPublicDir called while in URL mode');
  return mode.dir;
};

export { resolveLocal };
