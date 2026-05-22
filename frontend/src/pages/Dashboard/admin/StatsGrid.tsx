import React, { useEffect, useState } from 'react';
import { Users, Ship, Anchor, Shield } from 'lucide-react';
import { getDashboardStats, getUserStatusCount, getPortStatusCount,getShipStatusCount } from '../../../services/api/dashboardService';
import type { UserStatusCountResponse, PortStatusCountResponse , ShipStatusCountResponse} from '../../../types/dashboard';
import styles from './StatsGrid.module.css';

export const StatsGrid: React.FC = () => {

  type DashboardStats = {
    totalUsers: number;
    activeUsers: number;
  };

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userStatusStats, setUserStatusStats] = useState<UserStatusCountResponse | null>(null);
  const [portStatusStats, setPortStatusStats] = useState<PortStatusCountResponse | null>(null);
  const [shipStatusStats, setShipStatusStats] = useState<ShipStatusCountResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [data, statusData, portData, shipData] = await Promise.all([
          getDashboardStats(),
          getUserStatusCount(),
          getPortStatusCount(),
          getShipStatusCount()
          
        ]);
        setStats(data);
        setUserStatusStats(statusData);
        setPortStatusStats(portData);
        setShipStatusStats(shipData);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Barcos', value: '—', icon: <Ship /> },
    { title: 'Roles de administrador', value: '—', icon: <Shield /> },
  ];

  return (
    <div className={styles.grid}>
      {/* 1. Card de Usuarios Modificada */}
      <div className={styles.card}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${userStatusStats?.active ?? 0} Activos`}
          </div>
          <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${userStatusStats?.vacation ?? 0} Vacaciones`}
          </div>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${userStatusStats?.medicalLeave ?? 0} Licencia Médica`}
          </div>
          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${userStatusStats?.suspended ?? 0} Suspendidos`}
          </div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${userStatusStats?.inactive ?? 0} Inactivos`}
          </div>
        </div>
        
        <div className={styles.iconWrapper} style={{ color: '#38bdf8' }}>
          <Users strokeWidth={1.5} size={40} />
        </div>
        
        <div className={styles.info}>
          <h3 className={styles.cardValue}>
            {loading ? '...' : userStatusStats?.totalUsersWithSystemAccess ?? 0}
          </h3>
          <p className={styles.cardTitle}>Total Usuarios</p>
        </div>
      </div>

      {/* 2. Card de Puertos Modificada */}
      <div className={styles.card}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${portStatusStats?.operational ?? 0} Operativo`}
          </div>
           <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${portStatusStats?.full ?? 0} Lleno`}
          </div>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${portStatusStats?.underMaintenance ?? 0} Mantenimiento`}
          </div>
          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${portStatusStats?.closed ?? 0} Cerrado`}
          </div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${portStatusStats?.inactive ?? 0} Inactivo`}
          </div>
        </div>
        
        <div className={styles.iconWrapper} style={{ color: '#38bdf8' }}>
          <Anchor strokeWidth={1.5} size={40} />
        </div>
        
        <div className={styles.info}>
          <h3 className={styles.cardValue}>
            {loading ? '...' : portStatusStats?.total ?? 0}
          </h3>
          <p className={styles.cardTitle}>Total Puertos</p>
        </div>
      </div>

      {/* 2. Card de Puertos Modificada */}
      <div className={styles.card}>
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${shipStatusStats?.operational ?? 0} Operativo`}
          </div>
           <div style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${shipStatusStats?.inTransit ?? 0} En Curso`}
          </div>
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${shipStatusStats?.maintenance ?? 0} Mantenimiento`}
          </div>
          <div style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${shipStatusStats?.repair ?? 0} Reparación`}
          </div>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 10px', borderRadius: '12px', fontSize: '9px', fontWeight: 500 }}>
            {loading ? '...' : `${shipStatusStats?.outOfService ?? 0} Fuera de servicio`}
          </div>
        </div>
        
        <div className={styles.iconWrapper} style={{ color: '#38bdf8' }}>
          <Ship strokeWidth={1.5} size={40} />
        </div>
        
        <div className={styles.info}>
          <h3 className={styles.cardValue}>
            {loading ? '...' : portStatusStats?.total ?? 0}
          </h3>
          <p className={styles.cardTitle}>Total Puertos</p>
        </div>
      </div>    
    </div>
  );
};