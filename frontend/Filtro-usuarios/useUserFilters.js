import { useState, useCallback, useEffect, useRef } from "react";
import { FILTER_STORAGE_KEY } from "../constants/filters";

const DEFAULT_FILTERS = {
  cargo: "",
  estado: "",
  antiguedadMin: "",
  antiguedadMax: "",
  edadMin: "",
  edadMax: "",
};

/**
 * Persists filter state across navigation using sessionStorage.
 * Falls back gracefully if storage is unavailable (offline / private mode).
 */
function loadPersistedFilters() {
  try {
    const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
    return raw ? { ...DEFAULT_FILTERS, ...JSON.parse(raw) } : DEFAULT_FILTERS;
  } catch {
    return DEFAULT_FILTERS;
  }
}

function persistFilters(filters) {
  try {
    sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Silently ignore — storage quota or private mode
  }
}

/**
 * useUserFilters
 *
 * Manages advanced filter state for the user management screen.
 * - Persists state across navigation via sessionStorage
 * - Exposes computed activeCount for badge display
 * - Provides reset and individual field setters
 */
export function useUserFilters() {
  const [filters, setFilters] = useState(loadPersistedFilters);
  const isFirstRender = useRef(true);

  // Persist whenever filters change (skip first render to avoid redundant write)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    persistFilters(filters);
  }, [filters]);

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    try {
      sessionStorage.removeItem(FILTER_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const activeCount = Object.values(filters).filter(Boolean).length;

  return {
    filters,
    updateFilter,
    clearFilters,
    activeCount,
    hasActiveFilters: activeCount > 0,
  };
}
