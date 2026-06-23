import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

type User = {
  name: string;
  surname: string;
  role: string;
  avatarUrl: string;
  fullName: string;
  roleLabel: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // 🔥 Mantenemos el loading en true firme al inicio
  const [loading, setLoading] = useState(true); 

  const translateRole = (role: string): string => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'CHIEF_NAVIGATION': return 'Jefe de Navegación';
      case 'CHIEF_OPERATION': return 'Jefe de Operaciones';
      default: return role;
    }
  };

  const fetchProfile = async () => {
    try {
      // Inyectamos manualmente el token por seguridad en el F5 para evitar que falle el interceptor por carrera de tiempos
      const token = localStorage.getItem('auth_token');
      
      const res = await apiClient.get('/auth/profile', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const data = res.data;
      
      const refreshedUser = {
        name: data.fullName,
        surname: data.surname || '',
        role: data.role,
        avatarUrl: data.avatarUrl || '',
        fullName: `${data.fullName} ${data.surname || ''}`.trim(),
        roleLabel: translateRole(data.role)
      };

      // Actualizamos storage y estado con datos frescos del backend
      localStorage.setItem('navops_user', JSON.stringify(refreshedUser));
      setUser(refreshedUser);
    } catch (error) {
      console.error('Error al hidratar el perfil del usuario en F5:', error);
      // Solo si el servidor da un error real de credenciales (token expirado), deslogueamos
      localStorage.removeItem('auth_token');
      localStorage.removeItem('navops_user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al arrancar la app o recargar (F5)
  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const localUser = localStorage.getItem('navops_user');

      // Si no hay token de ninguna forma, apagamos la carga y al login directo
      if (!token) {
        setLoading(false);
        return;
      }

      // ⚡ HIDRATACIÓN FLASH: Si tenemos la sesión guardada en localStorage, 
      // la metemos al estado inmediatamente. Esto evita que user sea null y previene el rebote.
      if (localUser) {
        try {
          setUser(JSON.parse(localUser));
        } catch (e) {
          console.error("Error parseando navops_user local:", e);
        }
      }

      // Validamos contra el backend de Spring Boot que el token siga siendo válido
      await fetchProfile();
    };

    bootstrapAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('navops_user');
    setUser(null);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {/* Si está cargando el perfil por primera vez y no hay usuario local, congela */}
      {loading && !user ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#04101E', color: 'white' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 300 }}>Sincronizando credenciales de seguridad...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};