import React,{useState} from 'react';
import './PopupSaveUserSession.css'
import { useSessionContext } from '../context/SessionContext';
import useRTDBFunctions from '../hooks/useRealtimeDatabaseFunction'
import { useChat } from '../context/ChatContext';
import { useTabContext } from '../context/TabContext';
import { useSummaryContext } from '../context/SummaryContext';


function PopupSaveUserSession({ onSave, onClose }) { // Receive closeMenu
  const [sessionName, setSessionName] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const {sessionData} = useSessionContext();
  const {saveSession } = useRTDBFunctions(); 
  const {messages}  = useChat();  
  const {tabStates} = useTabContext(); // Use the hook!
  const {summaryItems} = useSummaryContext();

  const handleSaveClick = () => {
    
    const userId = sessionData['userId'];
    const sessionId = sessionData['sessionId'];
    const session_Name = sessionName?sessionName:sessionData['sessionId'];
    const session_Description = sessionDescription;
    const chatMessages = messages;
    const tabState = tabStates;
    const summary = summaryItems;
    const sessionSummary = sessionData;

    try {
        saveSession(userId,sessionId,session_Name,session_Description,chatMessages,tabState,summary,sessionSummary);
      } catch (err) {
        // Error handling is already done within the hook.
        console.error("Failed to add session:", err);
      }
    onSave(session_Name, session_Description);

  };


  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>New Session</h2>
        <div className="form-group">
          <label htmlFor="sessionName">Session Name:</label>
          <input
            type="text"
            id="sessionName"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={handleSaveClick} className="save-button">Save</button>
          <button onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );



}

export default PopupSaveUserSession;
