import React from 'react';
import { LayoutDashboard, Users, Ship, Anchor, Bell, Sun, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Datos mockeados para que no falle buscando el contexto
  const user = { 
    name: 'Capitán Martinez', 
    role: localStorage.getItem('navops_role') || 'Admin' 
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.navbar}>
        <div className={styles.logoArea}>
          <Ship color="#2095D4" />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>NavOps</span>
        </div>

        <div className={styles.navLinks}>
          <button className={styles.activeLink}><LayoutDashboard size={18}/> Dashboard</button>
          <button className={styles.link}><Users size={18}/> Usuarios</button>
          <button className={styles.link}><Ship size={18}/> Barcos</button>
          <button className={styles.link}><Anchor size={18}/> Puertos</button>
        </div>

        <div className={styles.actions}>
          <Sun size={20} style={{ cursor: 'pointer' }} />
          <div className={styles.statusBadge}>
            <Wifi size={14} /> <span>Conectado</span>
          </div>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          
          <div className={styles.userProfile} onClick={logout} style={{ cursor: 'pointer' }}>
            <div className={styles.avatar}>
               <Users size={20} color="#2095D4" />
            </div>
            <div className="hidden md:block text-left">
              <p style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{user.role}</p>
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