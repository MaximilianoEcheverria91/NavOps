import React, { useState, useEffect } from 'react';
import styles from './RegisterCargoModal.module.css';
import { CARGO_CATEGORIES, CARGO_TYPES, CONTAINER_TYPES } from '../../../../../types/cargoType';
import type { CargoRequest } from '../../../../../types/cargoType';
import { Save } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSave: (cargo: CargoRequest) => void;
  initialData?: CargoRequest;
}

export const RegisterCargoModal: React.FC<Props> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<CargoRequest>(
    initialData || {
      productName: '',
      productCategory: '',
      productType: '',
      cargoType: '',
      quantity: 0,
      weightTonnes: 0,
      volumeM3: 0,
      owningCompany: '',
      containerType: null,
      hazardousMaterial: false,
      description: '',
      status: 'LOADED',
    }
  );

  useEffect(() => {
    if (formData.cargoType !== 'CONTAINER') {
      setFormData(prev => ({ ...prev, containerType: null }));
    }
  }, [formData.cargoType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleRadioChange = (val: boolean) => {
    setFormData(prev => ({ ...prev, hazardousMaterial: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Registrar Nueva Carga</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Nombre del producto</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Ej: Maquinaria industrial"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Empresa Propietaria</label>
              <input
                type="text"
                name="owningCompany"
                value={formData.owningCompany}
                onChange={handleChange}
                placeholder="Ej: Logistica S.A."
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Categoría del producto</label>
              <select name="productCategory" value={formData.productCategory} onChange={handleChange} required>
                <option value="">Selecciona categoría</option>
                {CARGO_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Tipo de Producto</label>
              <input
                type="text"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                placeholder="Ej: Electrónica"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Tipo de Carga</label>
              <select name="cargoType" value={formData.cargoType} onChange={handleChange} required>
                <option value="">Selecciona tipo de carga</option>
                {CARGO_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Material Peligroso:</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hazardous"
                    checked={formData.hazardousMaterial === true}
                    onChange={() => handleRadioChange(true)}
                  />
                  <span>SI</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="hazardous"
                    checked={formData.hazardousMaterial === false}
                    onChange={() => handleRadioChange(false)}
                  />
                  <span>NO</span>
                </label>
              </div>
            </div>

            {formData.cargoType === 'CONTAINER' && (
              <div className={styles.inputGroup}>
                <label>Tipo de contenedor</label>
                <select name="containerType" value={formData.containerType || ''} onChange={handleChange} required>
                  <option value="">Selecciona contenedor</option>
                  {CONTAINER_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            )}

            

          </div>

          <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el producto"
              rows={3}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label>Cantidad de carga</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity === 0 ? '' : formData.quantity}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Volumen (m³)</label>
              <input
                type="number"
                name="volumeM3"
                value={formData.volumeM3 === 0 ? '' : formData.volumeM3}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Peso (Toneladas)</label>
              <input
                type="number"
                name="weightTonnes"
                value={formData.weightTonnes === 0 ? '' : formData.weightTonnes}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave}>
              <Save size={18} /> Guardar y Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
