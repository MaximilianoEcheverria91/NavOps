import React, { useEffect, useState } from 'react';
import { Users,Ship, Anchor,Shield } from 'lucide-react';
import { getDashboardStats } from '../../../services/api/dashboardService';
import styles from './StatsGrid.module.css';


export const StatsGrid: React.FC = () => {

  type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
};

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  const cards = [
    { title: 'Total Usuarios', value:stats?.totalUsers ?? 0, 
      active: `${stats?.activeUsers ?? 0} Disponibles`,
      icon: <Users /> },
    { title: 'Total Barcos', value: '—',  icon: <Ship /> },
    { title: 'Total Puertos', value: '—', icon: <Anchor /> },
    { title: 'Roles de administrador', value: '—', icon: <Shield /> },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.activeBadge}>{card.active}</div>
          <div className={styles.iconWrapper} style={{ color: '#38bdf8' }}>
            {React.cloneElement(card.icon, { strokeWidth: 1.5, size: 40 })}
          </div>
          <div className={styles.info}>
            <h3 className={styles.cardValue}>{loading ? '...' : card.value}</h3>
            <p className={styles.cardTitle}>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};