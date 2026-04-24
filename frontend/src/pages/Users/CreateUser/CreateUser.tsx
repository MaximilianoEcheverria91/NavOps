import React, { useRef, useState } from 'react';
import { Camera, ChevronDown, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../layouts/MainLayout';
import { useCreateUserForm } from '../../../hooks/useCreateUserForm';
import { FeedbackModal } from '../../../components/ui/FeedbackModal/FeedbackModal';
import { getCountries } from '../../../services/api/countryService';
import { getRoles } from '../../../services/api/roleService';
import styles from './CreateUser.module.css';

export const CreateUser: React.FC = () => {
  const { form, errors, image, handleImage, handleChange, submit, loading } = useCreateUserForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [countries, setCountries] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

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
    const response = await submit();
    if (response.success) {
      setShowModal(true);
    }
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate('/usuarios');
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  return (
    <MainLayout>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>Agregar nuevo Usuario</h1>
          <p className={styles.subtitle}>
            Bienvenido al sistema de gestión y navegación
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
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro / No binario</option>
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
                <option value="PASAPORTE">Pasaporte</option>
                <option value="CEDULA">Cédula</option>
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
                className={`${styles.input} ${errors['generalInfo.nationality'] ? styles.inputError : ''}`} 
                value={form.generalInfo.nationality}
                onChange={(e) => handleChange('generalInfo','nationality', e.target.value)}
              >
                <option value="">Ej: Argentino</option>
                <option value="Argentino">Argentino</option>
                <option value="Uruguayo">Uruguayo</option>
                <option value="Chileno">Chileno</option>
                <option value="Bolibiano">Boliviano</option>
                <option value="Paraguayo">Paraguayo</option>
                <option value="Barzilero">Brazilero</option>
                <option value="Peruano">Peruano</option>
                <option value="Ecuatoriano">Ecuatoriano</option>
                <option value="Vanezolano">Venezolano</option>
                <option value="Colombiano">Colombiano</option>
                <option value="Mexicano">Mexicano</option>
                <option value="Hondureño">Hondureño</option>
                <option value="Cubano">Cubano</option>
              </select>
              {errors['generalInfo.nationality'] && <span className={styles.errorText}>{errors['generalInfo.nationality']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Estado Civil</label>
              <select 
                className={`${styles.input} ${errors['generalInfo.maritalStatus'] ? styles.inputError : ''}`} 
                value={form.generalInfo.maritalStatus}
                onChange={(e) => handleChange('generalInfo','maritalStatus', e.target.value)}
              >
                <option value="">Ej: Soltero</option>
                <option value="SOLTERO">Soltero</option>
                <option value="CASADO">Casado</option>
                <option value="DIVORCIADO">Divorciado</option>
                <option value="VIUDO">Viudo</option>
                <option value="CONVIVIENTE">Conviviente</option>
              </select>
              {errors['generalInfo.maritalStatus'] && <span className={styles.errorText}>{errors['generalInfo.maritalStatus']}</span>}
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
              <input 
                className={`${styles.input} ${errors['residenceInfo.province'] ? styles.inputError : ''}`} 
                value={form.residenceInfo.province}
                onChange={(e) => handleChange('residenceInfo','province', e.target.value)}
              />
              {errors['residenceInfo.province'] && <span className={styles.errorText}>{errors['residenceInfo.province']}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Localidad</label>
              <input 
                className={`${styles.input} ${errors['residenceInfo.locality'] ? styles.inputError : ''}`} 
                value={form.residenceInfo.locality}
                onChange={(e) => handleChange('residenceInfo','locality', e.target.value)}
              />
              {errors['residenceInfo.locality'] && <span className={styles.errorText}>{errors['residenceInfo.locality']}</span>}
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

          </div>
        </div>

        <hr className={styles.divider} />

        {/* SISTEMA */}
        <div className={styles.section}>
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

          {form.systemAccessData.belongsToSystem && (
            <div className={`${styles.grid} ${styles.treeCols}`}>
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
                <label className={styles.label}>Contraseña</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${errors['systemAccessData.password'] ? styles.inputError : ''}`} 
                    placeholder="Ej: Admin123$"
                    value={form.systemAccessData.password}
                    onChange={(e) => handleChange('systemAccessData', 'password', e.target.value)}
                    style={{ width: '100%', paddingRight: '40px' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', background: 'none', border: 'none', 
                      cursor: 'pointer', color: '#6A7182', display: 'flex', padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors['systemAccessData.password'] && <span className={styles.errorText}>{errors['systemAccessData.password']}</span>}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Guardar
          </button>
        </div>

        <p className={styles.footerText}>
          Sistema de Gestión Maritima V.1
        </p>

      </div>

      {showModal && (
        <FeedbackModal
          message="Usuario creado correctamente"
          onClose={handleConfirmModal}
        />
      )}

    </MainLayout>
  );
};