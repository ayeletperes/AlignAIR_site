/**
 * Model + reference cache rooted at ~/.alignair/cache/ (override with
 * ALIGNAIR_CACHE_DIR). Downloads artifacts from the deployed site on first
 * use; subsequent runs read from disk.
 *
 * What we cache:
 *   - TF.js graph models: model.json + the .bin shards listed in its
 *     `weightsManifest[].paths` (download those alongside model.json).
 *   - ONNX models: single binary file.
 *   - Reference JSON under /dataconfig/.
 *
 * Layout mirrors the site's URL structure so the same path resolver works
 * for both filesystem and cached-URL modes. Example after caching:
 *
 *   ~/.alignair/cache/
 *     models/alignment/human/heavy/IGH_S5F_576/model.json
 *     models/alignment/human/heavy/IGH_S5F_576/group1-shard1of4.bin
 *     models/alignment/human/heavy/IGH_S5F_576/group1-shard2of4.bin
 *     ...
 *     models/orientation/human/heavychain_ornt_pipeline.onnx
 *     dataconfig/HUMAN_IGH_OGRDB.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const DEFAULT_BASE_URL = 'https://alignair.ai';

export interface CacheConfig {
  baseUrl: string;
  cacheDir: string;
}

let activeConfig: CacheConfig | null = null;

export const setCacheConfig = (cfg: { baseUrl?: string; cacheDir?: string }): CacheConfig => {
  const baseUrl = (cfg.baseUrl ?? process.env.ALIGNAIR_URL ?? DEFAULT_BASE_URL).replace(/\/$/, '');
  const cacheDir = cfg.cacheDir
    ?? process.env.ALIGNAIR_CACHE_DIR
    ?? path.join(os.homedir(), '.alignair', 'cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  activeConfig = { baseUrl, cacheDir };
  return activeConfig;
};

export const getCacheConfig = (): CacheConfig => {
  if (!activeConfig) {
    return setCacheConfig({});
  }
  return activeConfig;
};

/** Translate a server-absolute path to its local cache path. */
export const cachePath = (urlPath: string): string => {
  const cfg = getCacheConfig();
  const rel = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
  return path.join(cfg.cacheDir, rel);
};

const log = (msg: string) => process.stderr.write(`[cache] ${msg}\n`);

/** Fetch a URL into a buffer (Node 18+'s built-in fetch). */
const fetchBytes = async (url: string): Promise<Buffer> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
};

/** Ensure a single URL is present in cache; return its local path. */
export const ensureFile = async (urlPath: string): Promise<string> => {
  const local = cachePath(urlPath);
  if (fs.existsSync(local)) return local;
  const cfg = getCacheConfig();
  const url = `${cfg.baseUrl}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
  log(`fetching ${url}`);
  const buf = await fetchBytes(url);
  fs.mkdirSync(path.dirname(local), { recursive: true });
  fs.writeFileSync(local, buf);
  return local;
};

/**
 * Ensure a TF.js graph-model bundle (model.json + weight shards) is fully
 * cached. Returns the local path to model.json.
 *
 * Accepts either the model directory ("/models/alignment/.../IGH_S5F_576")
 * or the model.json itself.
 */
export const ensureTfBundle = async (urlPath: string): Promise<string> => {
  const modelJsonUrl = urlPath.endsWith('.json') ? urlPath : `${urlPath.replace(/\/$/, '')}/model.json`;
  const modelJsonLocal = await ensureFile(modelJsonUrl);
  // Parse to find shards.
  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(modelJsonLocal, 'utf8'));
  } catch (e: any) {
    // If the just-downloaded file isn't valid JSON, the cache is poisoned.
    fs.unlinkSync(modelJsonLocal);
    throw new Error(`model.json at ${modelJsonUrl} is not valid JSON: ${e.message}`);
  }
  const groups: any[] = manifest?.weightsManifest ?? [];
  const baseDir = path.dirname(modelJsonUrl);
  for (const group of groups) {
    const paths: string[] = group?.paths ?? [];
    for (const relShard of paths) {
      // Shard URLs are relative to model.json's directory.
      const shardUrl = `${baseDir}/${relShard}`;
      await ensureFile(shardUrl);
    }
  }
  return modelJsonLocal;
};

/** Clear the entire cache (used by `alignair clear-cache`). */
export const clearCache = (): void => {
  const cfg = getCacheConfig();
  if (fs.existsSync(cfg.cacheDir)) {
    fs.rmSync(cfg.cacheDir, { recursive: true, force: true });
  }
};
