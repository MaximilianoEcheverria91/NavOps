import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { Map, Sailboat, History, Check } from 'lucide-react';
import styles from './NavigationMenu.module.css';

export const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  // Estado para simular selección u hover avanzado si fuera necesario, 
  // aunque se manejará mayormente por CSS
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      title: 'Plan de travesía',
      icon: <Map strokeWidth={1.5} size={64} />,
      link: '/navigation/create-plan',
      showCheck: true
    },
    {
      id: 2,
      title: 'Lista de Viajes', // 🚢 Cambiado para que coincida con la US
      icon: <Sailboat strokeWidth={1.5} size={64} />,
      link: '/navigation/travel-plans', // 🔗 Esta es la ruta que renderiza tu nuevo componente
      showCheck: false
    },
    {
      id: 3,
      title: 'Historia de viaje',
      icon: <History strokeWidth={1.5} size={64} />,
      link: '/navigation/history',
      showCheck: false
    }
  ];

  return (
    <NavigationLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Navegación</h1>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </header>

        <div className={styles.grid}>
          {cards.map((card) => (
            <div 
              key={card.id} 
              className={`${styles.card} ${activeCard === card.id ? styles.cardActive : ''}`}
              onClick={() => navigate(card.link)}
              onMouseEnter={() => setActiveCard(card.id)}
              onMouseLeave={() => setActiveCard(null)}
            >
              {card.showCheck && (
                <div className={styles.checkIcon}>
                  <Check size={24} color="#10b981" strokeWidth={3} />
                </div>
              )}
              <div className={styles.iconWrapper}>
                {card.icon}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </div>
          ))}
        </div>

        <footer className={styles.footer}>
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </NavigationLayout>
  );
};
