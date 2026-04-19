import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { StatsGrid } from './StatsGrid';
import { ManagementGrid } from './ManagementGrid';

export const DashboardAdmin: React.FC = () => {
  return (
    <MainLayout>
      {/* Contenedor con ancho completo y centrado */}
      <div className="w-full flex flex-col items-center"> 
        <div className="w-full"> {/* Este div asegura que el texto empiece a la izquierda del centro */}
          <header className="mb-12">
            <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Administrador</h1>
            <p className="text-slate-400 mt-1 font-light">
              Bienvenido al sistema de gestión y Navegación
            </p>
          </header>

          <StatsGrid />
          
          <div className="mt-10">
            <ManagementGrid />
          </div>
        </div>

        <footer className="text-center mt-16 text-xs text-slate-500 font-light pb-10">
          Sistema de Gestión Marítima V.1
        </footer>
      </div>
    </MainLayout>
  );
};