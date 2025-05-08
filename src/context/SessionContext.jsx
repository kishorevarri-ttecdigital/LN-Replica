import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from "../context/AuthContext";

const SessionContext = createContext();

export const useSessionContext = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const {currentUser} = useContext(AuthContext);
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.uid ?? currentUser?.uid ?? "";
  const [sessionData, setSessionData] = useState(() => {
    const storedsessionData = localStorage.getItem('sessionData');    
    return storedsessionData ? JSON.parse(storedsessionData) : {"sessionId":uuidv4(),"userId":userId};
  });


  if (currentUser && !sessionData["userId"]){
    sessionData["userId"]=userId
  }
  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const newSessionData = (newSessionData) => {
    setSessionData(newSessionData); // Replace the entire session data
    localStorage.setItem('sessionData', JSON.stringify(newSessionData));
  };

  const addUpdateSessionData = (key, newValue) => {
    setSessionData(prevSessionData => ({
      ...prevSessionData,  // Keep existing data
      [key]: newValue      // Update the specified key
    }));
  };


  const addUpdateSessionDataSelectedInsights = (key, newKeyValue) => {
    setSessionData(prevSessionData => {
      // Check if the key exists. If not, initialize it as an empty object.
      const existingValue = prevSessionData[key] || {};
  
      // If the key represents an object (like selectedInsights), merge the new key-value pair.
      if (typeof existingValue === 'object' && existingValue !== null && !Array.isArray(existingValue)) {
        return {
          ...prevSessionData,
          [key]: {
            ...existingValue,  // Spread the *existing* object
            ...newKeyValue    // Spread the *new* key-value pair(s)
          }
        };
      } else {
        // If the key doesn't represent an object, replace it (original behavior).
        return {
          ...prevSessionData,
          [key]: newKeyValue
        }
      }
    });
  };

  const updateSessionId = (newSessionId) => {
    setSessionData(prevSessionData => ({
      ...prevSessionData,  // Keep existing data
      sessionId: newSessionId // Update only the sessionId
    }));
  };


  const value = {
    sessionData,
    newSessionData,
    updateSessionId,
    addUpdateSessionData,
    addUpdateSessionDataSelectedInsights
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
