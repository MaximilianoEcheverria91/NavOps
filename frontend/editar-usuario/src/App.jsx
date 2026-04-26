import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import EditUsuario from './pages/EditUsuario';
import '../src/styles/variables.css';

/**
 * App
 * Root router. Add ProtectedRoute wrapper when Auth is implemented.
 * Route /usuarios/:id/editar → EditUsuario page.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to demo edit page */}
        <Route path="/" element={<Navigate to="/usuarios/1/editar" replace />} />
        <Route path="/usuarios/:id/editar" element={<EditUsuario />} />
        {/* Add more routes here: /login, /usuarios, /barcos, etc. */}
      </Routes>
    </BrowserRouter>
  );
}
