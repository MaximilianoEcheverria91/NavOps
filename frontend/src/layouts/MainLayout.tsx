// src/layouts/MainLayout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Ship, Anchor, Bell, Sun, Wifi, Moon, Menu, X, Navigation as NavigationIcon, Package, User as UserIcon, LogOut } from 'lucide-react';
import styles from './MainLayout.module.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
// 🔥 IMPORTAMOS TU COMPONENTE DE MODAL DE CONFIRMACIÓN
import { ConfirmModal } from '../components/ui/ConfirmModal/ConfirmModal'; 

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // 🔥 ESTADO PARA MOSTRAR/OCULTAR EL MODAL DE LOGOUT
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // src/layouts/MainLayout.tsx
  // Bloquear de forma activa el botón de atrás del navegador dentro de la app
  useEffect(() => {
    // Inyectamos un estado ficticio en el historial del navegador
    window.history.pushState(null, '', window.location.href);
    
    const handlePopState = (e: PopStateEvent) => {
      // Cuando el usuario le da a la flecha "Atrás", volvemos a empujar la URL actual
      // bloqueando la salida y forzándolo a usar el ConfirmModal de cerrar sesión
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
                <span className={`${styles.link}`} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  <LayoutDashboard size={18}/> Dashboard
                </span>
                <NavLink to="/navigation/menu" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <NavigationIcon size={18} style={{ transform: 'rotate(45deg)' }}/> Navegación
                </NavLink>
                <NavLink to="/viajes" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Ship size={18}/> Viajes
                </NavLink>
                <NavLink to="/carga" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                  <Package size={18}/> Carga
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
                
                {/* 🔥 AL HACER CLICK ACÁ AHORA SOLO ACTIVAMOS EL MODAL ESTÉTICO */}
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

      {/* 🔥 CONTROL DEL MODAL DE CONFIRMACIÓN PERSONALIZADO */}
      {showLogoutConfirm && (
        <ConfirmModal
          isOpen={showLogoutConfirm} // Por si tu modal requiere el flag de apertura
          title="Cerrar Sesión"
          description="¿Estás seguro de que querés cerrar sesión en NavOps?" // 🔥 Cambiado de 'message' a 'description'
          onConfirm={() => {
            setShowLogoutConfirm(false);
            logout(); // Ejecuta la limpieza de tokens
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
};