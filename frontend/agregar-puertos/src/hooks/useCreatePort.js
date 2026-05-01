import { useState, useCallback } from 'react';
import { createPort } from '../services/api/portsService';

// ── Validators ────────────────────────────────────────────────────────────────
const V = {
  required:    (v) => v?.toString().trim() ? null : 'Este campo es obligatorio.',
  text:        (v) => !v || /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-'.]+$/.test(v) ? null : 'Caracteres no permitidos.',
  numeric:     (v) => !v || /^-?\d+(\.\d+)?$/.test(v) ? null : 'Solo valores numéricos.',
  positiveInt: (v) => !v || /^\d+$/.test(v) ? null : 'Solo números enteros positivos.',
  latLng:      (v) => !v || /^-?\d{1,3}(\.\d{1,8})?$/.test(v) ? null : 'Coordenada inválida.',
  phone:       (v) => !v || /^[\d\s\-\+\(\)]{7,20}$/.test(v) ? null : 'Teléfono inválido.',
  email:       (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email inválido.',
  url:         (v) => !v || /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+/.test(v) ? null : 'URL inválida.',
  imoCode:     (v) => !v || /^[A-Z]{2}[A-Z0-9]{3,6}$/.test(v.toUpperCase()) ? null : 'Código inválido (Ej: ARBUE).',
};

// ── Field validation rules ────────────────────────────────────────────────────
const RULES = {
  nombre:            ['required', 'text'],
  codigo_int:        ['required', 'imoCode'],
  tipo_puerto:       ['required'],
  latitud:           ['required', 'latLng'],
  longitud:          ['required', 'latLng'],
  pais:              ['required'],
  tipo_muelle:       ['required'],
  cantidad_muelles:  ['positiveInt'],
  eslora_max:        ['numeric'],
  calado_max:        ['numeric'],
  telefono:          ['phone'],
  email:             ['email'],
  sitio_web:         ['url'],
};

function validateField(name, value) {
  const rules = RULES[name] || [];
  for (const rule of rules) {
    const err = V[rule]?.(value);
    if (err) return err;
  }
  return null;
}

function validateAll(form) {
  const errors = {};
  Object.keys(RULES).forEach((k) => {
    const err = validateField(k, form[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

// ── Photo validation ──────────────────────────────────────────────────────────
function validatePhoto(file) {
  if (!['image/png', 'image/jpeg'].includes(file.type)) return 'Solo PNG o JPG.';
  if (file.size > 5 * 1024 * 1024) return 'Máximo 5MB.';
  return null;
}

// ── Empty form ────────────────────────────────────────────────────────────────
const EMPTY = {
  nombre: '', codigo_int: '', tipo_puerto: '', latitud: '', longitud: '',
  pais: '', provincia: '', localidad: '',
  tipo_muelle: '', cantidad_muelles: '', eslora_max: '', calado_max: '',
  telefono: '', email: '', sitio_web: '',
};

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCreatePort() {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [saving, setSaving]     = useState(false);
  const [result, setResult]     = useState(null); // { success, offline, message }
  const [photo, setPhoto]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError]     = useState(null);

  const handleChange = useCallback((name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  }, []);

  const handleBlur = useCallback((name) => {
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validateField(name, form[name]) }));
  }, [form]);

  const handlePhotoChange = useCallback((file) => {
    const err = validatePhoto(file);
    if (err) { setPhotoError(err); return; }
    setPhotoError(null);
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => {
    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const allErrors = validateAll(form);
    setErrors(allErrors);
    setTouched(Object.fromEntries(Object.keys(RULES).map((k) => [k, true])));
    if (Object.keys(allErrors).length > 0) {
      setResult({ success: false, message: 'Revisá los campos marcados en rojo.' });
      return false;
    }
    setSaving(true);
    setResult(null);
    try {
      const res = await createPort(form, photo);
      setResult({
        success: true,
        offline: res.offline,
        message: res.offline
          ? '✓ Puerto guardado localmente. Se sincronizará al reconectar.'
          : '✓ Puerto registrado correctamente.',
      });
      return true;
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Error al guardar el puerto.' });
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, photo]);

  const reset = useCallback(() => {
    setForm(EMPTY); setErrors({}); setTouched({}); setResult(null);
    setPhoto(null); setPhotoPreview(null); setPhotoError(null);
  }, []);

  return {
    form, errors, touched, saving, result,
    photo, photoPreview, photoError,
    handleChange, handleBlur, handlePhotoChange, removePhoto, handleSubmit, reset,
  };
}
