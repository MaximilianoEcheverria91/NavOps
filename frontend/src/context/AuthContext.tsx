import React, { createContext, useContext, useState, } from 'react';

type User = {
  name: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 🚀 Inicialización síncrona inmediata: lee el localStorage al vuelo
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('navops_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const logout = () => {
    localStorage.removeItem('navops_user');
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.pathname = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};















  
