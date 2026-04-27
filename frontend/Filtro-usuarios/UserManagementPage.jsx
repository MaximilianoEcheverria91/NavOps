import { useCallback, useMemo } from "react";
import { useUserFilters } from "../hooks/useUserFilters";
import { useUsers } from "../hooks/useUsers";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { FilterPanel } from "../components/ui/FilterPanel";
import { UserCard } from "../components/ui/UserCard";
import { CARGOS_FALLBACK } from "../constants/filters";

/**
 * UserManagementPage
 *
 * Main screen for managing maritime crew members.
 * Integrates offline-first data loading with advanced client-side filtering.
 */
export default function UserManagementPage() {
  const { isOnline } = useNetworkStatus();
  const { filters, updateFilter, clearFilters, activeCount, hasActiveFilters } = useUserFilters();
  const { users, totalUsers, isLoading, isSyncing, isStale, error, refresh } = useUsers(filters);

  const handleView = useCallback((user) => {
    // Navigate to user detail — replace with useNavigate in real app
    console.info("[UserManagementPage] View user:", user.id);
  }, []);

  const handleEdit = useCallback((user) => {
    console.info("[UserManagementPage] Edit user:", user.id);
  }, []);

  const handleDelete = useCallback((user) => {
    console.info("[UserManagementPage] Delete user:", user.id);
  }, []);

  // Derive summary text
  const resultSummary = useMemo(() => {
    if (isLoading) return null;
    if (hasActiveFilters) return `${users.length} de ${totalUsers} usuarios`;
    return `${totalUsers} usuarios`;
  }, [isLoading, hasActiveFilters, users.length, totalUsers]);

  return (
    <main
      className="min-h-screen p-6"
      style={{ background: "var(--color-bg)", fontFamily: "var(--font-sans)" }}
    >
      {/* ── Page header ────────────────────────────────────────── */}
      <header className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              Gestión de Usuarios
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-accent)" }}>
              Bienvenido al sistema de gestión y Navegación
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-accent)", color: "#fff" }}
            aria-label="Agregar nuevo usuario"
          >
            <span aria-hidden="true">👤+</span>
            Nuevo usuario
          </button>
        </div>

        {/* ── Status banners ─────────────────────────────────── */}
        {!isOnline && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
            style={{ background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}
          >
            <span aria-hidden="true">📡</span>
            <span>Sin conexión — mostrando datos en caché local.</span>
          </div>
        )}
        {isOnline && isStale && (
          <div
            role="status"
            className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
            style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)", border: "1px solid var(--color-border)" }}
          >
            <span aria-hidden="true">🔄</span>
            <span>Datos desactualizados.</span>
            <button
              onClick={refresh}
              className="underline font-medium ml-1"
              style={{ color: "var(--color-accent)" }}
            >
              Actualizar
            </button>
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm"
            style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA" }}
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </header>

      {/* ── Toolbar: search + filter ────────────────────────── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "var(--color-text-muted)" }}
            aria-hidden="true"
          >
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar usuario..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
            style={{
              background: "var(--color-surface)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text-primary)",
              outline: "none",
            }}
            aria-label="Buscar usuario por nombre o legajo"
          />
        </div>

        {/* Filter panel trigger */}
        <FilterPanel
          filters={filters}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
          activeCount={activeCount}
          cargos={CARGOS_FALLBACK}
        />

        {/* Sync spinner */}
        {isSyncing && (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
            aria-live="polite"
            aria-label="Sincronizando con el servidor"
          >
            Sincronizando…
          </span>
        )}
      </div>

      {/* ── Result summary + clear filters ─────────────────── */}
      {resultSummary && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }} aria-live="polite">
            {resultSummary}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium"
              style={{ color: "var(--color-accent)", textDecoration: "underline" }}
              aria-label="Limpiar todos los filtros activos"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* ── User grid ──────────────────────────────────────── */}
      {isLoading ? (
        <UserGridSkeleton />
      ) : users.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} onClear={clearFilters} />
      ) : (
        <ul
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          aria-label="Lista de usuarios"
        >
          {users.map((user) => (
            <li key={user.id}>
              <UserCard
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="mt-10 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
        Sistema de Gestión Marítima V.1
      </footer>
    </main>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function UserGridSkeleton() {
  return (
    <ul
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      aria-label="Cargando usuarios"
      aria-busy="true"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="h-44 rounded-xl animate-pulse"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        />
      ))}
    </ul>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-4xl mb-4" aria-hidden="true">🔍</span>
      <p className="text-base font-medium" style={{ color: "var(--color-text-primary)" }}>
        {hasFilters ? "Ningún usuario coincide con los filtros aplicados" : "No hay usuarios registrados"}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
