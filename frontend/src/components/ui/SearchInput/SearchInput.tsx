import React from 'react';
import { Search } from 'lucide-react';
import styles from './SearchInput.module.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchInput: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Buscar usuario...',
}) => {
  return (
    <div className={styles.container}>
      <Search size={18} className={styles.icon} />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button onClick={() => onChange('')}>
            ✕
        </button>
        )}
    </div>
  );
};

