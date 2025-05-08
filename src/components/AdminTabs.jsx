import React, { useState } from 'react';
import styles from './AdminTabs.module.css'; // We'll create this CSS module next
import ReportingComponent from './AdminTabReportingComponent';
import UserAdministration from './AdminTabUserAdministration';


const AdminTabs = ({ children }) => {
  const tabLabels = ["User Administration", "Reporting"];
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeader}>
        {tabLabels.map((label, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {/* Render content based on active tab */}
        {activeTab === 0 && <UserAdministration />}
        {activeTab === 1 && <ReportingComponent />}
        {/* <p>Content for: {tabLabels[activeTab]}</p> */}
        {/* If you pass children, you might want to render them conditionally */}
        {/* {React.Children.toArray(children)[activeTab]} */}
      </div>
    </div>
  );
};

export default AdminTabs;
