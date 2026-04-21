import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Hidratación inicial (clave offline-first)
  useEffect(() => {
    const storedUser = localStorage.getItem('navops_user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('navops_user');
    localStorage.removeItem('auth_token');

    setUser(null);

    // ⚠️ mejor que window.location
    window.location.pathname = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};