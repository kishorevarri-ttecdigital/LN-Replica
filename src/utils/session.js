import { v4 as uuidv4 } from 'uuid';

export const createNewSession = () => {  
  const newSessionId = uuidv4(); 
  localStorage.removeItem('chatMessages');
  localStorage.removeItem('summaryItems');
  localStorage.removeItem('tabStates');
  return newSessionId; // Return the new ID
};
