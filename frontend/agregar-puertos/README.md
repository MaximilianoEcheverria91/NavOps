# ⛵ NavOps – Agregar Puerto (PWA Offline-First)

## Instalación

```bash
npm install
cp .env.example .env        # configurar VITE_API_BASE_URL
npm run dev                 # http://localhost:5173/puertos/nuevo
```

## ⚠️ Logo NavOps

Copiá el archivo `LogoElegidoRecort.jpg` dentro de `/public/` con el nombre `logo.jpg`:

```
public/
  logo.jpg        ← LogoElegidoRecort.jpg renombrado
  logo192.png
  logo512.png
  favicon.ico
```

El navbar lo carga automáticamente desde `/logo.jpg`.

## Archivos entregados

| Archivo | Responsabilidad |
|---|---|
| `src/styles/variables.css` | Tokens light + dark |
| `src/db/navopsDB.js` | Dexie v2 con `cached_ports` |
| `src/services/api/apiClient.js` | Axios + JWT |
| `src/services/api/portsService.js` | POST online/offline |
| `src/services/sync/syncEngine.js` | FIFO + backoff |
| `src/hooks/useCreatePort.js` | Validaciones + submit |
| `src/hooks/useTheme.js` | Toggle light/dark |
| `src/pages/AgregarPuerto.jsx` | Página completa |
| `src/pages/AgregarPuerto.module.css` | Estilos duales |

## Características

- ✅ Mapa OSM embebido que se mueve al ingresar lat/lng
- ✅ Upload de foto con preview
- ✅ Validaciones en tiempo real (texto, numérico, lat/lng, email, URL)
- ✅ POST al backend con soporte offline (IndexedDB queue)
- ✅ Sync automático al reconectar
- ✅ Toggle light/dark mode
- ✅ Banner de estado online/offline
- ✅ Toast de éxito/error con badge ⚓ Offline
- ✅ PWA instalable (standalone mode)
