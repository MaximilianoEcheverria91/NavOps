//import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : (
        <span className={styles.content}>
          {icon && icon}
          {children}
        </span>
      )}
    </button>
  );
};
