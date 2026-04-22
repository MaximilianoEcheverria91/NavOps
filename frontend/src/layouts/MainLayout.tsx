import React from 'react';
import { LayoutDashboard, Users, Ship, Anchor, Bell, Sun, Wifi, Moon } from 'lucide-react';
import styles from './MainLayout.module.css';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';


export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <img src={logo} alt="NavOps" className={styles.logo} />
          <span style={{ fontSize: '1.5rem'}} >NavOps</span>
        </div>

        <div className={styles.navLinks}>
          <button className={styles.activeLink}><LayoutDashboard size={18}/> Dashboard</button>
          <button className={styles.link}><Users size={18}/> Usuarios</button>
          <button className={styles.link}><Ship size={18}/> Barcos</button>
          <button className={styles.link}><Anchor size={18}/> Puertos</button>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle} onClick={toggleTheme} aria-label="Alternar tema" style={{ color: 'var(--color-theme)' }}>
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <div className={styles.statusBadge}>
            <Wifi size={14}  /> <span>Conectado</span>
          </div>
          <Bell size={20} style={{ cursor: 'pointer', color: 'var(--color-icon-notifict)', }} />
          
          <div className={styles.userProfile} onClick={logout} style={{ cursor: 'pointer'}}>
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  color='#38bdf8'
                  viewBox="0 0 24 24"
                  fill="currentColor">
              <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>
            <div className="hidden md:block text-left">
              <p style={{ fontSize: '0.85rem', fontWeight: 'lighter', margin: 0 }}><p>{user?.name || 'Usuario'}</p></p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}><p>{user?.role || 'Rol'}</p></p>
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};