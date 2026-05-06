/**
 * IndexedDB storage for MediaItems.
 * Photos (base64 dataUrl) are stored here instead of localStorage
 * to avoid the 5-10 MB localStorage quota limit.
 */
import { MediaItem } from '../types/areal';

const DB_NAME = 'sma-nastroj-media';
const DB_VERSION = 1;
const STORE = 'media';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbSaveMedia(items: MediaItem[]): Promise<void> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readwrite');
  const store = tx.objectStore(STORE);
  // Clear existing and write fresh set
  store.clear();
  for (const item of items) store.put(item);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function dbLoadMedia(): Promise<MediaItem[]> {
  const db = await openDb();
  const tx = db.transaction(STORE, 'readonly');
  const store = tx.objectStore(STORE);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as MediaItem[]);
    req.onerror = () => reject(req.error);
  });
}
