import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute
 * Redirects to /login if user is not authenticated.
 * Optionally checks for a required role.
 *
 * Usage:
 *   <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
 *     <Route path="/usuarios/:id/editar" element={<EditUsuario />} />
 *   </Route>
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Wait for session restore

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !roles.includes(requiredRole)) {
    return <Navigate to="/sin-permiso" replace />;
  }

  return children;
}
