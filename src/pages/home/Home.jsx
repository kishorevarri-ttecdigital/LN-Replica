import React, { useEffect,useContext, useState } from 'react';
import ChatAreaContainer from '../../components/ChatAreaContainer';
import './Home.css';
import { useSessionContext } from '../../context/SessionContext';
import { AuthContext } from '../../context/AuthContext';
import useRTDBFunctions from '../../hooks/useRealtimeDatabaseFunction';
import { filterSessionsByCurrentWeek } from '../../utils/filterSessionsByCurrentWeek';


function HomePage() {
  const {sessionData} = useSessionContext();
  const {currentUser} = useContext(AuthContext)
  const userId = currentUser["uid"]; //  replace with dynamic user ID if needed
  const email = currentUser["email"]; 
  const sessionId = sessionData['sessionId']; //  replace with dynamic session ID if needed
  const { userSesssions,userSavedSesssions, error, getUserInfo,setUserInfo, addUserSession, getUserSessions, getListOfUserSavedSessions,deleteAllSessions } = useRTDBFunctions();  
  const [userData, setUserData] = useState([])

  useEffect(() => {
      const fetchAndAddSession = async () => {

        try {
          // 1. Fetch user Info.
          const userInfo = await getUserInfo(userId);
          // 2. Fetch existing sessions.
          await getUserSessions(userId);

          // 3 Fetch saved sessions.
          await getListOfUserSavedSessions(userId);  

          if(userInfo){
            setUserData(userInfo)            
          }else{
            setUserInfo(userId,email)
          }
 
        } catch (err) {
          console.error("Failed to fetch or add session:", err);
        }
      };
  
      if (userId && sessionId) { // Only run if we have a user and session ID.
        fetchAndAddSession();
      }
    }, []); // Correct dependencies.

  const userSessionsThisWeek =  filterSessionsByCurrentWeek(userSesssions)
  

  return (
    <div className="app">   
      <ChatAreaContainer userId={userId} email={email} roleId={userData["roleId"]} sessionId={sessionId} userSesssions={userSesssions} addUserSession={addUserSession} sessionCount={userSessionsThisWeek.length} />
      <div className='footer-sessionId'>
        Session Id: {sessionId}
      </div>
    </div>
  );
}

export default HomePage;
