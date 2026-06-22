import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { useUpdateShip } from '../../../hooks/useUpdateShip';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import styles from '../CreateShip/CreateShip.module.css';
import { Loader2 } from 'lucide-react';

export const UpdateShip: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { form, errors, loading, fetching, previewUrl, handleChange, handleImage, handleUpdate } = useUpdateShip(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        handleImage(file);
        setImageError(null);
      } catch (err: any) {
        setImageError(err.message);
      }
    }
  };

  const handleSave = async () => {
    const response = await handleUpdate();
    if (response?.success) {
      setShowModal(true);
    } else {
      console.log('Errores de validación:', response?.error);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/barcos');
  };

  if (fetching) {
    return (
      <MainLayout>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader2 className={styles.spinner} size={40} color="#0ea5e9" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Editar Barco</h1>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </div>

        {/* SECCIÓN 1: FOTOGRAFÍA */}
        <h3 className={styles.sectionTitle}>Fotografía</h3>
        <div className={styles.imageUploadBar}>
          <div className={styles.dropzone} onClick={() => fileInputRef.current?.click()}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <p style={{fontSize: '12px', color: '#0ea5e9', marginTop: '10px'}}>Cargar Foto</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{display: 'none'}}
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
            />
          </div>

          <div className={styles.uploadTextInfo}>
            <span className={styles.recommendedBadge}>Recomendado</span>
            <p style={{fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secundary)'}}>
              Se recomienda una fotografía de perfil del barco con buena iluminación. La imagen debe
              ser clara y mostrar las características principales de la embarcación. Solo PNG/JPG, máx. 5MB.
            </p>
            {imageError && <span className={styles.errorText}>{imageError}</span>}
          </div>
        </div>

        {/* SECCIÓN 2: INFORMACIÓN GENERAL */}
        <h3 className={styles.sectionTitle}>Información General</h3>

        {/* Fila 1: nombre, IMO, matrícula */}
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nombre</label>
            <input
              className={`${styles.input} ${errors['name'] ? styles.inputError : ''}`}
              placeholder="Ej: ARA San Martín"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors['name'] && <span className={styles.errorText}>{errors['name']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>IMO</label>
            <input
              className={`${styles.input} ${errors['imoNumber'] ? styles.inputError : ''}`}
              placeholder="Ej: IMO1234567"
              value={form.imoNumber}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
              onChange={(e) => handleChange('imoNumber', e.target.value)}
            />
            {errors['imoNumber'] && <span className={styles.errorText}>{errors['imoNumber']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Matrícula</label>
            <input
              className={`${styles.input} ${errors['registration'] ? styles.inputError : ''}`}
              placeholder="Ej: AR-00123"
              value={form.registration}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
              onChange={(e) => handleChange('registration', e.target.value)}
            />
            {errors['registration'] && <span className={styles.errorText}>{errors['registration']}</span>}
          </div>
        </div>

        {/* Fila 2: tipo de barco, año, país, estado */}
        <div className={styles.formRow4} style={{marginTop: '30px'}}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tipo de Barco</label>
            <select
              className={`${styles.input} ${errors['shipType'] ? styles.inputError : ''}`}
              value={form.shipType}
              onChange={(e) => handleChange('shipType', e.target.value)}
            >
              <option value="" disabled>
                Seleccionar tipo de barco
              </option>
              <option value="AIRCRAFT_CARRIER">Portaviones</option>
              <option value="DESTROYER">Destructor</option>
              <option value="CORVETTE">Corbeta</option>
              <option value="BARGE">Barcaza</option>
              <option value="FRIGATE">Fragata</option>
              <option value="NOTICE_SHIP">Buque de Aviso</option>
              <option value="PATROL_BOAT">Patrulla</option>
              <option value="OCEAN_PATROL_OPV">Patrullero oceánico OPV</option>
              <option value="SUBMARINE">Submarino</option>
              <option value="LANDING_SHIP">Buque de Desembarco</option>
              <option value="ICEBREAKER">Rompehielos</option>
              <option value="TRAINING_SHIP">Buque Escuela</option>
              <option value="CONTAINER_SHIP">Portacontenedor</option>
              <option value="BULK_CARRIER">Granelero</option>
              <option value="CRUISE_SHIP">Crucero</option>
              <option value="FERRY">Ferry</option>
              <option value="FISHING_VESSEL">Pesquero</option>             
              <option value="HOSPITAL_SHIP">Buque Hospital</option>              
              <option value="PASSENGER_SHIP">Buque de Pasajero</option>              
              <option value="PILOT_BOAT">Barco Piloto</option>
              <option value="RESEARCH_VESSEL">Buque de investigación</option>
              <option value="RO_RO">RO-RO</option>              
              <option value="SAILBOAT">Velero</option>
              <option value="SPEEDBOAT">Lancha</option>              
              <option value="SUPPLY_SHIP">Buque de Suministro</option>
              <option value="TANKER">Petrolero</option>
              <option value="TUGBOAT">Remolque</option>
              <option value="YACHT">Yate</option>          
              <option value="OTHER">Otro</option>    
            </select>
            {errors['shipType'] && <span className={styles.errorText}>{errors['shipType']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Año de Construcción</label>
            <input
              type="number"
              className={`${styles.input} ${errors['buildYear'] ? styles.inputError : ''}`}
              placeholder="Ej: 2005"
              value={form.buildYear}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
              onChange={(e) => handleChange('buildYear', e.target.value)}
            />
            {errors['buildYear'] && <span className={styles.errorText}>{errors['buildYear']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>País</label>
            <select
              className={`${styles.input} ${errors['countryId'] ? styles.inputError : ''}`}
              value={form.countryId}
              onChange={(e) => handleChange('countryId', e.target.value)}
            >
              <option value="">Seleccione un País</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors['countryId'] && <span className={styles.errorText}>{errors['countryId']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Estado</label>
            <select
              className={`${styles.input} ${errors['status'] ? styles.inputError : ''}`}
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="OPERATIONAL">Operativo</option>
              <option value="MAINTENANCE">Mantenimiento</option>
              <option value="REPAIR">Reparación</option>
              <option value="OUT_OF_SERVICE">Fuera de Servicio</option>
            </select>
            {errors['status'] && <span className={styles.errorText}>{errors['status']}</span>}
          </div>
        </div>

        {/* SECCIÓN 3: IDENTIFICACIÓN TÉCNICA */}
        <h3 className={styles.sectionTitle}>Identificación Técnica</h3>
        <div className={styles.formRow2}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Número de Casco</label>
            <input
              className={`${styles.input} ${errors['hullNumber'] ? styles.inputError : ''}`}
              placeholder="Ej: HULL-00456"
              value={form.hullNumber}
              onChange={(e) => handleChange('hullNumber', e.target.value)}
            />
            {errors['hullNumber'] && <span className={styles.errorText}>{errors['hullNumber']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Número de Motor</label>
            <input
              className={`${styles.input} ${errors['serialNumber'] ? styles.inputError : ''}`}
              placeholder="Ej: SN-789ABC"
              value={form.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
            />
            {errors['serialNumber'] && <span className={styles.errorText}>{errors['serialNumber']}</span>}
          </div>
        </div>

        {/* SECCIÓN 4: ESPECIFICACIONES FÍSICAS */}
        <h3 className={styles.sectionTitle}>Especificaciones Físicas</h3>
        <div className={styles.formRow5}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Eslora (m)</label>
            <input
              type="number"
              className={`${styles.input} ${errors['length'] ? styles.inputError : ''}`}
              placeholder="Ej: 120.5"
              value={form.length}
              onChange={(e) => handleChange('length', e.target.value)}
            />
            {errors['length'] && <span className={styles.errorText}>{errors['length']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Manga (m)</label>
            <input
              type="number"
              className={`${styles.input} ${errors['beam'] ? styles.inputError : ''}`}
              placeholder="Ej: 18.0"
              value={form.beam}
              onChange={(e) => handleChange('beam', e.target.value)}
            />
            {errors['beam'] && <span className={styles.errorText}>{errors['beam']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Calado (m)</label>
            <input
              type="number"
              className={`${styles.input} ${errors['draft'] ? styles.inputError : ''}`}
              placeholder="Ej: 6.5"
              value={form.draft}
              onChange={(e) => handleChange('draft', e.target.value)}
            />
            {errors['draft'] && <span className={styles.errorText}>{errors['draft']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Puntal (m)</label>
            <input
              type="number"
              className={`${styles.input} ${errors['depth'] ? styles.inputError : ''}`}
              placeholder="Ej: 10.0"
              value={form.depth}
              onChange={(e) => handleChange('depth', e.target.value)}
            />
            {errors['depth'] && <span className={styles.errorText}>{errors['depth']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Peso en Toneladas</label>
            <input
              type="number"
              className={`${styles.input} ${errors['weightTonnes'] ? styles.inputError : ''}`}
              placeholder="Ej: 5000"
              value={form.weightTonnes}
              onChange={(e) => handleChange('weightTonnes', e.target.value)}
            />
            {errors['weightTonnes'] && <span className={styles.errorText}>{errors['weightTonnes']}</span>}
          </div>
        </div>

        {/* SECCIÓN 5: CAPACIDADES */}
        <h3 className={styles.sectionTitle}>Capacidades</h3>
        <div className={styles.formRow4}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tripulantes</label>
            <input
              type="number"
              className={`${styles.input} ${errors['crewCapacity'] ? styles.inputError : ''}`}
              placeholder="Ej: 25"
              value={form.crewCapacity}
              onChange={(e) => handleChange('crewCapacity', e.target.value)}
            />
            {errors['crewCapacity'] && <span className={styles.errorText}>{errors['crewCapacity']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Bodegas</label>
            <input
              type="number"
              className={`${styles.input} ${errors['holdCount'] ? styles.inputError : ''}`}
              placeholder="Ej: 4"
              value={form.holdCount}
              onChange={(e) => handleChange('holdCount', e.target.value)}
            />
            {errors['holdCount'] && <span className={styles.errorText}>{errors['holdCount']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Carga en Ton</label>
            <input
              type="number"
              className={`${styles.input} ${errors['cargoCapacityTonnes'] ? styles.inputError : ''}`}
              placeholder="Ej: 3000"
              value={form.cargoCapacityTonnes}
              onChange={(e) => handleChange('cargoCapacityTonnes', e.target.value)}
            />
            {errors['cargoCapacityTonnes'] && <span className={styles.errorText}>{errors['cargoCapacityTonnes']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nafta en Litros</label>
            <input
              type="number"
              className={`${styles.input} ${errors['fuelCapacityLiters'] ? styles.inputError : ''}`}
              placeholder="Ej: 50000"
              value={form.fuelCapacityLiters}
              onChange={(e) => handleChange('fuelCapacityLiters', e.target.value)}
            />
            {errors['fuelCapacityLiters'] && <span className={styles.errorText}>{errors['fuelCapacityLiters']}</span>}
          </div>
        </div>

        {/* SECCIÓN 6: MOTOR Y MANTENIMIENTO */}
        <h3 className={styles.sectionTitle}>Motor y Mantenimiento</h3>

        {/* Fila 1: fabricante motor, modelo motor, horas acumuladas */}
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Fabricante del Motor</label>
            <input
              className={`${styles.input} ${errors['engineManufacturer'] ? styles.inputError : ''}`}
              placeholder="Ej: Caterpillar"
              value={form.engineManufacturer}
              onChange={(e) => handleChange('engineManufacturer', e.target.value)}
            />
            {errors['engineManufacturer'] && <span className={styles.errorText}>{errors['engineManufacturer']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Modelo del Motor</label>
            <input
              className={`${styles.input} ${errors['engineModel'] ? styles.inputError : ''}`}
              placeholder="Ej: 3516C"
              value={form.engineModel}
              onChange={(e) => handleChange('engineModel', e.target.value)}
            />
            {errors['engineModel'] && <span className={styles.errorText}>{errors['engineModel']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Horas Acumuladas</label>
            <input
              type="number"
              className={`${styles.input} ${errors['currentEngineHours'] ? styles.inputError : ''}`}
              placeholder="Ej: 12000"
              value={form.currentEngineHours}
              onChange={(e) => handleChange('currentEngineHours', e.target.value)}
            />
            {errors['currentEngineHours'] && <span className={styles.errorText}>{errors['currentEngineHours']}</span>}
          </div>
        </div>

        {/* Fila 2: horas último overhaul, fecha último mantenimiento */}
        <div className={styles.formRow2}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Horas Último Overhaul</label>
            <input
              type="number"
              className={`${styles.input} ${errors['lastTboEngineHours'] ? styles.inputError : ''}`}
              placeholder="Ej: 8000"
              value={form.lastTboEngineHours}
              onChange={(e) => handleChange('lastTboEngineHours', e.target.value)}
            />
            {errors['lastTboEngineHours'] && <span className={styles.errorText}>{errors['lastTboEngineHours']}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Fecha Último Mantenimiento</label>
            <input
              type="date"
              className={`${styles.input} ${errors['lastMaintenanceDate'] ? styles.inputError : ''}`}
              value={form.lastMaintenanceDate}
              onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
            />
            {errors['lastMaintenanceDate'] && <span className={styles.errorText}>{errors['lastMaintenanceDate']}</span>}
          </div>
        </div>

        {/* SECCIÓN 7: ACCIONES */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={() => navigate('/barcos')}>Cancelar</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className={styles.spinner} size={20} />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>

        <p className={styles.footerText}>
          Sistema de Gestión Maritima V.1
        </p>
      </div>

      {showModal && (
        <FeedbackModal
          message="Barco actualizado correctamente"
          onClose={handleConfirmModal}
        />
      )}

    </MainLayout>
  );
};
