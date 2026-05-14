import React from 'react';
import styles from './MultiSelectSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  title?: string;
  twoColumns?: boolean;
}

export const MultiSelectSelect: React.FC<MultiSelectSelectProps> = ({
  options,
  selectedValues,
  onChange,
  title,
  twoColumns = false,
}) => {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={styles.container}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={`${styles.optionsList} ${twoColumns ? styles.twoColumns : ''}`}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <label key={option.value} className={styles.optionLabel}>
              <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className={styles.labelText}>{option.label}</span>
              <input
                type="checkbox"
                className={styles.hiddenInput}
                checked={isSelected}
                onChange={() => handleToggle(option.value)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};
