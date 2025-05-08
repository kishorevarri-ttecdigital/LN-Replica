import React, { useState, useEffect } from 'react';
import styles from './AdminAreaContainer.module.css';
import { useNavigate } from 'react-router-dom';

import AdminTabs from './AdminTabs'; 

function AdminAreaContainer() {
  const navigate = useNavigate();

  const handleGoToHome =()=>{
    navigate('/');
  }

  return (
    <div className={styles.chatAreaContainer}>
      <div className={styles.HomeButton}>
        <button onClick={handleGoToHome} className={styles.homeButton}>
            Go to Home
          </button>
      </div>
      <AdminTabs>
      </AdminTabs>
    </div>
  );
}

export default AdminAreaContainer;
