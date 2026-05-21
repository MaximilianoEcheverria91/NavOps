import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import { MainLayout } from '../../../layouts/MainLayout';
import { createNavigationPlan } from '../../../services/api/navigationPlanService';
import { getAllShips } from '../../../services/api/shipService';
import type { ShipSummaryResponse } from '../../../types/ship';
import styles from './CreateNavigationPlan.module.css';

export const CreateNavigationPlan: React.FC = () => {
  const navigate = useNavigate();
  const [ships, setShips] = useState<ShipSummaryResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    shipId: '',
    departureTime: '',
    estimatedArrivalTime: '',
    notes: '',
  });

  useEffect(() => {
    getAllShips().then(setShips).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.shipId) {
      setError('El nombre y el barco son obligatorios.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const plan = await createNavigationPlan({
        name: form.name,
        shipId: form.shipId,
        departureTime: form.departureTime || undefined,
        estimatedArrivalTime: form.estimatedArrivalTime || undefined,
        notes: form.notes || undefined,
      });
      navigate(`/navegacion/plan/${plan.id}/editar`);
    } catch {
      setError('No se pudo crear el plan. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <button className={styles.backBtn} onClick={() => navigate('/navegacion/viajes')}>
          <ArrowLeft size={18} /> Volver a Viajes
        </button>

        <header className="mb-8 mt-2">
          <h1 className="text-3xl text-[var(--text-secondary)] font-medium flex items-center gap-3">
            <Map size={28} /> Nuevo Plan de Travesía
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Completá los datos básicos del plan. Podrás editar ruta, tripulación y carga desde el panel de edición.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nombre del plan *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Travesía Buenos Aires - Montevideo"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label>Barco *</label>
            <select name="shipId" value={form.shipId} onChange={handleChange} className={styles.input}>
              <option value="">Seleccionar barco...</option>
              {ships.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.registration}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Fecha/hora de salida</label>
              <input
                type="datetime-local"
                name="departureTime"
                value={form.departureTime}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>Llegada estimada</label>
              <input
                type="datetime-local"
                name="estimatedArrivalTime"
                value={form.estimatedArrivalTime}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Notas</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Observaciones adicionales..."
              className={styles.input}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={() => navigate('/navegacion/viajes')}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear plan'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
