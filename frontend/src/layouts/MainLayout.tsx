// src/layouts/MainLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Ship, Anchor, Bell, Sun, Wifi, Moon, Menu, X, Navigation as NavigationIcon, Package, User as UserIcon, LogOut, History } from 'lucide-react';
import styles from './MainLayout.module.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { ConfirmModal } from '../components/ui/ConfirmModal/ConfirmModal'; 

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🚀 ESTADO DETECTOR: Verifica si el capitán tiene un plan de viaje activo/iniciado
  const [hasActiveVoyage, setHasActiveVoyage] = useState<boolean>(false);

  useEffect(() => {
    // Buscamos si existe algún residuo o marca de sesión de viaje activo (en curso)
    const activeUser = localStorage.getItem('navops_user');
    // También podés checkear si hay un flag específico guardado al darle "Iniciar"
    // Por ejemplo: const activePlan = localStorage.getItem('active_travel_plan_id');
    
    // Dejamos una validación genérica. Si querés que dependa de una clave exacta, cambiala acá:
    const checkActivePlan = localStorage.getItem('auth_token') !== null; 
    setHasActiveVoyage(checkActivePlan); // Cambiar por tu flag real de viaje en curso si es necesario
  }, []);

  // Bloquear de forma activa el botón de atrás del navegador dentro de la app
  // Bloquear de forma activa el botón de atrás del navegador dentro de la app
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = (e: PopStateEvent) => {
      // ✅ CORREGIDO: Eliminado el 'history' duplicado
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Cerrar el dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.wrapper}>
      <nav className={`${styles.navbar} ${isMobileMenuOpen ? styles.navbarOpen : ''}`}>
        
        <div className={styles.logoArea}>
          <img src={logo} alt="NavOps" className={styles.logo} />
          <span className={styles.logoText}>NavOps</span>
        </div>

        <div className={`${styles.menuContainer} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.statusBadgeMobile}>
            <Wifi size={14} /> <span>Conectado</span>
          </div>

          <div className={styles.navLinks}>
            {user?.role === 'ADMIN' && (
              <>
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <LayoutDashboard size={18}/> Dashboard
                </NavLink>
                <NavLink to="/usuarios" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Users size={18}/> Usuarios
                </NavLink>
                <NavLink to="/barcos" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Ship size={18}/> Barcos
                </NavLink>
                <NavLink to="/puertos" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Anchor size={18}/> Puertos
                </NavLink>
              </>
            )}

            {user?.role === 'CHIEF_NAVIGATION' && (
              <>
                {/* 📊 DASHBOARD DINÁMICO: Se habilita sólo si hasActiveVoyage es true */}
                {hasActiveVoyage ? (
                  <NavLink to="/navigation/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    <LayoutDashboard size={18}/> Dashboard
                  </NavLink>
                ) : (
                  <span className={`${styles.link}`} style={{ opacity: 0.4, cursor: 'not-allowed' }} title="Disponible sólo con un viaje en curso">
                    <LayoutDashboard size={18}/> Dashboard
                  </span>
                )}

                <NavLink to="/navigation/menu" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <NavigationIcon size={18} style={{ transform: 'rotate(45deg)' }}/> Navegación
                </NavLink>

                {/* 🚢 1) VIAJES: Redirige a la lista de travesías */}
                <NavLink to="/navigation/travel-plans" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Ship size={18}/> Viajes
                </NavLink>

                {/* 🕒 2) HISTORIAL: Redirige a tu nueva pantalla de historial histórico */}
                <NavLink to="/navigation/history" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <History size={18}/> Historial
                </NavLink>
              </>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Alternar tema">
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          <div className={styles.statusBadgeDesktopTablet}>
            <Wifi size={14} /> <span>Conectado</span>
          </div>
          
          <div className={styles.bellContainer}>
            <Bell size={20} />
          </div>
          
          <div className={styles.userProfileContainer} ref={dropdownRef}>
            <div className={styles.userProfile} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className={styles.userAvatar} />
              ) : (
                <UserIcon size={30} className={styles.userSvg} />
              )}
              <div className={styles.userInfoText}>
                <p className={styles.userName}>{user?.fullName || 'Usuario'}</p>
                <p className={styles.userRole}>{user?.roleLabel || 'Rol'}</p>
              </div>
            </div>

            {isProfileMenuOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownHeader}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className={styles.dropdownAvatar} />
                  ) : (
                    <UserIcon size={40} className={styles.dropdownSvg} />
                  )}
                  <div className={styles.dropdownHeaderText}>
                    <p className={styles.dropdownName}>{user?.fullName}</p>
                    <p className={styles.dropdownRole}>{user?.roleLabel}</p>
                  </div>
                </div>
                
                <div className={styles.dropdownDivider} />
                
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/perfil');
                  }}
                >
                  <UserIcon size={18} className={styles.dropdownSvg} />
                  <span>Perfil</span>
                </button>
                
                <div className={styles.dropdownDivider} />
                
                <button 
                  className={styles.dropdownItem} 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setShowLogoutConfirm(true); 
                  }}
                >
                  <LogOut size={18} style={{ color: '#e74c3c' }} />
                  <span style={{ color: '#e74c3c' }}>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>

          <button 
            className={styles.menuButton} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        {children}
      </main>

      {showLogoutConfirm && (
        <ConfirmModal
          isOpen={showLogoutConfirm} 
          title="Cerrar Sesión"
          description="¿Estás seguro de que querés cerrar sesión en NavOps?" 
          onConfirm={() => {
            setShowLogoutConfirm(false);
            logout(); 
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
};