import { useState } from 'react';
import { createShip } from '../services/api/shipService';
import { validateCreateShip } from '../validators/shipValidator';

export const useCreateShipForm = () => {
  const [form, setForm] = useState({
    name: '',
    imoNumber: '',
    registration: '',
    shipType: '',
    buildYear: '',
    countryId: '',
    status: 'OPERATIONAL',
    hullNumber: '',
    length: '',
    beam: '',
    draft: '',
    depth: '',
    weightTonnes: '',
    crewCapacity: '',
    cargoCapacityTonnes: '',
    holdCount: '',
    fuelCapacityLiters: '',
    engineManufacturer: '',
    engineModel: '',
    serialNumber: '',
    currentEngineHours: '',
    lastTboEngineHours: '',
    lastMaintenanceDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleImage = (file: File) => {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      throw new Error('Formato inválido. Solo PNG o JPG.');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no puede superar 5MB.');
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const submit = async () => {
    const validationErrors = validateCreateShip(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return { success: false };
    }

    setLoading(true);
    try {
      const dataToSend = {
        name: form.name,
        imoNumber: form.imoNumber,
        registration: form.registration,
        shipType: form.shipType,
        buildYear: Number(form.buildYear),
        countryId: form.countryId,
        status: form.status,
        hullNumber: form.hullNumber || null,
        length: Number(form.length),
        beam: Number(form.beam),
        draft: Number(form.draft),
        depth: Number(form.depth),
        weightTonnes: Number(form.weightTonnes),
        crewCapacity: Number(form.crewCapacity),
        cargoCapacityTonnes: Number(form.cargoCapacityTonnes),
        holdCount: form.holdCount ? Number(form.holdCount) : null,
        fuelCapacityLiters: form.fuelCapacityLiters ? Number(form.fuelCapacityLiters) : null,
        engineManufacturer: form.engineManufacturer || null,
        engineModel: form.engineModel || null,
        serialNumber: form.serialNumber || null,
        currentEngineHours: form.currentEngineHours ? Number(form.currentEngineHours) : null,
        lastTboEngineHours: form.lastTboEngineHours ? Number(form.lastTboEngineHours) : null,
        lastMaintenanceDate: form.lastMaintenanceDate || null,
      };

      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify(dataToSend)], { type: 'application/json' }));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createShip(formData);
      return { success: true };
    } catch (err: any) {
      if (err.response?.status === 409) {
        return { success: false, error: 'El IMO o la matrícula ya se encuentran registrados.' };
      }
      const detail = err.response?.data?.message || err.response?.data?.error || 'Error de servidor.';
      return { success: false, error: detail };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    loading,
    previewUrl,
    handleChange,
    handleImage,
    submit,
  };
};
