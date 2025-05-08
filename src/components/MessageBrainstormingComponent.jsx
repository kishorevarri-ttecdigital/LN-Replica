import React, { useState } from 'react';
import styles from './MessageBrainstormingComponent.module.css';
import ReactMarkdown from 'react-markdown';
import { useSessionContext } from '../context/SessionContext';

function MessageBrainstormingComponent({ payload, uuid ,TimeStamp}) {
  const [selectedElements, setSelectedElements] = React.useState([]);
  const {sessionData, addUpdateSessionDataSelectedInsights, addUpdateSessionData} = useSessionContext();
  const [isCardDisabled, setIsCardDisabled] = useState(false);

  
  const ActiveFeature = sessionData["ActiveFeature"] || "standard";

  if(selectedElements.length===0){
    if(sessionData[`${uuid}_selectedIdeas`] && sessionData[`${uuid}_selectedIdeas`].length>0){
      setSelectedElements(sessionData[`${uuid}_selectedIdeas`]);
      setIsCardDisabled(true);
    }
  }


  const onElementSelect = (elementText) => {
    // Toggle selection
    setSelectedElements((prevSelected) =>
      prevSelected.includes(elementText)
        ? prevSelected.filter((name) => name !== elementText)
        : [...prevSelected, elementText]
    );
  };


  if (!payload || !Array.isArray(payload)) {
    return null;
  }



  const updateSessionDataSelectedIdeas= ()=>{
    const newData = {[uuid]:selectedElements}
    
    // 1. Check for existing 'selectedInsights'
    if (sessionData && sessionData.selectedIdeas) {            
      addUpdateSessionDataSelectedInsights("selectedIdeas",newData)

    } else if (selectedElements.length>0){
      addUpdateSessionDataSelectedInsights(`selectedIdeas`,newData)
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

  const element = findTargetElement(payload, 'brainstorming_cards');  

  if (!element || !element.payload || !Array.isArray(element.payload)) {
    return null;
  }


  React.useEffect(() => {
    if(ActiveFeature!='brainstorming' && !sessionData[`${uuid}_CardDisabledTrue`]){
      updateSessionDataSelectedIdeas();
      addUpdateSessionData(`${uuid}_CardDisabledTrue`,true);
      addUpdateSessionData(`${uuid}_selectedIdeas`,selectedElements);

  }
    
      }, [ActiveFeature]);
  
  
  return (
            <div>
              <div className={styles.plainText}>Here are a few promotional ideas:</div>
              {element.payload.map((card, index) => (
                <div key={index} className={styles.card}>
                  <h3 style={{marginTop: '0'}}>{card.heading}</h3>
                  <div className={styles.reactMarkdownContainer}>
                    <ReactMarkdown>{card.content}</ReactMarkdown>
                    </div>
                    <button
                      className={`${styles.selectElement} ${selectedElements.includes(`(${card.heading}) ${card.content}`) ? styles.selected : ''}`}
                      onClick={() => onElementSelect(`(${card.heading}) ${card.content}`)}
                      disabled={sessionData[`${uuid}_CardDisabledTrue`]?true:isCardDisabled}

                    >
                      &#9733;
                    </button>
                  </div>       
              ))}
            </div>
          );
        }

export default MessageBrainstormingComponent;