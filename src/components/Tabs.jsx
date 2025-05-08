import React, { useState, useEffect } from 'react';
import styles from './Tabs.module.css';
import { useTabContext } from '../context/TabContext';


function Tabs({ activeTab, onTabChange }) { // Receive globalPayload as prop
  const { tabStates } = useTabContext();  


  return (
    <div className={styles.tabs}>
      <button
        className={`${styles.tab} ${activeTab === 'start' ? styles.active : ''}`}
        onClick={() => onTabChange('start')}
        data-tab="start"
        disabled={!tabStates.start}
      >
        Start
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'inventory' ? styles.active : ''}`}
        onClick={() => onTabChange('inventory')}
        data-tab="inventory"
        disabled={!tabStates.inventory}
      >
        Inventory
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'research' ? styles.active : ''}`}
        onClick={() => onTabChange('research')}
        data-tab="research"
        disabled={!tabStates.research}
      >
        Research
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'brainstorming' ? styles.active : ''}`}
        onClick={() => onTabChange('brainstorming')}
        data-tab="brainstorming"
        disabled={!tabStates.brainstorming}
      >
        Brainstorm
      </button>
      <button
        className={`${styles.tab} ${activeTab === 'whitepaper' ? styles.active : ''}`}
        onClick={() => onTabChange('whitepaper')}
        data-tab="whitepaper"
        disabled={!tabStates.whitepaper}
      >
        Draft Response
      </button>
    </div>
  );
}

export default Tabs;

