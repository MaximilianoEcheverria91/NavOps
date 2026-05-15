import React, { useState } from 'react';
import { MainLayout } from '../../../layouts/MainLayout';
import { Search, Filter, User, FileText, Clock, Edit2, Trash2, X } from 'lucide-react';
import styles from './UsersList.module.css';
import { updateUserStatus } from '../../../services/api/userService';
import type { UserResponse } from '../../../services/api/userService';
import { SearchInput } from '../../../components/ui/SearchInput/SearchInput';
import { useNavigate } from 'react-router-dom';
import { UserDetailModal } from '../DetailUser/UserDetailModal';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal/ConfirmationModal';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { FilterSidebar } from '../../../components/ui/FilterSidebar/FilterSidebar';
import { usePersonnelFilters } from '../../../hooks/usePersonnelFilters';
import {
  PERSONAL_STATUSES,
  WORK_STATUSES,
  POSITIONS,
  ACCESS_STATUSES,
  SYSTEM_ROLES
} from '../../../types/userEnums';

export const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navigate = useNavigate();

  const {
    filters,
    handleFilterChange,
    applyFilters,
    resetFilters,
    loadMore,
    data,
    pagination,
    isFetching,
    errorMsg,
    countries,
    provinces,
    cities
  } = usePersonnelFilters();

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await updateUserStatus(userToDelete.id, 'INACTIVE');
      // For now we just refresh the filters to reflect the deleted user
      applyFilters();
      setUserToDelete(null);
      setShowFeedback(true);
    } catch (error: any) {
      console.error('Error al dar de baja al usuario:', error);
      alert('Error al dar de baja: ' + (error?.message || 'Error desconocido'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Local filtering if user wants to search within the fetched data quickly
  const filteredUsers = data.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.surname?.toLowerCase().includes(term) ||
      user.position?.toLowerCase().includes(term) ||
      user.systemRole?.toLowerCase().includes(term) ||
      user.crewMemberStatus?.toLowerCase().includes(term) ||
      user.fileNumber?.toLowerCase().includes(term)
    );
  });

  const getActiveFilters = () => {
    const chips: { key: string, label: string, value: any, displayValue: string }[] = [];
    
    if (filters.countryId) {
      const c = countries.find((x: any) => x.id === filters.countryId);
      if (c) chips.push({ key: 'countryId', label: 'País', value: filters.countryId, displayValue: c.name });
    }
    if (filters.provinceId) {
      const p = provinces.find((x: any) => x.id === filters.provinceId);
      if (p) chips.push({ key: 'provinceId', label: 'Provincia', value: filters.provinceId, displayValue: p.name });
    }
    if (filters.cityId) {
      const c = cities.find((x: any) => x.id === filters.cityId);
      if (c) chips.push({ key: 'cityId', label: 'Ciudad', value: filters.cityId, displayValue: c.name });
    }
    if (filters.minAge) chips.push({ key: 'minAge', label: 'Edad Mín.', value: filters.minAge, displayValue: String(filters.minAge) });
    if (filters.maxAge) chips.push({ key: 'maxAge', label: 'Edad Máx.', value: filters.maxAge, displayValue: String(filters.maxAge) });
    if (filters.minSeniority) chips.push({ key: 'minSeniority', label: 'Antigüedad Mín.', value: filters.minSeniority, displayValue: String(filters.minSeniority) });
    if (filters.maxSeniority) chips.push({ key: 'maxSeniority', label: 'Antigüedad Máx.', value: filters.maxSeniority, displayValue: String(filters.maxSeniority) });
    
    filters.personalStatuses?.forEach(st => {
      const label = PERSONAL_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `personalStatus_${st}`, label: 'Estado', value: st, displayValue: label });
    });

    filters.workStatuses?.forEach(st => {
      const label = WORK_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `workStatus_${st}`, label: 'Estado Laboral', value: st, displayValue: label });
    });

    filters.positions?.forEach(pos => {
      const label = POSITIONS.find(x => x.value === pos)?.label || pos;
      chips.push({ key: `position_${pos}`, label: 'Posición', value: pos, displayValue: label });
    });

    if (filters.entryDateFrom) chips.push({ key: 'entryDateFrom', label: 'Ingreso Desde', value: filters.entryDateFrom, displayValue: filters.entryDateFrom });
    if (filters.entryDateTo) chips.push({ key: 'entryDateTo', label: 'Ingreso Hasta', value: filters.entryDateTo, displayValue: filters.entryDateTo });

    if (filters.hasSystemAccess !== null && filters.hasSystemAccess !== undefined) {
      chips.push({ key: 'hasSystemAccess', label: 'Acceso Sistema', value: filters.hasSystemAccess, displayValue: filters.hasSystemAccess ? 'Sí' : 'No' });
    }

    filters.accessStatuses?.forEach(st => {
      const label = ACCESS_STATUSES.find(x => x.value === st)?.label || st;
      chips.push({ key: `accessStatus_${st}`, label: 'Estado Acceso', value: st, displayValue: label });
    });

    filters.roles?.forEach(role => {
      const label = SYSTEM_ROLES.find(x => x.value === role)?.label || role;
      chips.push({ key: `role_${role}`, label: 'Rol', value: role, displayValue: label });
    });

    return chips;
  };

  const handleRemoveFilter = (chip: any) => {
    const newFilters = { ...filters };
    if (['countryId', 'provinceId', 'cityId', 'minAge', 'maxAge', 'minSeniority', 'maxSeniority', 'entryDateFrom', 'entryDateTo'].includes(chip.key)) {
      (newFilters as any)[chip.key] = chip.key.includes('Age') ? null : '';
      if (chip.key === 'countryId') {
        newFilters.provinceId = '';
        newFilters.cityId = '';
      } else if (chip.key === 'provinceId') {
        newFilters.cityId = '';
      }
    } else if (chip.key === 'hasSystemAccess') {
      newFilters.hasSystemAccess = null;
    } else if (chip.key.startsWith('personalStatus_')) {
      newFilters.personalStatuses = newFilters.personalStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('workStatus_')) {
      newFilters.workStatuses = newFilters.workStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('position_')) {
      newFilters.positions = newFilters.positions?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('accessStatus_')) {
      newFilters.accessStatuses = newFilters.accessStatuses?.filter(x => x !== chip.value) || [];
    } else if (chip.key.startsWith('role_')) {
      newFilters.roles = newFilters.roles?.filter(x => x !== chip.value) || [];
    }
    
    // Set pagination to page 0 when removing filter
    newFilters.page = 0;
    applyFilters(newFilters);
  };

  const activeFiltersChips = getActiveFilters();

  return (
    <MainLayout>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <header>
            <h1 className="text-3xl text-[var(--text-secondary)] font-medium"> 
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Bienvenido al sistema de gestión y Navegación
            </p>
          </header>
          
          <button
            className={styles.addButton}
            onClick={() => navigate('/users/create')}>
            <User size={24} />
            <span className={styles.plusIcon}>+</span>
          </button>
        </div>

        {/* TOP BAR */}
        <div className={styles.filtersContainer}>
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, apellido, legajo..."/>
          
          <button 
            className={styles.filterDropdown}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Filter size={18} className={styles.filterIcon} />
            <span style={{ color: '#94a3b8' }}>
              Filtros {isSidebarOpen ? '∧' : '∨'}
            </span>
          </button>
        </div>

        {/* ACTIVE FILTERS CHIPS */}
        {activeFiltersChips.length > 0 && (
          <div className={styles.activeFiltersContainer}>
            {activeFiltersChips.map(chip => (
              <div key={chip.key} className={styles.filterChip}>
                {chip.label}: <span>{chip.displayValue}</span>
                <button 
                  className={styles.chipRemoveBtn}
                  onClick={() => handleRemoveFilter(chip)}
                  title="Quitar filtro"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button 
              className={styles.clearFiltersBtn}
              onClick={resetFilters}
            >
              Limpiar
            </button>
          </div>
        )}

        {/* MAIN LAYOUT (GRID + SIDEBAR) */}
        <div className={styles.mainLayout}>
          
          <div className={styles.gridContainer}>
            {/* ESTADOS */}
            {isFetching && data.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-[var(--text-secondary)] text-lg">Cargando registros...</p>
              </div>
            ) : errorMsg ? (
              <div className="flex justify-center items-center py-20 text-center flex-col">
                <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
                <p className="text-slate-500 text-sm">Detalle: {errorMsg}.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <p className="text-[var(--text-secondary)] text-xl font-medium">
                  No se encontraron usuarios
                </p>
              </div>
            ) : (
              <>
                <div className={styles.usersGrid}>
                  {filteredUsers.map((user) => (
                    <div key={user.id} className={styles.userCard}>
                      
                      <div className={styles.cardHeader}>
                        <div className={styles.avatarContainer}>
                          {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={`${user.name} ${user.surname}`} className={styles.avatar} />
                        ) : (
                          <div className={`${styles.avatar} flex justify-center items-center bg-[--bg-card] text-[var(--color-icon3)]`}>
                            <User size={40} />
                          </div>
                        )}
                          {user.crewMemberStatus === 'AVAILABLE' ? (
                            <div className={`${styles.statusBadge} ${styles.statusOnline}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          ) : (
                            <div className={`${styles.statusBadge} ${styles.statusOffline}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.userInfo}>
                          <h3 className={styles.userName}>{user.name} {user.surname}</h3>
                          <p className={styles.userRole}>{user.position}</p>
                          
                          <div className={styles.userDetail}>
                            <FileText size={12} className={styles.detailIcon} />
                            <span>Legajo: <strong style={{ color: 'var(--text-secondary, #fff)', fontWeight: 500 }}>{user.fileNumber}</strong></span>
                          </div>
                          
                          <div className={styles.userDetail}>
                            <Clock size={12} className={styles.detailIcon} />
                            <span>Antigüedad: {user.yearsOfService} años</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.skillsContainer}>
                          <span className={styles.skillBadge}>Rol: {user.systemRole}</span>
                          <span className={styles.skillBadge}>Libreta: {user.maritimeBookNumber}</span>
                      </div>
                      
                      <div className={styles.cardActions}>
                        <button 
                          className={styles.viewDetailBtn}
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          Ver detalle
                        </button>
                        <div className="flex gap-4">
                          <button className={styles.editBtn} onClick={() => navigate(`/users/edit/${user.id}`)}>
                            <Edit2 size={16} />
                          </button>
                          <button className={styles.deleteBtn} onClick={() => setUserToDelete(user)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>

                {/* LOAD MORE */}
                {pagination.page + 1 < pagination.totalPages && (
                  <div className={styles.loadMoreContainer}>
                    <button 
                      className={styles.loadMoreBtn} 
                      onClick={loadMore}
                      disabled={isFetching}
                    >
                      {isFetching ? 'Cargando...' : 'Cargar más resultados'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SIDEBAR RIGHT */}
          {isSidebarOpen && (
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onApply={() => applyFilters()}
              onClear={resetFilters}
              countries={countries}
              provinces={provinces}
              cities={cities}
            />
          )}

        </div>

        {/* FOOTER */}
        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>

      </div>

      {selectedUserId && (
        <UserDetailModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        user={userToDelete}
      />

      {showFeedback && (
        <FeedbackModal
          message="Usuario dado de baja exitosamente"
          onClose={() => setShowFeedback(false)}
        />
      )}
    </MainLayout>
  );
};
