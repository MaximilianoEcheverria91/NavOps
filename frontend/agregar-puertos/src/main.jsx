import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AgregarPuerto from './pages/AgregarPuerto';
import './styles/variables.css';
import './styles/index.css';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ onOfflineReady() { console.info('[PWA] Ready for offline use.'); } });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/puertos/nuevo" replace />} />
        <Route path="/puertos/nuevo" element={<AgregarPuerto />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
