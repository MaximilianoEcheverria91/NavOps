import apiClient from './apiClient';
import db from '../../db/navopsDB';

// ── Users API Service ────────────────────────────────────────────────────────
// All methods handle online/offline gracefully.
// On offline: reads from IndexedDB cache, writes to pending_operations queue.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a single user by ID.
 * Online  → GET /usuarios/:id, cache result in IndexedDB.
 * Offline → return cached data from IndexedDB.
 */
export async function getUserById(userId) {
  if (navigator.onLine) {
    try {
      const { data } = await apiClient.get(`/usuarios/${userId}`);
      // Cache fetched user locally
      await db.cached_users.put({ userId, data, updatedAt: Date.now() });
      return data;
    } catch (error) {
      // Network error despite onLine flag → fall back to cache
      return getCachedUser(userId);
    }
  }
  return getCachedUser(userId);
}

/**
 * Return cached user from IndexedDB.
 * Throws if not found (user was never loaded online before).
 */
async function getCachedUser(userId) {
  const cached = await db.cached_users
    .where('userId')
    .equals(userId)
    .first();
  if (!cached) throw new Error('Usuario no disponible sin conexión.');
  return cached.data;
}

/**
 * Update a user.
 * Online  → PUT /usuarios/:id (multipart if photo changed)
 * Offline → queue PUT in pending_operations and update local cache optimistically.
 */
export async function updateUser(userId, payload, photoFile = null) {
  if (navigator.onLine) {
    const formData = buildFormData(payload, photoFile);
    const { data } = await apiClient.put(`/usuarios/${userId}`, formData, {
      headers: photoFile ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    // Update local cache with fresh response
    await db.cached_users.put({ userId, data, updatedAt: Date.now() });
    return { success: true, data, offline: false };
  }

  // ── Offline: persist in queue ──────────────────────────────────────────────
  await db.pending_operations.add({
    type: 'PUT_USER',
    entityId: userId,
    payload,
    hasPhoto: !!photoFile,
    status: 'pending',
    retryCount: 0,
    createdAt: Date.now(),
  });

  // Optimistic update in local cache
  const cached = await db.cached_users.where('userId').equals(userId).first();
  if (cached) {
    await db.cached_users.put({
      ...cached,
      data: { ...cached.data, ...payload },
      updatedAt: Date.now(),
    });
  }

  return { success: true, data: { ...payload, id: userId }, offline: true };
}

/** Build FormData for multipart requests */
function buildFormData(payload, photoFile) {
  if (!photoFile) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => v != null && fd.append(k, v));
  fd.append('foto', photoFile);
  return fd;
}
