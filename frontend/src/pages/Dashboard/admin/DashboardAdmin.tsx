import React from 'react';
import { MainLayout } from '../../../layouts/MainLayout';
import { StatsGrid } from './StatsGrid';
import { ManagementGrid } from './ManagementGrid';

export const DashboardAdmin: React.FC = () => {


  return (
    <MainLayout>

      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-3xl text-[var(--text-secondary)]"> 
            Panel de Administrador
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Bienvenido al sistema de gestión y navegación
          </p>
        </header>

        {/* STATS */}
        <StatsGrid />

        {/* MANAGEMENT */}
        <div className="mt-6">
          <ManagementGrid />
        </div>

        {/* FOOTER */}
        <footer className="text-center mt-10 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>

      </div>
    </MainLayout>
  );
};