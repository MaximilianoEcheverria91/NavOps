import Dexie from "dexie";

/**
 * NavOps local database (IndexedDB via Dexie).
 *
 * Tables:
 *  - cached_data       → read cache for API responses (users, catalogs, etc.)
 *  - pending_operations → FIFO queue for offline write operations
 */
export const db = new Dexie("navops_db");

db.version(1).stores({
  // key is the unique identifier (e.g. "users", "cargos")
  cached_data: "key, timestamp",

  // id is auto-incremented; endpoint + method for routing on sync
  pending_operations: "++id, endpoint, method, status, createdAt",
});

export default db;
