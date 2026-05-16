import { useState, useEffect } from 'react';
import { updatePort, getPortById } from '../services/api/portService';
import { validateCreatePort } from '../validators/PortValidator';

export const useEditPortForm = (portId: string | undefined) => {
  const [form, setForm] = useState({
    name: '',
    code: '',
    portType: '',
    countryId: '',
    provinceId: '',
    cityId: '',
    latitude: '',
    longitude: '',
    dockType: '',
    dockCount: '',
    maxLength: '',
    maxDraft: '',
    contactPhone: '',
    contactEmail: '',
    contactWeb: '', 
    timezone: 'UTC-3',
    status: 'OPERATIONAL'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  useEffect(() => {
    if (!portId) {
        setFetching(false);
        return;
    }
    
    setFetching(true);
    getPortById(portId)
      .then((data) => {
        setForm({
          name: data.name || '',
          code: data.code || '',
          portType: data.portType || '',
          countryId: data.countryId || '',
          provinceId: data.provinceId || '',
          cityId: data.cityId || '',
          latitude: data.latitude !== null && data.latitude !== undefined ? String(data.latitude) : '',
          longitude: data.longitude !== null && data.longitude !== undefined ? String(data.longitude) : '',
          dockType: data.dockType || '',
          dockCount: data.dockCount !== null && data.dockCount !== undefined ? String(data.dockCount) : '',
          maxLength: data.maxLength !== null && data.maxLength !== undefined ? String(data.maxLength) : '',
          maxDraft: data.maxDraft !== null && data.maxDraft !== undefined ? String(data.maxDraft) : '',
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          contactWeb: data.contactWeb || '',
          timezone: data.timezone || 'UTC-3',
          status: data.status || 'OPERATIONAL'
        });
        if (data.mainImageUrl) {
          setImage(data.mainImageUrl);
        }
        if (data.country) {
          setSelectedCountryName(data.country);
        }
        if (data.province) {
          setSelectedProvinceName(data.province);
        }
        if (data.city) {
          setSelectedCityName(data.city);
        }
      })
      .catch((err) => console.error('Error al cargar datos del puerto:', err))
      .finally(() => setFetching(false));
  }, [portId]);

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
    if (!portId) return { success: false, error: 'Falta el ID del puerto' };
    
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
        portType: form.portType,
        countryId: form.countryId,
        provinceId: form.provinceId,
        cityId: form.cityId,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        dockType: form.dockType,
        dockCount: form.dockCount ? Number(form.dockCount) : null,
        maxLength: form.maxLength ? Number(form.maxLength) : null,
        maxDraft: form.maxDraft ? Number(form.maxDraft) : null,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        contactWeb: form.contactWeb,
        timezone: form.timezone,
        status: form.status
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updatePort(portId, formData);
      return { success: true };
    } catch (err: any) {
      console.error('Error de Servidor al actualizar puerto:', err);

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
    fetching,
    image,
    selectedCountryName,
    setSelectedCountryName,
    selectedProvinceName,
    selectedCityName,
    handleChange,
    handleImage,
    submit,
  };
};
