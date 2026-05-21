import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { MainLayout } from '../../../layouts/MainLayout';
import { getAllNavigationPlans, deleteNavigationPlan } from '../../../services/api/navigationPlanService';
import type { NavigationPlanSummaryResponse } from '../../../types/navigationPlan';
import styles from './ListNavigationPlans.module.css';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Borrador',
  PLANNED: 'Planificado',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export const ListNavigationPlans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<NavigationPlanSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlans = () => {
    setIsLoading(true);
    getAllNavigationPlans()
      .then(setPlans)
      .catch(() => setErrorMsg('Error al cargar los planes de travesía.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadPlans(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este plan?')) return;
    try {
      await deleteNavigationPlan(id);
      loadPlans();
    } catch {
      alert('No se pudo eliminar el plan.');
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <header>
            <h1 className="text-3xl text-[var(--text-secondary)] font-medium flex items-center gap-3">
              <Map size={28} /> Viajes
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Listado de planes de navegación activos</p>
          </header>
          <button className={styles.addBtn} onClick={() => navigate('/navegacion/nuevo')}>
            <Plus size={20} /> Nuevo plan
          </button>
        </div>

        {isLoading ? (
          <div className={styles.message}>Cargando planes...</div>
        ) : errorMsg ? (
          <div className={styles.message}>{errorMsg}</div>
        ) : plans.length === 0 ? (
          <div className={styles.empty}>
            <Map size={64} className="opacity-20 mb-4" />
            <p>No hay planes de travesía registrados.</p>
            <button className={styles.addBtn} onClick={() => navigate('/navegacion/nuevo')}>
              Crear primer plan
            </button>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Nombre</span>
              <span>Barco</span>
              <span>Origen → Destino</span>
              <span>Salida</span>
              <span>Estado</span>
              <span></span>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className={styles.tableRow}>
                <span className={styles.planName}>{plan.name}</span>
                <span>{plan.shipName ?? '—'}</span>
                <span className={styles.route}>
                  {plan.originPortName ?? '—'} <ArrowRight size={12} /> {plan.destinationPortName ?? '—'}
                </span>
                <span>{plan.departureTime ? new Date(plan.departureTime).toLocaleDateString('es-AR') : '—'}</span>
                <span className={`${styles.statusBadge} ${styles[`status${plan.status}`]}`}>
                  {STATUS_LABELS[plan.status] ?? plan.status}
                </span>
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/navegacion/plan/${plan.id}/editar`)}
                    title="Editar"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(plan.id)}
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
