'use client';
import React from 'react';
import styles from './Card.module.css';

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated';
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          ${styles.card}
          ${styles[`variant-${variant}`]}
          ${hoverable ? styles.hoverable : ''}
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
