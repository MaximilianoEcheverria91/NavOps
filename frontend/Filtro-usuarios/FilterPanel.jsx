import { useState, useRef, useEffect, useCallback } from "react";
import { ESTADOS, CARGOS_FALLBACK, ANTIGUEDAD_RANGES, EDAD_RANGES } from "../../constants/filters";
import styles from "./FilterPanel.module.css";

/**
 * FilterPanel
 *
 * Dropdown panel with advanced filter controls.
 * Closes on outside click and Escape key.
 * Fully keyboard-navigable for accessibility.
 *
 * Props:
 *  - filters        {object}   Current filter state
 *  - updateFilter   {fn}       (field, value) => void
 *  - clearFilters   {fn}       () => void
 *  - activeCount    {number}   Number of active filters (for badge)
 *  - cargos         {string[]} Available cargo options (from API or fallback)
 */
export function FilterPanel({ filters, updateFilter, clearFilters, activeCount, cargos = CARGOS_FALLBACK }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        closePanel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closePanel]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closePanel]);

  const handleRangeChange = useCallback((field, rangeValue, ranges) => {
    const range = ranges.find((r) => r.value === rangeValue);
    if (range) {
      updateFilter(`${field}Min`, String(range.min));
      updateFilter(`${field}Max`, String(range.max));
    } else {
      updateFilter(`${field}Min`, "");
      updateFilter(`${field}Max`, "");
    }
  }, [updateFilter]);

  const getActiveRange = useCallback((field, ranges) => {
    const minKey = `${field}Min`;
    const maxKey = `${field}Max`;
    const activeRange = ranges.find(
      (r) => String(r.min) === filters[minKey] && String(r.max) === filters[maxKey]
    );
    return activeRange?.value || "";
  }, [filters]);

  return (
    <div className={styles.wrapper}>
      {/* ── Trigger button ───────────────────────────────────────── */}
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isOpen ? styles.triggerActive : ""} ${activeCount > 0 ? styles.triggerFiltered : ""}`}
        onClick={togglePanel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Filtros${activeCount > 0 ? `, ${activeCount} activos` : ""}`}
      >
        <FilterIcon />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className={styles.badge} aria-label={`${activeCount} filtros activos`}>
            {activeCount}
          </span>
        )}
        <ChevronIcon isOpen={isOpen} />
      </button>

      {/* ── Dropdown panel ───────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-label="Filtros avanzados de usuarios"
        >
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Filtros avanzados</span>
            {activeCount > 0 && (
              <button
                className={styles.clearBtn}
                onClick={clearFilters}
                aria-label="Limpiar todos los filtros"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className={styles.fields}>
            {/* Cargo */}
            <FilterField label="Cargo" htmlFor="filter-cargo">
              <select
                id="filter-cargo"
                className={styles.select}
                value={filters.cargo}
                onChange={(e) => updateFilter("cargo", e.target.value)}
              >
                <option value="">Todos los cargos</option>
                {cargos.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FilterField>

            {/* Estado */}
            <FilterField label="Estado" htmlFor="filter-estado">
              <div className={styles.chipGroup} role="group" aria-label="Estado del usuario">
                <Chip
                  active={filters.estado === ""}
                  onClick={() => updateFilter("estado", "")}
                  label="Todos"
                />
                {ESTADOS.map((e) => (
                  <Chip
                    key={e.value}
                    active={filters.estado === e.value}
                    onClick={() => updateFilter("estado", e.value)}
                    label={e.label}
                    statusDot={e.value}
                  />
                ))}
              </div>
            </FilterField>

            {/* Antigüedad */}
            <FilterField label="Antigüedad" htmlFor="filter-antiguedad">
              <div className={styles.chipGroup} role="group" aria-label="Rango de antigüedad">
                <Chip
                  active={getActiveRange("antiguedad", ANTIGUEDAD_RANGES) === ""}
                  onClick={() => handleRangeChange("antiguedad", "", ANTIGUEDAD_RANGES)}
                  label="Cualquiera"
                />
                {ANTIGUEDAD_RANGES.map((r) => (
                  <Chip
                    key={r.value}
                    active={getActiveRange("antiguedad", ANTIGUEDAD_RANGES) === r.value}
                    onClick={() => handleRangeChange("antiguedad", r.value, ANTIGUEDAD_RANGES)}
                    label={r.label}
                  />
                ))}
              </div>
            </FilterField>

            {/* Edad */}
            <FilterField label="Edad" htmlFor="filter-edad">
              <div className={styles.chipGroup} role="group" aria-label="Rango de edad">
                <Chip
                  active={getActiveRange("edad", EDAD_RANGES) === ""}
                  onClick={() => handleRangeChange("edad", "", EDAD_RANGES)}
                  label="Cualquiera"
                />
                {EDAD_RANGES.map((r) => (
                  <Chip
                    key={r.value}
                    active={getActiveRange("edad", EDAD_RANGES) === r.value}
                    onClick={() => handleRangeChange("edad", r.value, EDAD_RANGES)}
                    label={r.label}
                  />
                ))}
              </div>
            </FilterField>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterField({ label, htmlFor, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

function Chip({ active, onClick, label, statusDot }) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.chipActive : ""}`}
      onClick={onClick}
      aria-pressed={active}
      type="button"
    >
      {statusDot && <span className={`${styles.dot} ${styles[`dot_${statusDot}`]}`} aria-hidden="true" />}
      {label}
    </button>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M1 3h13M3 7.5h9M5.5 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ isOpen }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
