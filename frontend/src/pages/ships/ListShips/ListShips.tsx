// frontend/src/pages/ships/ListShips/ListShips.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Filter, Anchor, Edit2, Trash2 } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { getAllShips } from '../../../services/api/shipService';
import { ShipDetailModal } from '../ShipDetailModal/ShipDetailModal';
import type { ShipSummaryResponse, ShipStatus } from '../../../types/ship';
import styles from './ListShips.module.css';

const STATUS_LABELS: Record<ShipStatus, string> = {
  OPERATIONAL: 'Operativo',
  MAINTENANCE: 'Mantenimiento',
  REPAIR: 'Reparación',
  OUT_OF_SERVICE: 'Fuera de servicio',
};

export const ListShips: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ships, setShips] = useState<ShipSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    getAllShips()
      .then(setShips)
      .catch(() => setErrorMsg('Error al cargar la lista de barcos.'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = ships.filter((ship) => {
    const term = debouncedSearch.toLowerCase();
    const matchesSearch =
      ship.name.toLowerCase().includes(term) ||
      ship.registration.toLowerCase().includes(term) ||
      ship.imoNumber.toLowerCase().includes(term);
    const matchesStatus = statusFilter ? ship.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <header className="mb-6">
          <h1 className="text-3xl text-[var(--text-secondary)] font-medium">Gestión de Barcos</h1>
          <p className="text-slate-400 mt-1 text-sm">Bienvenido al sistema de gestión y Navegación</p>
        </header>

        <div className={styles.filtersContainer}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, matrícula o IMO..."
          />
          <div className={styles.filterDropdown}>
            <Filter size={18} className={styles.filterIcon} />
            <select
              className={styles.selectInput}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="OPERATIONAL">Operativo</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="REPAIR">Reparación</option>
              <option value="OUT_OF_SERVICE">Fuera de servicio</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Cargando barcos...</div>
        ) : errorMsg ? (
          <div className={styles.error}>{errorMsg}</div>
        ) : (
          <div className={styles.shipsGrid}>
            {filtered.map((ship) => (
              <div key={ship.id} className={styles.shipCard}>
                <div className={styles.imageContainer}>
                  {ship.mainImageUrl ? (
                    <img src={ship.mainImageUrl} alt={ship.name} className={styles.shipImage} />
                  ) : (
                    <Anchor size={48} color="rgba(14,165,233,0.4)" />
                  )}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.headerRow}>
                    <div className={styles.shipInfo}>
                      <h3 className={styles.shipName}>{ship.name}</h3>
                      <div className={styles.shipMeta}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Matrícula</span>
                          <span className={styles.metaValue}>{ship.registration}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Número de IMO</span>
                          <span className={styles.metaValue}>{ship.imoNumber}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[`status${ship.status}`]}`}>
                      {STATUS_LABELS[ship.status]}
                    </span>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.viewDetailBtn}
                      onClick={() => navigate(`/barcos/${ship.id}`)}
                    >
                      Ver detalle
                    </button>
                    <div className={styles.iconBtns}>
                      <button className={styles.editBtn} title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className={styles.loading} style={{ gridColumn: '1 / -1' }}>
                No existen barcos registrados.
              </div>
            )}
          </div>
        )}

        {id && <ShipDetailModal shipId={id} onClose={() => navigate('/barcos')} />}

        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </MainLayout>
  );
};
