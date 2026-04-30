import { useState, useEffect } from 'react';
import { updateUser, getUserForEdit } from '../services/api/userService';
import { validateEditUser } from '../validators/userValidators';
import { addToQueue } from './../offline/offlineQueue';

export const useEditUserForm = (id: string) => {
  const [form, setForm] = useState({
    avatarUrl: '',
    generalInfo: {
      name: '',
      surname: '',
      documentType: '',
      documentNumber: '',
      cuil: '',
      birthDate: '',
      nationality: '',
      nationalityCountryId: '',
      maritalStatus: '',
      gender: '',
      status: 'ACTIVE'
    },
    residenceInfo: {
      countryId: '',
      provinceId: '',
      cityId: '',
      postalCode: '',
      street: '',
      number: '',
      department: '',
      floor: '',
    },
    contactInfo: {
      particularPhone: '',
      cellPhone: '',
      email: '',
    },
    laborData: {
      fileNumber: '',
      navigationRole: '',
      category: '',
      hireDate: '',
      maritimeBookNumber: '',
      status: 'AVAILABLE',
    },
    systemAccessData: {
      belongsToSystem: false,
      username: '',
      roleId: '',
      isActive: true,
      is_blocked: false
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (id) {
      setLoadingData(true);
      getUserForEdit(id)
        .then(data => {
          setForm({
            avatarUrl: data.avatarUrl || '',
            generalInfo: {
              name: data.generalInfo?.name || '',
              surname: data.generalInfo?.surname || '',
              documentType: data.generalInfo?.documentType || '',
              documentNumber: data.generalInfo?.documentNumber || '',
              cuil: data.generalInfo?.cuil || '',
              birthDate: data.generalInfo?.birthDate || '',
              nationality: data.generalInfo?.nationality || '',
              nationalityCountryId: data.generalInfo?.nationalityCountryId || '',
              maritalStatus: data.generalInfo?.maritalStatus || '',
              gender: data.generalInfo?.gender || '',
              status: data.generalInfo?.status || 'ACTIVE'
            },
            residenceInfo: {
              countryId: data.residenceInfo?.countryId || '',
              provinceId: data.residenceInfo?.provinceId || '',
              cityId: data.residenceInfo?.cityId || '',
              postalCode: data.residenceInfo?.postalCode || '',
              street: data.residenceInfo?.street || '',
              number: data.residenceInfo?.number || '',
              department: data.residenceInfo?.department || '',
              floor: data.residenceInfo?.floor || '',
            },
            contactInfo: {
              particularPhone: data.contactInfo?.particularPhone || '',
              cellPhone: data.contactInfo?.cellPhone || '',
              email: data.contactInfo?.email || '',
            },
            laborData: {
              fileNumber: data.laborData?.fileNumber || '',
              navigationRole: data.laborData?.navigationRole || '',
              category: data.laborData?.category || '',
              hireDate: data.laborData?.hireDate || '',
              maritimeBookNumber: data.laborData?.maritimeBookNumber || '',
              status: data.laborData?.status || 'AVAILABLE',
            },
            systemAccessData: {
              belongsToSystem: data.systemAccessData?.belongsToSystem || false,
              username: data.systemAccessData?.username || '',
              roleId: data.systemAccessData?.roleId || '',
              isActive: data.systemAccessData?.isActive !== false,
              is_blocked: data.systemAccessData?.is_blocked || false
            },
          });
          if (data.avatarUrl) {
            setImage(data.avatarUrl);
          }
        })
        .catch(err => {
          console.error("Error cargando datos para edición", err);
        })
        .finally(() => {
          setLoadingData(false);
        });
    }
  }, [id]);

  const handleChange = (section: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value,
      },
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${section}.${field}`];
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
    const validationErrors = validateEditUser(form);

    if (Object.keys(validationErrors).length > 0) {
      console.log('🔴 Errores de Validación detectados:', validationErrors);
      setErrors(validationErrors);
      return { success: false };
    }

    setLoading(true);

    try {
      const dataToSend = JSON.parse(JSON.stringify(form));
      dataToSend.residenceInfo.PostalCode = dataToSend.residenceInfo.postalCode;

      if (!dataToSend.systemAccessData.belongsToSystem) {
        dataToSend.systemAccessData = null;
      }

      if (!imageFile && image && image.startsWith("http")) {
         dataToSend.avatarUrl = image;
      }

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateUser(id, formData);
      return { success: true };
    } catch (err: any) {
      console.error('Error de Servidor al actualizar:', err);

      let backendErrorDetail = '';
      if (err.response?.status === 400 && err.response.data) {
        if (typeof err.response.data === 'object') {
           backendErrorDetail = '\nDetalles:\n' + JSON.stringify(err.response.data, null, 2);
        } else {
           backendErrorDetail = err.response.data;
        }
      }

      if (!navigator.onLine) {
        addToQueue({
          url: `/admin/user/${id}`,
          method: 'PUT',
          data: form,
        });

        return { success: true, offline: true };
      }

      if (err.response && err.response.status === 409) {
        return { success: false, error: 'Hay datos duplicados (Ej. Email, DNI).' };
      }

      return { success: false, error: (err.response?.data?.message || 'Error de Servidor (500) o Bad Request (400).') + backendErrorDetail };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    loadingData,
    image,
    handleImage,
    handleChange,
    submit,
  };
};
