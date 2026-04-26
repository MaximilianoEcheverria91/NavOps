import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserById, updateUser } from '../services/api/usersService';

// ── Validators ────────────────────────────────────────────────────────────────
const VALIDATORS = {
  required:    (v) => (v?.toString().trim() ? null : 'Este campo es obligatorio.'),
  onlyLetters: (v) => (!v || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(v) ? null : 'Solo letras.'),
  numeric:     (v) => (!v || /^\d+$/.test(v) ? null : 'Solo números.'),
  cuil:        (v) => (!v || /^\d{2}-\d{7,8}-\d$/.test(v) ? null : 'Formato: 20-12345678-1'),
  phone:       (v) => (!v || /^[\d\s\-\+\(\)]{7,15}$/.test(v) ? null : 'Teléfono inválido.'),
  email:       (v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido.'),
  date: (v) => {
    if (!v) return null;
    const year = new Date(v).getFullYear();
    if (year < 1900 || year > new Date().getFullYear() + 1) return 'Año fuera de rango.';
    return null;
  },
};

// ── Field rules map ───────────────────────────────────────────────────────────
const FIELD_RULES = {
  nombres:       ['required', 'onlyLetters'],
  apellido:      ['required', 'onlyLetters'],
  tipo_doc:      ['required'],
  nro_doc:       ['required', 'numeric'],
  cuil:          ['required', 'cuil'],
  fecha_nac:     ['required', 'date'],
  celular:       ['required', 'phone'],
  email:         ['required', 'email'],
  cargo:         ['required'],
  fecha_ingreso: ['required', 'date'],
  legajo:        ['required'],
  estado:        ['required'],
  tel_particular:['phone'],
  altura:        ['numeric'],
  piso:          ['numeric'],
};

function validateField(name, value) {
  const rules = FIELD_RULES[name] || [];
  for (const rule of rules) {
    const error = VALIDATORS[rule]?.(value);
    if (error) return error;
  }
  return null;
}

function validateAll(form) {
  const errors = {};
  Object.keys(FIELD_RULES).forEach((name) => {
    const error = validateField(name, form[name]);
    if (error) errors[name] = error;
  });
  return errors;
}

// ── Photo validation ──────────────────────────────────────────────────────────
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];
const MAX_PHOTO_MB  = 5;

function validatePhoto(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Solo PNG o JPG.';
  if (file.size > MAX_PHOTO_MB * 1024 * 1024) return `Máximo ${MAX_PHOTO_MB}MB.`;
  return null;
}

// ── Initial empty form ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  nombres: '', apellido: '', tipo_doc: '', nro_doc: '', cuil: '',
  fecha_nac: '', nacionalidad: '', estado_civil: '', genero: '',
  pais: '', provincia: '', localidad: '', calle: '', altura: '',
  depto: '', piso: '', tel_particular: '', celular: '', email: '',
  cargo: '', categoria: '', fecha_ingreso: '', legajo: '', libreta: '', estado: '',
};

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useEditUser(userId) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [saveResult, setSaveResult] = useState(null); // { success, offline, message }
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError]   = useState(null);
  const originalDataRef = useRef(null);

  // ── Load user data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setFetchError(null);

    getUserById(userId)
      .then((data) => {
        const mapped = mapApiToForm(data);
        setForm(mapped);
        originalDataRef.current = mapped;
        if (data.foto_url) setPhotoPreview(data.foto_url);
      })
      .catch((err) => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  // ── Field change ────────────────────────────────────────────────────────────
  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  // ── Field blur ──────────────────────────────────────────────────────────────
  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, [form]);

  // ── Photo change ────────────────────────────────────────────────────────────
  const handlePhotoChange = useCallback((file) => {
    const error = validatePhoto(file);
    if (error) { setPhotoError(error); return; }
    setPhotoError(null);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const allErrors = validateAll(form);
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(FIELD_RULES).map((k) => [k, true])));

    if (Object.keys(allErrors).length > 0) {
      setSaveResult({ success: false, message: 'Revisá los campos marcados en rojo.' });
      return false;
    }

    setSaving(true);
    setSaveResult(null);

    try {
      const result = await updateUser(userId, mapFormToApi(form), photoFile);
      setSaveResult({
        success: true,
        offline: result.offline,
        message: result.offline
          ? '✓ Cambios guardados localmente. Se sincronizarán al reconectar.'
          : '✓ Usuario actualizado correctamente.',
      });
      return true;
    } catch (err) {
      setSaveResult({ success: false, message: err.message || 'Error al guardar.' });
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, photoFile, userId]);

  return {
    form, errors, touched, loading, saving, fetchError, saveResult,
    photoPreview, photoError,
    handleChange, handleBlur, handlePhotoChange, removePhoto, handleSubmit,
  };
}

// ── Data mappers ──────────────────────────────────────────────────────────────
function mapApiToForm(data) {
  return {
    nombres:       data.nombres       || '',
    apellido:      data.apellido      || '',
    tipo_doc:      data.tipo_doc      || '',
    nro_doc:       data.nro_doc       || '',
    cuil:          data.cuil          || '',
    fecha_nac:     data.fecha_nac     || '',
    nacionalidad:  data.nacionalidad  || '',
    estado_civil:  data.estado_civil  || '',
    genero:        data.genero        || '',
    pais:          data.pais          || '',
    provincia:     data.provincia     || '',
    localidad:     data.localidad     || '',
    calle:         data.calle         || '',
    altura:        data.altura        || '',
    depto:         data.depto         || '',
    piso:          data.piso          || '',
    tel_particular:data.tel_particular|| '',
    celular:       data.celular       || '',
    email:         data.email         || '',
    cargo:         data.cargo         || '',
    categoria:     data.categoria     || '',
    fecha_ingreso: data.fecha_ingreso || '',
    legajo:        data.legajo        || '',
    libreta:       data.libreta       || '',
    estado:        data.estado        || '',
  };
}

function mapFormToApi(form) {
  return { ...form };
}
