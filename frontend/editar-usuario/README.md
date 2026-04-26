# ⛵ NavOps – Sistema de Gestión Marítima

PWA Offline-First para gestión de personal y operaciones marítimas.
Diseñada para funcionar en entornos de conectividad hostil (alta mar).

---

## Stack Tecnológico

| Capa            | Tecnología                        |
|-----------------|-----------------------------------|
| UI              | React 18 + Vite                   |
| Estilos         | Tailwind CSS + CSS Variables + CSS Modules |
| Routing         | React Router v6                   |
| HTTP Client     | Axios (con interceptores JWT)     |
| Base local      | IndexedDB via Dexie.js            |
| PWA / SW        | Workbox (vite-plugin-pwa)         |
| Backend         | Spring Boot (API REST, JWT Auth)  |

---

## Estructura de carpetas

```
src/
├── assets/                  # Imágenes, íconos estáticos
├── components/
│   ├── ui/
│   │   ├── FormField.jsx    # Input/Select reutilizable con validación
│   │   ├── PhotoUploader.jsx# Carga de imagen con preview circular
│   │   ├── SectionBlock.jsx # Bloque de sección con punto indicador
│   │   └── NetworkBanner.jsx# Banner online/offline/syncing
│   └── layout/
├── pages/
│   └── EditUsuario.jsx      # Página principal de edición
├── hooks/
│   ├── useEditUser.js       # Lógica completa de edición + validaciones
│   └── useNetworkStatus.js  # Detecta online/offline en tiempo real
├── context/
│   └── AuthContext.jsx      # JWT Auth + offline session support
├── services/
│   ├── api/
│   │   ├── apiClient.js     # Axios instance + interceptores
│   │   └── usersService.js  # GET/PUT con fallback offline
│   └── sync/
│       └── syncEngine.js    # Motor FIFO + retry con backoff
├── db/
│   └── navopsDB.js          # Dexie schema (IndexedDB)
├── routes/
│   └── ProtectedRoute.jsx   # Guard por JWT + rol
└── styles/
    ├── variables.css         # CSS Design Tokens globales
    └── index.css             # Tailwind + reset global
```

---

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de entorno
cp .env.example .env
# Editar VITE_API_BASE_URL con la URL de tu backend

# 3. Modo desarrollo
npm run dev
# → http://localhost:5173

# 4. Build producción (genera PWA con Service Worker)
npm run build

# 5. Preview del build
npm run preview
```

---

## Variables de entorno

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Arquitectura Offline-First

```
┌─────────────────────────────────────────────────────┐
│                    USUARIO                          │
└────────────────────┬────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │   React UI Layer    │
          │  EditUsuario Page   │
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   useEditUser Hook  │  ← validaciones, estado
          └──────────┬──────────┘
                     │
          ┌──────────▼──────────┐
          │   usersService.js   │
          │  navigator.onLine?  │
          └────┬────────────────┘
               │
    ┌──────────┴──────────────┐
    │ ONLINE                  │ OFFLINE
    ▼                         ▼
┌───────────┐         ┌───────────────────┐
│  Backend  │         │    IndexedDB      │
│  REST API │         │  (Dexie cache +   │
│  PUT /api │         │  pending_ops)     │
└───────────┘         └─────────┬─────────┘
                                │
                     ┌──────────▼──────────┐
                     │   Sync Engine       │
                     │  (on reconnect)     │
                     │  FIFO + backoff     │
                     └─────────────────────┘
```

---

## Escenarios soportados

| Escenario                  | Comportamiento                                      |
|---------------------------|-----------------------------------------------------|
| Online normal             | GET/PUT directo al backend, cache actualizado       |
| Offline al cargar         | Datos desde IndexedDB (si fueron cacheados antes)  |
| Edición sin conexión      | Guardado en `pending_operations` queue              |
| Reconexión                | Sync Engine procesa la cola automáticamente         |
| Conflicto de datos        | Estrategia last-write-wins (backend authority)      |
| JWT expirado offline      | Sesión previa en IndexedDB permite acceso           |

---

## Paleta de colores

| Token             | Hex        | Uso                          |
|-------------------|------------|------------------------------|
| `--color-celeste` | `#57B8F4`  | Primario, bordes, labels     |
| `--color-celeste-light` | `#EDF6FD` | Fondos, superficies   |
| `--color-success` | `#00C853`  | Confirmaciones, online       |
| `--color-danger`  | `#FF0000`  | Errores, botón eliminar      |
| `--color-border`  | `#B7D2E0`  | Bordes, divisores, sombras   |
| `--color-bg`      | `#F8FBFD`  | Fondo general y modal        |
