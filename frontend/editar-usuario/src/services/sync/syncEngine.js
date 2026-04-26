import db from '../../db/navopsDB';
import apiClient from '../api/apiClient';

// ── Sync Engine ──────────────────────────────────────────────────────────────
// Processes the pending_operations queue using FIFO order.
// Retries with exponential backoff. Conflict strategy: last-write-wins.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

let syncIntervalId = null;
let isSyncing = false;

/** Start listening for reconnection to trigger sync */
export function initSyncEngine(onSyncStart, onSyncEnd) {
  window.addEventListener('online', () => runSyncQueue(onSyncStart, onSyncEnd));

  // Also try sync periodically when online (every 30s)
  syncIntervalId = setInterval(() => {
    if (navigator.onLine) runSyncQueue(onSyncStart, onSyncEnd);
  }, 30_000);
}

export function destroySyncEngine() {
  clearInterval(syncIntervalId);
}

/** Process all pending operations in FIFO order */
export async function runSyncQueue(onSyncStart, onSyncEnd) {
  if (isSyncing || !navigator.onLine) return;
  isSyncing = true;
  onSyncStart?.();

  try {
    const pending = await db.pending_operations
      .where('status')
      .anyOf(['pending', 'failed'])
      .sortBy('createdAt'); // FIFO

    for (const op of pending) {
      if (op.retryCount >= MAX_RETRIES) {
        await db.pending_operations.update(op.id, { status: 'failed' });
        continue;
      }
      await processOperation(op);
    }
  } finally {
    isSyncing = false;
    onSyncEnd?.();
  }
}

/** Process a single queued operation */
async function processOperation(op) {
  await db.pending_operations.update(op.id, { status: 'syncing' });

  try {
    if (op.type === 'PUT_USER') {
      const formData = op.hasPhoto ? buildFormData(op.payload) : op.payload;
      const { data } = await apiClient.put(`/usuarios/${op.entityId}`, formData, {
        headers: op.hasPhoto ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      // Update cache with authoritative backend response
      await db.cached_users.put({ userId: op.entityId, data, updatedAt: Date.now() });
      await db.pending_operations.update(op.id, { status: 'done' });
    }
  } catch (error) {
    const delay = BASE_DELAY_MS * 2 ** op.retryCount;
    await sleep(delay);
    await db.pending_operations.update(op.id, {
      status: 'failed',
      retryCount: op.retryCount + 1,
      lastError: error.message,
    });
  }
}

function buildFormData(payload) {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => v != null && fd.append(k, v));
  return fd;
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
