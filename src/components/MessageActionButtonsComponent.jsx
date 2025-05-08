import React from 'react';
import styles from './ChatArea.module.css';
import { useSessionContext } from '../context/SessionContext';
import { brand_profile } from '../utils/whitepaperHelperfunction';

function MessageActionsButtonComponent({ payload,sendMessage,dataContext,dataToSet}) {
const {sessionData,addUpdateSessionData} = useSessionContext();

  if (!payload || !Array.isArray(payload)) {
    return null;
  }
  //HELPER FUNCTION TO LOOK FOR THE TARGET ELEMENT
  function findActionButton(data) {
    if (!Array.isArray(data)) {
      return null;
    }
  
    for (const item of data) {
      if (Array.isArray(item)) {
        const found = findActionButton(item);
        if (found) {
          return found;
        }
      } else if (typeof item === 'object' && item !== null) {
        if (item.name === 'action_button') {
          return item;
        }
        if (item.payload) {
          const found = findActionButton(item.payload);
          if (found) {
            return found;
          }
        }
      }
    }
  
    return null;
  }

  const actionButtons = findActionButton(payload);

  if (!actionButtons || !actionButtons.payload || !Array.isArray(actionButtons.payload)) {
    return null;
  }
  

  const onButtonClick =(text)=>{

    const selectedFeatures =["start","inventory search","insights and research","brainstorming","draft proposal"];

    if(selectedFeatures.includes(text.toLowerCase())){         
      addUpdateSessionData("ActiveFeature",text.toLowerCase());
    }

    if(text.toLowerCase().includes('proceed') && dataContext.toLowerCase().includes('brand_profile')){
      const brandProfileString = brand_profile(dataToSet);    
      addUpdateSessionData("brandProfile",brandProfileString);
    }
    

    if(text.toLowerCase().includes("travel_")){
      const subCategory =`- Selected subcategory:\n   - ${text}`
      addUpdateSessionData("subCategory",subCategory);
    }

    const IsWhitepaper = checkText(text);
    const InfoForWhitepaper = generateOutput(sessionData,text);

    if(IsWhitepaper === true && InfoForWhitepaper){ 
      // console.log("INFO FOR WHITE PAPER -------",InfoForWhitepaper)
      addUpdateSessionData("infoForWhitepaper",InfoForWhitepaper); 
      sendMessage(text,InfoForWhitepaper); // Call the prop function
      
      
    }else

    if (text.trim() !== '') {
      sendMessage(text,null); // Call the prop function
      
    }
  }

  //HELPER FUNCTION THAT CHECK IF A STRING IS IN THE LIST OF KEYWOARDS
  function checkText(text) {
    const keywords = ["Casual", "Formal", "Creative", "Persuasive", "Logical"];
    const lowerCaseText = text.toLowerCase();
    const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());

    if (lowerCaseKeywords.includes(lowerCaseText)) {
        return true;
    } else {
        return false;
    }
  }
  // HELPER FUNCTION TO CURRATE THE INFORMATION NEEDED FOR THE WHITE PAPER
  function generateOutput(sessionData,tone) {
    const brandProfile = sessionData.brandProfile;
    const subCategory = sessionData.subCategory;
    const selectedVenue = sessionData.selectedVenuesFestivals;
    const selectedInventories = sessionData.selectedInventories;

    let selectedInsights = null;
    if (sessionData.selectedInsights) {
      const insights = [];
      for (const key in sessionData.selectedInsights) {
        insights.push(...sessionData.selectedInsights[key]);
      }
      selectedInsights = `- Selected insights and research:\n   ${insights.join(
        "\n   "
      )}`;
    }

    let selectedIdeas = null;
    if (sessionData.selectedIdeas) {
      const ideas = [];
      for (const key in sessionData.selectedIdeas) {
        ideas.push(...sessionData.selectedIdeas[key]);
      }
      selectedIdeas = `- Selected brainstorming ideas:\n   - ${ideas.join(
        "\n   - "
      )}`;
    }
    return `Here is the information needed to generate the draft proposal:\n${brandProfile}\n${subCategory}\n-${selectedVenue}\n-${selectedInventories}\n${selectedInsights}\n${selectedIdeas}\n-Tone to use for the draft proposal:\n   -${tone}\n-Include Budget information in the proposal`;
  }

  return (
    <div className={styles.actionButtonsContainer}>
      {actionButtons.payload.map((buttonText, buttonIndex) => (
            <button
              key={buttonIndex}
              className={styles.actionButtonsButton}
              onClick={() => onButtonClick(buttonText)}
            >
              {buttonText}
            </button>
          ))}
    </div>
    
  );
}

export default MessageActionsButtonComponent;
