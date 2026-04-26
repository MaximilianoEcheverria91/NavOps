import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api/apiClient';
import db from '../db/navopsDB';

// ── Auth Context ──────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

const TOKEN_KEY = 'navops_token';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [roles, setRoles]     = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // Decode payload (JWT is base64 – no verification here, backend validates)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser(payload.sub || payload.user);
          setRoles(payload.roles || []);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  // ── Online login ─────────────────────────────────────────────────────────
  async function login(username, password) {
    if (navigator.onLine) {
      const { data } = await apiClient.post('/auth/login', { username, password });
      localStorage.setItem(TOKEN_KEY, data.token);

      // Persist session for offline login
      await db.auth_session.put({
        id: 'current',
        token: data.token,
        user: data.user,
        expiresAt: data.expiresAt,
      });

      setUser(data.user);
      setRoles(data.roles || []);
      return true;
    }

    // ── Offline login: validate against persisted session ──────────────────
    const session = await db.auth_session.get('current');
    if (session && session.expiresAt > Date.now()) {
      setUser(session.user);
      return true;
    }
    throw new Error('Sin conexión y sin sesión previa guardada.');
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setRoles([]);
  }

  const value = { user, roles, loading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
