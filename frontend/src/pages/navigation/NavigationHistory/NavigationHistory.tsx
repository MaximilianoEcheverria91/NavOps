import React from 'react';
import { MainLayout } from '../../../layouts/MainLayout';
import { History } from 'lucide-react';

export const NavigationHistory: React.FC = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl text-[var(--text-secondary)] font-medium flex items-center gap-3">
            <History size={28} /> Historial de Travesías
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Registro histórico de todos los planes de navegación completados</p>
        </header>
        <div className="flex flex-col items-center justify-center py-24 text-slate-500">
          <History size={64} className="mb-4 opacity-30" />
          <p className="text-lg">No hay travesías en el historial aún.</p>
        </div>
      </div>
    </MainLayout>
  );
};
