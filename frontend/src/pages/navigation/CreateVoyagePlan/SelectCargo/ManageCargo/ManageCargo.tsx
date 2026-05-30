import React, { useState, useMemo, useEffect } from 'react';
import styles from './ManageCargo.module.css';
import { Package, Plus, Search, ChevronDown, Save, Trash2, Edit2, Inbox, Box, Archive, Layers, Database, Filter } from 'lucide-react';
import { CARGO_CATEGORIES, CARGO_TYPES } from '../../../../../types/cargoType';
import type { CargoRequest } from '../../../../../types/cargoType';
import { cargoService } from '../../../../../services/api/cargoService';
import { RegisterCargoModal } from '../RegisterCargo/RegisterCargoModal';

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
    let products = 0;
    let drums = 0;
    let biners = 0;

    cargoList.forEach(item => {
      tonnes += item.weightTonnes || 0;
      products += item.quantity || 0;
      if (item.cargoType === 'CONTAINER') containers += item.quantity || 0;
      if (item.cargoType === 'PALLET') pallets += item.quantity || 0;
      if (item.cargoType === 'DRUM') drums += item.quantity || 0;
      if (item.cargoType === 'BINER') biners += item.quantity || 0;
    });

    return {
      totalTonnes: tonnes,
      totalContainers: containers,
      totalPallets: pallets,
      totalProducts: products,
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

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setCargoList(cargoList.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      // Solo invocamos si hay un planId real, si es mock evitamos el error
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

  const filteredList = cargoList.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (value: string) => {
    return CARGO_CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const getTypeLabel = (value: string) => {
    return CARGO_TYPES.find(c => c.value === value)?.label || value;
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
          <span>Peso Máximo</span>
          <span className={styles.progressValue}>
            {totalTonnes.toLocaleString()} / {shipCapacityTonnes.toLocaleString()} Tn
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercentage}%` }}
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
        <button className={styles.filterBtn}>
          <Filter size={18} /> Categorias <ChevronDown size={16} />
        </button>
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
                <button className={styles.btnDetails}>Ver detalle</button>
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
    </div>
  );
};
