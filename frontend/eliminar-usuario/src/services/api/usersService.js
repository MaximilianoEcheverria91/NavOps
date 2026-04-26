import apiClient from './apiClient';
import db from '../../db/navopsDB';

/**
 * Delete a user by ID.
 *
 * Online  → DELETE /usuarios/:id → remove from cache.
 * Offline → queue DELETE in pending_operations (optimistic removal from cache).
 *
 * @returns {{ success: boolean, offline: boolean }}
 */
export async function deleteUser(userId) {
  if (navigator.onLine) {
    try {
      await apiClient.delete(`/usuarios/${userId}`);
      // Remove from local cache
      await db.cached_users.where('userId').equals(userId).delete();
      return { success: true, offline: false };
    } catch (error) {
      // If network error despite onLine flag, queue for retry
      if (!error.response) {
        return enqueueDeleteOffline(userId);
      }
      throw error; // 4xx/5xx → propagate to UI
    }
  }

  return enqueueDeleteOffline(userId);
}

/** Queue a DELETE operation for later sync */
async function enqueueDeleteOffline(userId) {
  await db.pending_operations.add({
    type: 'DELETE_USER',
    entityId: userId,
    payload: null,
    status: 'pending',
    retryCount: 0,
    createdAt: Date.now(),
  });

  // Optimistic: mark user as deleted in local cache
  await db.cached_users
    .where('userId')
    .equals(userId)
    .modify({ deleted: true, updatedAt: Date.now() });

  return { success: true, offline: true };
}

/**
 * Fetch all users.
 * Online  → GET /usuarios, update cache.
 * Offline → return cached (excluding optimistically deleted).
 */
export async function getUsers() {
  if (navigator.onLine) {
    try {
      const { data } = await apiClient.get('/usuarios');
      // Refresh cache
      await db.cached_users.clear();
      await db.cached_users.bulkPut(
        data.map((u) => ({ userId: u.id, data: u, updatedAt: Date.now() }))
      );
      return data;
    } catch (error) {
      return getCachedUsers();
    }
  }
  return getCachedUsers();
}

async function getCachedUsers() {
  const cached = await db.cached_users
    .filter((u) => !u.deleted)
    .toArray();
  return cached.map((u) => u.data);
}
