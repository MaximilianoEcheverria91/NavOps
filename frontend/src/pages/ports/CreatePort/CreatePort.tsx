import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { MainLayout } from '../../../layouts/MainLayout';
import { useCreatePortForm, countryCoordinates } from '../../../hooks/useCreatePortForm';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import { getProvincesByCountry } from '../../../services/api/provinceService';
import { getCitiesByProvince } from '../../../services/api/cityService';
import { getAllPorts, type PortSummaryResponse } from '../../../services/api/portService';
import styles from './CreatePort.module.css';
import 'leaflet/dist/leaflet.css';

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

function ExistingPortsMarkers({ ports }: { ports: PortSummaryResponse[] }) {
  return (
    <>
      {ports.map((port) => (
        <Marker
          key={port.id}
          position={[port.latitude, port.longitude]}
          title={port.name}
        />
      ))}
    </>
  );
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
      getProvincesByCountry(form.countryId).then(setProvinces).catch(console.error);
      const selected = countries.find((c) => c.id === form.countryId);
      if (selected) setSelectedCountryName(selected.name);
    }
  }, [form.countryId, countries, setSelectedCountryName]);

  useEffect(() => {
    if (form.provinceId) {
      getCitiesByProvince(form.provinceId).then(setCities).catch(console.error);
    }
  }, [form.provinceId]);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    handleChange('latitude', lat.toFixed(6));
    handleChange('longitude', lng.toFixed(6));
  };

  const handleSave = async () => {
    const response = await submit();
    if (response.success) setShowModal(true);
  };

  const portTypes = [
    { value: 'COMMERCIAL', label: 'Comercial' },
    { value: 'PASSENGER', label: 'Pasajeros' },
    { value: 'INDUSTRIAL', label: 'Industrial' },
    { value: 'FISHING', label: 'Pesquero' },
  ];

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
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <p style={{fontSize: '12px', color: '#0ea5e9', marginTop: '10px'}}>Cargar Foto</p>
            <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={(e) => e.target.files && handleImage(e.target.files[0])} />
          </div>
          <div className={styles.uploadTextInfo}>
            <span className={styles.recommendedBadge}>Recomendado</span>
            <p style={{fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)'}}>
              Se recomienda una fotografía de perfl del Usuario con buena  iluminación. La imagen debe
              ser clara y mostrar las características  principales de la embarcación.
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
              <ExistingPortsMarkers ports={existingPorts} />
              {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
          </div>

          <div className={styles.formColumn}>
            <h3 className={styles.sectionTitle} style={{margin: 0}}>Información General</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombres del Puerto</label>
              <input className={styles.input} value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Código Internacional</label>
              <input className={styles.input} value={form.code} onChange={(e) => handleChange('code', e.target.value)} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de Puerto</label>
              <select className={styles.input} value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
                <option value="COMMERCIAL">Comercial</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Latitud</label>
              <input className={styles.input} value={form.latitude} readOnly />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Longitud</label>
              <input className={styles.input} value={form.longitude} readOnly />
            </div>
          </div>
        </div>

        {/* FILA: PAÍS, PROVINCIA, LOCALIDAD */}
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>País</label>
            <select className={styles.input} value={form.countryId} onChange={(e) => handleChange('countryId', e.target.value)}>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Provincia</label>
            <select className={styles.input} value={form.provinceId} onChange={(e) => handleChange('provinceId', e.target.value)}>
              {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Localidad</label>
            <select className={styles.input} value={form.cityId} onChange={(e) => handleChange('cityId', e.target.value)}>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* SECCIÓN DATOS TÉCNICOS */}
        <h3 className={styles.sectionTitle}>Datos del Puerto</h3>
        <div className={styles.fullWidthRow} style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de Muelle</label>
              <input className={styles.input} placeholder="Sólido" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cantidad de Muelles</label>
              <input type="number" className={styles.input} value={form.dockCount} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Eslora maximo permitido</label>
              <input type="number" className={styles.input} value={form.dockCount} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Calado maximo permitido</label>
              <input type="number" className={styles.input} value={form.dockCount} />
            </div>
        </div>

        {/* FILA: contacto*/}
        <h3 className={styles.sectionTitle}>Contacto</h3>
        <div className={styles.fullWidthRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>N° de teléfono</label>
            <input className={styles.input} placeholder="Sólido" />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} placeholder="Sólido" />
            </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sitio Web</label>
            <input className={styles.input} placeholder="Sólido" />
            </div>
        </div>

        {/* ACCIONES FINAL */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={() => navigate('/puertos')}>Cancelar</button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Actualizar y Guardar
          </button>
        </div>
      </div>
    </MainLayout> 
  );
};