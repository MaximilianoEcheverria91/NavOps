import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup} from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';
import L from 'leaflet';
import { MainLayout } from '../../../layouts/MainLayout';
import { useEditPortForm } from '../../../hooks/useEditPortForm';
import { countryCoordinates } from '../../../hooks/useCreatePortForm';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import { getProvincesByCountry } from '../../../services/api/provinceService';
import { getCitiesByProvince } from '../../../services/api/cityService';
import { getAllPorts } from '../../../services/api/portService';
import type { PortSummaryResponse } from '../../../types/port';
import styles from './EditPort.module.css';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

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

function ExistingPortsMarkers({ ports, currentId }: { ports: PortSummaryResponse[], currentId?: string }) {
  return (
    <>
      {ports.filter(p => p.id !== currentId).map((port) => (
        <Marker
          key={port.id}
          position={[port.latitude, port.longitude]}
          opacity={0.6}
        >
          <Popup>Puerto registrado: {port.name}</Popup>
        </Marker>
      ))}
    </>
  );
}

export const EditPort: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    form, errors, image, loading, fetching, 
    selectedCountryName, setSelectedCountryName, 
    selectedProvinceName, selectedCityName, 
    handleChange, handleImage, submit 
  } = useEditPortForm(id);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [existingPorts, setExistingPorts] = useState<PortSummaryResponse[]>([]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  // Robust alignment for Country
  useEffect(() => {
    if (countries.length === 0 || fetching) return;
    const currentId = form.countryId;
    const matchedById = currentId ? countries.find(c => c.id.toLowerCase() === currentId.toLowerCase()) : null;
    
    if (!matchedById && selectedCountryName) {
      const matchedByName = countries.find(c => c.name.trim().toLowerCase() === selectedCountryName.trim().toLowerCase());
      if (matchedByName) handleChange('countryId', matchedByName.id);
    } else if (matchedById && matchedById.id !== currentId) {
      handleChange('countryId', matchedById.id);
    }
  }, [form.countryId, selectedCountryName, countries, fetching]);

  // Robust alignment for Province
  useEffect(() => {
    if (provinces.length === 0 || fetching) return;
    const currentId = form.provinceId;
    const matchedById = currentId ? provinces.find(p => p.id.toLowerCase() === currentId.toLowerCase()) : null;
    
    if (!matchedById && selectedProvinceName) {
      const matchedByName = provinces.find(p => p.name.trim().toLowerCase() === selectedProvinceName.trim().toLowerCase());
      if (matchedByName) handleChange('provinceId', matchedByName.id);
    } else if (matchedById && matchedById.id !== currentId) {
      handleChange('provinceId', matchedById.id);
    }
  }, [form.provinceId, selectedProvinceName, provinces, fetching]);

  // Robust alignment for City
  useEffect(() => {
    if (cities.length === 0 || fetching) return;
    const currentId = form.cityId;
    const matchedById = currentId ? cities.find(c => c.id.toLowerCase() === currentId.toLowerCase()) : null;
    
    if (!matchedById && selectedCityName) {
      const matchedByName = cities.find(c => c.name.trim().toLowerCase() === selectedCityName.trim().toLowerCase());
      if (matchedByName) handleChange('cityId', matchedByName.id);
    } else if (matchedById && matchedById.id !== currentId) {
      handleChange('cityId', matchedById.id);
    }
  }, [form.cityId, selectedCityName, cities, fetching]);

  // Si form trae coordenadas inicialmente, actualizamos el marcador
  useEffect(() => {
    if (form.latitude && form.longitude) {
      const lat = parseFloat(form.latitude);
      const lng = parseFloat(form.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition([lat, lng]);
      }
    }
  }, [form.latitude, form.longitude]);

  // Y para la imagen inicial
  useEffect(() => {
    if (image && !previewUrl) {
      setPreviewUrl(image);
    }
  }, [image, previewUrl]);

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    handleChange('latitude', lat.toFixed(6));
    handleChange('longitude', lng.toFixed(6));
  };

  const handleSave = async () => {
    const response = await submit();
    if (response.success) {
      setShowModal(true);
      setTimeout(() => {
        navigate('/puertos'); 
      }, 2500);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/puertos');
  };

  const handleInputChange = (field: string, value: string) => {
    handleChange(field, value);
    
    const lat = field === 'latitude' ? parseFloat(value) : parseFloat(form.latitude);
    const lng = field === 'longitude' ? parseFloat(value) : parseFloat(form.longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      setMarkerPosition([lat, lng]);
    }
  };

  if (fetching) {
    return (
      <MainLayout>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Loader2 className={styles.spinner} size={48} color="#0ea5e9" />
          <span style={{ marginLeft: 16 }}>Cargando datos del puerto...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Editar Puerto</h1>
          <p className={styles.subtitle}>Modifica los datos del puerto seleccionado</p>
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
            <p style={{fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)'}}>
              Se recomienda una fotografía del Puerto con buena iluminación. La imagen debe
              ser clara y mostrar las características principales de la infraestructura.
            </p>
          </div>
        </div>

        {/* GRID CENTRAL: MAPA + INFO GENERAL */}
        <div className={styles.mainGrid}>
          <div className={styles.mapWrapper}>
            <MapContainer center={markerPosition || [-38.4161, -63.6167]} zoom={markerPosition ? 13 : 4} className={styles.mapContainer}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker onMapClick={handleMapClick} />
              <MapRecenter countryName={selectedCountryName} />
              <MapPanToCoords coords={markerPosition} />
              <ExistingPortsMarkers ports={existingPorts} currentId={id} />
              {markerPosition && <Marker position={markerPosition} />}
            </MapContainer>
          </div>

          <div className={styles.formColumn}>
            <h3 className={styles.sectionTitle} style={{margin: 0}}>Información General</h3>
            
            {/*NOMBRE DEL PUERTO*/}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombres del Puerto</label>
              <input className={`${styles.input} ${errors['name'] ? styles.inputError : ''}`}
                placeholder="Ej: Puerto Mar del Plata"
                value={form.name} 
                onChange={(e) => handleChange('name', e.target.value)} />
              {errors['name'] && <span className={styles.errorText}>{errors['name']}</span>}
            </div>

            {/*CÓDIGO INTERNACIONAL*/}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Código Internacional</label>
              <input className={`${styles.input} ${errors['code'] ? styles.inputError : ''}`}
                placeholder='ARDS1'
                value={form.code} 
                onChange={(e) => handleChange('code', e.target.value.toUpperCase().trim())} />
              {errors['code'] && <span className={styles.errorText}>{errors['code']}</span>}
            </div>

            {/* ESTADO */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado del Puerto</label>
              <select className={`${styles.input} ${errors['status'] ? styles.inputError : ''}`}
                value={form.status} 
                onChange={(e) => handleChange('status', e.target.value)}>
                <option value="OPERATIONAL">Operativo</option>
                <option value="UNDER_MAINTENANCE">En mantenimiento</option>
                <option value="CLOSED">Cerrado</option>
                <option value="FULL">Muelle completo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>

            {/*TIPO DE PUERTO*/}
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
  
            {/*LATITUD*/}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Latitud</label>
              <input 
                className={`${styles.input} ${errors['latitude'] ? styles.inputError : ''}`}
                placeholder='-63.6167'
                value={form.latitude} 
                onChange={(e) => handleInputChange('latitude', e.target.value)} />
                {errors['latitude'] && <span className={styles.errorText}>{errors['latitude']}</span>}
            </div>

            {/*LONGITUD*/}
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
              onChange={(e) => {
                handleChange('countryId', e.target.value);
                handleChange('provinceId', '');
                handleChange('cityId', '');
              }}>
              <option value="">Seleccione un País</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

           {/* FILA: PROVINCIA */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Provincia</label>
            <select 
              className={`${styles.input} ${errors['provinceId'] ? styles.inputError : ''}`}
              value={form.provinceId} 
              onChange={(e) => {
                handleChange('provinceId', e.target.value);
                handleChange('cityId', '');
              }}>
               <option value="">Seleccione una Provincia</option>
                  {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

           {/* FILA: CIUDAD */}
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

             {/* TIPO DE MUELLE */}
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

            {/* CANTIDAD DE MUELLES*/}
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

            {/* ESLORA MAXÍMO */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Eslora maximo permitido</label>
              <input type="number" 
                className={`${styles.input} ${errors['maxLength'] ? styles.inputError : ''}`}
                placeholder='250.5'
                value={form.maxLength} 
                onChange={(e) => handleChange('maxLength', e.target.value)}/>
                {errors['maxLength'] && <span className={styles.errorText}>{errors['maxLength']}</span>}
            </div>

            {/* CALADO MAXÍMO */}
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

          {/* CONTACTO TELÉFONICO */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>N° de teléfono</label>
            <input 
              className={`${styles.input} ${errors['contactPhone'] ? styles.inputError : ''}`}
              placeholder="11 4589 2312"
              value={form.contactPhone} 
              onChange={(e) => handleChange('contactPhone', e.target.value)}/>
              {errors['contactPhone'] && <span className={styles.errorText}>{errors['contactPhone']}</span>} 
          </div>

          {/* CORREO ELECTRONICO */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email</label>
            <input 
              className={`${styles.input} ${errors['contactEmail'] ? styles.inputError : ''}`}
              placeholder="mardelplata@gmail.com.ar"
              value={form.contactEmail} 
              onChange={(e) => handleChange('contactEmail', e.target.value)}/>
              {errors['contactEmail'] && <span className={styles.errorText}>{errors['contactEmail']}</span>} 
            </div>

            {/* SITIÓ WEB */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Sitio Web</label>
            <input 
              className={`${styles.input} ${errors['contactWeb'] ? styles.inputError : ''}`}
              placeholder="www.mardelplata.com.ar"
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
              Actualizando...
              </>
            ) : (
                'Actualizar'
            )}
          </button>
        </div>
        <p className={styles.footerText}>
          Sistema de Gestión Maritima V.1
        </p>
      </div>

       {showModal && (
              <FeedbackModal
                message="El puerto se actualizó correctamente"
                onClose={handleConfirmModal}
              />
            )}

    </MainLayout> 
  );
};
