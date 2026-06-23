import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Moon, Sun, Ship, EyeOff, Eye } from 'lucide-react';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';
import navopsLogo from '../../assets/logo.png';
import { apiClient } from '../../api/apiClient';


// Usaremos un componente SVG inline simple para Google ya que lucide-react no tiene logo oficial de Google a color.
const GoogleIcon = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export const Login: React.FC = () => {
 
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const isFormValid = username.trim() !== '' && password.trim() !== '';
  const [imgError, setImgError] = useState(false);
  const logoPath = navopsLogo;

  // src/pages/Login/Login.tsx
  const { user, loading } = useAuth(); // 🔥 Asegurate de extraer 'user' y 'loading' aquí también

  // 🛡️ GUARDIÁN INVERSO: Si el usuario ya está autenticado e intenta volver al Login 
  // (ya sea tipeando la URL o usando las flechas del navegador), lo mandamos de patitas a su Dashboard.
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'CHIEF_NAVIGATION') {
        navigate('/navigation/menu', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) return;

    setIsLoading(true);
    setGlobalError('');

    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const data = response.data;

      if (!data?.token) {
        throw new Error('No se recibió token del servidor.');
      }

      // 1. Guardamos el token primero (Es vital para que el interceptor lo use)
      localStorage.setItem('auth_token', data.token);

      // 2. 🔥 LE PEGAMOS AL ENDPOINT DE PERFIL EN TIEMPO REAL
      // Usamos el apiClient que ya tiene el token inyectado gracias al interceptor
      const profileResponse = await apiClient.get('/auth/profile');
      const profileData = profileResponse.data;

      // Helper rápido para traducir roles en el Login
      const translateRole = (r: string): string => {
        if (r === 'ADMIN') return 'Administrador';
        if (r === 'CHIEF_NAVIGATION') return 'Jefe de Navegación';
        if (r === 'CHIEF_OPERATION') return 'Jefe de Operaciones';
        return r;
      };

      // 3. Hidratamos el estado global con el formato exacto que espera MainLayout
      const extendedUserData = {
        name: profileData.fullName,
        surname: profileData.surname || '',
        role: profileData.role,
        avatarUrl: profileData.avatarUrl || '',
        fullName: `${profileData.fullName} ${profileData.surname || ''}`.trim(),
        roleLabel: translateRole(profileData.role)
      };

      // Guardamos en localStorage por persistencia
      localStorage.setItem('navops_user', JSON.stringify(extendedUserData));

      // Asignamos al contexto global (Gatilla el renderizado limpio)
      setUser(extendedUserData);

      // 4. Redirección limpia borrando el historial (No pueden volver atrás con las flechas)
      if (profileData.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (profileData.role === 'CHIEF_NAVIGATION') {
        navigate('/navigation/menu', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err: any) {
      console.error("Error en el flujo de Login:", err);
      // Limpiamos residuos por seguridad si falla la sincronización de perfil
      localStorage.removeItem('auth_token');
      localStorage.removeItem('navops_user');
      
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Error de red. Asegúrate que el servidor esté en línea.';

      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Botón superior de Theme */}
      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Alternar tema"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Tarjeta Glassmorfismo Formulario */}
      <div className={styles.card}>
        <div className={styles.header}>
          {!imgError ? (
            <img
              src={logoPath}
              alt="NavOps Logo"
              className={styles.logoImage}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.logoPlaceholder}>
              <Ship size={64} strokeWidth={1.5} />
            </div>
          )}

          <h1 className={styles.title}>NavOps</h1>
          <h2 className={styles.subtitle}>Control de Navegación y Logística</h2>
        </div>

        {globalError && (
          <div className={styles.globalError}>
            {globalError}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Usuario"
            placeholder="Ingresa tu Usuario"
            icon={<User size={18} />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />

          {/* 🔥 ENVOLVEMOS EL INPUT Y EL BOTÓN EN UN CONTENEDOR RELATIVO */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder="Ingresa tu Contraseña"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            
            {/* 🔥 EL BOTÓN AHORA SÍ SE POSICIONA PERFECTAMENTE A LA DERECHA DEL COMPONENTE */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '12px', // Lo cambié a bottom para que se alinee con el input sin importar el alto del label
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#38bdf8', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                zIndex: 10
              }}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
            
          <span className={styles.forgotPassword} onClick={() => navigate('/forgot-password')}
              style={{ cursor: 'pointer', padding: 4, color: 'var(--item_stan)' }}> ¿Olvidaste tu contraseña?</span>

          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid}
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>

          <div style={{ height: '12px' }} />

          <Button
            type="button"
            variant="outline"
            className={theme === 'light' ? styles.lightModeOverride : undefined}
            onClick={() => {/* Lógica Google Oauth futura */ }}
            disabled={isLoading}
            icon={<span className={styles.googleIcon}><GoogleIcon /></span>}
          >
            Iniciar sesión con Google
          </Button>
        </form>
      </div>

      <div className={styles.footer}>
        Sistema de Gestión Marítima V.1
      </div>
    </div>
  );
};
