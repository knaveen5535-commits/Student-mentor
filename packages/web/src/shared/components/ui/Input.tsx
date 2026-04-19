'use client';
import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, size = 'md', className, ...props }, ref) => {
    return (
      <div className={styles.container}>
        {label && (
          <label className={styles.label} htmlFor={props.id}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.wrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            className={`
              ${styles.input}
              ${styles[`size-${size}`]}
              ${error ? styles.error : ''}
              ${icon ? styles.withIcon : ''}
              ${className || ''}
            `}
            {...props}
          />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
