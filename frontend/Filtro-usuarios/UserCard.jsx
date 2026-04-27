/**
 * UserCard
 *
 * Displays a single user's info in the grid.
 * Matches the card layout shown in the design mockup.
 *
 * Props:
 *  - user {object} User data from API/cache
 *  - onView   {fn}  Navigate to user detail
 *  - onEdit   {fn}  Open edit modal
 *  - onDelete {fn}  Confirm and delete
 */
export function UserCard({ user, onView, onEdit, onDelete }) {
  const statusColor = {
    activo:     "var(--color-success)",
    inactivo:   "var(--color-text-muted)",
    suspendido: "var(--color-warning)",
  }[user.estado] || "var(--color-text-muted)";

  return (
    <article
      className="relative flex flex-col gap-3 p-4 rounded-xl border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        transition: "box-shadow var(--transition-fast)",
      }}
      aria-label={`Usuario ${user.nombre}`}
    >
      {/* ── Avatar + Info ─────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatarUrl || "/assets/avatar-placeholder.png"}
            alt={`Avatar de ${user.nombre}`}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
          {/* Status indicator dot */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{
              background: statusColor,
              borderColor: "var(--color-surface)",
            }}
            aria-label={`Estado: ${user.estado}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
            {user.nombre}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--color-accent)" }}>
            {user.cargo}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            Legajo: {user.legajo}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {user.antiguedad} {user.antiguedad === 1 ? "año" : "años"}
          </p>
        </div>
      </div>

      {/* ── Tags ─────────────────────────────────────────────── */}
      {user.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Especialidades">
          {user.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                background: "var(--color-accent-muted)",
                color: "var(--color-accent)",
              }}
            >
              {tag}
            </span>
          ))}
          {user.tags.length > 3 && (
            <span
              className="px-2 py-0.5 rounded-md text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              +{user.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-1 border-t" style={{ borderColor: "var(--color-border-subtle)" }}>
        <button
          className="flex-1 text-xs font-medium py-1.5 rounded-md transition-colors"
          style={{ color: "var(--color-accent)", background: "var(--color-accent-muted)" }}
          onClick={() => onView?.(user)}
          aria-label={`Ver detalle de ${user.nombre}`}
        >
          Ver detalle
        </button>
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onClick={() => onEdit?.(user)}
          aria-label={`Editar ${user.nombre}`}
        >
          <PencilIcon />
        </button>
        <button
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "var(--color-error)" }}
          onClick={() => onDelete?.(user)}
          aria-label={`Eliminar ${user.nombre}`}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10 2L12 4L5 11H3V9L10 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 4h10M5 4V3h4v1M6 7v3M8 7v3M3 4l.7 7.3A1 1 0 003.7 12h6.6a1 1 0 001-.7L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
