import React from 'react';
import { User, Ship, Anchor, ChevronRight } from 'lucide-react';
import styles from './ManagementGrid.module.css';

export const ManagementGrid: React.FC = () => {
  const managers = [
    { title: 'Gestión de Usuarios', desc: 'Administrar Usuarios y Permisos', count: 256, icon: <User />, link: '/usuarios' },
    { title: 'Gestión de Barcos', desc: 'Administrar Flota y Embarcaciones', count: 59, icon: <Ship />, link: '/barcos' },
    { title: 'Gestión de Puertos', desc: 'Administrar Puertos', count: 136, icon: <Anchor />, link: '/puertos' },
  ];

  return (
    <div className={styles.grid}>
      {managers.map((m, index) => (
        <div key={index} className={styles.managerCard}>
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              {React.cloneElement(m.icon, { size: 32, strokeWidth: 1.5 })}
            </div>
            <div className={styles.countBadge}>{m.count}</div>
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