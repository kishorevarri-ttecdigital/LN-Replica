import React, { useState } from 'react';
import styles from './MessageInsightsComponent.module.css';
import ReactMarkdown from 'react-markdown';
import { useSessionContext } from '../context/SessionContext';

function MessageInsightsComponent({ payload,uuid,TimeStamp }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInsights, setSelectedInsights] = React.useState([]);
  const {sessionData,addUpdateSessionDataSelectedInsights,addUpdateSessionData} = useSessionContext();
  const [isCardDisabled, setIsCardDisabled] = useState(false);

  const ActiveFeature = sessionData["ActiveFeature"] || "standard";
  

  if(selectedInsights.length===0){
    if(sessionData[`${uuid}_selectedInsights`] && sessionData[`${uuid}_selectedInsights`].length>0){
      setSelectedInsights(sessionData[`${uuid}_selectedInsights`]);
      setIsCardDisabled(true);
    }
  }

  const onInsightSelect = (uuid,insightSubtitle) => {
    // Toggle selection
    setSelectedInsights((prevSelected) =>
      prevSelected.includes(insightSubtitle)
        ? prevSelected.filter((name) => name !== insightSubtitle)
        : [...prevSelected, insightSubtitle]
    );
   
   };

  if (!payload || !Array.isArray(payload)) {
    return null;
  }
  

  const updateSessionDataSelectedInsights= ()=>{
    const newData = {[uuid]:selectedInsights}
    
    // 1. Check for existing 'selectedInsights'
    if (sessionData && sessionData.selectedInsights) {            
      addUpdateSessionDataSelectedInsights("selectedInsights",newData)

    } else if (selectedInsights.length>0){
      addUpdateSessionDataSelectedInsights(`selectedInsights`,newData)
    }
  };

  // HELPER FUNCTION TO LOOK FOR THE TARGET ELEMENT
  function findTargetElement(data, targetName) {
    if (!Array.isArray(data)) {
      return null;
    }

    for (const item of data) {
      if (Array.isArray(item)) {
        const found = findTargetElement(item, targetName);
        if (found) {
          return found;
        }
      } else if (typeof item === 'object' && item !== null) {
        if (item.name === targetName) {
          return item;
        }
        if (item.payload) {
          const found = findTargetElement(item.payload, targetName);
          if (found) {
            return found;
          }
        }
      }
    }

    return null;
  }

  const snippet = findTargetElement(payload, 'insights_card');  


  if (!snippet) {
    return null;
  }


  const popupContent = (
  <div className={styles.popup}>
    <h3>Document Title: {snippet.payload.title}</h3>
    <p>   </p>
    {snippet.payload.actionLink && (        
      <a href={snippet.payload.actionLink} target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '15px'}}>
        Link to source
      </a>
    )}
  </div>
  );
  

  React.useEffect(() => {

    if(ActiveFeature!='insights and research' && !sessionData[`${uuid}_CardDisabledTrue`]){
      updateSessionDataSelectedInsights();
      addUpdateSessionData(`${uuid}_CardDisabledTrue`,true);
      addUpdateSessionData(`${uuid}_selectedInsights`,selectedInsights);
  
    }

   
    }, [ActiveFeature]);
  

  

  

  return (
    <>
    <div className={styles.formattedTextContainer}>
      {snippet.payload.header && <div style={{marginBottom:'10px'}}>{snippet.payload.header}</div>}
      {snippet.payload.subtitle.map((item, index) => (
             item ? 
              <div key={`${index}_div`} className={styles.reactMarkdownContainer}>
                              <span><ReactMarkdown key={index}>{item}</ReactMarkdown></span> 
              
                  <button
                      className={`${styles.selectInsight} ${selectedInsights.includes(item) ? styles.selected : ''}`}
                      onClick={() => onInsightSelect(uuid,item)}
                      disabled={sessionData[`${uuid}_CardDisabledTrue`]?true:isCardDisabled}
                      // disabled={isCardDisabled}
                  >
                      &#9733;
                  </button>

              </div>
              : <br key={index} />
           ))}         
      </div>
      
      <div className={styles.snippetButtonContainer}>
        <button className={styles.snippetButton} onClick={() => setShowPopup(!showPopup)}>
          source
        </button>
        {showPopup && popupContent}
      </div>
    
    {snippet.payload.tailer && <div>{snippet.payload.tailer}</div>}

  </>
  );
}

export default MessageInsightsComponent;