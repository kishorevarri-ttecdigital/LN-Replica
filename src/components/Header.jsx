import React from 'react';
import styles from './Header.module.css';
import logo from '../assets/logo.png';

function Header() {
  return (
    <div className={styles.header}>
      <img src={logo} alt="Live Nation Logo" className={styles.logo} />
      <h1>Media & Sponsorship AI Assistant</h1>      
      <div className={styles.buttonsTopRight}>
      </div>
    </div>
  );
}

export default Header;
