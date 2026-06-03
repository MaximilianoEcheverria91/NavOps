import React, { useState, useMemo, useEffect } from 'react';
import styles from './ManageCargo.module.css';
import { Package, Plus, Search, ChevronDown, Save, Trash2, Edit2, Inbox, Box, Archive, Layers, Database, Filter } from 'lucide-react';
import { CARGO_CATEGORIES, CARGO_TYPES } from '../../../../../types/cargoType';
import type { CargoRequest } from '../../../../../types/cargoType';
import { cargoService } from '../../../../../services/api/cargoService';
import { RegisterCargoModal } from '../RegisterCargo/RegisterCargoModal';
import { CargoFilterDropdown, } from '../../../../../components/ui/filtersSelectCargo/CargoFilterDropdown';
import { AlertModal } from '../../../../../components/ui/AlertModal/AlertModal';
import { CargoDetailModal } from '../../../../../components/ui/CargoDetailModal/CargoDetalModal';
import { ConfirmModal } from '../../../../../components/ui/ConfirmModal/ConfirmModal';

interface ManageCargoProps {
  planId?: string;
  shipCapacityTonnes?: number;
  initialCargoList?: CargoRequest[];
  onSaveSelection: (cargoList: CargoRequest[]) => void;
  onCancel: () => void;
}

export const ManageCargo: React.FC<ManageCargoProps> = ({
  initialCargoList = [],
  planId = 'V012',
  shipCapacityTonnes = 5000,
  onSaveSelection,
  onCancel
}) => {
  const [cargoList, setCargoList] = useState<CargoRequest[]>(initialCargoList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOverloadAlertOpen, setIsOverloadAlertOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCargo, setSelectedCargo] = useState<CargoRequest | null>(null);
  const [isLeaveAlertOpen, setIsLeaveAlertOpen] = useState(false);
  
  const [localFilters, setLocalFilters] = useState({
    planId: planId === 'V012' ? null : planId,
    productCategory: '' as string | null,
    cargoType: '' as string | null,
    containerType: '' as string | null,
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDirection: 'ASC'
  });

  const handleApplyFilters = (newFilters: any) => {
    setLocalFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      planId: planId === 'V012' ? null : planId,
      productCategory: '',
      cargoType: '',
      containerType: '',
      page: 0,
      size: 10,
      sortBy: 'id',
      sortDirection: 'ASC'
    });
     setIsFilterOpen(false);
  };


 // 🚀 CONTROL SENIOR: Solo va a la API si no tenemos datos temporales cargados previamente
  useEffect(() => {
    const fetchCargo = async () => {
      // Si ya tenemos elementos en la lista inicial, no tocamos la API
      if (initialCargoList && initialCargoList.length > 0) return;

      try {
        if (!planId || planId === 'V012') return;
        const data = await cargoService.getCargoByPlanId(planId);
        if (data && data.length > 0) {
          setCargoList(data);
        }
      } catch (error) {
        console.error('Error fetching cargo list:', error);
      }
    };
    fetchCargo();
  }, [planId, initialCargoList]); // Added initialCargoList to dependencies

  // 🚀 SINCRONIZACIÓN SENIOR: Si la prop del padre cambia o se actualiza, refrescamos el estado local al instante
  useEffect(() => {
    if (initialCargoList) {
      setCargoList(initialCargoList);
    }
  }, [initialCargoList]);

  const { totalTonnes, totalContainers, totalPallets, totalProducts, totalDrums, totalBiners } = useMemo(() => {
    let tonnes = 0;
    let containers = 0;
    let pallets = 0;
    let drums = 0;
    let biners = 0;

    cargoList.forEach(item => {
      tonnes += item.weightTonnes || 0;
      if (item.cargoType === 'CONTAINER') containers += item.quantity || 0;
      if (item.cargoType === 'PALLET') pallets += item.quantity || 0;
      if (item.cargoType === 'DRUM') drums += item.quantity || 0;
      if (item.cargoType === 'BINER') biners += item.quantity || 0;
    });

    return {
      totalTonnes: tonnes,
      totalContainers: containers,
      totalPallets: pallets,
      totalProducts: cargoList.length,
      totalDrums: drums,
      totalBiners: biners
    };
  }, [cargoList]);

  const progressPercentage = Math.min((totalTonnes / shipCapacityTonnes) * 100, 100);

  const handleAddOrUpdate = (cargo: CargoRequest) => {
    if (editingIndex !== null) {
      const newList = [...cargoList];
      newList[editingIndex] = cargo;
      setCargoList(newList);
    } else {
      setCargoList([...cargoList, cargo]);
    }
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const handleViewDetail = (cargo: CargoRequest) => {
    setSelectedCargo(cargo);
    setIsDetailOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setCargoList(cargoList.filter((_, i) => i !== index));
  };


  const handleSaveAll = async () => {
    // 🚀 CONTROL CRÍTICO DE PESO MÁXIMO (VGM)
    if (totalTonnes > shipCapacityTonnes) {
      setIsOverloadAlertOpen(true); // Abre el cartel de la imagen
      return; // 🛑 Frena la ejecución, no guarda ni cierra
    }

    try {
      setIsSaving(true);
      if (planId !== 'V012') {
        await cargoService.saveCargoList(planId, cargoList);
      }
      onSaveSelection(cargoList);
    } catch (error) {
      console.error('Error al guardar', error);
      alert('Error al guardar la lista de carga');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredList = useMemo(() => {
    return cargoList.filter(item => {
      const matchSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const filterCategories = typeof localFilters.productCategory === 'string'
        ? localFilters.productCategory.split(',').filter(Boolean)
        : Array.isArray(localFilters.productCategory) ? localFilters.productCategory : [];

      const matchCategory = filterCategories.length === 0 || 
        filterCategories.includes(item.productCategory);

     const filterCargoTypes = typeof localFilters.cargoType === 'string'
        ? localFilters.cargoType.split(',').filter(Boolean)
        : Array.isArray(localFilters.cargoType) ? localFilters.cargoType : [];

      const matchCargoType = filterCargoTypes.length === 0 || 
        filterCargoTypes.includes(item.cargoType);

      const filterContainerTypes = typeof localFilters.containerType === 'string'
        ? localFilters.containerType.split(',').filter(Boolean)
        : Array.isArray(localFilters.containerType) ? localFilters.containerType : [];

      const matchContainerType = filterContainerTypes.length === 0 || 
        filterContainerTypes.includes((item as any).containerType);
      
      return matchSearch && matchCategory && matchCargoType && matchContainerType;
    });
  }, [cargoList, searchTerm, localFilters]);

  const getCategoryLabel = (value: string) => {
    return CARGO_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const getTypeLabel = (value: string) => {
    return CARGO_TYPES.find(c => c.value === value)?.label || value;
  }; 
  
  // 🚀 INTERCEPTOR SENIOR: Captura la flecha de la PC / Botón Atrás del Navegador
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      // Si hay elementos cargados, bloqueamos el comportamiento por defecto
      if (cargoList.length > 0) {
        window.history.pushState(null, '', window.location.pathname); // Bloquea el historial
        setIsLeaveAlertOpen(true); // Dispara el cartel de confirmación
      } else {
        onCancel(); // Si está vacío, se va directo a las 4 cards sin molestar
      }
    };

    // Empujamos un estado falso al historial para poder capturar el primer click de atrás
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [cargoList, onCancel]);

  const handleBackNavigation = () => {
    if (cargoList.length > 0) {
      setIsLeaveAlertOpen(true); // Abre el modal de advertencia
    } else {
      onCancel(); // Vuelve directo a las 4 cards (ejecuta el setActiveModal(null) del padre)
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h2>Gestión de Carga ID {planId}</h2>
          <p>Administra productos y tipo de cargas</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.btnSaveClose}
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            <Save size={18} /> Guardar y Cerrar
          </button>
          <button className={styles.btnAdd} onClick={() => { setEditingIndex(null); setIsModalOpen(true); }}>
            <Package size={24} /> +
          </button>
        </div>
      </header>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>

          <span 
            style={{ 
              color: totalTonnes > shipCapacityTonnes ? '#ef4444' : 'inherit',
              fontWeight: totalTonnes > shipCapacityTonnes ? '600' : 'normal'
            }}
          >
            {totalTonnes > shipCapacityTonnes 
              ? '⚠️ Límite Excedido (Sobrecarga)' 
              : `Peso Máximo ${shipCapacityTonnes === 5000 && planId === 'V012' ? '(Sin barco asignado - Estimación)' : ''}`
            }
          </span>
          
          <span 
            className={styles.progressValue}
            style={{ color: totalTonnes > shipCapacityTonnes ? '#ef4444' : 'inherit' }}
          >
            {totalTonnes.toLocaleString()} / {shipCapacityTonnes.toLocaleString()} Tn
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` ,
                      backgroundColor: totalTonnes > shipCapacityTonnes ? '#ef4444' : '#0284c7'}}
          />
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Box size={24} /></div>
          <div className={styles.metricInfo}>
            <p>Total Productos</p>
            <h3>{totalProducts}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Archive size={24} /></div>
          <div className={styles.metricInfo}>
            <p>Total Contenedores</p>
            <h3>{totalContainers}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Layers size={24} /></div>
          <div className={styles.metricInfo}>
            <p>Total Pallets</p>
            <h3>{totalPallets}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Inbox size={24} /></div>
          <div className={styles.metricInfo}>
            <p>Total Biners</p>
            <h3>{totalBiners}</h3>
          </div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}><Database size={24} /></div>
          <div className={styles.metricInfo}>
            <p>Tambores</p>
            <h3>{totalDrums}</h3>
          </div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, legajo o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ position: 'relative', 
          display: 'flex',
          alignItems: 'stretch',
          flexShrink: 0 }}>
          <button 
            className={styles.filterBtn}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ 
              flexShrink: 0, 
              minWidth: '150px', 
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Filter size={18} /> Categorias <ChevronDown size={16} />
          </button>
          
          {isFilterOpen && (
            <CargoFilterDropdown 
              filters={localFilters}
              onFilterChange={setLocalFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
        </div>
      </div>

      {cargoList.length === 0 ? (
        <div className={styles.emptyState}>
          <Package size={64} />
          <h3>No hay productos registrados</h3>
          <p>Haz clic en "Agregar Producto" para comenzar a registrar la carga para este plan de travesía.</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {filteredList.map((item, index) => (
            <div key={index} className={styles.productCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Box size={24} />
                </div>
                <div className={styles.cardTitle}>
                  <h4>{item.productName}</h4>
                  <p>{getCategoryLabel(item.productCategory)}</p>
                </div>
              </div>

              <div className={styles.cardDescription} title={item.description}>
                {item.description || 'Sin descripción'}
              </div>

              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span>Cantidad</span>
                  <strong>{item.quantity} {getTypeLabel(item.cargoType)}</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Peso</span>
                  <strong>{item.weightTonnes} Tone</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Volumen</span>
                  <strong>{item.volumeM3} M³</strong>
                </div>
                <div className={styles.statItem}>
                  <span>Tipo de carga</span>
                  <strong>{getTypeLabel(item.cargoType)}</strong>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button 
                  className={styles.btnDetails} 
                  onClick={() => handleViewDetail(item)}>
                    Ver detalle
                </button>
                <div className={styles.iconActions}>
                  <button className={styles.iconBtn} onClick={() => handleEdit(index)}>
                    <Edit2 size={16} />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <RegisterCargoModal
          onClose={() => { setIsModalOpen(false); setEditingIndex(null); }}
          onSave={handleAddOrUpdate}
          initialData={editingIndex !== null ? cargoList[editingIndex] : undefined}
        />
      )}

      {/* 🚨 MODAL DE ADVERTENCIA VGM - SOBRECARGA */}
      <AlertModal
        isOpen={isOverloadAlertOpen}
        title={`VGM NO CONFORME. Tenés una sobrecarga de ${(totalTonnes - shipCapacityTonnes).toLocaleString()} Tn. Supera el límite máximo bruto:`}
        highlightText={`${shipCapacityTonnes.toLocaleString()} toneladas`}
        buttonText="Aceptar"
        onClose={() => setIsOverloadAlertOpen(false)}
      />

      <CargoDetailModal
        isOpen={isDetailOpen}
        cargo={selectedCargo}
        onClose={() => { setIsDetailOpen(false); setSelectedCargo(null); }}
        isLightTheme={false} // Cambialo a true si tu sistema conmuta a modo claro
      />

      <ConfirmModal
        isOpen={isLeaveAlertOpen}
        title="¿Desea salir de la gestión de carga?"
        description="Si sales ahora, perderás los productos cargados en el sistema que no hayan sido guardados de forma definitiva."
        onConfirm={() => {
          setIsLeaveAlertOpen(false);
          onCancel(); // Forzamos la salida y volvemos a las 4 cards
        }}
        onCancel={() => setIsLeaveAlertOpen(false)} // Cerramos el cartel y se queda editando
      />
      
    </div>
  );
};
