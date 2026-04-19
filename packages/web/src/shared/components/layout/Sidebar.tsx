'use client';
import React from 'react';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, isOpen = true, onClose }) => {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      {isOpen && <button className={styles.closeBtn} onClick={onClose}>×</button>}
      <nav className={styles.nav}>
        {children}
      </nav>
    </aside>
  );
};
