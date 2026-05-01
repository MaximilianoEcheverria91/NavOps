import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Filter, UserPlus, User, Anchor, Edit2, Trash2 } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { getAllPorts } from '../../../services/api/portService';
import type { PortSummaryResponse } from '../../../services/api/portService';
import styles from './ListPorts.module.css';

export const ListPorts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ports, setPorts] = useState<PortSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllPorts();
        setPorts(data);
      } catch (error: any) {
        console.error('Error fetching ports:', error);
        setErrorMsg('Error al cargar la lista de puertos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPorts();
  }, []);

  const filteredPorts = ports.filter((port) => {
    const term = debouncedSearch.toLowerCase();
    const matchesSearch = 
      port.name.toLowerCase().includes(term) ||
      port.code?.toLowerCase().includes(term) ||
      port.countryName.toLowerCase().includes(term) ||
      port.provinceName.toLowerCase().includes(term);

    const matchesStatus = statusFilter ? port.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id: string) => {
    console.log('Edit port', id);
    // navigate(`/puertos/edit/${id}`);
  };

  const handleDelete = (port: PortSummaryResponse) => {
    console.log('Delete port', port.id);
    // TODO: integrate confirmation modal
    alert(`Preparado para eliminar puerto: ${port.name}`);
  };

  const handleViewDetail = (id: string) => {
    console.log('View detail', id);
    // TODO: implement detail view
  };

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <header>
            <h1 className="text-3xl text-[var(--text-secondary)] font-medium"> 
              Gestión de Puertos
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Bienvenido al sistema de gestión y Navegación
            </p>
          </header>
          
          <button
            className={styles.addButton}
            onClick={() => navigate('/puertos/create')}>
            <Anchor size={24} />
            <span className={styles.plusIcon}>+</span>
          </button>
        </div>

        {/* FILTERS */}
        <div className={styles.filtersContainer}>
            <SearchInput 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre y código ..."/>
          
          <div className={styles.filterDropdown}>
            <Filter size={18} className={styles.filterIcon} />
            <select className={styles.selectInput}>
              <option value="all">Filtros</option>
              {/* Other options would go here */}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>Cargando puertos...</div>
        ) : errorMsg ? (
          <div className={styles.error}>{errorMsg}</div>
        ) : (
          <div className={styles.portsGrid}>
            {filteredPorts.map((port) => (
              <div key={port.id} className={styles.portCard}>
                <div className={styles.imageContainer}>
                  {port.mainImageUrl ? (
                    <img src={port.mainImageUrl} alt={port.name} className={styles.portImage} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' }}>
                      <Anchor size={48} />
                    </div>
                  )}
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.headerRow}>
                    <div className={styles.portInfo}>
                      <h3 className={styles.portName}>{port.name}</h3>
                      <p className={styles.portLocation}>
                        {port.provinceName}, {port.countryName}
                      </p>
                    </div>
                    {port.status === 'OPERATIONAL' ? (
                      <span className={`${styles.statusBadge} ${styles.statusOPERATIONAL}`}>OPERATIVO</span>
                    ) : port.status === 'UNDER_MAINTENANCE' ? (
                      <span className={`${styles.statusBadge} ${styles.statusUNDER_MAINTENANCE}`}>EN MANTENIMIENTO</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusCLOSED}`}>MUELLE COMPLETO</span>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.viewDetailBtn} onClick={() => handleViewDetail(port.id)}>
                      Ver detalle
                    </button>
                    
                    <div className={styles.iconBtns}>
                      <button className={styles.editBtn} onClick={() => handleEdit(port.id)}>
                        <Edit2 size={16} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(port)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredPorts.length === 0 && (
              <div className={styles.loading} style={{ gridColumn: '1 / -1' }}>
                No se encontraron puertos con los filtros actuales.
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </MainLayout>
  );
};
