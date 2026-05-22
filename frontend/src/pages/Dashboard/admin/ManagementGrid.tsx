import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ship, Anchor, ChevronRight } from 'lucide-react';
import styles from './ManagementGrid.module.css';
import { getDashboardStats, getUserStatusCount } from '../../../services/api/dashboardService';
import type { UserStatusCountResponse } from '../../../types/dashboard';

export const ManagementGrid: React.FC = () => {

  type DashboardStats = {
    totalUsers: number;
  };

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userStatusStats, setUserStatusStats] = useState<UserStatusCountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, statusData] = await Promise.all([
          getDashboardStats(),
          getUserStatusCount()
        ]);
        setStats(data);
        setUserStatusStats(statusData);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
    

  const managers = [
    { 
      title: 'Gestión de Usuarios', 
      desc: 'Administrar Usuarios y Permisos', 
      count: userStatusStats?.total ?? 0, 
      loading,  
      icon: <User />, 
      link: '/usuarios' 
    },
    { 
      title: 'Gestión de Barcos', 
      desc: 'Administrar Flota y Embarcaciones', 
      value: '—', 
      icon: <Ship />, 
      link: '/barcos' 
    },
    { 
      title: 'Gestión de Puertos', 
      desc: 'Administrar Puertos', 
      value: '—', 
      icon: <Anchor />, 
      link: '/puertos' 
    },
  ];

  return (
    <div className={styles.grid}>
      {managers.map((m, index) => (
        <div key={index} className={styles.managerCard} onClick={() => navigate(m.link)} style={{ cursor: 'pointer' }}>
          <div className={styles.header}>
            <div className={styles.iconContainer}>
               {React.cloneElement(m.icon, { strokeWidth: 1.5, size: 40 })}
            </div>
            {m.count !== undefined ? (
              <div className={styles.countBadge}>{m.loading ? '...' : m.count}</div>
            ) : null}
          </div>
          
          <div className={styles.body}>
            <h3 className={styles.title}>{m.title}</h3>
            <p className={styles.description}>{m.desc}</p>
          </div>

          <button className={styles.footerLink}>
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};