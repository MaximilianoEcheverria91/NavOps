import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationLayout } from '../../../layouts/NavigationLayout';
import { Map, Sailboat, ShipWheel, History, Check } from 'lucide-react';
import styles from './NavigationMenu.module.css';
import { 
  getGlobalVoyagesMetrics, 
  getMyVoyagesMetrics, 
  getHistoryVoyagesMetrics 
} from '../../../services/api/voyageService';
import type { 
  GlobalVoyagesMetrics, 
  MyVoyagesMetrics, 
  HistoryVoyagesMetrics 
} from '../../../types/navigation';

export const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const [globalMetrics, setGlobalMetrics] = useState<GlobalVoyagesMetrics | null>(null);
  const [myMetrics, setMyMetrics] = useState<MyVoyagesMetrics | null>(null);
  const [historyMetrics, setHistoryMetrics] = useState<HistoryVoyagesMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [globalData, myData, historyData] = await Promise.all([
          getGlobalVoyagesMetrics(),
          getMyVoyagesMetrics(),
          getHistoryVoyagesMetrics()
        ]);
        setGlobalMetrics(globalData);
        setMyMetrics(myData);
        setHistoryMetrics(historyData);
      } catch (error) {
        console.error('Error fetching metrics', error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <NavigationLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Navegación</h1>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </header>

        <div className={styles.grid}>
          {/* Card 1: Plan de travesía */}
          <div 
            className={`${styles.card} ${activeCard === 1 ? styles.cardActive : ''}`}
            onClick={() => navigate('/navigation/create-plan')}
            onMouseEnter={() => setActiveCard(1)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.checkIcon}>
              <Check size={24} color="#10b981" strokeWidth={3} />
            </div>
            <div>
              <div className={styles.iconWrapper}>
                <Map strokeWidth={1.5} size={64} />
              </div>
              <h3 className={styles.cardTitle}>Plan de travesía</h3>
            </div>
          </div>

          {/* Card 2: Lista de Viajes */}
          <div 
            className={`${styles.card} ${activeCard === 2 ? styles.cardActive : ''}`}
            onClick={() => navigate('/navigation/travel-plans')}
            onMouseEnter={() => setActiveCard(2)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.badgesContainer}>
              <span className={`${styles.badge} ${styles.badgeGrey}`}>{globalMetrics?.plannedCount ?? 0} Programadas</span>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>{globalMetrics?.inProgressCount ?? 0} en cursos</span>
              <span className={`${styles.badge} ${styles.badgeYellow}`}>{globalMetrics?.delayedCount ?? 0} Demorados</span>
            </div>
            <div>
              <div className={styles.iconWrapper}>
                <Sailboat strokeWidth={1.5} size={64} />
              </div>
              <h3 className={styles.cardTitle}>Lista de Travesías</h3>
            </div>
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span className={styles.totalNumber}>{globalMetrics?.totalCount ?? 0}</span>
            </div>
          </div>

          {/* Card 3: Mis Viajes */}
          <div 
            className={`${styles.card} ${activeCard === 3 ? styles.cardActive : ''}`}
            onClick={() => navigate('/navigation/my-voyages')}
            onMouseEnter={() => setActiveCard(3)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.badgesContainer}>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>{myMetrics?.completedCount ?? 0} Completados</span>
              <span className={`${styles.badge} ${styles.badgeGrey}`}>{myMetrics?.plannedCount ?? 0} De programadas</span>
              <span className={`${styles.badge} ${styles.badgeRed}`}>{myMetrics?.cancelledCount ?? 0} Cancelados</span>
            </div>
            <div>
              <div className={styles.iconWrapper}>
                <ShipWheel strokeWidth={1.5} size={64} />
              </div>
              <h3 className={styles.cardTitle}>Mis Travesías</h3>
            </div>
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span className={styles.totalNumber}>{myMetrics?.totalCount ?? 0}</span>
            </div>
          </div>

          {/* Card 4: Historia de viaje */}
          <div 
            className={`${styles.card} ${activeCard === 4 ? styles.cardActive : ''}`}
            onClick={() => navigate('/navigation/history')}
            onMouseEnter={() => setActiveCard(4)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.badgesContainer}>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>{historyMetrics?.completedCount ?? 0} Completados</span>
              <span className={`${styles.badge} ${styles.badgeRed}`}>{historyMetrics?.cancelledCount ?? 0} Cancelados</span>
            </div>
            <div>
              <div className={styles.iconWrapper}>
                <History strokeWidth={1.5} size={64} />
              </div>
              <h3 className={styles.cardTitle}>Historial de Travesías</h3>
            </div>
            <div className={styles.totalContainer}>
              <span>Total</span>
              <span className={styles.totalNumber}>{historyMetrics?.totalCount ?? 0}</span>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </NavigationLayout>
  );
};
