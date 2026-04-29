import React, { useEffect, useState } from 'react';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../../api/apiClient';
import styles from './CountrySelect.module.css';

interface CitySelectProps {
  provinceId: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const CitySelect: React.FC<CitySelectProps> = ({ provinceId, value, onChange, label, error }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      if (!provinceId) {
        setCities([]);
        return;
      }
      try {
        setLoading(true);
        setFetchError(false);
        const response = await apiClient.get(`/locations/cities/${provinceId}`);
        setCities(response.data);
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, [provinceId]);

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectWrapper}>
        <div className={styles.icon}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
        </div>
        <select
          className={`${styles.select} ${error || fetchError ? styles.selectError : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || !provinceId}
        >
          <option value="">{loading ? 'Cargando...' : 'Selecciona una ciudad'}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      {(error || fetchError) && <span className={styles.errorText}>{error || 'Error al cargar ciudades'}</span>}
    </div>
  );
};