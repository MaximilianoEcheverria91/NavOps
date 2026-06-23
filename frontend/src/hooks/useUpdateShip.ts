import { useState, useEffect } from 'react';
import { updateShip, getShipById } from '../services/api/shipService';
import { validateCreateShip } from '../validators/shipValidator';

export const useUpdateShip = (shipId: string | undefined) => {
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
  const [fetching, setFetching] = useState(true);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');

  useEffect(() => {
    if (!shipId) {
      setFetching(false);
      return;
    }

    setFetching(true);
    getShipById(shipId)
      .then((data: any) => { // 🔥 CAMBIÁ ESTA LÍNEA (Agregale el ": any")
        setForm({
          name: data.name || '',
          imoNumber: data.imoNumber || '',
          registration: data.registration || '',
          shipType: data.shipType || '',
          buildYear: data.buildYear ? String(data.buildYear) : '',
          
          // Ahora te va a leer los objetos anidados sin dar error en rojo:
          countryId: data.countryId || data.country?.id || data.nationality?.id || '',
          
          status: data.status || 'OPERATIONAL',
          hullNumber: data.hullNumber || '',
          length: data.length ? String(data.length) : '',
          beam: data.beam ? String(data.beam) : '',
          draft: data.draft ? String(data.draft) : '',
          depth: data.depth ? String(data.depth) : '',
          weightTonnes: data.weightTonnes ? String(data.weightTonnes) : '',
          crewCapacity: data.crewCapacity ? String(data.crewCapacity) : '',
          cargoCapacityTonnes: data.cargoCapacityTonnes ? String(data.cargoCapacityTonnes) : '',
          holdCount: data.holdCount !== null && data.holdCount !== undefined ? String(data.holdCount) : '',
          fuelCapacityLiters: data.fuelCapacityLiters !== null && data.fuelCapacityLiters !== undefined ? String(data.fuelCapacityLiters) : '',
          engineManufacturer: data.engineManufacturer || '',
          engineModel: data.engineModel || '',
          serialNumber: data.engineSerialNumber || '',
          currentEngineHours: data.currentEngineHours !== null && data.currentEngineHours !== undefined ? String(data.currentEngineHours) : '',
          lastTboEngineHours: data.lastTboEngineHours !== null && data.lastTboEngineHours !== undefined ? String(data.lastTboEngineHours) : '',
          lastMaintenanceDate: data.lastMaintenanceDate || '',
        });

        if (data.mainImageUrl) {
          setPreviewUrl(data.mainImageUrl);
        }

        // Esta sección tampoco te va a dar error de atributos ahora:
        if (data.countryName || data.country?.name) {
          setSelectedCountryName(data.countryName || data.country?.name);
        }
      })
      .catch((err) => console.error('Error al cargar datos del barco:', err))
      .finally(() => setFetching(false));
      }, [shipId]);

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

  const handleUpdate = async () => {
    if (!shipId) return { success: false, error: 'Falta el ID del barco' };

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

      await updateShip(shipId, formData);
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
    fetching,
    previewUrl,
    selectedCountryName,
    handleChange,
    handleImage,
    handleUpdate,
  };
};
