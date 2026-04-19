import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Anchor } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import styles from './StatsGrid.module.css';


export const StatsGrid: React.FC = () => {
  // ... lógica de fetch (déjala comentada si quieres concentrarte en diseño)
  const loading = false; // Forza loading false para ver diseño
  const stats = { totalUsers: 256, activeUsers: 59, availableCrewMembers: 136, roles: 5 }; // Datos Mock de tu foto

  const cards = [
    { title: 'Total Usuarios', value: stats.totalUsers, active: '56 Activos', icon: <Users />, color: '#2095D4' },
    //{ title: 'Total Barcos', value: stats.activeUsers, active: '48 Activos', icon: <Ship />, color: '#2095D4' },
    { title: 'Total puertos', value: stats.availableCrewMembers, active: '135 Activos', icon: <Anchor />, color: '#2095D4' },
    { title: 'Roles de administrador', value: stats.roles, active: '5 Activos', icon: <Users />, color: '#2095D4' },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.activeBadge}>{card.active}</div>
          <div className={styles.iconWrapper} style={{ backgroundColor: `${card.color}15`, color: card.color }}>
            {React.cloneElement(card.icon, { strokeWidth: 1.5, size: 24 })}
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