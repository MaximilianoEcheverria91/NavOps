import React, { useEffect, useState } from 'react';
import { Map, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../../api/apiClient';
import styles from './CountrySelect.module.css'; // Reutilizamos tus estilos

interface ProvinceSelectProps {
  countryId: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const ProvinceSelect: React.FC<ProvinceSelectProps> = ({ countryId, value, onChange, label, error }) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (!countryId) {
        setProvinces([]);
        return;
      }
      try {
        setLoading(true);
        setFetchError(false);
        const response = await apiClient.get(`/locations/provinces/${countryId}`);
        setProvinces(response.data);
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, [countryId]);

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <div className={styles.icon}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Map size={18} />}
        </div>
        <select
          className={`${styles.select} ${error || fetchError ? styles.selectError : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || !countryId}
        >
          <option value="">{loading ? 'Cargando...' : 'Selecciona una provincia'}</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      {(error || fetchError) && <span className={styles.errorText}>{error || 'Error al cargar provincias'}</span>}
    </div>
  );
};