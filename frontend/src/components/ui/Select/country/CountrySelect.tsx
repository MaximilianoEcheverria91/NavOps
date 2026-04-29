import React, { useEffect, useState } from 'react';
import { Globe, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../../../api/apiClient';
import { CountrySelectOption } from '../../../../types/location';
import styles from './CountrySelect.module.css';

interface CountrySelectProps {
  value: string | number;
  onChange: (value: string) => void;
  label?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, label }) => {
  const [countries, setCountries] = useState<CountrySelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await apiClient('/countries');
        if (!response.ok) throw new Error();
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      
      <div className={styles.selectWrapper}>
        <div className={styles.icon}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
        </div>

        <select
          className={`${styles.select} ${error ? styles.selectError : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || error}
        >
          <option value="">
            {loading ? 'Cargando países...' : error ? 'Error al cargar' : 'Selecciona un país'}
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={14} /> No se pudieron cargar los países
          </div>
        )}
      </div>
    </div>
  );
};