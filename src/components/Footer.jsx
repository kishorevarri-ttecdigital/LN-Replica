import React, { useState, useRef } from 'react'; // Import useContext
import styles from './Footer.module.css';
import { useLogout } from '../utils/Logout';
import { createNewSession } from '../utils/session';
import { useTabContext } from '../context/TabContext';
import { useSessionContext } from '../context/SessionContext';
import { downloadSessionLogs } from '../utils/sessionDownloader';
import useRTDBFunctions from '../hooks/useRealtimeDatabaseFunction';
import PopupShowSavedSessions from './PopupShowSavedSessions';
import PopupSaveUserSession from './PopupSaveUserSession';
import save from '../assets/save.svg'
import newSession from '../assets/new_session.svg'
import logouticon from '../assets/logout.svg'
import adminicon from '../assets/admin.svg'
import logsicon from '../assets/logs.svg'
import PopupShowUsageReport from './PopupShowUsageReport';
import { useNavigate } from 'react-router-dom';


function Footer({roleId}) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const optionsButtonRef = useRef(null);
  const {resetTabStates} = useTabContext(); // Use the hook!
  const {sessionData,newSessionData} = useSessionContext();
  const [showPopup, setShowPopup] = useState(false);
  const { userSesssions, deleteAllSessions } = useRTDBFunctions(); 
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSaveSessionPopupOpen, setIsSaveSessionPopupOpen] = useState(false);
  const [isUsageReportPopupOpen, setIsUsageReportPopupOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (optionsButtonRef.current) {
      const rect = optionsButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top + window.scrollY -150,
        left: rect.left + window.scrollX + 40,
      });
    }
  };

  const logout = useLogout();

  const handleLogout = async (e) => {
    e.preventDefault();
    handleNewSession();
    await logout();
    setIsMenuOpen(false);
    
  };

  const handleCancelLogout = () => {
    setShowPopup(false); // Close the popup
    setIsMenuOpen(false);
  };

  const handleLogoutPopup=()=>{
    setShowPopup(true);
  }



  const handleDownload = async (e) => {
    e.preventDefault();
    await downloadSessionLogs(sessionData['sessionId']);
    setIsMenuOpen(false);
  };


  const handleNewSession = () => {
    const newSessionId = createNewSession(); // Call the utility function
    const thenewsessionData = {"sessionId":newSessionId};
  
    // Now, use the context hooks to update the state:
    newSessionData(thenewsessionData); // replace the entire session data
    resetTabStates(); // Reset tabs using the context
    

    window.location.reload(); // Force a page reload
  };

  const handleSaveSession = () => {
    setIsSaveSessionPopupOpen(true);

  };

  const handleExportUsageReport = () => {
    setIsUsageReportPopupOpen(true);
  }

  const handleSave = (sessionName, sessionDescription) => {
    console.log('Session Name:', sessionName);
    console.log('Session Description:', sessionDescription);
    
    closeSaveSessionPopup();
  };
  
  const closeSaveSessionPopup =()=>{
    setIsSaveSessionPopupOpen(false);
  }

  const closeExportUsageReportPopup = () =>{
    setIsUsageReportPopupOpen(!isUsageReportPopupOpen);
  }

  const handleShowSavedSessions = ()=>{
    setIsPopupOpen(!isPopupOpen);
    
  }

  const handleDeleteTableContents =()=>{
    deleteAllSessions("SavedSessions");
    closeMenu(); // Close the menu
  }

  
  // Function to close the menu.  This will be passed to the popup.
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to handle loading a selected session.
  const handleLoadSession = (sessionId) => {
    // Implement your session loading logic here.  For now, we'll just log it.
    console.log("Loading session with ID:", sessionId);
    const userId = sessionData['userId'];
    // getSessionDataToLoad(sessionId)    

    setIsPopupOpen(false); // Close the popup after loading.
    closeMenu(); // Close the menu
    window.location.reload(); // Force a page reload
  };


  const popupLogoutConfirmation = (
    <div className={styles.popup}>
      <h3>Are you sure you want to logout?</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around'}}>
          <button id='logout-btn' onClick={handleLogout}>
            Logout
          </button>
          <button id='cancel-btn' onClick={handleCancelLogout}>
            Cancel
          </button>
          </div>
    </div>
    );
  
  const handleAdminPageClick =()=>{
    navigate('admin');
  }

  return (
    <div className={styles.footer}>
      <button id='new-session' onClick={handleNewSession} >
        New Session <img src={newSession} alt='New Session'/>
      </button>
      <button id='save-session'onClick={handleSaveSession}>Save <img src={save} alt='save'/></button>
      <button id='options-btn' ref={optionsButtonRef} onClick={toggleMenu}>
        &#8942;
      </button>
      {isMenuOpen && (
        <div className={styles.optionsMenu} style={menuPosition}>
          <button id="load-saved-sessions-btn" 
            onClick={handleShowSavedSessions}          
            >
            <img src={save} alt='save'/> Saved Sessions
          </button>

          {roleId===1 &&
            <button id='admin-btn' onClick={handleAdminPageClick}>
              <img src={adminicon} alt='admin'/> Admin Page
          </button>
          }

          <button id="logout-btn" 
            onClick={handleLogoutPopup}          
            >
            <img src={logouticon} alt='logout'/> Logout
          </button>

          {roleId===1 &&
          <button id='download-btn' onClick={handleDownload}>
            <img src={logsicon} alt='logs'/> Download Session Logs
          </button>
          }

          {showPopup && popupLogoutConfirmation}
          
          {/* Pass userSessions and handleLoadSession to the popup */}
          {isPopupOpen && (
            <PopupShowSavedSessions
              onClose={handleShowSavedSessions}
              closeMenu={closeMenu}
              userSesssions={userSesssions}
              onLoadSession={handleLoadSession} // Pass the handler function
            >
              <h2>Saved Sessions</h2>
            </PopupShowSavedSessions>
          )}
            

        </div>
      )}
          {isSaveSessionPopupOpen && <PopupSaveUserSession
              onSave={handleSave}
              onClose={closeSaveSessionPopup}
            >
              <h2>Do you want to save Session</h2>
          </PopupSaveUserSession>
          }


          {isUsageReportPopupOpen && <PopupShowUsageReport
              onSave={handleSave}
              onClose={closeExportUsageReportPopup}
              closeMenu={closeMenu}
              userSesssions={userSesssions}
              onLoadSession={handleLoadSession} // Pass the handler function
            >
              <h2>Extract Tool Usage Data</h2>
          </PopupShowUsageReport>
          }
          

    </div>
  );
}

export default Footer;
