import { ref, onValue, orderByChild, equalTo, query, push, set, get, remove, startAt, endAt, update } from "firebase/database";
import { rtdb } from "../firebase/firebase.js";
import { useState, useEffect, useContext } from 'react';


export default function useRTDBFunctions() {
    const [userSesssions, setUserSessions] = useState([]);
    const [userSavedSesssions, setUserSavedSessions] = useState([]);
    const [sessionDataToLoad,setSessionDataToLoad] = useState([]);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState([]);

    
    async function getUserInfo(userId) {
      const userRef = ref(rtdb, `users/${userId}`);

      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          return snapshot.val(); // Return the user data
        } else {
          console.log(`User ${userId} not found.`);
          return null; // User does not exist
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null; // Indicate error
      }
    }

    async function setUserInfo(userId,u_email) {
      if (!userId || !u_email) {
        console.warn("setUserInfo called without userId or email");
        return null; // Return null for consistency
      }

      const userInfo  ={
        email: u_email,
        roleId:u_email==='default-admin@livenation.com'?1:0,
        roleName:u_email==='default-admin@livenation.com'?"admin":"user"
      }      

      try {
        const userRef = ref(rtdb, `users/${userId}`);
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
          await set(userRef,userInfo);
          console.log("New user added to RTDB users table")
          return null; // Do nothing, user already
        } else {
          return null; // Do nothing, user already exist
        }
      } catch (error) {
        console.error(`Error adding user ${userId}:`, error);
        setError(error.message);
        throw error; // Re-throw for handling in component
      }
    }

    async function getUserSessions(userId, startDate, endDate) {
      let fetchedSessions = []; // Variable to hold fetched sessions
        try {
          let sessionsRef = ref(rtdb, 'SessionsCreated');
          let q;
      
          // Base query constraints
          const queryConstraints = [];
      
          // Add userId filter if provided
          if (userId) {
            queryConstraints.push(orderByChild('userId'));
            queryConstraints.push(equalTo(userId));
          } else {
            queryConstraints.push(orderByChild('startDateTimeSerial')); // Or 'createdAt', etc.
          }
      
          // Add date range filters if provided
          // NOTE: Firebase RTDB requires orderByChild/orderByKey/orderByValue
          // before using startAt/endAt/equalTo.
          // If filtering by userId, the primary sort is userId. Date filtering
          // might be less efficient or require specific data structures (like composite keys)
          // for optimal performance if you need to filter by *both* userId and date range efficiently.
          // If *not* filtering by userId, we order by timestamp directly.
      
          if (startDate) {
            
            // Ensure startDate is in a format comparable to stored timestamps
            // (e.g., ISO string, Unix timestamp). Assuming Unix timestamp (milliseconds) here.
            queryConstraints.push(startAt(new Date(startDate).getTime() / 1000));
          }
          if (endDate) {
            // Ensure endDate is in a format comparable to stored timestamps
            // queryConstraints.push(endAt(new Date(endDate).getTime()));
            // queryConstraints.push(endAt(new Date(endDate).getTime() / 1000));
            // Add 23:59:59.999 to the end date to include the whole day
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            queryConstraints.push(endAt(endOfDay.getTime() / 1000));
          }
      

          if (queryConstraints.length > 0) {            
            // If filtering by userId AND date, the primary order is userId.
            // If filtering ONLY by date, the primary order is timestamp.
            q = query(sessionsRef, ...queryConstraints);

          } else {

            console.log("No filters provided (userId, startDate, or endDate). Aborting fetch.");
            setUserSessions([]); // Clear sessions if no query is made
            return;
          }
      
      
          const snapshot = await get(q);
          const data = snapshot.val();
      
          if (data) {
            const userSessionsList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));

            fetchedSessions = userSessionsList; // Store fetched sessions
      
          } else {
            // setUserSessions([]);
            fetchedSessions = []; // No data found
          }
        } catch (error) {
          setError(error.message);
          console.error("Error fetching data:", error);
          fetchedSessions = []; // Ensure empty array on error
          // Optionally re-throw if the caller needs to handle it
          // throw error;
        } finally {
            // Update the state regardless of whether data was found or not
            setUserSessions(fetchedSessions);
            // Return the fetched sessions directly
            return fetchedSessions;
        }
      }




    async function addUserSession(userId,email,sessionId) {
        if (!userId || !sessionId) {
            console.warn("addUserSession called without userId or sessionId");
            return null; // Return null for consistency
          }
        const sessionData = {
            userId: userId,
            startDateTime: new Date().toISOString(),
            email: email,
            startDateTimeSerial: new Date().getTime() / 1000,
          };

        try {
            const sessionRef = ref(rtdb, 'SessionsCreated/' + sessionId); // Use sessionId directly
            const snapshot = await get(sessionRef);

            if (!snapshot.exists()) {
                await set(sessionRef, sessionData);  // Set directly at the sessionId location
                console.log("Session added with ID: ", sessionId);
                await getUserSessions(userId);
                return sessionId; // Return the sessionId
            } else {
                // console.log("Session with this sessionId already exists.");
                return null; // Or throw an error, or return existing session ID
            }
        } catch (error) {
            console.error("Error adding session:", error);
            setError(error.message);
            throw error; // Re-throw for handling in component
        }
    }


    async function saveSession(userId,sessionId,sessionName, sessionDescription, chatMessages,tabStates,summaryItems,sessionSummary) {
        if (!userId || !sessionId) {
            console.warn("saveSession called without userId or sessionId");
            return null; // Return null for consistency
          }
        const sessionData = {
            userId: userId,
            sessionName: sessionName,
            sessionDescription: sessionDescription,
            savedDateTime: new Date().toISOString(),
            savedDateTimeSerial: new Date().getTime() / 1000,
            chatMessages: chatMessages,
            tabStates: tabStates,
            summaryItems: summaryItems,
            sessionSummary: sessionSummary
          };

        try {
            const sessionRef = ref(rtdb, 'SavedSessions/' + sessionId); // Use sessionId directly
            await set(sessionRef, sessionData);  // Set directly at the sessionId location
            console.log("Session has been saved with ID: ", sessionId);
            return sessionId; // Return the sessionId

        } catch (error) {
            console.error("Error saving session:", error);
            setError(error.message);
            throw error; // Re-throw for handling in component
        }
    }

    async function getListOfUserSavedSessions(userId) {
        try {
            let sessionsRef = ref(rtdb, 'SavedSessions');
            let q;

            if (userId) {
                q = query(sessionsRef, orderByChild('userId'), equalTo(userId));
            } else {
                q = null
            }

            if(!q){
                return;
            }

            const snapshot = await get(q); // Use get() for one-time fetch
            const data = snapshot.val();
            if (data) {
                const userSavedSesssions = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setUserSavedSessions(userSavedSesssions);
            } else {
                setUserSavedSessions([]);
            }
        } catch (error) {
            setError(error.message);
            console.error("Error fetching data:", error);
            throw error; // Re-throw for handling in component
        }
    }

    async function getSessionDataToLoad(sessionId) {
        if (!sessionId) {
            console.warn("getSavedSessionData called without sessionId");
            return null;
        }
        try {
            const sessionRef = ref(rtdb, 'SavedSessions/' + sessionId);
            const snapshot = await get(sessionRef);
            const data = snapshot.val();

            if (data) {
                const sessionDataToLoad = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setSessionDataToLoad(sessionDataToLoad);
            } else {
                setSessionDataToLoad([]);
            }
            
        } catch (error) {
            setError(error.message);
            console.error("Error fetching saved session data:", error);
            setSessionDataToLoad([]); // Set null on error
            throw error; // Re-throw for handling in component
        }
    }

    async function deleteSavedSession(sessionId) {
      if (!sessionId) {
          console.warn("deleteSavedSession called without sessionId");
          return null;
      }
      try {
          const sessionRef = ref(rtdb, 'SavedSessions/' + sessionId);
          await remove(sessionRef);
          console.log("Session data deleted");          
      } catch (error) {
          console.error("Error deleting session data:", error);
          setError(error.message);
          throw error;
      }
    }

    

    async function deleteAllSessions(targetTable) {
        try {
        const sessionsRef = ref(rtdb, targetTable);
        await remove(sessionsRef);
        console.log("All sessions deleted");
        } catch (error) {
        console.error("Error deleting all sessions:", error);
        setError(error.message);
        throw error;
        }
        }

    
      async function fetchListOfUsers() {
        const usersRef = ref(rtdb, 'users');
        try {
          const snapshot = await get(usersRef);
          if (snapshot.exists()) {
            // console.log("Fetched users data:", snapshot.val());
            return snapshot.val();
          } else {
            // console.log("No data available at 'users' path.");
            return null;
          }
        } catch (error) {
          // console.error("Error fetching users data:", error);
          return null;
        }
      }

      async function updateUserData(userId, roleName) {
        if (!userId || !roleName) {
          console.warn("updateUserData called without userId or roleName");
          return null; // Return null for consistency
        }
      
        // Define the fields to update
        const updates = {
          roleId: roleName === 'admin' ? 1 : 0,
          roleName: roleName
        };
      
        try {
          const userRef = ref(rtdb, 'users/' + userId); // Reference to the specific user
          await update(userRef, updates); // Use update() to modify only specified fields
          console.log("User data (roleId, roleName) has been updated for userId:", userId);
          return "OK"; // Indicate success
      
        } catch (error) {
          console.error("Error updating user data:", error);
          // Assuming setError is available to handle the error state
          // setError(error.message);
          throw error; // Re-throw for handling elsewhere if needed
        }
      }
    
    
    return { userData,userSesssions, sessionDataToLoad, userSavedSesssions, error, deleteSavedSession,updateUserData, fetchListOfUsers, getUserInfo,setUserInfo, addUserSession, getUserSessions, getSessionDataToLoad, saveSession, getListOfUserSavedSessions, deleteAllSessions};
}
