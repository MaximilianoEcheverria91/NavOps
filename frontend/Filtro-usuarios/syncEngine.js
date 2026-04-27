import axios from "axios";
import { db } from "../../db/database";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;

/**
 * syncEngine
 *
 * Processes the pending_operations queue when the device comes back online.
 *
 * Strategy: FIFO + exponential backoff per operation.
 * Conflict resolution: backend authority (last write wins via server timestamp).
 */
export const syncEngine = {
  /**
   * Bootstraps event listeners for online/offline transitions.
   * Call once at app startup.
   */
  init() {
    window.addEventListener("app:online", () => {
      console.info("[SyncEngine] Connection restored — starting sync");
      this.processQueue();
    });

    // Also try on initial load if already online
    if (navigator.onLine) {
      this.processQueue();
    }
  },

  /**
   * Enqueue a write operation for later sync.
   * @param {string} endpoint  e.g. "/users/123"
   * @param {string} method    "POST" | "PUT" | "PATCH" | "DELETE"
   * @param {object} payload   Request body
   */
  async enqueue(endpoint, method, payload = {}) {
    await db.pending_operations.add({
      endpoint,
      method,
      payload,
      status: "pending",
      retries: 0,
      createdAt: Date.now(),
    });
    console.info(`[SyncEngine] Queued: ${method} ${endpoint}`);
  },

  /**
   * Process all pending operations in FIFO order.
   * Skips already-failed operations (exceeded retries).
   */
  async processQueue() {
    if (!navigator.onLine) return;

    const operations = await db.pending_operations
      .where("status")
      .equals("pending")
      .sortBy("createdAt");

    if (operations.length === 0) return;

    console.info(`[SyncEngine] Processing ${operations.length} pending operations`);

    const token = localStorage.getItem("auth_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    for (const op of operations) {
      await this._processOperation(op, headers);
    }
  },

  async _processOperation(op, headers) {
    const delay = BACKOFF_BASE_MS * Math.pow(2, op.retries);

    if (op.retries > 0) {
      await sleep(delay);
    }

    try {
      await axios({
        method: op.method,
        url: `${BASE_URL}${op.endpoint}`,
        data: op.payload,
        headers,
        timeout: 8000,
      });

      await db.pending_operations.delete(op.id);
      console.info(`[SyncEngine] Synced: ${op.method} ${op.endpoint}`);
    } catch (err) {
      const retries = op.retries + 1;

      if (retries >= MAX_RETRIES) {
        await db.pending_operations.update(op.id, { status: "failed", retries });
        console.error(`[SyncEngine] Permanently failed: ${op.method} ${op.endpoint}`, err);
      } else {
        await db.pending_operations.update(op.id, { retries });
        console.warn(`[SyncEngine] Retry ${retries}/${MAX_RETRIES}: ${op.method} ${op.endpoint}`);
      }
    }
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
