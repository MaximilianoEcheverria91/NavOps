import { useState, useEffect, useCallback, useRef } from "react";
import { userService } from "../services/api/userService";
import { db } from "../db/database";
import { useNetworkStatus } from "./useNetworkStatus";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * useUsers
 *
 * Offline-first data hook for the user list.
 *
 * Strategy:
 *  1. Load from IndexedDB cache immediately (instant render, no flash)
 *  2. If online, fetch from API and refresh cache
 *  3. If offline, serve stale cache with an indicator
 *  4. Apply filters client-side against the cached dataset
 */
export function useUsers(filters) {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const { isOnline } = useNetworkStatus();
  const abortRef = useRef(null);

  // ─── Load from cache on mount ───────────────────────────────────────────────
  const loadFromCache = useCallback(async () => {
    try {
      const cached = await db.cached_data.get("users");
      if (cached?.data) {
        setAllUsers(cached.data);
        const age = Date.now() - (cached.timestamp || 0);
        setIsStale(age > CACHE_TTL_MS);
        return cached.data;
      }
    } catch (err) {
      console.error("[useUsers] Cache read failed:", err);
    }
    return null;
  }, []);

  // ─── Fetch from API and update cache ────────────────────────────────────────
  const fetchFromApi = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsSyncing(true);
    setError(null);
    try {
      const users = await userService.getAll({ signal: abortRef.current.signal });
      setAllUsers(users);
      setIsStale(false);

      await db.cached_data.put({
        key: "users",
        data: users,
        timestamp: Date.now(),
      });
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      setError("No se pudo actualizar la lista desde el servidor.");
      console.error("[useUsers] API fetch failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ─── Bootstrap: cache first, then API if online ───────────────────────────
  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);
      await loadFromCache();
      if (!cancelled && isOnline) {
        await fetchFromApi();
      }
      if (!cancelled) setIsLoading(false);
    };

    bootstrap();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Refresh when coming back online ─────────────────────────────────────
  useEffect(() => {
    if (isOnline && !isSyncing) {
      fetchFromApi();
    }
    // Only trigger on connectivity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // ─── Apply filters client-side ───────────────────────────────────────────
  useEffect(() => {
    const result = allUsers.filter((user) => {
      if (filters.cargo && user.cargo !== filters.cargo) return false;
      if (filters.estado && user.estado !== filters.estado) return false;
      if (filters.antiguedadMin && user.antiguedad < Number(filters.antiguedadMin)) return false;
      if (filters.antiguedadMax && user.antiguedad > Number(filters.antiguedadMax)) return false;
      if (filters.edadMin && user.edad < Number(filters.edadMin)) return false;
      if (filters.edadMax && user.edad > Number(filters.edadMax)) return false;
      return true;
    });
    setFilteredUsers(result);
  }, [allUsers, filters]);

  const refresh = useCallback(() => {
    if (isOnline) fetchFromApi();
  }, [isOnline, fetchFromApi]);

  return {
    users: filteredUsers,
    totalUsers: allUsers.length,
    isLoading,
    isSyncing,
    isStale,
    error,
    refresh,
  };
}
