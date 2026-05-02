import Dexie from 'dexie';

/**
 * NavOps local IndexedDB.
 * NOT the SSOT — Spring Boot backend is authoritative.
 */
const db = new Dexie('NavOpsDB');

db.version(2).stores({
  cached_users:       '++id, userId, updatedAt',
  cached_ports:       '++id, portId, updatedAt',
  cached_data:        'key, value, cachedAt',
  pending_operations: '++id, type, entityId, status, createdAt, retryCount',
  auth_session:       'id, token, user, expiresAt',
});

export default db;
