import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { Filter, UserPlus, User, Anchor, Edit2, Trash2 } from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { getAllPorts } from '../../../services/api/portService';
import type { PortSummaryResponse } from '../../../types/port';
import styles from './ListPorts.module.css';
import {PortDetailModal} from "../DetailPort/PortDetailModal.tsx";
import DeletePortModal from '../DeletePortModal/DeletePortModal';
import ReactivatePortModal from '../../../components/ui/ReactivatePortModal/ReactivatePortModal';

export const ListPorts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ports, setPorts] = useState<PortSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const navigate = useNavigate();


  const [portToDelete, setPortToDelete] = useState<{
  id: string;
  name: string;
  location: string;
  imageUrl?: string;
} | null>(null);

  const [portToReactivate, setPortToReactivate] = useState<{
  id: string;
  name: string;
  location: string;
  imageUrl?: string;
} | null>(null);

  const fetchPorts = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await getAllPorts();
      
      console.log("Datos recibidos de la API de Puertos:", data); // Debug clave

      if (Array.isArray(data)) {
        setPorts(data);
      } else if (data && typeof data === 'object') {
        // Buscamos los puertos si vienen anidados (común en Spring Boot)
        // @ts-ignore
        const arrayData = data.content || data.data || data.ports || [];
        setPorts(arrayData);
        
        if (!Array.isArray(arrayData)) {
          setPorts([]); // Si después de todo no es array, aseguramos lista vacía
        }
      } else {
        setPorts([]);
      }
    } catch (error: any) {
      console.error('Error al cargar la lista de puertos:', error);
      setErrorMsg(error?.message || 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
  }, []);

const filteredPorts = (ports || []).filter((port) => {
  if (!port) return false;
  const term = debouncedSearch.toLowerCase();

  // Usamos (port.propiedad || '') para evitar errores si algo viene null
  return (
    (port.name || '').toLowerCase().includes(term) ||
    (port.code || '').toLowerCase().includes(term) ||
    (port.countryName || '').toLowerCase().includes(term)
  );
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
    setSelectedPortId(id);
    setIsModalOpen(true);
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
          <div className="flex justify-center items-center py-20 text-center flex-col">
            <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
            <p className="text-slate-500 text-sm">Detalle: {errorMsg}. Por favor, revisa la consola (F12).</p>
          </div>
        ) : filteredPorts.length === 0 ? (
          <div className="flex justify-center items-center py-20 text-center flex-col">
            <Anchor size={48} className="text-slate-600 mb-4 opacity-20" />
            <p className="text-[var(--text-secondary)] text-xl font-medium">
              No se encontraron puertos registrados
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Probá cambiando los filtros o agregá un nuevo puerto.
            </p>
          </div>
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
                    ) : port.status === 'INACTIVE' ? (
                      <span className={`${styles.statusBadge} ${styles.statusINACTIVE}`}>INACTIVO</span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusCLOSED}`}>MUELLE COMPLETO</span>
                    )}
                  </div>

                  <div className={styles.cardActions}>

                    <button className={styles.viewDetailBtn} onClick={() => handleViewDetail(port.id)}>
                      Ver detalle
                    </button>

                    {port.status === 'INACTIVE' && port.isActive === false ? (
                      <button 
                        className={styles.reactivateBtn} 
                        onClick={() => setPortToReactivate({
                          id: port.id,
                          name: port.name,
                          location: `${port.provinceName}, ${port.countryName}`,
                          imageUrl: port.mainImageUrl ?? undefined,
                        })}
                      >
                        Dar de alta
                      </button>
                    ) : (
                      <div className={styles.iconBtns}>
                        <button className={styles.editBtn} onClick={() => handleEdit(port.id)}>
                          <Edit2 size={16} />
                        </button>

                        <button  className={styles.deleteBtn}  onClick={() => setPortToDelete({
                          id: port.id,
                          name: port.name,
                          location: `${port.provinceName}, ${port.countryName}`,
                          imageUrl: port.mainImageUrl ?? undefined,
                        })}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}

                    {portToDelete && portToDelete.id === port.id && (
                      <DeletePortModal
                        portId={portToDelete.id}
                        portName={portToDelete.name}
                        portLocation={portToDelete.location}
                        mainImageUrl={portToDelete.imageUrl}
                        onCancel={() => setPortToDelete(null)}
                      />
                    )}

                    {portToReactivate && portToReactivate.id === port.id && (
                      <ReactivatePortModal
                        portId={portToReactivate.id}
                        portName={portToReactivate.name}
                        portLocation={portToReactivate.location}
                        mainImageUrl={portToReactivate.imageUrl}
                        onCancel={() => setPortToReactivate(null)}
                        onSuccess={() => {
                          setPortToReactivate(null);
                          fetchPorts();
                        }}
                      />
                    )}
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

      {isModalOpen && selectedPortId && (
        <PortDetailModal
          portId={selectedPortId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </MainLayout>
  );
};
