import React,{useEffect, useState} from 'react';
import './PopupShowSavedSessions.css'
import { useSessionContext } from '../context/SessionContext';
import useRTDBFunctions from '../hooks/useRealtimeDatabaseFunction'
import { LoadSessionData } from '../utils/LoadSavedSessionDataFunc';
import { useChat } from '../context/ChatContext';
import { useTabContext } from '../context/TabContext';
import { useSummaryContext } from '../context/SummaryContext';
import cancelicon from '../assets/cancel.svg'

function PopupShowSavedSessions({ children, onClose, closeMenu, onLoadSession}) { // Receive closeMenu
  const {sessionData, newSessionData} = useSessionContext();
  const userId = sessionData["userId"];
  const { userSavedSesssions, sessionDataToLoad, getListOfUserSavedSessions, getSessionDataToLoad, deleteSavedSession } = useRTDBFunctions(); 
  const {reloadMessage}  = useChat();  
  const {reloadTabStates} = useTabContext(); // Use the hook!
  const {reloadSummaryItems} = useSummaryContext();
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loadflag,setLoadFlag] = useState(0);
  const [deleteFlag,setDeleteFlag] = useState(0);
  if(loadflag===0){
    setLoadFlag(loadflag+1);
    getListOfUserSavedSessions(userId); 
  }
  
  const handleSessionChange = (event) => {
    setSelectedSessionId(event.target.value);
  };

  const handleLoadClick = () => {
    if (selectedSessionId) {      
      getSessionDataToLoad(selectedSessionId);
      // onLoadSession(selectedSessionId);
    } else {
      alert('Please select a session to load.');
    }
  };

  const handDeleteClick = () => {
    if (selectedSessionId) {      
      deleteSavedSession(selectedSessionId);
      // onLoadSession(selectedSessionId);
      setDeleteFlag(1);
      alert("Saved Session has been deleted");
      closeMenu(); 
      onClose();
    } else {
      alert('Please select a session to delete.');
    }
  };

 useEffect(() => {
     if(sessionDataToLoad && sessionDataToLoad.length>0){
       const {chatMessagesToLoad, summaryItemsToLoad , TabStateToLoad, SessionDataToLoad}= LoadSessionData(sessionDataToLoad);
       reloadMessage(chatMessagesToLoad);
       reloadSummaryItems(summaryItemsToLoad);
       reloadTabStates(TabStateToLoad);
       newSessionData(SessionDataToLoad);
       onLoadSession(selectedSessionId); // Call the handler with the selected ID
     } 
     
     if(deleteFlag===1){
      setDeleteFlag(0);      
     }

     }, [sessionDataToLoad]);
  

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className='cancel-btn-container'>
          <button id='cancel-btn2' onClick={() => { closeMenu(); onClose(); }}><img src={cancelicon} alt='Cancel'/></button>
        </div>
        {children}
        <ul className="session-list"> {/* Added class for specific targeting */}
          {userSavedSesssions && userSavedSesssions.map((session) => (
            <li key={session.id} className="session-item">
              <label htmlFor={session.id} className="session-label">
                {session.sessionName}
              </label>
              <input
                type="radio"
                id={session.id}
                name="session"
                value={session.id}
                checked={selectedSessionId === session.id}
                onChange={handleSessionChange}
                className="session-radio"
              />
            </li>
          ))}
        </ul>

        {/* Button container */}
        <div className="ipopupbuttons">
          <button onClick={handleLoadClick}>Load Selected Session</button>
          <button onClick={handDeleteClick}>Delete Selected Session</button>
        </div>
      </div>
    </div>
  );
}

export default PopupShowSavedSessions;
