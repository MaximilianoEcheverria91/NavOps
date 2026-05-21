import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ship, Map, Users, Package, Edit2, ArrowLeft, AlertCircle } from 'lucide-react';
import { MainLayout } from '../../../layouts/MainLayout';
import { getNavigationPlanById } from '../../../services/api/navigationPlanService';
import type { NavigationPlanDetailResponse } from '../../../types/navigationPlan';
import styles from './EditNavigationPlan.module.css';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PLANNED: 'Planificado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const SHIP_STATUS_LABELS: Record<string, string> = {
  OPERATIONAL: 'Operativo',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

export const EditNavigationPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NavigationPlanDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getNavigationPlanById(id)
      .then(setPlan)
      .catch(() => setError('No se encontró el Plan de Travesía.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className={styles.centered}>Cargando plan de travesía...</div>
      </MainLayout>
    );
  }

  if (error || !plan) {
    return (
      <MainLayout>
        <div className={styles.centered}>
          <AlertCircle size={48} className="mb-3 text-red-400" />
          <p>{error ?? 'No se encontró el Plan de Travesía.'}</p>
          <button className={styles.backBtn} onClick={() => navigate('/navegacion/viajes')}>
            Volver
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <button className={styles.backBtn} onClick={() => navigate('/navegacion/viajes')}>
            <ArrowLeft size={18} /> Volver
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl text-[var(--text-secondary)] font-medium">{plan.name}</h1>
          <span className={`${styles.statusBadge} ${styles[`status${plan.status}`]}`}>
            {STATUS_LABELS[plan.status] ?? plan.status}
          </span>
        </header>

        <div className={styles.cardsGrid}>
          {/* Card Barco */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Ship size={20} />
              <h2>Barco</h2>
              <button className={styles.editBtn} onClick={() => navigate(`/barcos`)}>
                <Edit2 size={14} /> Editar
              </button>
            </div>
            {plan.shipName ? (
              <div className={styles.cardBody}>
                <div className={styles.infoRow}><span className={styles.label}>Nombre</span><span>{plan.shipName}</span></div>
                <div className={styles.infoRow}><span className={styles.label}>Matrícula</span><span>{plan.shipRegistration}</span></div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Estado</span>
                  <span>{plan.shipStatus ? (SHIP_STATUS_LABELS[plan.shipStatus] ?? plan.shipStatus) : '—'}</span>
                </div>
              </div>
            ) : (
              <p className={styles.noData}>Sin información disponible</p>
            )}
          </div>

          {/* Card Ruta */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Map size={20} />
              <h2>Ruta</h2>
              <button className={styles.editBtn} onClick={() => navigate(`/navegacion/plan/${id}/ruta`)}>
                <Edit2 size={14} /> Editar
              </button>
            </div>
            {plan.route ? (
              <div className={styles.cardBody}>
                <div className={styles.infoRow}><span className={styles.label}>Origen</span><span>{plan.route.originPortName ?? '—'}</span></div>
                <div className={styles.infoRow}><span className={styles.label}>Destino</span><span>{plan.route.destinationPortName ?? '—'}</span></div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Salida</span>
                  <span>{plan.route.departureTime ? new Date(plan.route.departureTime).toLocaleString('es-AR') : '—'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Llegada est.</span>
                  <span>{plan.route.estimatedArrivalTime ? new Date(plan.route.estimatedArrivalTime).toLocaleString('es-AR') : '—'}</span>
                </div>
              </div>
            ) : (
              <p className={styles.noData}>Sin información disponible</p>
            )}
          </div>

          {/* Card Tripulantes */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Users size={20} />
              <h2>Tripulantes</h2>
              <button className={styles.editBtn} onClick={() => navigate(`/navegacion/plan/${id}/tripulacion`)}>
                <Edit2 size={14} /> Editar
              </button>
            </div>
            {plan.totalCrewCount > 0 ? (
              <div className={styles.cardBody}>
                <div className={styles.infoRow}><span className={styles.label}>Total</span><span>{plan.totalCrewCount}</span></div>
                <div className={styles.crewList}>
                  {plan.crew.slice(0, 3).map((c) => (
                    <div key={c.crewMemberId} className={styles.crewItem}>
                      <span>{c.fullName}</span>
                      <span className={styles.role}>{c.assignedRole}</span>
                    </div>
                  ))}
                  {plan.crew.length > 3 && (
                    <p className={styles.moreItems}>+{plan.crew.length - 3} más</p>
                  )}
                </div>
              </div>
            ) : (
              <p className={styles.noData}>Sin información disponible</p>
            )}
          </div>

          {/* Card Carga */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Package size={20} />
              <h2>Carga</h2>
              <button className={styles.editBtn} onClick={() => navigate(`/navegacion/plan/${id}/carga`)}>
                <Edit2 size={14} /> Editar
              </button>
            </div>
            {plan.cargo.length > 0 ? (
              <div className={styles.cardBody}>
                {plan.cargo.map((c) => (
                  <div key={c.id} className={styles.infoRow}>
                    <span className={styles.label}>{c.cargoType}</span>
                    <span>{c.weightTonnes} tn</span>
                  </div>
                ))}
                <div className={`${styles.infoRow} ${styles.total}`}>
                  <span className={styles.label}>Total</span>
                  <span>{plan.cargo.reduce((acc, c) => acc + c.weightTonnes, 0).toFixed(2)} tn</span>
                </div>
              </div>
            ) : (
              <p className={styles.noData}>Sin información disponible</p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
