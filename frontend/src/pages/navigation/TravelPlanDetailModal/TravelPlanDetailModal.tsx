import React, { useState, useEffect } from 'react';
import { Download, X, Package, Anchor, Calendar, MapPin, Ship, Navigation, Users } from 'lucide-react';
import { getVoyageFullDetail } from '../../../services/api/voyageService';
import type { VoyageFullDetailResponse } from '../../../types/voyageTypes';
import './TravelPlanDetailModal.css'; // Importación directa del archivo de estilos fijados

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

  if (loading) {
    return (
      <div className="navops-modal-overlay">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="navops-modal-overlay" onClick={onClose}>
        <div className="navops-modal-content" style={{ maxWidth: '400px', padding: '20px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-center">Error</h2>
          <p className="text-slate-400 mb-6 text-center">{error || 'No se encontró información'}</p>
          <button onClick={onClose} className="w-full py-2 bg-blue-600 rounded-lg text-white font-medium">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const { ship, route, cargo, crewMembers } = data;

  return (
    <div className="navops-modal-overlay" onClick={onClose}>
      {/* Ventana Modal */}
      <div className="navops-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* FILA SUPERIOR DE TÍTULO Y ACCIONES */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-[#162e4e]/50 bg-[#07172c] shrink-0">
          <div className="flex items-center gap-2.5 text-white">
            <Navigation className="h-5 w-5 text-sky-400 rotate-45" /> {/* Icono de navegación al estilo de tu diseño */}
            <span className="text-lg font-semibold tracking-wide">Detalle de travesía</span>
          </div>

          <div className="flex items-center gap-3">
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
        <div className="navops-modal-hero">
          {ship.mainImageUrl ? (
            <img src={ship.mainImageUrl} alt={ship.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">Sin Imagen Disponible</div>
          )}
          <div className="navops-modal-gradient" />

          {/* Estado del plan */}
          <div className="absolute top-4 right-5 bg-blue-600 text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider z-10">
            {data.status || 'Programando'}
          </div>

          {/* Nombre de la unidad en la parte inferior */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white z-10">
            <Anchor className="h-4 w-4 text-sky-400" />
            <span className="text-base font-bold tracking-wider">{ship.name || 'Atlantis'}</span>
          </div>
        </div>

        {/* CUERPO INTERNO CON SCROLL DEL MODAL */}
        <div className="navops-modal-body">
          
          {/* Ficha Técnica de 3 Columnas Fijas */}
          <div className="navops-grid-technical">
            <div className="space-y-1">
              <div><span className="text-slate-400">Tipo de Barco:</span> <span className="text-white font-medium">{ship.shipType || 'Destructor'}</span></div>
              <div><span className="text-slate-400">Matricula:</span> <span className="text-white font-medium">{ship.registration || 'CFR-4538-RRE'}</span></div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-400">Numero de casco:</span> <span className="text-white font-medium">{ship.hullNumber || '200-123ds-as'}</span></div>
              <div><span className="text-slate-400">Cantidad de bodega:</span> <span className="text-white font-medium">{ship.holdCount || 4}</span></div>
            </div>
            <div className="space-y-1">
              <div><span className="text-slate-400">Capacidad de tripulantes:</span> <span className="text-white font-medium">200</span></div>
              <div><span className="text-slate-400">Capacidad:</span> <span className="text-white font-medium">{ship.cargoCapacityTonnes?.toLocaleString() || '4.500'} Toneladas</span></div>
            </div>
          </div>

          {/* BARRA DE PESTAÑAS ACTUALIZADA CON ICONOS */}
          <div className="navops-tabs-container">
            <button 
              onClick={() => setActiveTab('ROUTE')} 
              className={`navops-tab-btn flex items-center justify-center gap-2 ${activeTab === 'ROUTE' ? 'active' : ''}`}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Ruta</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('CARGO')} 
              className={`navops-tab-btn flex items-center justify-center gap-2 ${activeTab === 'CARGO' ? 'active' : ''}`}
            >
              <Package className="h-3.5 w-3.5" />
              <span>Carga</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('CREW')} 
              className={`navops-tab-btn flex items-center justify-center gap-2 ${activeTab === 'CREW' ? 'active' : ''}`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Tripulación</span>
            </button>
          </div>

          {/* Caja Envolvente Dinámica */}
          <div className="navops-dynamic-box">
            
            {/* RUTA */}
            {activeTab === 'ROUTE' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch text-xs">
                <div className="md:col-span-2 flex flex-col justify-between">
                  <span className="font-bold text-white block mb-2">Plan de Navegación</span>
                  <div className="relative border-l border-slate-700 ml-2 space-y-4 pb-1">
                    <div className="relative pl-5">
                      <div className="absolute -left-[4px] top-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-500 block text-[10px]">Origen</span>
                      <p className="font-semibold text-white mt-0.5">{route.originPortName || 'Mar del Plata'}</p>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5"><Calendar size={10} /> Salida 14 Junio / 07:30 Hs</span>
                    </div>
                    <div className="relative pl-5 text-[11px] text-slate-400 space-y-0.5">
                      <div>Distancia: <span className="text-slate-200">{route.distanceMiles || '10.187'} MN</span></div>
                      <div>Duración: <span className="text-slate-200">27 Días</span></div>
                      <div>Cantidad de escalas: <span className="text-slate-200">{route.stopsCount || 2}</span></div>
                    </div>
                    <div className="relative pl-5">
                      <div className="absolute -left-[4px] top-1 h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-slate-500 block text-[10px]">Destino</span>
                      <p className="font-semibold text-white mt-0.5">{route.destinationPortName || 'Puerto Madryn'}</p>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5"><Calendar size={10} /> Llegada 16 Agosto / 07:30 Hs</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="w-full h-full min-h-[200px] rounded-xl bg-sky-500/5 flex flex-col items-center justify-center border border-sky-500/20">
                    <MapPin className="text-sky-400 h-8 w-8 mb-1 animate-pulse" />
                    <span className="text-sky-300 font-medium">Mapa interactivo Leaflet</span>
                  </div>
                </div>
              </div>
            )}

            {/* CARGA */}
            {activeTab === 'CARGO' && (
              <div className="space-y-4 text-xs">
                <span className="font-bold text-white block">Carga Transportada</span>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {cargo.items && cargo.items.map((item) => (
                    <div key={item.id} className="bg-[#031930]/60 border border-[#132a4a] rounded-lg p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Package className="text-blue-400 h-4 w-4" />
                        <div>
                          <h4 className="font-semibold text-white">{item.productName || 'Nombre'} <span className="text-slate-400 font-light text-[10px]">/ Dueño</span></h4>
                          <span className="text-[10px] text-slate-500 block">{item.productCategory || 'Categoria'}</span>
                        </div>
                      </div>
                      <div className="flex gap-5 text-slate-300 font-medium text-[11px]">
                        <div><span className="text-[9px] text-slate-500 block">Cantidad</span>5</div>
                        <div><span className="text-[9px] text-slate-500 block">Peso</span>2400</div>
                        <div><span className="text-[9px] text-slate-500 block">Volumen</span>1200 M°</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRIPULACIÓN */}
            {activeTab === 'CREW' && (
              <div className="space-y-3 text-xs">
                <span className="font-bold text-white block">Tripulación Asignada</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                  {crewMembers && crewMembers.map((member) => (
                    <div key={member.id} className="bg-[#031930]/60 border border-[#132a4a] rounded-lg p-2 flex items-center gap-3">
                      <img 
                        src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullName || 'U')}&background=031930&color=fff`} 
                        alt={member.fullName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="font-semibold text-white">{member.fullName || 'Tripulante'}</h4>
                        <p className="text-sky-400 text-[10px]">{member.role || 'Oficial'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};