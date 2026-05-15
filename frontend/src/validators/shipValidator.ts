const CURRENT_YEAR = new Date().getFullYear();

export const validateCreateShip = (form: any) => {
  const errors: Record<string, string> = {};

  if (!form.name || form.name.trim() === '') {
    errors.name = 'El nombre del barco es obligatorio';
  }

  if (!form.imoNumber || form.imoNumber.trim() === '') {
    errors.imoNumber = 'El número IMO es obligatorio';
  }

  if (!form.registration || form.registration.trim() === '') {
    errors.registration = 'La matrícula es obligatoria';
  }

  if (!form.shipType || form.shipType.trim() === '') {
    errors.shipType = 'El tipo de barco es obligatorio';
  }

  if (!form.buildYear) {
    errors.buildYear = 'El año de construcción es obligatorio';
  } else {
    const year = Number(form.buildYear);
    if (isNaN(year) || year < 1800 || year > CURRENT_YEAR) {
      errors.buildYear = `El año debe estar entre 1800 y ${CURRENT_YEAR}`;
    }
  }

  if (!form.countryId) {
    errors.countryId = 'Debe seleccionar un país';
  }

  if (!form.status) {
    errors.status = 'El estado es obligatorio';
  }

  const positiveNumericFields: [string, string][] = [
    ['length', 'La eslora debe ser mayor a 0'],
    ['beam', 'La manga debe ser mayor a 0'],
    ['draft', 'El calado debe ser mayor a 0'],
    ['depth', 'El puntal debe ser mayor a 0'],
    ['weightTonnes', 'El peso debe ser mayor a 0'],
  ];

  for (const [field, msg] of positiveNumericFields) {
    if (!form[field]) {
      errors[field] = `${msg.split(' debe')[0]} es obligatorio`;
    } else {
      const val = Number(form[field]);
      if (isNaN(val) || val <= 0) {
        errors[field] = msg;
      }
    }
  }

  if (!form.crewCapacity) {
    errors.crewCapacity = 'La capacidad de tripulación es obligatoria';
  } else {
    const crew = Number(form.crewCapacity);
    if (isNaN(crew) || crew <= 0) {
      errors.crewCapacity = 'La capacidad de tripulación debe ser mayor a 0';
    }
  }

  if (!form.cargoCapacityTonnes && form.cargoCapacityTonnes !== 0 && form.cargoCapacityTonnes !== '0') {
    errors.cargoCapacityTonnes = 'La capacidad de carga es obligatoria';
  } else {
    const cargo = Number(form.cargoCapacityTonnes);
    if (isNaN(cargo) || cargo < 0) {
      errors.cargoCapacityTonnes = 'La capacidad de carga debe ser 0 o mayor';
    }
  }

  if (form.fuelCapacityLiters) {
    const fuel = Number(form.fuelCapacityLiters);
    if (isNaN(fuel) || fuel < 0) {
      errors.fuelCapacityLiters = 'La capacidad de combustible debe ser mayor a 0';
    }
  }

  if (form.currentEngineHours) {
    const hours = Number(form.currentEngineHours);
    if (isNaN(hours) || hours < 0) {
      errors.currentEngineHours = 'Las horas del motor deben ser 0 o más';
    }
  }

  if (form.lastTboEngineHours) {
    const tbo = Number(form.lastTboEngineHours);
    if (isNaN(tbo) || tbo < 0) {
      errors.lastTboEngineHours = 'Las horas del overhaul deben ser 0 o más';
    }
  }

  return errors;
};
