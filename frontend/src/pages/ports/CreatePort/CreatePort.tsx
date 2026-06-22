import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { MainLayout } from '../../../layouts/MainLayout';
import { useCreatePortForm, countryCoordinates } from '../../../hooks/useCreatePortForm';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import { getProvincesByCountry } from '../../../services/api/provinceService';
import { getCitiesByProvince } from '../../../services/api/cityService';
import { getAllPorts } from '../../../services/api/portService';
import type { PortSummaryResponse } from '../../../types/port';
import styles from './CreatePort.module.css';
import 'leaflet/dist/leaflet.css';
import { Loader2, Info } from 'lucide-react';
import { PortDetailModal } from '../../ports/DetailPort/PortDetailModal';

// Fix Leaflet default icon issue
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapPanToCoords({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] !== 0 && coords[1] !== 0) {
      map.flyTo(coords, 13, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

function LocationMarker({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ countryName }: { countryName: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (countryName && countryCoordinates[countryName]) {
      const coords = countryCoordinates[countryName];
      map.flyTo(coords, 5, { duration: 1.5 });
    }
  }, [countryName, map]);
  return null;
}

export const CreatePort: React.FC = () => {
  const { form, errors, image, loading, selectedCountryName, setSelectedCountryName, handleChange, handleImage, submit } = useCreatePortForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [existingPorts, setExistingPorts] = useState<PortSummaryResponse[]>([]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detailPortId, setDetailPortId] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
    getAllPorts()
      .then((ports) => {
        setExistingPorts(ports.filter((p) => p.latitude && p.longitude));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (form.countryId) {
      setProvinces([]);
      setCities([]);
      
      getProvincesByCountry(form.countryId)
        .then(setProvinces)
        .catch(console.error);

      const selected = countries.find((c) => c.id === form.countryId);
      if (selected) {
        setSelectedCountryName(selected.name);
      }
    } else {
      setProvinces([]);
      setCities([]);
      setSelectedCountryName('');
    }
  }, [form.countryId, countries, setSelectedCountryName]);

  useEffect(() => {
    if (form.provinceId) {
      setCities([]);
      getCitiesByProvince(form.provinceId)
        .then(setCities)
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [form.provinceId]);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    handleChange('latitude', lat.toFixed(6));
    handleChange('longitude', lng.toFixed(6));
  };

  const handleSave = async () => {
    console.log("Intentando guardar... Datos actuales:", form);
    const response = await submit();
    if (response.success) {
      setShowModal(true);
      setTimeout(() => {
        navigate('/puertos'); 
      }, 2500);
    } else {
      console.log("Errores de validación:", response.error);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/usuarios');
  };

  const handleInputChange = (field: string, value: string) => {
    handleChange(field, value);
    const lat = field === 'latitude' ? parseFloat(value) : parseFloat(form.latitude);
    const lng = field === 'longitude' ? parseFloat(value) : parseFloat(form.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition([lat, lng]);
    }
  };

  function ExistingPortsMarkers({ ports, onViewDetail }: { ports: PortSummaryResponse[], onViewDetail: (id: string) => void }) {
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'OPERATIONAL': return 'OPERATIVO';
        case 'UNDER_MAINTENANCE': return 'MANTENIMIENTO';
        case 'CLOSED': return 'CERRADO';
        case 'FULL': return 'LLENO';
        case 'INACTIVE': return 'INACTIVO';
        default: return status || 'DESCONOCIDO';
      }
    };

    return (
      <>
        {ports.map((port) => (
          <Marker
            key={port.id}
            position={[port.latitude, port.longitude]}
            opacity={0.7}
          >
            <Popup closeButton={false}>
              <div className={styles.mapTooltip}>
                <div className={styles.tooltipHeader}>
                  <strong style={{ fontSize: '15px', color: '#ffffff', display: 'block', marginBottom: '2px' }}>
                    {port.name}, {port.countryName}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {port.provinceName}, {port.cityName}
                  </span>
                </div>
                
                <div 
                  className={`${styles.tooltipStatus} ${port.status === 'OPERATIONAL' ? styles.statusActive : styles.statusInactive}`}
                  style={{ marginTop: '8px', marginBottom: '12px' }}
                >
                  {getStatusLabel(port.status)}
                </div>
                
                <button className={styles.tooltipBtn} onClick={(e) => { e.stopPropagation(); onViewDetail(port.id); }}>
                  <Info size={14} /> Ver Ficha Técnica
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Agregar nuevo Puerto</h1>
          <p className={styles.subtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </div>

        {/* SECCIÓN FOTOGRAFÍA */}
        <h3 className={styles.sectionTitle}>Fotografía del Puerto</h3>
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
              <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleImageChange} />
          </div>

          <div className={styles.uploadTextInfo}>
            <span className={styles.recommendedBadge}>Recomendado</span>
            <p style={{fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secundary)'}}>
              Se recomienda una fotografía de perfil del Usuario con buena iluminación. La imagen debe
              ser clara y mostrar las características principales de la embarcación.
            </p>
          </div>
        </div>

        {/* GRID CENTRAL: MAPA + INFO GENERAL */}
        <div className={styles.mainGrid}>
          <div className={styles.mapWrapper}>
            <MapContainer center={[-38.4161, -63.6167]} zoom={4} className={styles.mapContainer}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onMapClick={handleMapClick} />
              <MapRecenter countryName={selectedCountryName} />
              <MapPanToCoords coords={markerPosition} />
              
              {/* 🔥 ENGANCHAMOS CORRECTAMENTE EL CALLBACK PARA PASAR EL ID AL ESTADO */}
              <ExistingPortsMarkers ports={existingPorts} onViewDetail={(id) => setDetailPortId(id)} />
              
              {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
          </div>

          <div className={styles.formColumn}>
            <h3 className={styles.sectionTitle} style={{margin: 0}}>Información General</h3>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombres del Puerto</label>
              <input className={`${styles.input} ${errors['name'] ? styles.inputError : ''}`}
                placeholder="Ej: Puerto Mar del Plata"
                value={form.name} 
                onChange={(e) => handleChange('name', e.target.value)} />
              {errors['name'] && <span className={styles.errorText}>{errors['name']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Código Internacional</label>
              <input className={`${styles.input} ${errors['code'] ? styles.inputError : ''}`}
                placeholder='ARDS1'
                value={form.code} 
                onChange={(e) => handleChange('code', e.target.value.toUpperCase().trim())} />
              {errors['code'] && <span className={styles.errorText}>{errors['code']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de Puerto</label>
              <select className={`${styles.input} ${errors['portType'] ? styles.inputError : ''}`}
                value={form.portType} 
                onChange={(e) => handleChange('portType', e.target.value)}>
                <option value="">Ej: Industrial</option>
                <option value="COMMERCIAL">Comercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="LOGISTIC">Logistica</option>
                <option value="PASSENGER">Pasajero</option>
                <option value="FISHING">Pesca</option>
              </select>
            </div>
  
            <div className={styles.inputGroup}>
              <label className={styles.label}>Latitud</label>
              <input 
                className={`${styles.input} ${errors['latitude'] ? styles.inputError : ''}`}
                placeholder='-63.6167'
                value={form.latitude} 
                onChange={(e) => handleInputChange('latitude', e.target.value)} />
                {errors['latitude'] && <span className={styles.errorText}>{errors['latitude']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Longitud</label>
              <input 
                className={`${styles.input} ${errors['longitude'] ? styles.inputError : ''}`}
                placeholder='-38.4161'
                value={form.longitude} 
                onChange={(e) => handleInputChange('longitude', e.target.value)} />
                {errors['longitude'] && <span className={styles.errorText}>{errors['longitude']}</span>}
            </div>
          </div>
        </div>

        {/* FILA: PAÍS*/}
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>País</label>
            <select 
              className={`${styles.input} ${errors['countryId'] ? styles.inputError : ''}`}
              value={form.countryId} 
              onChange={(e) => handleChange('countryId', e.target.value)}>
              <option value="">Seleccione un País</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Provincia</label>
            <select 
              className={`${styles.input} ${errors['provinceId'] ? styles.inputError : ''}`}
              value={form.provinceId} 
              onChange={(e) => handleChange('provinceId', e.target.value)}>
               <option value="">Seleccione una Provincia</option>
                  {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Localidad</label>
            <select 
              className={`${styles.input} ${errors['cityId'] ? styles.inputError : ''}`}
              value={form.cityId} 
              onChange={(e) => handleChange('cityId', e.target.value)}>
              <option value="">Seleccione una ciudad</option>
                  {cities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* SECCIÓN DATOS TÉCNICOS */}
        <h3 className={styles.sectionTitle}>Datos del Puerto</h3>
        <div className={styles.fullWidthRow} style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de muelle</label>
              <select className={`${styles.input} ${errors['dockType'] ? styles.inputError : ''}`}
                value={form.dockType} 
                onChange={(e) => handleChange('dockType', e.target.value)}>
                <option value="">Ej: Sólido</option>
                <option value="SOLID_STRUCTURE">Solido</option>
                <option value="FLOATING">Flotante</option>
                <option value="PIER_JETTY">Espigon</option>
                <option value="DOLPHIN">Duque de Alba</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Cantidad de Muelles</label>
              <input 
                type="number" 
                placeholder='15'
                className={`${styles.input} ${errors['dockCount'] ? styles.inputError : ''}`}
                value={form.dockCount} 
                onChange={(e) => handleChange('dockCount', e.target.value)}/>
                {errors['dockCount'] && <span className={styles.errorText}>{errors['dockCount']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Eslora maximo permitido</label>
              <input type="number" 
                className={`${styles.input} ${errors['maxLength'] ? styles.inputError : ''}`}
                placeholder='250.5'
                value={form.maxLength} 
                onChange={(e) => handleChange('maxLength', e.target.value)}/>
                {errors['maxLength'] && <span className={styles.errorText}>{errors['maxLength']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Calado maximo permitido</label>
              <input type="number" 
                className={`${styles.input} ${errors['maxDraft'] ? styles.inputError : ''}`}
                placeholder='10.5'
                value={form.maxDraft} 
                onChange={(e) => handleChange('maxDraft', e.target.value)}/>
                {errors['maxDraft'] && <span className={styles.errorText}>{errors['maxDraft']}</span>}
            </div>
        </div>

        {/* FILA: contacto*/}
        <h3 className={styles.sectionTitle}>Contacto</h3>
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>N° de teléfono</label>
            <input 
              className={`${styles.input} ${errors['contactPhone'] ? styles.inputError : ''}`}
              placeholder="11 4589 2312"
              value={form.contactPhone} 
              onChange={(e) => handleChange('contactPhone', e.target.value)}/>
              {errors['contactPhone'] && <span className={styles.errorText}>{errors['contactPhone']}</span>} 
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              className={`${styles.input} ${errors['contactEmail'] ? styles.inputError : ''}`}
              placeholder="mardelplata@gmail.com.ar"
              value={form.contactEmail} 
              onChange={(e) => handleChange('contactEmail', e.target.value)}/>
              {errors['contactEmail'] && <span className={styles.errorText}>{errors['contactEmail']}</span>} 
            </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Sitio Web</label>
            <input 
              className={`${styles.input} ${errors['contactWeb'] ? styles.inputError : ''}`}
              placeholder="mardelplata@gmail.com.ar"
              value={form.contactWeb} 
              onChange={(e) => handleChange('contactWeb', e.target.value)}/>
              {errors['contactWeb'] && <span className={styles.errorText}>{errors['contactWeb']}</span>} 
            </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={() => navigate('/puertos')}>Cancelar</button>
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
            message="Usuario creado correctamente"
            onClose={handleConfirmModal}
          />
        )}

       {/* 🔥 CORRECCIÓN MASTER: El modal de detalle se declara acá afuera del mapa */}
       {detailPortId && (
         <PortDetailModal 
           portId={detailPortId} 
           onClose={() => setDetailPortId(null)} 
           showActions={false} 
         />
       )}

    </MainLayout> 
  );
};