import React, { useState, useEffect } from 'react';
import { MainLayout } from './../../layouts/MainLayout';
import { Search, Filter, User, FileText, Clock, Edit2, Trash2 } from 'lucide-react';
import styles from './UsersList.module.css';
import { getAllUsers } from '../../services/api/userService';
import type { UserResponse } from '../../services/api/userService';

export const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const data = await getAllUsers();
        
        // Manejo por si viene anidado en data.content o data.data
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && typeof data === 'object') {
          // @ts-ignore - por si viene anidado
          const arrayData = data.content || data.data || data.users || [];
          setUsers(arrayData);
          if (arrayData.length === 0) {
            console.warn('Data recibida no es un array directo:', data);
          }
        }
      } catch (error: any) {
        console.error('Error al cargar la lista de usuarios:', error);
        setErrorMsg(error?.message || 'Error de conexión con el servidor');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
          
          <button className={styles.addButton}>
            <User size={24} />
            <span className={styles.plusIcon}>+</span>
          </button>
        </div>

        {/* FILTERS */}
        <div className={styles.filtersContainer}>
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Busca por ID.." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterDropdown}>
            <Filter size={18} className={styles.filterIcon} />
            <select className={styles.selectInput}>
              <option value="all">Filtros</option>
              {/* Other options would go here */}
            </select>
          </div>
        </div>

        {/* USERS GRID o MENSAJES DE ESTADO */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[var(--text-secondary)] text-lg">Cargando registros...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex justify-center items-center py-20 text-center flex-col">
            <p className="text-red-400 text-lg mb-2">Ocurrió un error al cargar los datos.</p>
            <p className="text-slate-500 text-sm">Detalle: {errorMsg}. Por favor, revisa la consola (F12).</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[var(--text-secondary)] text-xl font-medium">No se encontraron registros de personal</p>
          </div>
        ) : (
          <div className={styles.usersGrid}>
            {users.map((user) => (
              <div key={user.id} className={styles.userCard}>
                
                <div className={styles.cardHeader}>
                  <div className={styles.avatarContainer}>
                    {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={`${user.name} ${user.surname}`} className={styles.avatar} />
                  ) : (
                    <div className={`${styles.avatar} flex justify-center items-center bg-[#082842] text-[var(--color-icon3)]`}>
                      <User size={40} />
                    </div>
                  )}
                    {user.crewMemberStatus === 'ACTIVE' ? (
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
                      <span>Antiguedad: {user.yearsOfService} años</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.skillsContainer}>
                    <span className={styles.skillBadge}>Rol: {user.systemRole}</span>
                    <span className={styles.skillBadge}>Libreta: {user.maritimeBookNumber}</span>
                </div>
                
                <div className={styles.cardActions}>
                  <button className={styles.viewDetailBtn}>
                    Ver detalle
                  </button>
                  <div className="flex gap-4">
                    <button className={styles.editBtn}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteBtn}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center mt-12 text-xs text-slate-500 pb-6">
          Sistema de Gestión Marítima V.1
        </footer>

      </div>
    </MainLayout>
  );
};
