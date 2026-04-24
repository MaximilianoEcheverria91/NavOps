import { useState } from 'react';
import { createUser } from '../services/api/userService';
import { validateCreateUser } from '../validators/userValidators';
import { addToQueue } from './../offline/offlineQueue';

export const useCreateUserForm = () => {
  const [form, setForm] = useState({
    generalInfo: {
      name: '',
      surname: '',
      documentType: '',
      documentNumber: '',
      cuil: '',
      birthDate: '',
      nationality: '',
      maritalStatus: '',
      gender: '',
    },

    residenceInfo: {
      countryId: '',
      province: '',
      locality: '',
      postalCode: '',
      //    postalCode: '1832',
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
      navigationRole: '',
      category: '',
      hireDate: '',
      maritimeBookNumber: '',
      status: 'ACTIVE',
    },
    systemAccessData: {
      belongsToSystem: false,
      username: '',
      password: '',
      roleId: '',
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (section: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));

    // Auto-limpiar el error del campo cuando el usuario tipea
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
      setImageFile(file); // Guardamos para FormData (Cloudinary)
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    const validationErrors = validateCreateUser(form);

    if (Object.keys(validationErrors).length > 0) {
      console.log('🔴 Errores de Validación detectados:', validationErrors);
      setErrors(validationErrors);
      return { success: false };
    }

    setLoading(true);

    try {
      // Clonar form para modificar cómo enviamos al back
      const dataToSend = JSON.parse(JSON.stringify(form));

      // Emparejar la mayúscula exacta que Java exige (@NotBlank String PostalCode)
      dataToSend.residenceInfo.PostalCode = dataToSend.residenceInfo.postalCode;

      // Si NO pertenece al sistema, borrar el objeto para que Spring Boot revoque el @Valid
      if (!dataToSend.systemAccessData.belongsToSystem) {
        dataToSend.systemAccessData = null;
      }

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createUser(formData);
      return { success: true };
    } catch (err: any) {
      console.error('Error de Servidor al guardar:', err);

      // Si interceptamos los errores exactos de SpringBoot 400 Bad Request, los extraemos:
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
          url: '/admin/create-user',
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
    image,
    handleChange,
    handleImage,
    submit,
  };
};