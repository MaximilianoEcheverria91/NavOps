import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'logo192.png'],

      // ── Web App Manifest ─────────────────────────────────────────────────
      manifest: {
        name: 'NavOps – Sistema de Gestión Marítima',
        short_name: 'NavOps',
        description: 'Sistema de gestión marítima offline-first',
        theme_color: '#57B8F4',
        background_color: '#F8FBFD',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'logo192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo512.png', sizes: '512x512', type: 'image/png' },
          { src: 'logo512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      // ── Workbox runtime caching strategies ───────────────────────────────
      workbox: {
        // Precache all built assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        runtimeCaching: [
          // API GET → stale-while-revalidate (serve cache, refresh in bg)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Static assets → cache-first
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],

        // Background Sync for failed PUT/POST requests
        backgroundSync: {
          name: 'navops-sync-queue',
          options: { maxRetentionTime: 24 * 60 }, // 24 hours
        },
      },
    }),
  ],

  server: {
    port: 5173,
    // Proxy API calls to Spring Boot backend in dev
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
