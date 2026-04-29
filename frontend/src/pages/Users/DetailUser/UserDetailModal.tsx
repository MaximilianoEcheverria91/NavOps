import React from 'react';
import { X, Download, Edit2, Trash2, User as UserIcon } from 'lucide-react';
import styles from './UserDetailModal.module.css';
import { useUserDetail } from '../../hooks/useUserDetail';

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, onClose }) => {
  const { data: user, loading, error } = useUserDetail(userId);

  // Prevenir propagación de click para que cerrar funcione solo en el fondo overlay
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Función para capitalizar o parsear enums al UI
  const formatEnum = (val?: string) => {
    if (!val) return '-';
    // Reemplazos genéricos para un display amigable
    const mapping: Record<string, string> = {
      'MASCULINO': 'Masculino',
      'FEMENINO': 'Femenino',
      'OTRO': 'Otro',
      'SOLTERO': 'Soltero',
      'CASADO': 'Casado',
      'DIVORCIADO': 'Divorciado',
      'VIUDO': 'Viudo',
      'CONVIVIENTE': 'Conviviente',
      'ACTIVE': 'Operativo',
      'INACTIVE': 'Inactivo'
    };
    return mapping[val] || val;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalContentClick}>
        
        {/* CABECERA */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <UserIcon size={24} color="#63BACF" />
            <h2 className={styles.title}>Detalle del Usuario</h2>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.downloadBtn}>
              Descargar <Download size={14} />
            </button>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className={styles.content}>
          {loading ? (
            <div className={styles.centerMessage}>
              <p>Cargando información del usuario...</p>
            </div>
          ) : error ? (
            <div className={styles.centerMessage}>
              <p className={styles.errorText}>{error}</p>
              <button 
                className={styles.downloadBtn}
                onClick={onClose}
              >
                Volver
              </button>
            </div>
          ) : user ? (
            <>
              {/* TOP: Imagen + Info Gral */}
              <div className={styles.topSection}>
                <div className={styles.avatarWrapper}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className={styles.avatarImg} />
                  ) : (
                    <UserIcon size={64} color="rgba(255,255,255,0.4)" />
                  )}
                </div>

                <div className={styles.infoBlock}>
                  <h3 className={styles.sectionTitle}>Información General</h3>
                  <div className={styles.gridData}>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Nombre:</span>
                      <span className={styles.dataValue}>{user.name}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>F. Nacimiento:</span>
                      <span className={styles.dataValue}>{user.birthDate || '-'}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Apellido:</span>
                      <span className={styles.dataValue}>{user.surname}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Nacionalidad:</span>
                      <span className={styles.dataValue}>{user.nationality || '-'}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>T. de Documento:</span>
                      <span className={styles.dataValue}>{user.documentType || '-'}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Estado Civil:</span>
                      <span className={styles.dataValue}>{formatEnum(user.maritalStatus)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>N° de Documento:</span>
                      <span className={styles.dataValue}>{user.documentNumber || '-'}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Género:</span>
                      <span className={styles.dataValue}>{formatEnum(user.gender)}</span>
                    </div>
                    <div className={styles.dataRow}>
                      <span className={styles.dataLabel}>Cuil:</span>
                      <span className={styles.dataValue}>{user.cuil || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN RESIDENCIA */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Residencia</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>País:</span>
                    <span className={styles.dataValue}>{user.countryName || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Altura:</span>
                    <span className={styles.dataValue}>{user.addressNumber || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Provincia:</span>
                    <span className={styles.dataValue}>{user.addressProvince || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Depto:</span>
                    <span className={styles.dataValue}>{user.addressDepartment || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Localidad:</span>
                    <span className={styles.dataValue}>{user.addressCity || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Piso:</span>
                    <span className={styles.dataValue}>{user.addressFloor || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Calle:</span>
                    <span className={styles.dataValue}>{user.addressStreet || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>C. Postal:</span>
                    <span className={styles.dataValue}>{user.addressPostalCode || '-'}</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN CONTACTO */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Contacto</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>N° Particular:</span>
                    <span className={styles.dataValue}>{user.homePhone || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Email:</span>
                    <span className={styles.dataValue}>{user.email || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>N° de Celular:</span>
                    <span className={styles.dataValue}>{user.mobile || '-'}</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN DATOS LABORALES */}
              <div className={styles.infoBlock}>
                <h3 className={styles.sectionTitle}>Datos Laborales</h3>
                <div className={styles.gridData}>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Cargo / Rol Nav:</span>
                    <span className={styles.dataValue}>{user.navigationRole || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Legajo:</span>
                    <span className={styles.dataValue}>{user.fileNumber || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Categoría:</span>
                    <span className={styles.dataValue}>{user.category || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>N° de Libreta:</span>
                    <span className={styles.dataValue}>{user.maritimeBookNumber || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Fecha de Ingreso:</span>
                    <span className={styles.dataValue}>{user.hireDate || '-'}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Estado:</span>
                    <span className={styles.dataValue}>{formatEnum(user.crewMemberStatus)}</span>
                  </div>
                  <div className={styles.dataRow}>
                    <span className={styles.dataLabel}>Antigüedad:</span>
                    <span className={styles.dataValue}>{user.yearsOfService != null ? `${user.yearsOfService} años` : '-'}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* FOOTER ACTIONS - Igual al renderizado del layout modal */}
        {!loading && !error && (
          <div className={styles.footerActions}>
            <button className={styles.editActionBtn} title="Editar Usuario">
              <Edit2 size={16} />
            </button>
            <button className={styles.deleteActionBtn} title="Eliminar Usuario">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
