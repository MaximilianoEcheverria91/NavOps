export const FILTER_STORAGE_KEY = "navops_user_filters";

export const ESTADOS = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
  { value: "suspendido", label: "Suspendido" },
];

// Static cargo list used as fallback when API is unavailable offline
export const CARGOS_FALLBACK = [
  "Capitán",
  "Primer Oficial",
  "Oficial de Navegación",
  "Jefe de Navegación",
  "Jefe de Operaciones",
  "Capitán de Altura",
  "Ingeniería Naval",
  "Jefe de Máquinas",
  "Oficial Médico",
  "Ingeniero Electrónico",
  "Contramaestre",
  "Radio Operador",
  "Gestión de Carga",
];

export const ANTIGUEDAD_RANGES = [
  { value: "0-3", label: "0 – 3 años", min: 0, max: 3 },
  { value: "4-7", label: "4 – 7 años", min: 4, max: 7 },
  { value: "8-12", label: "8 – 12 años", min: 8, max: 12 },
  { value: "13+", label: "13+ años", min: 13, max: 99 },
];

export const EDAD_RANGES = [
  { value: "18-30", label: "18 – 30 años", min: 18, max: 30 },
  { value: "31-45", label: "31 – 45 años", min: 31, max: 45 },
  { value: "46-60", label: "46 – 60 años", min: 46, max: 60 },
  { value: "61+", label: "61+ años", min: 61, max: 99 },
];
