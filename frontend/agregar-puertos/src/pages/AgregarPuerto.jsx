import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePort } from '../hooks/useCreatePort';
import { useTheme } from '../hooks/useTheme';
import { initSyncEngine, destroySyncEngine } from '../services/sync/syncEngine';
import styles from './AgregarPuerto.module.css';

// ── NavOps logo is loaded at runtime from /public/logo.jpg
// For standalone HTML distribution it is embedded as base64 via vite import
// In the zip we reference it as a public asset for simplicity.
const LOGO_SRC = '/logo.jpg';   // Place LogoElegidoRecort.jpg in /public/ as logo.jpg

// ── Catalog options ───────────────────────────────────────────────────────────
const TIPOS_PUERTO  = ['Comercial','Militar','Pesquero','Deportivo','Cruceros','Industrial','Mixto'];
const TIPOS_MUELLE  = ['Sólido','Flotante','Marginal','En ángulo','En T','Dique seco'];
const PAISES        = ['Argentina','Brasil','Uruguay','Chile','Paraguay','Bolivia','Perú','Colombia','Venezuela','México'];
const PROVINCIAS_AR = ['Buenos Aires','CABA','Córdoba','Santa Fe','Mendoza','Tucumán','Salta','Jujuy','Entre Ríos','Corrientes','Misiones','Chaco','Formosa','La Rioja','San Juan','San Luis','Catamarca','La Pampa','Neuquén','Río Negro','Chubut','Santa Cruz','Tierra del Fuego'];
const LOCALIDADES   = ['Buenos Aires','Rosario','Mar del Plata','Bahía Blanca','Ushuaia','Comodoro Rivadavia','Puerto Madryn','San Antonio Oeste'];

// ─────────────────────────────────────────────────────────────────────────────
export default function AgregarPuerto() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [isOnline, setIsOnline]   = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    form, errors, touched, saving, result,
    photoPreview, photoError,
    handleChange, handleBlur, handlePhotoChange, removePhoto, handleSubmit,
  } = useCreatePort();

  // ── Network status ────────────────────────────────────────────────────────
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // ── Sync engine ───────────────────────────────────────────────────────────
  useEffect(() => {
    initSyncEngine(() => setIsSyncing(true), () => setIsSyncing(false));
    return () => destroySyncEngine();
  }, []);

  // ── Redirect after success ────────────────────────────────────────────────
  useEffect(() => {
    if (result) {
      setShowToast(true);
      if (result.success) {
        const t = setTimeout(() => navigate('/puertos'), 2200);
        return () => clearTimeout(t);
      }
    }
  }, [result, navigate]);

  const onCancel = () => {
    if (window.confirm('¿Cancelar el registro? Los datos no se guardarán.')) navigate('/puertos');
  };

  // ── Map: OpenStreetMap embed, updates when lat/lng change ─────────────────
  const lat  = parseFloat(form.latitud)  || -38.5;
  const lng  = parseFloat(form.longitud) || -63.5;
  const hasCoords = form.latitud && form.longitud;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-3},${lat-3},${lng+3},${lat+3}&layer=mapnik${hasCoords ? `&marker=${lat},${lng}` : ''}`;

  return (
    <div className={styles.page}>

      {/* ════════════ NAVBAR ════════════ */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <img src={LOGO_SRC} alt="NavOps" className={styles.navLogoImg} />
        </div>

        <div className={styles.navLinks}>
          <a href="/dashboard">Dashboard</a>
          <a href="/usuarios">Usuarios</a>
          <a href="/barcos">Barcos</a>
          <a href="/puertos" className={styles.active}>Puertos</a>
        </div>

        <div className={styles.navRight}>
          <span className={`${styles.netBadge} ${isOnline ? styles.online : styles.offline}`}>
            {isOnline
              ? (isSyncing ? '↻ Sincronizando' : '● Conectado')
              : '⚓ Sin conexión'}
          </span>
          <button className={styles.themeBtn} onClick={toggleTheme}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}>
            {isDark ? '☀' : '🌙'}
          </button>
          <span className={styles.bell}>🔔</span>
          <div className={styles.navUser}>
            <div className={styles.avatarNav}>CM</div>
            <div>
              <div className={styles.navUserName}>Capitán Martínez</div>
              <div className={styles.navUserRole}>Administrador</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ════════ OFFLINE BANNER ════════ */}
      {!isOnline && (
        <div className={styles.offlineBanner}>
          ⚓ Sin conexión — los datos se guardarán localmente y sincronizarán al reconectar.
        </div>
      )}

      {/* ════════════ MAIN ════════════ */}
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Agregar nuevo Puerto</h1>
        <p className={styles.pageSub}>Bienvenido al sistema de gestión y Navegación</p>
        <hr className={styles.divider} />

        {/* Toast */}
        {showToast && result && (
          <div className={`${styles.toast} ${result.success ? styles.toastOk : styles.toastErr}`}>
            <span>{result.message}</span>
            {result.offline && <span className={styles.offlinePill}>⚓ Offline</span>}
            <button className={styles.toastClose} onClick={() => setShowToast(false)}>×</button>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>

          {/* ── Fotografía ── */}
          <div className={styles.section}>
            <SectionTitle title="Fotografía del Puerto" />
            <div className={styles.photoRow}>
              <PhotoUploader
                preview={photoPreview}
                error={photoError}
                onChange={handlePhotoChange}
                onRemove={removePhoto}
              />
              <div className={styles.photoInfo}>
                <span className={styles.recBadge}>Recomendado</span>
                <p className={styles.photoDesc}>
                  Se recomienda una fotografía de perfil del Puerto con buena iluminación.
                  La imagen debe ser clara y mostrar las características principales de la embarcación.
                </p>
              </div>
            </div>
          </div>

          {/* ── Mapa + Info General ── */}
          <div className={styles.mapInfoRow}>
            {/* Map panel */}
            <div className={styles.mapPanel}>
              <iframe
                title="Mapa del puerto"
                src={mapSrc}
                className={styles.mapIframe}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info General */}
            <div className={styles.infoPanel}>
              <SectionTitle title="Información General" />

              <Field id="nombre" label="Nombres del Puerto" required
                placeholder="Ej: Puerto Sambias"
                value={form.nombre} onChange={handleChange} onBlur={handleBlur}
                error={errors.nombre} touched={touched.nombre} />

              <Field id="codigo_int" label="Código Internacional" required
                placeholder="Ej: ARBUEN"
                value={form.codigo_int} onChange={handleChange} onBlur={handleBlur}
                error={errors.codigo_int} touched={touched.codigo_int} />

              <SelectField id="tipo_puerto" label="Tipo de Puerto" required
                placeholder="Ej: Militar" options={TIPOS_PUERTO}
                value={form.tipo_puerto} onChange={handleChange} onBlur={handleBlur}
                error={errors.tipo_puerto} touched={touched.tipo_puerto} />

              <Field id="latitud" label="Latitud" required
                placeholder="Ej: -34.6037"
                value={form.latitud} onChange={handleChange} onBlur={handleBlur}
                error={errors.latitud} touched={touched.latitud} />

              <Field id="longitud" label="Longitud" required
                placeholder="Ej: -58.3816"
                value={form.longitud} onChange={handleChange} onBlur={handleBlur}
                error={errors.longitud} touched={touched.longitud} />

              <SelectField id="localidad" label="Localidad(s)"
                placeholder="Ej: Lomas de Zamora" options={LOCALIDADES}
                value={form.localidad} onChange={handleChange} onBlur={handleBlur}
                error={errors.localidad} touched={touched.localidad} />
            </div>
          </div>

          {/* ── País / Provincia ── */}
          <div className={`${styles.grid3} ${styles.mb}`}>
            <SelectField id="pais" label="País" required
              placeholder="Ej: Argentina" options={PAISES}
              value={form.pais} onChange={handleChange} onBlur={handleBlur}
              error={errors.pais} touched={touched.pais} />
            <SelectField id="provincia" label="Provincia"
              placeholder="Ej: Buenos Aires" options={PROVINCIAS_AR}
              value={form.provincia} onChange={handleChange} onBlur={handleBlur}
              error={errors.provincia} touched={touched.provincia} />
            <div />
          </div>

          {/* ── Datos del Puerto ── */}
          <div className={styles.section}>
            <SectionTitle title="Datos del Puerto" />
            <div className={styles.grid4}>
              <SelectField id="tipo_muelle" label="Tipo de Muelle" required
                placeholder="Ej: Sólido" options={TIPOS_MUELLE}
                value={form.tipo_muelle} onChange={handleChange} onBlur={handleBlur}
                error={errors.tipo_muelle} touched={touched.tipo_muelle} />
              <NumberField id="cantidad_muelles" label="Cantidad de Muelles"
                placeholder="Ej: 4"
                value={form.cantidad_muelles} onChange={handleChange} onBlur={handleBlur}
                error={errors.cantidad_muelles} touched={touched.cantidad_muelles} />
              <NumberField id="eslora_max" label="Eslora Máximo Permitido"
                placeholder="Ej: 4"
                value={form.eslora_max} onChange={handleChange} onBlur={handleBlur}
                error={errors.eslora_max} touched={touched.eslora_max} />
              <NumberField id="calado_max" label="Calado Máximo Permitido"
                placeholder="Ej: 4"
                value={form.calado_max} onChange={handleChange} onBlur={handleBlur}
                error={errors.calado_max} touched={touched.calado_max} />
            </div>
          </div>

          {/* ── Contacto ── */}
          <div className={styles.section}>
            <SectionTitle title="Contacto" />
            <div className={styles.grid3}>
              <Field id="telefono" label="Nº de Teléfono"
                placeholder="Ej: 4256-4582"
                value={form.telefono} onChange={handleChange} onBlur={handleBlur}
                error={errors.telefono} touched={touched.telefono} />
              <Field id="email" label="Email" type="email"
                placeholder="Ej: Ejemplo@gmail.com.ar"
                value={form.email} onChange={handleChange} onBlur={handleBlur}
                error={errors.email} touched={touched.email} />
              <Field id="sitio_web" label="Sitio Web"
                placeholder="www.ejemplo.com.ar"
                value={form.sitio_web} onChange={handleChange} onBlur={handleBlur}
                error={errors.sitio_web} touched={touched.sitio_web} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className={styles.formFooter}>
            <button type="button" className={styles.btnCancel} onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving
                ? <><span className={styles.btnSpinner} /> Guardando...</>
                : <><span>💾</span> Guardar</>}
            </button>
          </div>

        </form>
      </main>

      <footer className={styles.pageFooter}>Sistema de Gestión Marítima V.1</footer>
    </div>
  );
}

// ── Internal sub-components ───────────────────────────────────────────────────

function SectionTitle({ title }) {
  return (
    <div className={styles.sectionTitle}>
      <span className={styles.dot} />
      {title}
    </div>
  );
}

function Field({ id, label, type = 'text', value, onChange, onBlur, error, touched, required, placeholder }) {
  const hasErr  = touched && !!error;
  const isValid = touched && !error && value?.toString().trim();
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}{required && <span className={styles.req}> *</span>}
      </label>
      <input
        id={id} type={type}
        className={`${styles.input} ${hasErr ? styles.inputErr : ''} ${isValid ? styles.inputOk : ''}`}
        value={value} placeholder={placeholder}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={() => onBlur(id)}
      />
      {hasErr && <p className={styles.errMsg}>{error}</p>}
    </div>
  );
}

function SelectField({ id, label, value, onChange, onBlur, error, touched, required, placeholder, options }) {
  const hasErr  = touched && !!error;
  const isValid = touched && !error && value;
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}{required && <span className={styles.req}> *</span>}
      </label>
      <select
        id={id}
        className={`${styles.input} ${styles.select} ${hasErr ? styles.inputErr : ''} ${isValid ? styles.inputOk : ''}`}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={() => onBlur(id)}
      >
        <option value="">{placeholder || 'Seleccionar...'}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hasErr && <p className={styles.errMsg}>{error}</p>}
    </div>
  );
}

function NumberField({ id, label, value, onChange, onBlur, error, touched, placeholder }) {
  const hasErr  = touched && !!error;
  const isValid = touched && !error && value;
  const inc = () => onChange(id, String((parseFloat(value) || 0) + 1));
  const dec = () => onChange(id, String(Math.max(0, (parseFloat(value) || 0) - 1)));
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.numWrap}>
        <input
          id={id} type="number"
          className={`${styles.input} ${styles.numInput} ${hasErr ? styles.inputErr : ''} ${isValid ? styles.inputOk : ''}`}
          value={value} placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          onBlur={() => onBlur(id)}
        />
        <div className={styles.numBtns}>
          <button type="button" className={styles.numBtn} onClick={inc}>▲</button>
          <button type="button" className={styles.numBtn} onClick={dec}>▼</button>
        </div>
      </div>
      {hasErr && <p className={styles.errMsg}>{error}</p>}
    </div>
  );
}

function PhotoUploader({ preview, error, onChange, onRemove }) {
  return (
    <div
      className={`${styles.photoDropzone} ${preview ? styles.hasPhoto : ''}`}
      onClick={() => document.getElementById('photo-input')?.click()}
    >
      <input
        id="photo-input" type="file" accept="image/png,image/jpeg"
        style={{ display:'none' }}
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />
      {preview ? (
        <>
          <img src={preview} alt="Vista previa" className={styles.photoImg} />
          <button type="button" className={styles.photoRemove}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}>✕</button>
        </>
      ) : (
        <>
          <div className={styles.uploadIcon}>⬆</div>
          <div className={styles.uploadLabel}>Cargar Foto</div>
          <div className={styles.uploadHint}>PNG,JPG (Max 5MB)</div>
        </>
      )}
      {error && <p className={styles.photoErr}>{error}</p>}
    </div>
  );
}
