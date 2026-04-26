import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditUser } from '../hooks/useEditUser';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { initSyncEngine, destroySyncEngine } from '../services/sync/syncEngine';
import NetworkBanner from '../components/ui/NetworkBanner';
import FormField from '../components/ui/FormField';
import PhotoUploader from '../components/ui/PhotoUploader';
import SectionBlock from '../components/ui/SectionBlock';
import styles from './EditUsuario.module.css';

// ── Static catalog options ────────────────────────────────────────────────────
const TIPOS_DOC     = [{ value: 'DNI', label: 'DNI' }, { value: 'PASAPORTE', label: 'Pasaporte' }, { value: 'LC', label: 'LC' }, { value: 'LE', label: 'LE' }];
const NACIONALIDADES= [{ value: 'Argentina', label: 'Argentina' }, { value: 'Brasil', label: 'Brasil' }, { value: 'Uruguay', label: 'Uruguay' }, { value: 'Chile', label: 'Chile' }, { value: 'Otro', label: 'Otro' }];
const ESTADOS_CIVIL = [{ value: 'Soltero', label: 'Soltero/a' }, { value: 'Casado', label: 'Casado/a' }, { value: 'Divorciado', label: 'Divorciado/a' }, { value: 'Viudo', label: 'Viudo/a' }, { value: 'Unión civil', label: 'Unión civil' }];
const GENEROS       = [{ value: 'Masculino', label: 'Masculino' }, { value: 'Femenino', label: 'Femenino' }, { value: 'No binario', label: 'No binario' }, { value: 'Prefiero no decir', label: 'Prefiero no decir' }];
const PAISES        = [{ value: 'Argentina', label: 'Argentina' }, { value: 'Brasil', label: 'Brasil' }, { value: 'Uruguay', label: 'Uruguay' }, { value: 'Chile', label: 'Chile' }];
const PROVINCIAS    = [{ value: 'Buenos Aires', label: 'Buenos Aires' }, { value: 'CABA', label: 'CABA' }, { value: 'Córdoba', label: 'Córdoba' }, { value: 'Santa Fe', label: 'Santa Fe' }, { value: 'Mendoza', label: 'Mendoza' }, { value: 'Otra', label: 'Otra' }];
const CARGOS        = [{ value: 'Capitán', label: 'Capitán' }, { value: 'Jefe de Navegación', label: 'Jefe de Navegación' }, { value: 'Oficial de cubierta', label: 'Oficial de cubierta' }, { value: 'Maquinista', label: 'Maquinista' }, { value: 'Contramaestre', label: 'Contramaestre' }, { value: 'Marinero', label: 'Marinero' }];
const CATEGORIAS    = [{ value: 'Oficial', label: 'Oficial' }, { value: 'Sub Oficial', label: 'Sub Oficial' }, { value: 'Auxiliar', label: 'Auxiliar' }, { value: 'Cadete', label: 'Cadete' }];
const ESTADOS       = [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }, { value: 'Suspendido', label: 'Suspendido' }];

// ─────────────────────────────────────────────────────────────────────────────
export default function EditUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    form, errors, touched, loading, saving, fetchError, saveResult,
    photoPreview, photoError,
    handleChange, handleBlur, handlePhotoChange, removePhoto, handleSubmit,
  } = useEditUser(id);

  // ── Boot sync engine ────────────────────────────────────────────────────────
  useEffect(() => {
    initSyncEngine(
      () => setIsSyncing(true),
      () => setIsSyncing(false),
    );
    return () => destroySyncEngine();
  }, []);

  // ── Redirect after successful save ─────────────────────────────────────────
  useEffect(() => {
    if (saveResult?.success) {
      const timer = setTimeout(() => navigate('/usuarios'), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveResult, navigate]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const onCancel = () => {
    if (window.confirm('¿Cancelar edición? Los cambios no se guardarán.')) {
      navigate('/usuarios');
    }
  };

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) return <LoadingScreen />;
  if (fetchError) return <ErrorScreen message={fetchError} onBack={() => navigate('/usuarios')} />;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Navbar ── */}
      <Navbar isOnline={isOnline} />

      {/* ── Network banner ── */}
      <NetworkBanner isSyncing={isSyncing} />

      <main className={styles.main}>
        {/* ── Page header ── */}
        <h1 className={styles.pageTitle}>Editar Usuario</h1>
        <p className={styles.pageSub}>Sistema de gestión y Navegación</p>
        <hr className={styles.divider} />

        {/* ── Save result toast ── */}
        {saveResult && (
          <div className={`${styles.toast} ${saveResult.success ? styles.toastSuccess : styles.toastError}`}>
            {saveResult.message}
            {saveResult.offline && (
              <span className={styles.offlineBadge}>⚓ Offline</span>
            )}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>

          {/* ── FOTO ── */}
          <SectionBlock title="Fotografía del Usuario">
            <PhotoUploader
              preview={photoPreview}
              error={photoError}
              onChange={handlePhotoChange}
              onRemove={removePhoto}
            />
          </SectionBlock>

          {/* ── INFORMACIÓN GENERAL ── */}
          <SectionBlock title="Información General">
            <div className={styles.grid3}>
              <FormField id="nombres"  label="Nombres"  value={form.nombres}  onChange={handleChange} onBlur={handleBlur} error={errors.nombres}  touched={touched.nombres}  required placeholder="Ej: María Elena" />
              <FormField id="apellido" label="Apellido" value={form.apellido} onChange={handleChange} onBlur={handleBlur} error={errors.apellido} touched={touched.apellido} required placeholder="Ej: Martínez" />
              <FormField id="tipo_doc" label="Tipo de Documento" type="select" value={form.tipo_doc} onChange={handleChange} onBlur={handleBlur} error={errors.tipo_doc} touched={touched.tipo_doc} required options={TIPOS_DOC} placeholder="Seleccionar..." />
            </div>
            <div className={`${styles.grid3} ${styles.mt}`}>
              <FormField id="nro_doc"   label="Nº de Documento"   value={form.nro_doc}   onChange={handleChange} onBlur={handleBlur} error={errors.nro_doc}   touched={touched.nro_doc}   required placeholder="Ej: 36397576" />
              <FormField id="cuil"      label="CUIL"               value={form.cuil}      onChange={handleChange} onBlur={handleBlur} error={errors.cuil}      touched={touched.cuil}      required placeholder="Ej: 20-36397576-4" />
              <FormField id="fecha_nac" label="Fecha de Nacimiento" type="date" value={form.fecha_nac} onChange={handleChange} onBlur={handleBlur} error={errors.fecha_nac} touched={touched.fecha_nac} required />
            </div>
            <div className={`${styles.grid3} ${styles.mt}`}>
              <FormField id="nacionalidad" label="Nacionalidad"  type="select" value={form.nacionalidad} onChange={handleChange} onBlur={handleBlur} options={NACIONALIDADES} placeholder="Seleccionar..." />
              <FormField id="estado_civil" label="Estado Civil"  type="select" value={form.estado_civil} onChange={handleChange} onBlur={handleBlur} options={ESTADOS_CIVIL}  placeholder="Seleccionar..." />
              <FormField id="genero"       label="Género"        type="select" value={form.genero}       onChange={handleChange} onBlur={handleBlur} options={GENEROS}       placeholder="Seleccionar..." />
            </div>
          </SectionBlock>

          {/* ── RESIDENCIA ── */}
          <SectionBlock title="Residencia">
            <div className={styles.grid3}>
              <FormField id="pais"      label="País"      type="select" value={form.pais}      onChange={handleChange} onBlur={handleBlur} options={PAISES}    placeholder="Seleccionar..." />
              <FormField id="provincia" label="Provincia" type="select" value={form.provincia} onChange={handleChange} onBlur={handleBlur} options={PROVINCIAS} placeholder="Seleccionar..." />
              <FormField id="localidad" label="Localidad"  value={form.localidad} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Lomas de Zamora" />
            </div>
            <div className={`${styles.grid4} ${styles.mt}`}>
              <FormField id="calle"  label="Calle"  value={form.calle}  onChange={handleChange} onBlur={handleBlur} placeholder="Ej: Lopez de Vega" />
              <FormField id="altura" label="Altura" type="number" value={form.altura} onChange={handleChange} onBlur={handleBlur} error={errors.altura} touched={touched.altura} placeholder="Ej: 4523" />
              <FormField id="depto"  label="Depto"  value={form.depto}  onChange={handleChange} onBlur={handleBlur} placeholder="Ej: 2" />
              <FormField id="piso"   label="Piso"   type="number" value={form.piso}   onChange={handleChange} onBlur={handleBlur} error={errors.piso} touched={touched.piso} placeholder="Ej: 5" />
            </div>
          </SectionBlock>

          {/* ── CONTACTO ── */}
          <SectionBlock title="Contacto">
            <div className={styles.grid3}>
              <FormField id="tel_particular" label="Nº Particular"  value={form.tel_particular} onChange={handleChange} onBlur={handleBlur} error={errors.tel_particular} touched={touched.tel_particular} placeholder="Ej: 4285 5689" />
              <FormField id="celular"         label="Nº de Celular" value={form.celular}         onChange={handleChange} onBlur={handleBlur} error={errors.celular}         touched={touched.celular}         required placeholder="Ej: 11 5664 8923" />
              <FormField id="email"           label="Email"         type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} required placeholder="Ej: ejemplo@gmail.com.ar" />
            </div>
          </SectionBlock>

          {/* ── DATOS LABORALES ── */}
          <SectionBlock title="Datos Laborales">
            <div className={styles.grid3}>
              <FormField id="cargo"         label="Cargo / Rol de Navegación" type="select" value={form.cargo}         onChange={handleChange} onBlur={handleBlur} error={errors.cargo}         touched={touched.cargo}         required options={CARGOS}     placeholder="Seleccionar..." />
              <FormField id="categoria"     label="Categoría"                 type="select" value={form.categoria}     onChange={handleChange} onBlur={handleBlur} options={CATEGORIAS}   placeholder="Seleccionar..." />
              <FormField id="fecha_ingreso" label="Fecha de Ingreso"          type="date"   value={form.fecha_ingreso} onChange={handleChange} onBlur={handleBlur} error={errors.fecha_ingreso} touched={touched.fecha_ingreso} required />
            </div>
            <div className={`${styles.grid3} ${styles.mt}`}>
              <FormField id="legajo"  label="Nº de Legajo"         value={form.legajo}  onChange={handleChange} onBlur={handleBlur} error={errors.legajo}  touched={touched.legajo}  required placeholder="Ej: E97961" />
              <FormField id="libreta" label="Nº de Libreta Marítima" value={form.libreta} onChange={handleChange} onBlur={handleBlur} placeholder="Ej: FG568F4" />
              <FormField id="estado"  label="Estado" type="select"  value={form.estado}  onChange={handleChange} onBlur={handleBlur} error={errors.estado}  touched={touched.estado}  required options={ESTADOS} placeholder="Seleccionar..." />
            </div>
          </SectionBlock>

          {/* ── FOOTER ── */}
          <div className={styles.footer}>
            <button type="button" className={styles.btnCancelar} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnGuardar} disabled={saving}>
              {saving ? (
                <><span className={styles.spinner} /> Guardando...</>
              ) : (
                <><span>💾</span> Actualizar y Guardar</>
              )}
            </button>
          </div>

        </form>
      </main>

      <footer className={styles.pageFooter}>Sistema de Gestión Marítima V.1</footer>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Navbar({ isOnline }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navBrand}>
        <span className={styles.navLogo}>⛵</span>
        <span className={styles.navName}><span>Nav</span>Ops</span>
      </div>
      <div className={styles.navLinks}>
        <a href="#">Dashboard</a>
        <a href="#">Usuarios</a>
        <a href="#" className={styles.active}>Barcos</a>
        <a href="#">Puertos</a>
      </div>
      <div className={styles.navRight}>
        <span className={`${styles.badge} ${isOnline ? styles.badgeOnline : styles.badgeOffline}`}>
          {isOnline ? '● Conectado' : '● Sin conexión'}
        </span>
        <div className={styles.navUser}>
          <div className={styles.avatarNav}>CM</div>
          <div>
            <div className={styles.navUserName}>Capitán Martínez</div>
            <div className={styles.navUserRole}>Administrador</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LoadingScreen() {
  return (
    <div className={styles.centerScreen}>
      <div className={styles.loadingSpinner} />
      <p>Cargando datos del usuario...</p>
    </div>
  );
}

function ErrorScreen({ message, onBack }) {
  return (
    <div className={styles.centerScreen}>
      <p className={styles.errorMsg}>⚠ {message}</p>
      <button className={styles.btnCancelar} onClick={onBack}>← Volver al listado</button>
    </div>
  );
}
