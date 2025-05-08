import React, { useState } from 'react';
import styles from './SummarySection.module.css';
import { useSummaryContext } from '../context/SummaryContext';



function SummarySection(activeTab) {
  const [isOpen, setIsOpen] = useState(false);
  const {summaryItems} = useSummaryContext();


  const SummaryItemList = activeTab.summaryItems[activeTab.activeTab]
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // helper function
  function capitalizeFirstLetter(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const ActiveTab = activeTab['activeTab']
  const SummaryItems = activeTab['summaryItems'][ActiveTab]

  const IsShowMessage =()=>{
    if(SummaryItems && SummaryItems.length>3){
      return true
    }
  }
  
  return (
      <div className={styles.summarySection}>
        <div className={styles.summaryItem}>
          <span>Summary</span>
            <span className={styles.infoIcon}>&#9432;</span>
            <div className={styles.summaryTags}>
              {SummaryItemList &&
              (isOpen
                ? SummaryItemList.map((item, index) => (
                    <div key={`div${index}`} style={{marginBottom:'10px', display:'inline-block'}}><span key={index}>{capitalizeFirstLetter(item)}</span></div>
                  ))
                : SummaryItemList.slice(0, 3).map((item, index) => (
                  <div key={`div2${index}`} style={{marginBottom:'10px', display:'inline-block'}}><span key={index}>{capitalizeFirstLetter(item)}</span></div>                  
                  )))}
              </div>              
          <button className={styles.dropdownArrow} onClick={toggleOpen}>
            {isOpen ? '\u2303' : '\u2304'}
          </button>          
        </div>
        <div style={{marginRight:'10px',fontSize:'14px', color:'blue', textAlign:'right'}}>
          {!isOpen && IsShowMessage()?`Showing 3 out of ${SummaryItems.length} summary items`:''}
        </div>
      </div>
    );
  }

export default SummarySection;
