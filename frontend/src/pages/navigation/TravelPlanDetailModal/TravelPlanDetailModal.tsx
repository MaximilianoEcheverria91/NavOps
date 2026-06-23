import React, { useState, useEffect, useMemo } from 'react';
import { Download, X, Package, Anchor, Calendar, MapPin, Navigation, Users, Ship } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getVoyageFullDetail } from '../../../services/api/voyageService';
import type { VoyageFullDetailResponse } from '../../../types/voyageTypes';
import styles from './TravelPlanDetailModal.module.css'; // Importación mandatoria del módulo

// IMPORTACIONES DE TUS ARRAYS DE ENUMS NACOES
import { CARGO_CATEGORIES } from '../../../types/cargoType';
import { SHIP_TYPES } from '../../../types/shipEnums';
import { TRAVEL_PLAN_STATUS } from '../../../types/travelPlan';
import { POSITIONS } from '../../../types/userEnums';
import { CARGO_TYPES} from '../../../types/cargoType';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const createCustomIcon = (color: string, text: string, size: number) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: ${size > 20 ? '12px' : '10px'}; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">${text}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const MapResizeTrigger: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

interface TravelPlanDetailModalProps {
  planId: string;
  onClose: () => void;
}

type TabType = 'ROUTE' | 'CARGO' | 'CREW' | 'STATS';

export const TravelPlanDetailModal: React.FC<TravelPlanDetailModalProps> = ({ planId, onClose }) => {
  const [data, setData] = useState<VoyageFullDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('ROUTE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const detail = await getVoyageFullDetail(planId);
        setData(detail);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los detalles del viaje');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [planId]);

  const { ship, route, cargo, crewMembers } = data || {};

  // FUNCIONES AUXILIARES DE TRADUCCIÓN DE ENUMS
  const getStatusLabel = (statusKey: string) => {
    const found = TRAVEL_PLAN_STATUS.find(s => s.value === statusKey);
    return found ? found.label : statusKey;
  };

  const getShipTypeLabel = (typeKey: string) => {
    const found = SHIP_TYPES.find(t => t.value === typeKey);
    return found ? found.label : typeKey;
  };

  const getCargoCategoryLabel = (categoryKey: string) => {
    const found = CARGO_CATEGORIES.find(c => c.value === categoryKey);
    return found ? found.label : categoryKey;
  };

  const getCargoTypeLabel = (cargoTypeKey: string) => {
    const found = CARGO_TYPES.find(c => c.value === cargoTypeKey);
    return found ? found.label : cargoTypeKey;
  };

  const getCrewPositionLabel = (roleKey: string) => {
    const found = POSITIONS.find(p => p.value === roleKey);
    return found ? found.label : roleKey;
  };

  const coordinatesPath = useMemo<[number, number][]>(() => {
    if (!route) return [];
    const path: [number, number][] = [];
    if (route.originLatitude && route.originLongitude) {
      path.push([route.originLatitude, route.originLongitude]);
    }
    if (route.stops && Array.isArray(route.stops)) {
      const sortedStops = [...route.stops].sort((a, b) => a.sequence - b.sequence);
      sortedStops.forEach(stop => {
        if (stop.latitude && stop.longitude) {
          path.push([stop.latitude, stop.longitude]);
        }
      });
    }
    if (route.destinationLatitude && route.destinationLongitude) {
      path.push([route.destinationLatitude, route.destinationLongitude]);
    }
    return path;
  }, [route]);

  const mapBounds = useMemo(() => {
    if (coordinatesPath.length === 0) return undefined;
    return L.latLngBounds(coordinatesPath);
  }, [coordinatesPath]);

  const utilizedCapacityPercentage = useMemo(() => {
    if (!cargo || !cargo.shipCargoCapacityTonnes || cargo.shipCargoCapacityTonnes === 0) return 0;
    return (cargo.totalCargoTonnes / cargo.shipCargoCapacityTonnes) * 100;
  }, [cargo]);

  if (loading) {
    return (
      <div className={styles.navopsModalOverlay}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data || !ship || !route || !cargo) {
    return (
      <div className={styles.navopsModalOverlay} onClick={onClose}>
        <div className={styles.navopsModalContent} style={{ maxWidth: '400px', padding: '20px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-center text-white">Error</h2>
          <p className="text-slate-400 mb-6 text-center">{error || 'No se encontró información'}</p>
          <button onClick={onClose} className="w-full py-2 bg-blue-600 rounded-lg text-white font-medium">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.navopsModalOverlay} onClick={onClose}>
      <div className={styles.navopsModalContent} onClick={e => e.stopPropagation()}>
        
        {/* FILA SUPERIOR DE TÍTULO Y ACCIONES */}
        <div className={styles.navopsHeaderTopRow}>
          <div className={styles.navopsTitleArea}>
            <Ship className="h-6 w-6 text-sky-400 " />
            <span>Detalle de travesía</span>
          </div>

          <div className={styles.navopsActionArea}>
            <button className="flex items-center gap-2 border border-[#1e3a5f] bg-[#0c1f38]/80 rounded-xl px-4 py-1.5 text-white text-xs font-medium hover:bg-[#132841] transition-colors">
              <span>Descargar</span>
              <Download className="h-3.5 w-3.5" />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-[#0c1f38]/80 rounded-xl border border-[#1e3a5f] transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* CONTENEDOR DE LA IMAGEN HERO */}
        <div className={styles.navopsModalHero}>
          {ship.mainImageUrl ? (
            <img src={ship.mainImageUrl} alt={ship.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">Sin Imagen Disponible</div>
          )}
          <div className={styles.navopsModalGradient} />

          {/* ESTADO TRADUCIDO */}
          <div className="absolute top-4 right-8 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider z-10">
            {getStatusLabel(data.status)}
          </div>

          <div className="absolute bottom-4 left-8 flex items-center gap-2 text-white z-10">
            <Anchor className="h-6 w-6 right-5 text-sky-400" />
            <span className="text-base font-bold tracking-wider">{ship.name || 'Atlantis'}</span>
          </div>
        </div>

        {/* CUERPO INTERNO DEL MODAL */}
        <div className={styles.navopsModalBody}>
          
          {/* Ficha Técnica */}
          <div className={styles.navopsGridTechnical}>
            <div>
              {/* TIPO DE BARCO TRADUCIDO */}
              <div>Tipo de Barco: <span className="text-white font-medium">{getShipTypeLabel(ship.shipType)}</span></div>
              <div>Matricula: <span className="text-white font-medium">{ship.registration || 'CFR-4538-RRE'}</span></div>
            </div>
            <div>
              <div>Numero de casco: <span className="text-white font-medium">{ship.hullNumber || '200-123ds-as'}</span></div>
              <div>Cantidad de bodega: <span className="text-white font-medium">{ship.holdCount || 4}</span></div>
            </div>
            <div>
              <div>Capacidad de tripulantes: <span className="text-white font-medium">200</span></div>
              <div>Capacidad: <span className="text-white font-medium">{ship.cargoCapacityTonnes?.toLocaleString() || '4.500'} Toneladas</span></div>
            </div>
          </div>

          {/* BARRA DE PESTAÑAS */}
          <div className={styles.navopsTabsContainer}>
            <button 
              onClick={() => setActiveTab('ROUTE')} 
              className={`${styles.navopsTabBtn} ${activeTab === 'ROUTE' ? styles.active : ''}`}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Ruta</span>
            </button>
            <button 
              onClick={() => setActiveTab('CARGO')} 
              className={`${styles.navopsTabBtn} ${activeTab === 'CARGO' ? styles.active : ''}`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Carga</span>
            </button>
            <button 
              onClick={() => setActiveTab('CREW')} 
              className={`${styles.navopsTabBtn} ${activeTab === 'CREW' ? styles.active : ''}`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Tripulación</span>
            </button>
          </div>

          {/* Caja Envolvente Dinámica */}
          <div className={styles.navopsDynamicBox}>
            
            {/* PESTAÑA: RUTA */}
            {activeTab === 'ROUTE' && (
              <div className={styles.navopsRouteLayout}>
                <div className={`${styles.navopsRouteInfoPanel} text-xs pr-2 overflow-y-auto`}>
                  <span className={styles.navopsRouteSectionTitle}>Plan de Navegación</span>
                  
                  <div className={styles.navopsTimeline}>
                    <div className={styles.navopsTimelineItem}>
                      <div className={`${styles.navopsTimelineIcon} ${styles.bgOrigin}`} />
                      <span className={styles.navopsTimelineLabel}>Origen</span>
                      <p className={styles.navopsTimelineValue}>{route.originPortName || 'Mar del Plata'}</p>
                      <span className={styles.navopsTimelineDetail}>
                        <Calendar size={12} /> Salida 14 Junio / 07:30 Hs
                      </span>
                    </div>

                    <div className={styles.navopsTimelineMetrics}>
                      <div>
                        <Navigation size={12} className="rotate-45 text-sky-400" />
                        <span>Distancia: <strong className="text-slate-200">{route.distanceMiles || '10.187'} Millas Nauticas</strong></span>
                      </div>
                      <div>
                        <Calendar size={12} className="text-sky-400" />
                        <span>Duración: <strong className="text-slate-200">27 Días</strong></span>
                      </div>
                      <div>
                        <Navigation size={12} className="text-sky-400" />
                        <span>Cantidad de escalas: <strong className="text-slate-200">{route.stopsCount || 2}</strong></span>
                      </div>
                    </div>

                    <div className={styles.navopsTimelineItem}>
                      <div className={`${styles.navopsTimelineIcon} ${styles.bgDestination}`} />
                      <span className={styles.navopsTimelineLabel}>Destino</span>
                      <p className={styles.navopsTimelineValue}>{route.destinationPortName || 'Puerto Madryn'}</p>
                      <span className={styles.navopsTimelineDetail}>
                        <Calendar size={12} /> Llegada 16 Agosto / 07:30 Hs
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.navopsMapWrapper}>
                  {coordinatesPath.length > 0 ? (
                   <MapContainer
                      bounds={mapBounds}
                      style={{ width: '100%', height: '100%', minHeight: '290px', position: 'relative' }}
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <MapResizeTrigger />
                      <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                      />
                      
                      {route.originLatitude !== undefined && route.originLongitude !== undefined && (
                        <Marker 
                          position={[route.originLatitude, route.originLongitude] as [number, number]}
                          icon={createCustomIcon('#10b981', 'O', 24)}
                        >
                          <Popup><strong>Origen:</strong> {route.originPortName}</Popup>
                        </Marker>
                      )}

                      {route.stops && [...route.stops].sort((a, b) => a.sequence - b.sequence).map((stop, index) => (
                        stop.latitude !== undefined && stop.longitude !== undefined ? (
                          <Marker 
                            key={stop.id}
                            position={[stop.latitude, stop.longitude] as [number, number]}
                            icon={createCustomIcon('#f59e0b', (index + 1).toString(), 24)}
                          >
                            <Popup><strong>Escala {index + 1}:</strong> {stop.portName}</Popup>
                          </Marker>
                        ) : null
                      ))}

                      {route.destinationLatitude !== undefined && route.destinationLongitude !== undefined && (
                        <Marker 
                          position={[route.destinationLatitude, route.destinationLongitude] as [number, number]}
                          icon={createCustomIcon('#0284c7', 'D', 24)}
                        >
                          <Popup><strong>Destino:</strong> {route.destinationPortName}</Popup>
                        </Marker>
                      )}

                      {coordinatesPath.length > 1 && (
                        <Polyline 
                          positions={coordinatesPath} 
                          color="#38bdf8" 
                          weight={3} 
                          dashArray="5, 10" 
                        />
                      )}
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-sky-500/5">
                      <MapPin className="text-sky-400 h-8 w-8 mb-1 animate-pulse" />
                      <span className="text-sky-300 font-medium">Sin coordenadas</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA: CARGA */}
            {activeTab === 'CARGO' && (
              <div className={styles.navopsCargoLayout}>
                <span className={styles.navopsCargoMainTitle}>Carga Transportada</span>
                
                <div className={styles.navopsCapacityContainer}>
                  <div className={styles.navopsCapacityHeader}>
                    <span>Capacidad Utilizada</span>
                    <span>
                      {cargo.totalCargoTonnes?.toLocaleString() || '0'}/
                      {cargo.shipCargoCapacityTonnes?.toLocaleString() || '0'} Ton
                    </span>
                  </div>
                  <div className={styles.navopsProgressBarTrack}>
                    <div 
                      className={styles.navopsProgressBarFill} 
                      style={{ width: `${Math.min(utilizedCapacityPercentage, 100)}%` }}
                    />
                  </div>
                  <div className={styles.navopsCapacityFooter}>
                    <span>{utilizedCapacityPercentage.toFixed(0)} %</span>
                  </div>
                </div>

                <div className={styles.navopsCargoCardsScrollArea}>
                  {cargo.items && cargo.items.map((item) => (
                    <div key={item.id} className={styles.navopsCargoCard}>
                      
                      <div className={styles.navopsCargoHeader}>
                        <h4>
                          {item.productName}{' '}
                          <span>/ {item.owningCompany}</span>
                        </h4>
                        {/* CATEGORÍA DE CARGA TRADUCIDA */}
                        <span className={styles.navopsCargoSubcategory}>
                          {getCargoCategoryLabel(item.productCategory)}
                        </span>
                      </div>

                      <div className={styles.navopsCargoMetricsGrid}>
                        <div>
                          <span>T. de carga</span>
                          <strong>{getCargoTypeLabel(item.cargoType)}</strong>
                        </div>
                        <div>
                          <span>Cantidad</span>
                          <strong>{item.quantity}</strong>
                        </div>
                        <div>
                          <span>Peso por unidad</span>
                          <strong>{item.weightTonnes}</strong>
                        </div>
                        <div>
                          <span>Peso total</span>
                          <strong>{item.weightTonnes * item.quantity}</strong>
                        </div>
                        <div>
                          <span>Volumen total</span>
                          <strong>{item.volumeM3} m³</strong>
                        </div>
                      </div>

                      <div className={styles.navopsCargoIconWrapper}>
                        <Package className="h-5 w-5 text-sky-400" />
                      </div>

                    </div>
                  ))}
                  
                  {(!cargo.items || cargo.items.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No hay cargamento registrado en este viaje.
                    </div>
                  )}
                </div>
              </div>
            )}

           {/* PESTAÑA: TRIPULACIÓN */}
            {activeTab === 'CREW' && (
              <div className={styles.navopsCrewLayout}>
                <span className={styles.navopsCrewMainTitle}>Tripulación Asignada</span>
                
                <div className={styles.navopsCrewCardsScrollArea}>
                  {crewMembers && crewMembers.map((member) => (
                    <div key={member.id} className={styles.navopsCrewCard}>
                      <img 
                        src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName || 'U')}&background=031930&color=fff`} 
                        alt={member.fullName}
                        className={styles.navopsCrewAvatar}
                      />
                      <div className={styles.navopsCrewInfo}>
                        <h4>{member.fullName || 'Diego Hernan Torres'}</h4>
                        {/* RANGO / ROL TRADUCIDO */}
                        <p className={styles.navopsCrewRole}>
                          {getCrewPositionLabel(member.role)}
                        </p>
                        <span className={styles.navopsCrewFileId}>
                          Legajo: <strong>{member.fileNumber || 'E97961'}</strong>
                        </span>
                      </div>
                    </div>
                  ))}

                  {(!crewMembers || crewMembers.length === 0) && (
                    <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No hay tripulantes asignados a esta travesía.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};