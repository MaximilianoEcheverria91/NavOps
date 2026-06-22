import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Anchor, Plus, X, Calendar, Clock, Save, Route, Info, Navigation, Ship } from 'lucide-react';
import styles from './SelectRoute.module.css';
import { getAllPorts } from '../../../../services/api/portService';
import type { PortSummaryResponse } from '../../../../types/port';
import { ConfirmModal } from '../../../../components/ui/ConfirmModal/ConfirmModal';
import { PortDetailModal } from '../../../ports/DetailPort/PortDetailModal';

// FIX SENIOR VITE: Evita problemas de iconos con react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

interface SelectRouteProps {
  onSaveSelection: (routeData: any) => void;
  onCancel: () => void;
  initialRouteData?: any;
}

// 🚀 COMPONENTE CONTROLADOR DE LEAFLET: Permite centrar la cámara dinámicamente
const MapCenterController: React.FC<{ targetCoords: [number, number] | null }> = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 7, { animate: true, duration: 1.5 }); // Vuela suavemente al puerto encontrado
    }
  }, [targetCoords, map]);
  return null;
};


export const SelectRoute: React.FC<SelectRouteProps> = ({ onSaveSelection, onCancel, initialRouteData }) => {
  const [ports, setPorts] = useState<PortSummaryResponse[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapTarget, setMapTarget] = useState<[number, number] | null>(null);

  // 🚀 HIDRATACIÓN DE ESTADOS LOCALES: Si ya existía una ruta guardada en el padre, se levanta al instante
  const [origin, setOrigin] = useState<PortSummaryResponse | null>(initialRouteData?.origin || null);
  const [destination, setDestination] = useState<PortSummaryResponse | null>(initialRouteData?.destination || null);
  const [stops, setStops] = useState<PortSummaryResponse[]>(initialRouteData?.stops || []);
  
  // Interacciones
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [detailPortId, setDetailPortId] = useState<string | null>(null);

  // Fechas y horas hidratadas dinámicamente
  const [depDate, setDepDate] = useState(initialRouteData?.departureDate || '');
  const [depTime, setDepTime] = useState(initialRouteData?.departureTime || '');

  // 1. Obtener puertos de la API
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const data = await getAllPorts();
        setPorts(data);
      } catch (error) {
        console.error('Error al cargar puertos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPorts();
  }, []);

  const hasModifications = origin !== null || destination !== null || stops.length > 0 || depDate !== '' || depTime !== '';

  // Interceptor Flecha Atrás
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (hasModifications) {
        window.history.pushState(null, '', window.location.href);
        setShowConfirm(true);
      } else {
        onCancel();
      }
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [hasModifications, onCancel]);

  // 2. Filtrado en tiempo real (Soporta Código ISO / Patente / Ciudad)
  const filteredPorts = useMemo(() => {
    if (!search) return ports;
    const s = search.toLowerCase();
    return ports.filter(p => 
      p.name?.toLowerCase().includes(s) ||
      p.countryName?.toLowerCase().includes(s) ||
      p.provinceName?.toLowerCase().includes(s) ||
      p.cityName?.toLowerCase().includes(s) ||
      p.code?.toLowerCase().includes(s)
    );
  }, [ports, search]);

  // 🚀 MANEJADOR DE ENTER EN BUSCADOR: Hace foco inmediato en el mapa
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredPorts.length > 0) {
      const mainPort = filteredPorts[0];
      setMapTarget([mainPort.latitude, mainPort.longitude]);
    }
  };

  // 3. Fórmula de Haversine
  const calculateHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3440.065; // Radio en Millas Náuticas (NM)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 4. Lógica de Trazado de Ruta Dinámica
  const handleMarkerClick = (port: PortSummaryResponse) => {
    if (isAddingStop) {
      if (origin?.id === port.id || destination?.id === port.id || stops.find(s => s.id === port.id)) return;
      setStops(prev => [...prev, port]);
      setIsAddingStop(false);
    } else if (!origin) {
      setOrigin(port);
    } else if (!destination && origin.id !== port.id) {
      setDestination(port);
    }
  };

  // 5. CÁLCULO DE ETAS PARCIALES Y ARRIBOS (CRUZA DÍAS TOTALES)
  const routeCalculations = useMemo(() => {
    if (!origin) return { totalDistance: 0, etaHours: 0, totalDays: 0, stopArrivals: [] as string[] };
    
    let currentDistance = 0;
    let currentPoint = origin;
    const stopArrivals: string[] = [];

    // Fechas base
    const baseDate = depDate && depTime ? new Date(`${depDate}T${depTime}`) : null;

    // Calcular distancia y ETA parcial de cada parada
    stops.forEach((stop, index) => {
      const legDistance = calculateHaversineDistance(currentPoint.latitude, currentPoint.longitude, stop.latitude, stop.longitude);
      currentDistance += legDistance;
      
      if (baseDate && !isNaN(baseDate.getTime())) {
        const partialEtaHours = currentDistance / 15;
        const arrivalMs = baseDate.getTime() + (partialEtaHours * 60 * 60 * 1000);
        const arrivalDate = new Date(arrivalMs);
        stopArrivals.push(`${arrivalDate.getDate()}/${arrivalDate.getMonth() + 1} ${arrivalDate.toTimeString().substring(0, 5)}hs`);
      } else {
        stopArrivals.push('-');
      }
      currentPoint = stop;
    });

    // Tramo final al destino
    if (destination) {
      currentDistance += calculateHaversineDistance(currentPoint.latitude, currentPoint.longitude, destination.latitude, destination.longitude);
    }

    const finalDistance = Math.round(currentDistance);
    const finalEtaHours = finalDistance > 0 ? Number((finalDistance / 15).toFixed(1)) : 0;
    
    // Calcular días reales totales redondeados de navegación
    const totalDays = finalEtaHours > 0 ? Math.ceil(finalEtaHours / 24) : 0;

    return {
      totalDistance: finalDistance,
      etaHours: finalEtaHours,
      totalDays,
      stopArrivals
    };
  }, [origin, destination, stops, depDate, depTime]);

  const arrivalInfo = useMemo(() => {
    if (!depDate || !depTime || routeCalculations.totalDistance === 0) return { date: '-', time: '-' };
    const dep = new Date(`${depDate}T${depTime}`);
    if (isNaN(dep.getTime())) return { date: '-', time: '-' };
    
    const arrivalMs = dep.getTime() + (routeCalculations.etaHours * 60 * 60 * 1000);
    const arrivalDate = new Date(arrivalMs);
    
    return {
      date: arrivalDate.toISOString().split('T')[0],
      time: arrivalDate.toTimeString().substring(0, 5)
    };
  }, [depDate, depTime, routeCalculations]);

  // Generación de Marcadores
  const createCustomIcon = (color: string, text: string, size: number) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: ${size > 20 ? '12px' : '10px'}; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">${text}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  };

  const getPortIcon = (port: PortSummaryResponse) => {
    if (origin?.id === port.id) return createCustomIcon('#10b981', 'O', 28);
    if (destination?.id === port.id) return createCustomIcon('#0284c7', 'D', 28);
    const stopIndex = stops.findIndex(s => s.id === port.id);
    if (stopIndex !== -1) return createCustomIcon('#f59e0b', (stopIndex + 1).toString(), 28);
    return createCustomIcon('#64748b', '', 14);
  };

  const routePoints: [number, number][] = [];
  if (origin) routePoints.push([origin.latitude, origin.longitude]);
  stops.forEach(s => routePoints.push([s.latitude, s.longitude]));
  if (destination) routePoints.push([destination.latitude, destination.longitude]);

    const resetSelection = () => {
    setOrigin(null);
    setDestination(null);
    setStops([]);
    setDepDate('');
    setDepTime('');
    setIsAddingStop(false);
  };

   const handleCancelClick = () => {
    if (hasModifications) {
      setShowConfirm(true);
    } else {
      onCancel();
    }
  };
  
  const handleSave = () => {
    if (!origin || !destination || !depDate || !depTime) return;
    onSaveSelection({
      origin,
      destination,
      stops,
      totalDistance: routeCalculations.totalDistance,
      etaHours: routeCalculations.etaHours,
      totalDays: routeCalculations.totalDays, // 👈 Pasamos también los días totales que nos pidió el PO
      departureDate: depDate,
      departureTime: depTime,
      arrivalDate: arrivalInfo.date,
      arrivalTime: arrivalInfo.time
    });
  };

  return (
    <>
      {/* 🚀 ENCABEZADO ESTRUCTURAL DE LA PÁGINA (Unificado con el Layout del Wizard) */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gestión de Ruta Marítima</h1>
          <p className={styles.pageSubtitle}>Bienvenido al sistema de gestión y Navegación</p>
        </div>
        <div>
          {/* Botón superior estilizado formalmente */}
          <button className={styles.topCancelBtn} onClick={handleCancelClick}>
            Cancelar y Volver
          </button>
        </div>
      </div>
      
      {/* Línea divisoria superfina */}
      <div className={styles.headerDivider} />

      <div className={styles.container}>
        
        {/* PANEL IZQUIERDO: MAPA INTERACTIVO */}
        <div className={styles.leftColumn}>
          <div className={styles.searchFloating} style={{ left: '20px', transform: 'none' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Buscar puerto, país, ciudad o ISO + Enter..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>

          <div className={styles.mapWrapper}>
            {!loading && (
              <MapContainer 
                center={[-38.4161, -63.6167]} 
                zoom={5} 
                style={{ width: '100%', height: '100%', zIndex: 1 }}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <MapCenterController targetCoords={mapTarget} />

                {filteredPorts.map(port => (
                  <Marker 
                    key={port.id} 
                    position={[port.latitude, port.longitude]}
                    icon={getPortIcon(port)}
                    eventHandlers={{ click: () => handleMarkerClick(port) }}
                  >
                    <Popup closeButton={false}>
                      <div className={styles.mapTooltip}>
                        <div className={styles.tooltipHeader}>
                          <strong>{port.name}</strong>, {port.countryName}<br/>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{port.provinceName}, {port.cityName}</span>
                        </div>
                        <span className={`${styles.tooltipStatus} ${port.isActive ? styles.statusActive : styles.statusInactive}`}>{port.status}</span>
                        <button className={styles.tooltipBtn} onClick={(e) => { e.stopPropagation(); setDetailPortId(port.id); }}>
                          <Info size={14} /> Ver Ficha Técnica
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {routePoints.length > 1 && <Polyline positions={routePoints} color="#0284c7" weight={3} dashArray="8, 8" />}
              </MapContainer>
            )}
          </div>
        </div>  
        
        {/* PANEL DERECHO: DETALLES DE TRAVESÍA */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeaderArea}>
            <h2><Route size={20} color="#0284c7" /> Trazado e Itinerario</h2>
          </div>

          {/* Origen */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}><Anchor size={16} /> Puerto de Origen</h3>
            {origin ? (
              <div className={`${styles.portBox} ${styles.portBoxCompleted}`}>
                <div className={`${styles.portBoxIcon} ${styles.iconOrigin}`}><MapPin size={18} /></div>
                <div className={styles.portInfo}>
                  <div className={styles.portName}>{origin.name}</div>
                  <div className={styles.portCoords}>{origin.latitude.toFixed(2)}, {origin.longitude.toFixed(2)}</div>
                </div>
              </div>
            ) : (
              <div className={`${styles.portBox} ${styles.portBoxEmpty}`}>Haz clic en el mapa para iniciar zarpada</div>
            )}
          </div>

          {/* Paradas Intermedias con ETA Parcial */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}><Ship size={16} /> Destinos Intermedios (Waypoints)</h3>
            <div className={styles.portList}>
              {stops.map((stop, idx) => (
                <div key={idx} className={styles.portBox}>
                  <div className={`${styles.portBoxIcon} ${styles.iconStop}`}>{idx + 1}</div>
                  <div className={styles.portInfo}>
                    <div className={styles.portName}>{stop.name}</div>
                    <div className={styles.portCoords}>Arribo aprox: <strong style={{color: '#f59e0b'}}>{routeCalculations.stopArrivals[idx]}</strong></div>
                  </div>
                  <button className={styles.removeStopBtn} onClick={() => setStops(prev => prev.filter((_, i) => i !== idx))}>
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button className={`${styles.addStopBtn} ${isAddingStop ? styles.addStopBtnActive : ''}`} onClick={() => setIsAddingStop(!isAddingStop)}>
                <Plus size={16} /> {isAddingStop ? 'Haz clics marítimos en el mapa...' : 'Agregar Parada / Waypoint'}
              </button>
            </div>
          </div>

          {/* Destino */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}><Anchor size={16} /> Destino Final</h3>
            {destination ? (
              <div className={`${styles.portBox} ${styles.portBoxDestinationCompleted}`}>
                <div className={`${styles.portBoxIcon} ${styles.iconDestination}`}><MapPin size={18} /></div>
                <div className={styles.portInfo}>
                  <div className={styles.portName}>{destination.name}</div>
                  <div className={styles.portCoords}>{destination.latitude.toFixed(2)}, {destination.longitude.toFixed(2)}</div>
                </div>
              </div>
            ) : (
              <div className={`${styles.portBox} ${styles.portBoxEmpty}`}>Selecciona el puerto de arribo final</div>
            )}
          </div>

          {/* Estadísticas (Incluye Días Totales de Travesía) */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}><Navigation size={16} /> Métricas de Ruta</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Distancia Total</div>
                <div className={styles.statValue}>{routeCalculations.totalDistance.toLocaleString()} NM</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statLabel}>Duración del Viaje</div>
                <div className={styles.statValue} style={{ color: 'var(--text-primary' }}>{routeCalculations.totalDays} Días Totales</div>
              </div>
            </div>
          </div>

          {/* Programación (Inputs Reacomodados Verticalmente en Bloques) */}
          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}><Calendar size={16} /> Programación e Itinerario</h3>
            <div className={styles.scheduleBox}>
              
              {/* Bloque Salida */}
              <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className={styles.inputGroup}>
                  <label style={{ fontWeight: 600, color: '#10b981' }}>Fecha de Partida</label>
                  <input type="date" value={depDate} onChange={e => setDepDate(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label style={{ fontWeight: 600, color: '#10b981' }}>Hora de Partida</label>
                  <input type="time" value={depTime} onChange={e => setDepTime(e.target.value)} />
                </div>
              </div>

              {/* Bloque Llegada */}
              <div style={{ borderLeft: '3px solid #0284c7', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div className={styles.inputGroup}>
                  <label style={{ fontWeight: 600, color: '#0284c7' }}>Fecha de Llegada Estimada (ETA)</label>
                  <input type="text" value={arrivalInfo.date} disabled style={{ cursor: 'not-allowed' }} />
                </div>
                <div className={styles.inputGroup}>
                  <label style={{ fontWeight: 600, color: '#0284c7' }}>Hora de Llegada Estimada (ETA)</label>
                  <input type="text" value={arrivalInfo.time} disabled style={{ cursor: 'not-allowed' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Acciones Finales */}
          <div className={styles.footerActions}>
            <button className={styles.resetBtn} onClick={resetSelection}>Reiniciar Selección</button>
            <button className={styles.saveBtn} onClick={handleSave} disabled={!origin || !destination || !depDate || !depTime}>
              <Save size={16} /> Guardar Ruta
            </button>
          </div>
        </div>

      </div>

      <ConfirmModal isOpen={showConfirm} title="¿Descartar cambios de ruta?" description="Si cancelas perderás el trazado completo cargado en el mapa." onConfirm={onCancel} onCancel={() => setShowConfirm(false)} />
      {detailPortId && <PortDetailModal portId={detailPortId} onClose={() => setDetailPortId(null)} showActions={false} />}
    </>
  );
};