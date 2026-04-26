import Dexie from 'dexie';

/**
 * NavOps local IndexedDB (via Dexie).
 * NOT the SSOT — backend is authoritative.
 * Tables:
 *   cached_users       → read cache
 *   pending_operations → offline write queue (FIFO)
 *   auth_session       → offline login support
 */
const db = new Dexie('NavOpsDB');

db.version(1).stores({
  cached_users:        '++id, userId, updatedAt',
  cached_data:         'key, value, cachedAt',
  pending_operations:  '++id, type, entityId, status, createdAt, retryCount',
  auth_session:        'id, token, user, expiresAt',
});

export default db;
