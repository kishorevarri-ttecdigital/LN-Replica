import React, {useState} from 'react';
import styles from './MessageInventoryListComponent.module.css';
import { useSessionContext } from '../context/SessionContext';
import { useSummaryContext } from '../context/SummaryContext';
import { useTabContext } from '../context/TabContext';

function MessageInventoryListComponent({ payload, sendMessage, uuid }) {
  const [selectedVenues, setSelectedVenues] = React.useState([]);
  const [isbutton, setIsButton] = React.useState(true);
  const [prompttoselect, setPromptToSelect] = React.useState(false);
  const {sessionData, addUpdateSessionData} = useSessionContext();
  const {tabStates, getLatestEnabledTab} = useTabContext();
  const {summaryItems, updateSummaryItems} = useSummaryContext();
  const [isActionButtonClicked, setIsActionButtonClicked] = useState(false);



  const onVenueSelect = (venueName) => {
    // Toggle selection
    setSelectedVenues((prevSelected) =>
      prevSelected.includes(venueName)
        ? prevSelected.filter((name) => name !== venueName)
        : [...prevSelected, venueName]
    );
  };

  if(selectedVenues.length===0){
    if(sessionData[`${uuid}_selectedInventories`] && sessionData[`${uuid}_selectedInventories`].length>0){
      setSelectedVenues(sessionData[`${uuid}_selectedInventories`]);
      setIsActionButtonClicked(true);
    }
  }

  const onButtonClick = () => {
    let text = '';
    // Create a copy to avoid modifying state directly during render
    const selectedVenuesCopy = [...selectedVenues];

    if (selectedVenuesCopy.length === 0) {
      setPromptToSelect(true);
    } else if (selectedVenuesCopy.length === 1) {
      text = `Selected Inventory: ${selectedVenuesCopy[0]}`;
      setPromptToSelect(false);
    } else {
      const lastItem = selectedVenuesCopy.pop();
      text = `Selected Inventories: ${selectedVenuesCopy.join(', ')} and ${lastItem}`;
      setPromptToSelect(false);
    }
    
    if (text.trim() !== '') {

      const activeTab = getLatestEnabledTab(tabStates);
      const summaryItemsCopy = summaryItems[activeTab];
      selectedVenues.forEach((item,index) =>{
        summaryItemsCopy.push(`Inventory: ${item}`);      
      });

      addUpdateSessionData(`${uuid}_selectedInventories`,selectedVenues);     
      setIsActionButtonClicked(true);
      updateSummaryItems(activeTab,summaryItemsCopy);
      addUpdateSessionData("selectedInventories",text);
      setPromptToSelect(false);
      sendMessage(text); // Call the prop function
    }
  };

  if (!payload || !Array.isArray(payload)) {
    return null;
  }

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

  

  const venues = findTargetElement(payload, 'action_cards_inventories');
  if (!venues || !venues.payload || !Array.isArray(venues.payload)) {

    return null;
  }

  const actionButtons = findTargetElement(payload, 'action_button_inventories');
  if (!actionButtons || !actionButtons.payload || !Array.isArray(actionButtons.payload)) {
    setIsButton(false);
  }

  
  return (
    <>
    <div className={styles.venueList}>
      {venues.payload.map((venue, venueIndex) => (
        <div key={venueIndex} className={styles.venueItem}>
          <div className={styles.venueNameAndTags}>
              <span>{venue.inventory_name}</span>
                  <div className={styles.venueTags}>
                    {venue.tags.map((tag, tagIndex) => (
                      <span key={tag} data-tag-index={tagIndex}>{tag}</span>
                      ))}
                  </div>
          </div>
          <button
            className={`${styles.selectVenue} ${selectedVenues.includes(`${venue.inventory_name} (${venue.tags[0]})`) ? styles.selected : ''}`}
            onClick={() => onVenueSelect(`${venue.inventory_name} (${venue.tags[0]})`)}
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
      {prompttoselect && <span id={styles.selectionNotice}>Please select an item.</span>}
    </div>
    }
  </>
);
}

export default MessageInventoryListComponent;
