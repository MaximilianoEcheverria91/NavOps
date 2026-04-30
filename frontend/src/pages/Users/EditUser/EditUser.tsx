import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { useEditUserForm } from '../../../hooks/useEditUserForm';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import { getRoles } from '../../../services/api/roleService';
import { getProvincesByCountry } from '../../../services/api/provinceService';
import { getCitiesByProvince } from '../../../services/api/cityService';
// Reutilizamos los estilos del componente CreateUser
import styles from '../CreateUser/CreateUser.module.css';

export const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { form, errors, image, handleImage, handleChange, submit, loading, loadingData } = useEditUserForm(id!);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [countries, setCountries] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Efecto 1: Cargar Provincias
  React.useEffect(() => {
    if (form.residenceInfo.countryId) {
      getProvincesByCountry(form.residenceInfo.countryId)
        .then(setProvinces)
        .catch(console.error);
    } else {
      setProvinces([]);
      setCities([]);
    }
  }, [form.residenceInfo.countryId]);

  // Efecto 2: Cargar Ciudades
  React.useEffect(() => {
    if (form.residenceInfo.provinceId) {
      getCitiesByProvince(form.residenceInfo.provinceId)
        .then(setCities)
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [form.residenceInfo.provinceId]);

  React.useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
    getRoles().then(setRoles).catch(console.error);
  }, []);

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        handleImage(e.target.files[0]);
      } catch (err: any) {
         alert(err.message);
      }
    }
  };

  const handleSave = async () => {
    console.log("Botón de guardar presionado");
    const response = await submit();
    console.log("Respuesta de submit:", response);
    if (response.success) setShowModal(true);
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/usuarios');
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  if (loadingData) {
    return (
      <MainLayout>
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p style={{ color: 'white' }}>Cargando datos del usuario...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Editar Usuario</h1>
          <p className={styles.subtitle}>
            Actualizar datos del sistema de gestión y navegación
          </p>
        </div>

        {/* FOTO */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Fotografía del Usuario</p>
          <div className={styles.photoSection}>
            <div className={styles.uploadCircleWrapper}>
              <div className={styles.uploadCircle} onClick={handleCircleClick}>
                {image ? (
                  <img src={image} className={styles.previewImg} alt="Preview" />
                ) : (
                  <>
                    <svg className={styles.uploadIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Cargar Foto
                    <span className={styles.uploadTextSmall}>PNG/JPG (Max 5MB)</span>
                  </>
                )}
              </div>
              <input type="file" className={styles.fileInput} ref={fileInputRef} accept="image/png, image/jpeg" onChange={onFileChange} />
            </div>
            
            <div className={styles.recommendedBox}>
              <div className={styles.recomBadge}>Recomendado</div>
              <p className={styles.recoText}>
                Se recomienda una fotografía de perfil del Usuario con buena iluminación. La imagen debe ser clara y mostrar las características principales de la embarcación.
              </p>
            </div>
          </div>
        </div>

        {/* INFO GENERAL */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Información General</p>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombres</label>
              <input 
                className={`${styles.input} ${errors['generalInfo.name'] ? styles.inputError : ''}`} 
                placeholder="Ej: Maria"
                value={form.generalInfo.name}
                onChange={(e) => handleChange('generalInfo','name', e.target.value)}
              />
              {errors['generalInfo.name'] && <span className={styles.errorText}>{errors['generalInfo.name']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Apellido</label>
              <input 
                className={`${styles.input} ${errors['generalInfo.surname'] ? styles.inputError : ''}`} 
                placeholder="Ej: Martinez"
                value={form.generalInfo.surname}
                onChange={(e) => handleChange('generalInfo','surname', e.target.value)}
              />
              {errors['generalInfo.surname'] && <span className={styles.errorText}>{errors['generalInfo.surname']}</span>}
            </div>

             <div className={styles.inputGroup}>
              <label className={styles.label}>Genero</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.gender'] ? styles.inputError : ''}`} 
                value={form.generalInfo.gender}
                onChange={(e) => handleChange('generalInfo','gender', e.target.value)}
              >
                <option value="">Ej: Masculino</option>
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Femenino</option>
                <option value="OTHER">Otro / No binario</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo de Documento</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.documentType'] ? styles.inputError : ''}`} 
                value={form.generalInfo.documentType}
                onChange={(e) => handleChange('generalInfo','documentType', e.target.value)}
              >
                <option value="">Ej: DNI</option>
                <option value="DNI">DNI</option>
                <option value="PASSPORT">Pasaporte</option>
                <option value="CARD">Cédula</option>
                <option value="ENROLLMENT_BOOKLET">Libreta de enrolamiento</option>
              </select>
              {errors['generalInfo.documentType'] && <span className={styles.errorText}>{errors['generalInfo.documentType']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>N° de Documento</label>
              <input 
                className={`${styles.input} ${errors['generalInfo.documentNumber'] ? styles.inputError : ''}`} 
                placeholder="Ej: 1256847821"
                value={form.generalInfo.documentNumber}
                onChange={(e) => handleChange('generalInfo','documentNumber', e.target.value)}
              />
              {errors['generalInfo.documentNumber'] && <span className={styles.errorText}>{errors['generalInfo.documentNumber']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>CUIL</label>
              <input 
                className={`${styles.input} ${errors['generalInfo.cuil'] ? styles.inputError : ''}`} 
                placeholder="Ej: 1256847821"
                value={form.generalInfo.cuil}
                onChange={(e) => handleChange('generalInfo','cuil', e.target.value)}
              />
              {errors['generalInfo.cuil'] && <span className={styles.errorText}>{errors['generalInfo.cuil']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha de Nacimiento</label>
              <input 
                type="date" 
                className={`${styles.input} ${errors['generalInfo.birthDate'] ? styles.inputError : ''}`} 
                value={form.generalInfo.birthDate}
                onChange={(e) => handleChange('generalInfo','birthDate', e.target.value)}
              />
              {errors['generalInfo.birthDate'] && <span className={styles.errorText}>{errors['generalInfo.birthDate']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nacionalidad</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.nationalityCountryId'] ? styles.inputError : ''}`} 
                value={form.generalInfo.nationalityCountryId}
                onChange={(e) => handleChange('generalInfo','nationalityCountryId', e.target.value)}>
               <option value="">Seleccione Nacionalidad</option>
                  {countries.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors['generalInfo.nationalityCountryId'] && <span className={styles.errorText}>{errors['generalInfo.nationalityCountryId']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado Civil</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.maritalStatus'] ? styles.inputError : ''}`} 
                value={form.generalInfo.maritalStatus}
                onChange={(e) => handleChange('generalInfo','maritalStatus', e.target.value)}
              >
                <option value="">Ej: Soltero</option>
                <option value="SINGLE">Soltero</option>
                <option value="MARRIED">Casado</option>
                <option value="DIVORCIED">Divorciado</option>
                <option value="WIDOWED">Viudo</option>
                <option value="COHABITANT">Conviviente</option>
              </select>
              {errors['generalInfo.maritalStatus'] && <span className={styles.errorText}>{errors['generalInfo.maritalStatus']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.status'] ? styles.inputError : ''}`} 
                value={form.generalInfo.status}
                onChange={(e) => handleChange('generalInfo','status', e.target.value)}
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* RESIDENCIA */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Residencia</p>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>País</label>
              <select 
                className={`${styles.input} ${errors['residenceInfo.countryId'] ? styles.inputError : ''}`} 
                value={form.residenceInfo.countryId}
                onChange={(e) => handleChange('residenceInfo','countryId', e.target.value)}
              >
                <option value="">Seleccione país</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors['residenceInfo.countryId'] && <span className={styles.errorText}>{errors['residenceInfo.countryId']}</span>}
            </div>
          
          
            <div className={styles.inputGroup}>
              <label className={styles.label}>Provincia</label>
              <select
                className={`${styles.input} ${errors['residenceInfo.provinceId'] ? styles.inputError : ''}`} 
                value={form.residenceInfo.provinceId}
                onChange={(e) => handleChange('residenceInfo','provinceId', e.target.value)}>
               
                <option value="">Seleccione Provincia</option>
                  {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
              </select>
              {errors['residenceInfo.provinceId'] && <span className={styles.errorText}>{errors['residenceInfo.provinceId']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Localidad</label>
              <select 
                className={`${styles.input} ${errors['residenceInfo.cityId'] ? styles.inputError : ''}`} 
                value={form.residenceInfo.cityId}
                onChange={(e) => handleChange('residenceInfo','cityId', e.target.value)}>
                <option value="">Seleccione Ciudad</option>
                  {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
              {errors['residenceInfo.cityId'] && <span className={styles.errorText}>{errors['residenceInfo.cityId']}</span>}
            </div>
          </div>
      
          <div className={styles.residenceRow2}>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Calle</label>
              <input 
                className={`${styles.input} ${errors['residenceInfo.street'] ? styles.inputError : ''}`} 
                placeholder="Ej: Lopez de Vega"
                value={form.residenceInfo.street}
                onChange={(e) => handleChange('residenceInfo','street', e.target.value)}
              />
              {errors['residenceInfo.street'] && <span className={styles.errorText}>{errors['residenceInfo.street']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Número</label>
              <input 
                className={`${styles.input} ${errors['residenceInfo.number'] ? styles.inputError : ''}`} 
                placeholder="Ej: 1456"
                value={form.residenceInfo.number}
                onChange={(e) => handleChange('residenceInfo','number', e.target.value)}
              />
              {errors['residenceInfo.number'] && <span className={styles.errorText}>{errors['residenceInfo.number']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Depto</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ej: B"
                value={form.residenceInfo.department}
                onChange={(e) => handleChange('residenceInfo','department', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Piso</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ej: 5"
                value={form.residenceInfo.floor}
                onChange={(e) => handleChange('residenceInfo','floor', e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>C.Postal</label>
              <input 
                type="text" 
                className={`${styles.input} ${errors['residenceInfo.postalCode'] ? styles.inputError : ''}`} 
                placeholder="Ej: 1832"
                value={form.residenceInfo.postalCode}
                onChange={(e) => handleChange('residenceInfo','postalCode', e.target.value)}
              />
              {errors['residenceInfo.postalCode'] && <span className={styles.errorText}>{errors['residenceInfo.postalCode']}</span>}
            </div>

          </div>
        </div>

        {/* CONTACTO */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Contacto</p>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>N° Particular</label>
              <input 
                className={styles.input} 
                placeholder="Ej: 4256-4582"
                value={form.contactInfo.particularPhone}
                onChange={(e) => handleChange('contactInfo', 'particularPhone', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>N° de Celular</label>
              <input 
                className={styles.input} 
                placeholder="Ej: 11 4523 8956"
                value={form.contactInfo.cellPhone}
                onChange={(e) => handleChange('contactInfo', 'cellPhone', e.target.value)}
              />
            </div>
            
             <div className={styles.inputGroup}>
              <label className={styles.label}>Email</label>
              <input 
                className={`${styles.input} ${errors['contactInfo.email'] ? styles.inputError : ''}`} 
                placeholder="Ej: Ejemplo@gmail.com.ar"
                value={form.contactInfo.email}
                onChange={(e) => handleChange('contactInfo', 'email', e.target.value)}
              />
              {errors['contactInfo.email'] && <span className={styles.errorText}>{errors['contactInfo.email']}</span>}
            </div>
          </div>
        </div>

        {/* LABORAL */}
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Datos Laborales</p>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Cargo</label>
              <select 
                className={`${styles.input} ${errors['laborData.navigationRole'] ? styles.inputError : ''}`} 
                value={form.laborData.navigationRole}
                onChange={(e) => handleChange('laborData','navigationRole', e.target.value)}
              >
                <option value="">Ej: Jefe de Navegación</option>
                <option value="Jefe de Navegación">Jefe de Navegación</option>
                <option value="Marinero">Marinero</option>
                <option value="Operario carga">Operario carga</option>
              </select>
              {errors['laborData.navigationRole'] && <span className={styles.errorText}>{errors['laborData.navigationRole']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Categoria</label>
              <select 
                className={`${styles.input} ${errors['laborData.category'] ? styles.inputError : ''}`} 
                value={form.laborData.category}
                onChange={(e) => handleChange('laborData','category', e.target.value)}
              >
                <option value="">Ej: Sub Oficial</option>
                <option value="Sub Oficial">Sub Oficial</option>
                <option value="Oficial">Oficial</option>
                <option value="Auxiliar">Auxiliar</option>
              </select>
              {errors['laborData.category'] && <span className={styles.errorText}>{errors['laborData.category']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Fecha de Ingreso</label>
              <input 
                type="date" 
                className={styles.input}
                value={form.laborData.hireDate}
                onChange={(e) => handleChange('laborData','hireDate', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>N° de Libreta Maritima</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ej: FG568F4"
                value={form.laborData.maritimeBookNumber}
                onChange={(e) => handleChange('laborData','maritimeBookNumber', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado</label>
              <select 
                className={`${styles.input} ${errors['laborData.status'] ? styles.inputError : ''}`} 
                value={form.laborData.status}
                onChange={(e) => handleChange('laborData','status', e.target.value)}
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="ON_BOARD">A Bordo</option>
                <option value="ON_LEAVE">De Licencia</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Legajo</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Ej: LG00001"
                value={form.laborData.fileNumber}
                onChange={(e) => handleChange('laborData','fileNumber', e.target.value)}
              />
            </div>

          </div>
        </div>

        <hr className={styles.divider} />

        {/* SISTEMA */}
        <div className={styles.section}>
          <div className={styles.grid}>
             <div>
                <p className={styles.sectionTitle}>¿Pertenece al sistema?</p>
                <div className={styles.switchContainer}>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={form.systemAccessData.belongsToSystem}
                      onChange={(e) => handleChange('systemAccessData','belongsToSystem', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
             </div>

             <div>
                <p className={styles.sectionTitle}>¿Bloquear usuario?</p>
                <div className={styles.switchContainer}>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={form.systemAccessData.is_blocked}
                      onChange={(e) => handleChange('systemAccessData','is_blocked', e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
             </div>
          </div>

          {form.systemAccessData.belongsToSystem && (
            <div className={`${styles.grid} ${styles.treeCols}`} style={{ marginTop: '20px' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre de usuario</label>
                <input 
                  className={`${styles.input} ${errors['systemAccessData.username'] ? styles.inputError : ''}`} 
                  placeholder="Ej: adminRojas"
                  value={form.systemAccessData.username}
                  onChange={(e) => handleChange('systemAccessData','username', e.target.value)}
                />
                {errors['systemAccessData.username'] && <span className={styles.errorText}>{errors['systemAccessData.username']}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Rol</label>
                <select 
                  className={`${styles.input} ${errors['systemAccessData.roleId'] ? styles.inputError : ''}`} 
                  value={form.systemAccessData.roleId}
                  onChange={(e) => handleChange('systemAccessData','roleId', e.target.value)}
                >
                  <option value="">Seleccione rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                {errors['systemAccessData.roleId'] && <span className={styles.errorText}>{errors['systemAccessData.roleId']}</span>}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Cancelar
          </button>

          <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? (
              <span className={styles.spinner}></span>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar
              </>
            )}
          </button>
        </div>

        <p className={styles.footerText}>
          Sistema de Gestión Maritima V.1
        </p>

      </div>

      {showModal && (
        <FeedbackModal
          message="Usuario actualizado correctamente"
          onClose={handleConfirmModal}
        />
      )}

    </MainLayout>
  );
};
