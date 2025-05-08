// src/components/ChatAreaContainer.jsx
import React, { useState, useEffect } from 'react';
import Tabs from './Tabs';
import SummarySection from './SummarySection';
import ChatArea from './ChatArea';
import InputArea from './InputArea';
import styles from './ChatAreaContainer.module.css';
import branding from '../assets/ln-branding.png';
import Footer from './Footer';
// import MyChatBot from '../tmp/Chat'; // No longer needed
import { useChatbot } from '../hooks/useChatbot'; // Import
import { fetchTabToEnable, extractSummaryItems } from '../customfunctions/globalPayloadfunc';
import { useTabContext } from '../context/TabContext';
import { useSummaryContext } from '../context/SummaryContext';
import { useSessionContext } from '../context/SessionContext';

function ChatAreaContainer({userId,email,roleId, sessionId,userSesssions,addUserSession,sessionCount}) {
  const {sessionData} = useSessionContext();
  const [activeTab, setActiveTab] = useState('start');
  const { messages, sendMessage, isLoading, error, globalPayload } = useChatbot(); // Call hook here
  const { tabStates, updateTabStates, getDisabledTabs} = useTabContext();
  const {summaryItems, updateSummaryItems} = useSummaryContext();
  const docSearchMap = {"start":1,"inventory":8,"research":17,"brainstorming":0,"whitepaper":70}
  const [docCounter, setDocCounter] = useState(0);
  const [prevTab, setPrevTab] = useState(null);
  const [prevSummaryItems,setPrevSummaryItems] = useState(null)

  // DUE TO LAST MINUTE IMPLEMENTATION REQUEST, THIS IS NOW A CRUDE WAY OF MAPPING TO ACTIVE TAB
  // TO DO: FUTURE CODE BASE MAINTAINER, PLEASE FIX THIS CODE.
  const featureToActiveTabMap = {"start":"start","inventory search":"inventory","insights and research":"research","brainstorming":"brainstorming","draft proposal":"whitepaper"}

  const activeFeature = sessionData["ActiveFeature"] || "start";
  const tabToSetActive = featureToActiveTabMap[activeFeature]
  const docSearched = docSearchMap[activeTab]


  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {    

    // check if tabToSetActive is enabled
    if(!tabStates[tabToSetActive]){
      updateTabStates([tabToSetActive]); 
    } 
       

    const listOfSummaryItems = extractSummaryItems(globalPayload)
    if(listOfSummaryItems.length>0){
      updateSummaryItems(tabToSetActive,listOfSummaryItems[0]);      
    }else if(!summaryItems[tabToSetActive] && summaryItems[activeTab]){
      updateSummaryItems(tabToSetActive,summaryItems[activeTab]);  
    } 

    const sessionExists = Object.values(userSesssions).some(value => value.sessionId === sessionId);
    if(!sessionExists){
      try{
        addUserSession(userId,email,sessionId)
      }catch (err) {
        console.error("Failed to fetch or add session:", err);
      }

    }

    
    if(activeTab!=prevTab){
      setDocCounter(docCounter+docSearched);
      setPrevTab(activeTab);
    }

    // Set to active tab
    setActiveTab(tabToSetActive);
    
    
  }, [globalPayload]); 


  return (
    <div className={styles.chatAreaContainer}>
      <div className={styles.headerContainer}>
      <img src={branding} alt="Live Nation Logo" className={styles.branding} />
      <div className={styles.stats}>
                    <p><span>Documents searched </span><span className={styles.spanInt}><b>{docCounter}</b></span></p>
                    <p><span># of weekly sessions </span><span className={styles.spanInt}><b>{sessionCount}</b></span></p>
                  </div>
                  </div>
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} tabStates={tabStates} />
      <SummarySection activeTab={activeTab} summaryItems={summaryItems} />
      <div className={styles.chatArea}>
        <ChatArea messages={messages} isLoading={isLoading} error={error} globalPayload={globalPayload} sendMessage={sendMessage} /> {/* Pass props */}
      </div>
      <InputArea sendMessage={sendMessage} /> {/* Pass sendMessage */}
      <Footer roleId={roleId}/>
    </div>
  );
}

export default ChatAreaContainer;
