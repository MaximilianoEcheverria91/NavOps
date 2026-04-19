import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { name: string; role: string } | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('navops_role');
    const token = localStorage.getItem('auth_token');
    if (token && role) {
      // Aquí podrías decodificar el JWT para sacar el nombre real
      setUser({ name: 'Capitán Martinez', role }); 
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};