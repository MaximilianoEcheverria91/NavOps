import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// ── Register PWA Service Worker ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() {
        // Optional: show a "New version available" toast to the user
        console.info('[PWA] New content available, please refresh.');
      },
      onOfflineReady() {
        console.info('[PWA] App ready for offline use.');
      },
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
