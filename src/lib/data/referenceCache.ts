/**
 * IndexedDB-backed cache for parsed reference germline JSON payloads.
 *
 * The reference files served from /dataconfig/*.json are large (often 100-500KB),
 * static across sessions, and parsed identically on every cold load. Caching
 * the parsed payload by path skips both the network fetch and the JSON.parse
 * pass on subsequent runs.
 *
 * Invalidation: there is no implicit TTL — reference data is meant to be
 * stable. Call clearReferenceCache() to evict everything (exposed on `window`
 * in dev for debugging).
 */
import { logger } from '@/utils/logger';

const DB_NAME = 'alignair-reference-cache';
const DB_VERSION = 1;
const STORE_NAME = 'references';

const isIDBAvailable = (): boolean =>
  typeof indexedDB !== 'undefined' && typeof window !== 'undefined';

const openDb = (): Promise<IDBDatabase | null> =>
  new Promise((resolve) => {
    if (!isIDBAvailable()) {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      logger.warn('IndexedDB open failed; reference cache disabled', req.error);
      resolve(null);
    };
  });

const idbGet = async (key: string): Promise<any | undefined> => {
  const db = await openDb();
  if (!db) return undefined;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(undefined);
  });
};

const idbPut = async (key: string, value: any): Promise<void> => {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
};

const idbClear = async (): Promise<void> => {
  const db = await openDb();
  if (!db) return;
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
  });
};

/**
 * Fetch a reference JSON document, transparently caching the parsed payload
 * in IndexedDB. Falls back to a plain fetch if IndexedDB is unavailable.
 */
export const fetchReferenceJson = async (path: string): Promise<any> => {
  if (isIDBAvailable()) {
    const cached = await idbGet(path);
    if (cached !== undefined) {
      logger.info(`[ReferenceCache] hit: ${path}`);
      return cached;
    }
  }
  const res = await fetch(path);
  if (!res?.ok) throw new Error(`Failed to fetch reference: ${path}`);
  const payload = await res.json();
  if (isIDBAvailable()) {
    // Fire-and-forget; never block the caller on persistence.
    void idbPut(path, payload);
  }
  return payload;
};

export const clearReferenceCache = (): Promise<void> => idbClear();

// Dev affordance: surface the eviction helper on window so it can be called
// from the console without having to import. Guarded so we don't pollute prod.
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as any).__alignairClearReferenceCache = clearReferenceCache;
}
