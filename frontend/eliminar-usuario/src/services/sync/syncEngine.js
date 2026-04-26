import db from '../../db/navopsDB';
import apiClient from '../api/apiClient';

const MAX_RETRIES   = 5;
const BASE_DELAY_MS = 2000;

let syncIntervalId = null;
let isSyncing      = false;

export function initSyncEngine(onStart, onEnd) {
  window.addEventListener('online', () => runSyncQueue(onStart, onEnd));
  syncIntervalId = setInterval(() => {
    if (navigator.onLine) runSyncQueue(onStart, onEnd);
  }, 30_000);
}

export function destroySyncEngine() {
  clearInterval(syncIntervalId);
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
    if (op.type === 'DELETE_USER') {
      await apiClient.delete(`/usuarios/${op.entityId}`);
      await db.cached_users.where('userId').equals(op.entityId).delete();
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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
