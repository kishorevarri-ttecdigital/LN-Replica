import React, {useState} from 'react';
import styles from './MessageVenueListComponent.module.css';
import { useSessionContext } from '../context/SessionContext';

function MessageVenueListComponent({payload,sendMessage, uuid}) {
  const [selectedVenues, setSelectedVenues] = React.useState([]);
  const [isbutton,setIsButton] = React.useState(true);
  const [prompttoselect,setPromptToSelect] = React.useState(false);
  const {sessionData, addUpdateSessionData} = useSessionContext();
  const [isActionButtonClicked, setIsActionButtonClicked] = useState(false);
  const [refineInvocation, setRefineInvocation] = useState(false);
  
  
  const onVenueSelect = (venueName) => {
    // Toggle selection
    setSelectedVenues((prevSelected) =>
      prevSelected.includes(venueName)
        ? prevSelected.filter((name) => name !== venueName)
        : [...prevSelected, venueName]
    );    

  };

  
  if(selectedVenues && selectedVenues.length===0){
    if(sessionData[`${uuid}_selectedVenues`] && sessionData[`${uuid}_selectedVenues`].length>0){
      setSelectedVenues(sessionData[`${uuid}_selectedVenues`]);
      setIsActionButtonClicked(true);
    }
  }

  const onButtonClick = () =>{
    // Create a COPY of the array before modifying it.
    const selectedVenuesCopy = [...selectedVenues];
    let text='';
    if (selectedVenuesCopy.length === 0) {
      // console.log("You have selected no venue/s.");
      setPromptToSelect(true);
    } else if (selectedVenuesCopy.length === 1){   
        text = `Selected Venues/Festivals: ${selectedVenuesCopy[0]}`;        
        setPromptToSelect(false);
    } else {
      const lastItem = selectedVenuesCopy.pop();
      text = `Selected Venues/Festivals: ${selectedVenuesCopy.join(', ')} and ${lastItem}`;
      setPromptToSelect(false);
    }

    if (text.trim() !== '') {
      addUpdateSessionData(`${uuid}_selectedVenues`,selectedVenues);
      setIsActionButtonClicked(true);
      addUpdateSessionData("selectedVenuesFestivals",text);
      setPromptToSelect(false);
      sendMessage(text); // Call the prop function
    }
    };
  
    const onButtonClickRefine = () =>{      
        setIsActionButtonClicked(true);
        sendMessage("Refine available options"); // Call the prop function
        setRefineInvocation(true);

      };
  
  

  if (!payload || !Array.isArray(payload)) {
    return null;
  }

  //HELPER FUNCTION TO LOOK FOR THE TARGET ELEMENT
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

  const venues = findTargetElement(payload,'action_cards_venues_festivals_both'); 
  if (!venues || !venues.payload || !Array.isArray(venues.payload)) {
    return null;
  }

  const actionButtons = findTargetElement(payload,'action_button_venues_festivals_both');
  if (!actionButtons || !actionButtons.payload || !Array.isArray(actionButtons.payload)) {
    setIsButton(false);
  }

  React.useEffect(() => { 

    if(refineInvocation && !sessionData["venueRefineFlag"]){
      addUpdateSessionData(`${uuid}_CardDisabledTrue`,true); 
      addUpdateSessionData("venueRefineFlag",true);
      addUpdateSessionData("venuePayloadRe-render",payload);

    }    
    
      
      }, [refineInvocation]);

  return (
    <>
    <div className={styles.venueList}>
      {venues.payload.map((venueText,venueIndex) => (
        <div key={venueIndex} className={styles.venueItem}>
          <div className={styles.venueNameAndTags}>
            <span>{venueText.venue_name}</span>
            
            <div className={styles.venueTags}>
              {venueText.tags.map((tag, tagIndex) => (
                <span key={tag} data-tag-index={tagIndex}>{tag}</span>
              ))}
            </div>
          </div>

          <button
            className={`${styles.selectVenue} ${selectedVenues.includes(venueText.venue_name) ? styles.selected : ''}`}
            onClick={() => onVenueSelect(venueText.venue_name)}
            disabled={isActionButtonClicked}
          >
            &#9733;
          </button>
        </div>
      ))}
    </div>
    
    {isbutton && <div className={styles.actionButtonsContainer}>
            {actionButtons.payload.map((buttonText, buttonIndex) => (
                  <button
                    key={buttonIndex}
                    className={styles.actionButtonsButton}
                    onClick={() => onButtonClick()}
                  >
                    {buttonText}
                  </button>

                ))}
                {!sessionData["venueRefineFlag"] &&
                <button
                    key='refineButton'
                    className={styles.actionButtonsButton}
                    onClick={() => onButtonClickRefine()}
                  >
                    Refine available options
                  </button>
                }
                {prompttoselect && <span id={styles.selectionNotice}>Please select an item.</span>}
        </div>
    }
    </>   
  );
}

export default MessageVenueListComponent;
