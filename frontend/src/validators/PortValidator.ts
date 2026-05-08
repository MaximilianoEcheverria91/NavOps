export const validateCreatePort = (form: any) => {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim() === '') {
    errors.name = 'El nombre del puerto es obligatorio';
  }

  if (!form.portType || form.portType.trim() === '') {
    errors.portType = 'El tipo de puerto es obligatorio';
  }

  if (!form.code || form.code.trim() === '') {
    errors.code = 'El código internacional es obligatorio';
  } else if (!/^[A-Z0-9]{5}$/.test(form.code)) {
    errors.code = 'El código debe tener exactamente 5 letras mayúsculas (UN/LOCODE)';
  }

  if (!form.countryId) {
    errors.countryId = 'Debe seleccionar un país';
  }

  if (!form.provinceId) {
    errors.provinceId = 'Debe seleccionar una provincia';
  }

  if (!form.cityId) {
    errors.cityId = 'Debe seleccionar una localidad';
  }

  if (form.latitude === '' || form.latitude === undefined || form.latitude === null) {
    errors.latitude = 'La latitud es obligatoria';
  } else {
    const lat = Number(form.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.latitude = 'Latitud inválida (entre -90 y 90)';
    } else if (lat === 0 && Number(form.longitude) === 0) {
      errors.latitude = 'Coordenadas en 0,0 no válidas';
    }
  }

  if (form.longitude === '' || form.longitude === undefined || form.longitude === null) {
    errors.longitude = 'La longitud es obligatoria';
  } else {
    const lng = Number(form.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.longitude = 'Longitud inválida (entre -180 y 180)';
    }
  }

  if (form.maxLength) {
    const len = Number(form.maxLength);
    if (isNaN(len) || len <= 0) {
      errors.maxLength = 'La eslora máxima debe ser mayor a 0';
    }
  }

  if (form.maxDraft) {
    const draft = Number(form.maxDraft);
    if (isNaN(draft) || draft <= 0) {
      errors.maxDraft = 'El calado máximo debe ser mayor a 0';
    }
  }

  if (form.dockCount) {
    const docks = Number(form.dockCount);
    if (isNaN(docks) || docks < 0 || !Number.isInteger(docks)) {
      errors.dockCount = 'Cantidad de muelles inválida';
    }
  }

  return errors;
};


/*export const PortValidator = {
    name: {
        required: "El nombre del puerto es obligatorio",
        minLength: { value: 3, message: "Mínimo 3 caracteres" }
    },
    code: {
        required: "El código UN/LOCODE es obligatorio",
        pattern: {
            value: /^[A-Z]{5}$/,
            message: "El código debe ser de 5 letras mayúsculas (ej: ARBUE)"
        }
    },
    latitude: {
        required: "Marcá el puerto en el mapa",
        min: { value: -90, message: "Latitud inválida" },
        max: { value: 90, message: "Latitud inválida" }
    },
    longitude: {
        required: "Marcá el puerto en el mapa",
        min: { value: -180, message: "Longitud inválida" },
        max: { value: 180, message: "Longitud inválida" }
    }
};*/