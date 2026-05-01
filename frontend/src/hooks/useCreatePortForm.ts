import { useState } from 'react';
import { createPort } from '../services/api/portService';
import { validateCreatePort } from '../validators/PortValidator';

export const countryCoordinates: Record<string, [number, number]> = {
  // Coordenadas aproximadas del centro de los países requeridos (lat, lng)
  'Argentina': [-38.4161, -63.6167],
  'Uruguay': [-32.5228, -55.7658],
  'Paraguay': [-23.4425, -58.4438],
  'Bolivia': [-16.2902, -63.5887],
  'Chile': [-35.6751, -71.5430],
  'Brasil': [-14.2350, -51.9253],
  'Brazil': [-14.2350, -51.9253] // Alias
};

export const useCreatePortForm = () => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'COMMERCIAL',
    countryId: '',
    provinceId: '',
    cityId: '',
    latitude: '',
    longitude: '',
    dockCount: '',
    maxLength: '',
    maxDraft: '',
    contactPhone: '',
    contactEmail: '',
    contactWeb: '', // Agregado web aunque no se envíe al back, según imagen
    timezone: 'UTC-3'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleImage = (file: File) => {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      throw new Error('Formato inválido');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Imagen demasiado grande');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    const validationErrors = validateCreatePort(form);

    if (Object.keys(validationErrors).length > 0) {
      console.log('🔴 Errores de Validación detectados:', validationErrors);
      setErrors(validationErrors);
      return { success: false };
    }

    setLoading(true);

    try {
      const dataToSend = {
        name: form.name,
        code: form.code,
        type: form.type,
        countryId: form.countryId,
        provinceId: form.provinceId,
        cityId: form.cityId,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        dockCount: form.dockCount ? Number(form.dockCount) : null,
        maxLength: form.maxLength ? Number(form.maxLength) : null,
        maxDraft: form.maxDraft ? Number(form.maxDraft) : null,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        timezone: form.timezone
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createPort(formData);
      return { success: true };
    } catch (err: any) {
      console.error('Error de Servidor al guardar puerto:', err);

      let backendErrorDetail = '';
      if (err.response?.status === 400 && err.response.data) {
        if (typeof err.response.data === 'object') {
           backendErrorDetail = '\nDetalles:\n' + JSON.stringify(err.response.data, null, 2);
        } else {
           backendErrorDetail = err.response.data;
        }
      }

      if (err.response && err.response.status === 409) {
        return { success: false, error: 'Hay datos duplicados (Ej. Código UN/LOCODE).' };
      }

      return { success: false, error: (err.response?.data?.message || err.response?.data?.error || 'Error de Servidor.') + backendErrorDetail };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    image,
    selectedCountryName,
    setSelectedCountryName,
    handleChange,
    handleImage,
    submit,
  };
};
