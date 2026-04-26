import { useState, useEffect, useCallback } from 'react';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useTheme } from '../hooks/useTheme';
import { getUsers } from '../services/api/usersService';
import { initSyncEngine, destroySyncEngine } from '../services/sync/syncEngine';
import DeleteUserModal from '../components/ui/DeleteUserModal';
import UserCard from '../components/ui/UserCard';
import Toast from '../components/ui/Toast';
import ThemeToggle from '../components/ui/ThemeToggle';
import styles from './ListaUsuarios.module.css';

// ── Mock data (replace with real API) ────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, nombres: 'Carmen',    apellido: 'Díaz',      cargo: 'Oficial de cubierta', legajo: 'NAV-008', antiguedad: '6 años', estado: 'Activo',   foto_url: null },
  { id: 2, nombres: 'María',     apellido: 'Martínez',  cargo: 'Jefe de Navegación',  legajo: 'E97961',  antiguedad: '3 años', estado: 'Activo',   foto_url: null },
  { id: 3, nombres: 'Carlos',    apellido: 'Rodríguez', cargo: 'Maquinista',           legajo: 'NAV-021', antiguedad: '8 años', estado: 'Inactivo', foto_url: null },
  { id: 4, nombres: 'Luciana',   apellido: 'Pérez',     cargo: 'Contramaestre',        legajo: 'NAV-034', antiguedad: '2 años', estado: 'Activo',   foto_url: null },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function ListaUsuarios() {
  const { isDark, toggleTheme } = useTheme();
  const [users, setUsers]       = useState(MOCK_USERS);
  const [loading, setLoading]   = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline]   = useState(navigator.onLine);

  // ── Network status ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Sync engine ─────────────────────────────────────────────────────────
  useEffect(() => {
    initSyncEngine(() => setIsSyncing(true), () => setIsSyncing(false));
    return () => destroySyncEngine();
  }, []);

  // ── Load users ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(() => setUsers(MOCK_USERS)) // fallback to mock in demo
      .finally(() => setLoading(false));
  }, []);

  // ── Delete callback: remove from local list ─────────────────────────────
  const handleDeleteSuccess = useCallback((userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const {
    state, target, message, wasOffline,
    isModalOpen, isLoading: isDeleting,
    isSuccess, isError,
    openConfirm, cancel, confirm, reset,
  } = useDeleteUser(handleDeleteSuccess);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>⛵</span>
          <span className={styles.navName}><span>Nav</span>Ops</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Dashboard</a>
          <a href="#" className={styles.active}>Usuarios</a>
          <a href="#">Barcos</a>
          <a href="#">Puertos</a>
        </div>
        <div className={styles.navRight}>
          {/* Network status */}
          <span className={`${styles.networkBadge} ${isOnline ? styles.online : styles.offline}`}>
            {isOnline
              ? (isSyncing ? '↻ Sincronizando...' : '● Conectado')
              : '⚓ Sin conexión'}
          </span>
          {/* Theme toggle */}
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          {/* User */}
          <div className={styles.navUser}>
            <div className={styles.avatarNav}>CM</div>
            <div>
              <div className={styles.navUserName}>Capitán Martínez</div>
              <div className={styles.navUserRole}>Administrador</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Offline banner ── */}
      {!isOnline && (
        <div className={styles.offlineBanner}>
          ⚓ Sin conexión — las acciones se sincronizarán al reconectar.
        </div>
      )}

      {/* ── Main ── */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Usuarios</h1>
            <p className={styles.pageSub}>Gestión del personal de la flota</p>
          </div>
          <a href="/usuarios/nuevo" className={styles.btnNew}>
            + Agregar Usuario
          </a>
        </div>

        {/* ── User list ── */}
        {loading ? (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p>Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>No hay usuarios registrados.</div>
        ) : (
          <div className={styles.grid}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={openConfirm}
                isDeleting={isDeleting && target?.id === user.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Delete confirmation modal ── */}
      {isModalOpen && (
        <DeleteUserModal
          user={target}
          isLoading={isDeleting}
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}

      {/* ── Toast feedback ── */}
      {(isSuccess || isError) && (
        <Toast
          message={message}
          type={isSuccess ? 'success' : 'error'}
          offline={wasOffline}
          onDismiss={reset}
        />
      )}

      <footer className={styles.pageFooter}>
        Sistema de Gestión Marítima V.1
      </footer>
    </div>
  );
}
