import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // 🔥 EXTRAEMOS 'loading' DEL CONTEXTO DE AUTENTICACIÓN
  const { user, loading } = useAuth();

  // 🛑 CRUCIAL: Mientras la API de Spring Boot esté verificando el perfil en un F5,
  // frenamos el renderizado mostrando un spinner para que no te rebote al login.
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#04101E', 
        color: 'white',
        fontFamily: 'inherit'
      }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 300 }}>Verificando sesión segura...</p>
      </div>
    );
  }

  // Si terminó de cargar y no hay ningún usuario en memoria, directo al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario existe pero no tiene el rol requerido para esa ruta
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'CHIEF_NAVIGATION') return <Navigate to="/navigation/menu" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};