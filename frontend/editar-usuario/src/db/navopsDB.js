import Dexie from 'dexie';

// ── NavOps local database (IndexedDB via Dexie) ─────────────────────────────
// This is NOT the source of truth. Backend is SSOT.
// This DB acts as:
//   1. Read cache (catalogs, user data)
//   2. Pending operations queue (offline writes)
// ─────────────────────────────────────────────────────────────────────────────

const db = new Dexie('NavOpsDB');

db.version(1).stores({
  // Cached data from backend (read cache)
  cached_users: '++id, userId, updatedAt',

  // Catalog data (countries, provinces, roles, etc.)
  cached_data: 'key, value, cachedAt',

  // Offline operation queue (FIFO sync queue)
  // status: 'pending' | 'syncing' | 'failed' | 'done'
  pending_operations: '++id, type, entityId, status, createdAt, retryCount',

  // Auth session (offline login support)
  auth_session: 'id, token, user, expiresAt',
});

export default db;
