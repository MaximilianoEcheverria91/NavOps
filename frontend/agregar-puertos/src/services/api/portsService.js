import apiClient from './apiClient';
import db from '../../db/navopsDB';

/**
 * Create a new port.
 *
 * Online  → POST /puertos (multipart if photo attached)
 * Offline → queue POST in pending_operations, store locally
 *
 * @param {Object} payload  – form data
 * @param {File|null} photo – optional image file
 * @returns {{ success: boolean, offline: boolean, data: any }}
 */
export async function createPort(payload, photo = null) {
  if (navigator.onLine) {
    try {
      const body = buildBody(payload, photo);
      const headers = photo ? { 'Content-Type': 'multipart/form-data' } : {};
      const { data } = await apiClient.post('/puertos', body, { headers });

      // Cache created port locally
      await db.cached_ports.add({ portId: data.id, data, updatedAt: Date.now() });
      return { success: true, offline: false, data };
    } catch (error) {
      if (!error.response) {
        // Network failure despite onLine → enqueue
        return enqueueCreatePort(payload, photo);
      }
      throw error;
    }
  }
  return enqueueCreatePort(payload, photo);
}

/** Queue the create operation for later sync */
async function enqueueCreatePort(payload, photo) {
  const tempId = `temp_${Date.now()}`;
  await db.pending_operations.add({
    type: 'POST_PORT',
    entityId: tempId,
    payload,
    hasPhoto: !!photo,
    status: 'pending',
    retryCount: 0,
    createdAt: Date.now(),
  });

  // Optimistic local cache entry
  await db.cached_ports.add({
    portId: tempId,
    data: { ...payload, id: tempId, _offline: true },
    updatedAt: Date.now(),
  });

  return { success: true, offline: true, data: { ...payload, id: tempId } };
}

function buildBody(payload, photo) {
  if (!photo) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => v != null && fd.append(k, String(v)));
  fd.append('foto', photo);
  return fd;
}
