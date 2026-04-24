export const validateCreateUser = (form: any) => {
  const errors: Record<string, string> = {};

  // Información General
  if (!form.generalInfo.name || !form.generalInfo.name.trim()) {
    errors['generalInfo.name'] = 'Requerido';
  }
  if (!form.generalInfo.surname || !form.generalInfo.surname.trim()) {
    errors['generalInfo.surname'] = 'Requerido';
  }
  if (!form.generalInfo.documentType) {
    errors['generalInfo.documentType'] = 'Requerido';
  }
  if (!form.generalInfo.documentNumber || !form.generalInfo.documentNumber.trim()) {
    errors['generalInfo.documentNumber'] = 'Requerido';
  } else if (!/^\d+$/.test(form.generalInfo.documentNumber)) {
    errors['generalInfo.documentNumber'] = 'Sólo números';
  }
  if (!form.generalInfo.cuil || !form.generalInfo.cuil.trim()) {
    errors['generalInfo.cuil'] = 'Requerido';
  }
  if (!form.generalInfo.birthDate) {
    errors['generalInfo.birthDate'] = 'Requerido';
  }
  if (!form.generalInfo.nationality) {
    errors['generalInfo.nationality'] = 'Requerido';
  }
  if (!form.generalInfo.maritalStatus) {
    errors['generalInfo.maritalStatus'] = 'Requerido';
  }
  if (!form.generalInfo.gender) {
    errors['generalInfo.gender'] = 'Requerido';
  }

  // Residencia
  if (!form.residenceInfo.countryId) {
    errors['residenceInfo.countryId'] = 'Requerido';
  }
  if (!form.residenceInfo.postalCode || !form.residenceInfo.postalCode.trim()) {
    errors['residenceInfo.postalCode'] = 'Requerido';
  }
  if (!form.residenceInfo.province) {
    errors['residenceInfo.province'] = 'Requerido';
  }
  if (!form.residenceInfo.locality) {
    errors['residenceInfo.locality'] = 'Requerido';
  }
  if (!form.residenceInfo.street || !form.residenceInfo.street.trim()) {
    errors['residenceInfo.street'] = 'Requerido';
  }
  if (!form.residenceInfo.number) {
    errors['residenceInfo.number'] = 'Requerido';
  }

  // Contacto
  if (!form.contactInfo.email) {
    errors['contactInfo.email'] = 'Requerido';
  } else if (!/^\S+@\S+\.\S+$/.test(form.contactInfo.email)) {
    errors['contactInfo.email'] = 'Email inválido';
  }

  // Laboral
  if (!form.laborData.navigationRole) {
    errors['laborData.navigationRole'] = 'Requerido';
  }
  if (!form.laborData.category) {
    errors['laborData.category'] = 'Requerido';
  }
  if (!form.laborData.hireDate) {
    errors['laborData.hireDate'] = 'Requerido';
  }
  if (!form.laborData.maritimeBookNumber || !form.laborData.maritimeBookNumber.trim()) {
    errors['laborData.maritimeBookNumber'] = 'Requerido';
  }

  // Si pertenece al sistema
  if (form.systemAccessData.belongsToSystem) {
    if (!form.systemAccessData.username || !form.systemAccessData.username.trim()) {
      errors['systemAccessData.username'] = 'Requerido';
    }
    if (!form.systemAccessData.password || !form.systemAccessData.password.trim()) {
      errors['systemAccessData.password'] = 'Requerido';
    }
    if (!form.systemAccessData.roleId) {
      errors['systemAccessData.roleId'] = 'Requerido';
    }
  }

  return errors;
};