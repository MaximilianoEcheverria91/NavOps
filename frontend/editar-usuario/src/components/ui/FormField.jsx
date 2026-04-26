import styles from './FormField.module.css';

/**
 * FormField
 * Reusable form field with label, input/select, and real-time validation message.
 * Handles: text, number, date, email, select types.
 */
export default function FormField({
  id, label, type = 'text', value, onChange, onBlur,
  error, touched, required, placeholder, options, disabled,
}) {
  const hasError = touched && !!error;
  const isValid  = touched && !error && value?.toString().trim();

  const inputClass = [
    styles.input,
    hasError ? styles.error : '',
    isValid  ? styles.valid  : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </label>

      {type === 'select' ? (
        <select
          id={id}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          onBlur={() => onBlur(id)}
          disabled={disabled}
        >
          <option value="">{placeholder || 'Seleccionar...'}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(id, e.target.value)}
          onBlur={() => onBlur(id)}
          disabled={disabled}
        />
      )}

      <span className={`${styles.msg} ${hasError ? styles.msgError : ''}`}>
        {hasError ? error : ''}
      </span>
    </div>
  );
}
