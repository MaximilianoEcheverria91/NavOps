import db from '../../db/navopsDB';
import apiClient from '../api/apiClient';

const MAX_RETRIES   = 5;
const BASE_DELAY_MS = 2000;

let intervalId = null;
let isSyncing  = false;

export function initSyncEngine(onStart, onEnd) {
  window.addEventListener('online', () => runSyncQueue(onStart, onEnd));
  intervalId = setInterval(() => {
    if (navigator.onLine) runSyncQueue(onStart, onEnd);
  }, 30_000);
}

export function destroySyncEngine() {
  clearInterval(intervalId);
}

export async function runSyncQueue(onStart, onEnd) {
  if (isSyncing || !navigator.onLine) return;
  isSyncing = true;
  onStart?.();

  try {
    const pending = await db.pending_operations
      .where('status').anyOf(['pending', 'failed'])
      .sortBy('createdAt');

    for (const op of pending) {
      if (op.retryCount >= MAX_RETRIES) {
        await db.pending_operations.update(op.id, { status: 'failed' });
        continue;
      }
      await processOperation(op);
    }
  } finally {
    isSyncing = false;
    onEnd?.();
  }
}

async function processOperation(op) {
  await db.pending_operations.update(op.id, { status: 'syncing' });
  try {
    if (op.type === 'POST_PORT') {
      const body = op.hasPhoto ? buildFormData(op.payload) : op.payload;
      const headers = op.hasPhoto ? { 'Content-Type': 'multipart/form-data' } : {};
      const { data } = await apiClient.post('/puertos', body, { headers });

      // Replace temp entry with real one
      await db.cached_ports.where('portId').equals(op.entityId).delete();
      await db.cached_ports.add({ portId: data.id, data, updatedAt: Date.now() });
    }

    if (op.type === 'DELETE_PORT') {
      await apiClient.delete(`/puertos/${op.entityId}`);
      await db.cached_ports.where('portId').equals(op.entityId).delete();
    }

    await db.pending_operations.update(op.id, { status: 'done' });
  } catch (err) {
    const delay = BASE_DELAY_MS * 2 ** op.retryCount;
    await sleep(delay);
    await db.pending_operations.update(op.id, {
      status: 'failed',
      retryCount: op.retryCount + 1,
      lastError: err.message,
    });
  }
}

function buildFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => v != null && fd.append(k, String(v)));
  return fd;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
