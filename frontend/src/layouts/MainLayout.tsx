import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Ship, Anchor, Bell, Sun, Wifi, Moon, Menu, X } from 'lucide-react';
import styles from './MainLayout.module.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              <LayoutDashboard size={18}/> Dashboard
            </NavLink>
            <NavLink 
              to="/usuarios" 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              <Users size={18}/> Usuarios
            </NavLink>
            <NavLink 
              to="/barcos" 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              <Ship size={18}/> Barcos
            </NavLink>
            <NavLink 
              to="/puertos" 
              className={({ isActive }) => isActive ? styles.activeLink : styles.link}
            >
              <Anchor size={18}/> Puertos
            </NavLink>
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
          
          <div className={styles.userProfile} onClick={logout}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                className={styles.userSvg}
                viewBox="0 0 24 24"
                fill="currentColor">
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>
            <div className={styles.userInfoText}>
              <p className={styles.userName}>{user?.name || 'Usuario'}</p>
              <p className={styles.userRole}>{user?.role || 'Rol'}</p>
            </div>
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
    </div>
  );
};