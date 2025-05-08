import React, { useEffect, useRef } from 'react';
import styles from './ChatArea.module.css';
import { FaSpinner } from "react-icons/fa";
import MessageComponent from './MessageComponent';
import MessageActionsButtonComponent from './MessageActionButtonsComponent';
import MessageFormattedTextComponent from './MessageFormattedTextComponent';
import MessageVenueListComponent from './MessageVenueListComponent';
import MessageInventoryListComponent from './MessageInventoryListComponent';
import MessageInsightsComponent from './MessageInsightsComponent';
import MessageBrainstormingComponent from './MessageBrainstormingComponent';
import MessageWhitepaperComponent from './MessageWhitepaperComponent';
import { useSessionContext } from '../context/SessionContext';

function ChatArea({ messages, isLoading, error,sendMessage }) { // Receive props
  const messagesEndRef = useRef(null);
  const {sessionData} = useSessionContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


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
  const brandProfileCheck = (payload) =>{
    if (!payload) {
      return false;
    }
    const hasFormattedText = findTargetElement(payload,'formatted_text'); 
    const hasActionButton = findTargetElement(payload,'action_button');
    if(hasFormattedText && hasActionButton) {
      return true
    }
    return false

  }

  const isWhitePaperItem = (text,payload)  =>{
    const hasWhitepaper = findTargetElement(payload,'whitepaper');
    const isWhitepaperInfo = false;
    if(text && (hasWhitepaper || isWhitepaperInfo) && text.length>1000){
      return true
    }
  }

  // Updated hasContent function to check for snippets and formatted_text in the payload array
  const hasContent = (text,payload) => {
    if (!payload) {
      return false;
    }
    const hasSnippet = findTargetElement(payload,'insights_card'); 
    // const hasFormattedText = findTargetElement(payload,'formatted_text'); 
    if(hasSnippet){
      return true
    }
    const hasFormattedText = findTargetElement(payload,'formatted_text'); 
    const hasActionButton = findTargetElement(payload,'action_button');
    if(hasFormattedText && hasActionButton) {
      return true
    }
    const hasWhitepaper = findTargetElement(payload,'whitepaper');
    // const isWhitepaperInfo = "infoForWhitepaper" in sessionData && sessionData.infoForWhitepaper.length > 25;
    const isWhitepaperInfo = false;

    if(text && (hasWhitepaper || isWhitepaperInfo) && text.length>1000){
      return true
    }

    const hasBrainstorming = findTargetElement(payload,'brainstorming_cards'); 
    if(hasBrainstorming){
      return true
    }

    return false
  };


  return (
    <div className={styles.chatArea}>
      <div className={styles.messageContainer}>
        {messages.map((message, index) => (
          <div
            key={message.id || message.text}
            className={`${styles.messageItem} ${message.sender === 'user' ? styles.userMessage : (isWhitePaperItem(message.originalTextResponse,message.payload)?styles.isWhitePaperItem:'')}`}
          >
            {hasContent(message.originalTextResponse,message.payload) ? (
                  // <MessageFormattedTextComponent payload={message.payload} />
                  <></>
                ) : (<MessageComponent message={message.text}/>)
                }
            {<MessageFormattedTextComponent payload={message.payload} messageText={message.text} />}
            {<MessageInsightsComponent payload={message.payload} uuid={message.id} TimeStamp={message.TimeStamp} />}
            {<MessageBrainstormingComponent payload={message.payload} uuid={message.id} TimeStamp={message.TimeStamp} />}
            {<MessageVenueListComponent payload={message.payload} sendMessage={sendMessage} uuid={message.id}/>}
            {<MessageInventoryListComponent payload={message.payload} sendMessage={sendMessage} uuid={message.id}/>}
            {<MessageWhitepaperComponent text={message.originalTextResponse} payload={message.payload}/>}
            {<MessageActionsButtonComponent payload={message.payload} sendMessage={sendMessage} dataContext={brandProfileCheck(message.payload)?'brand_profile':'unknown'} dataToSet={brandProfileCheck(message.payload)?message.originalTextResponse:''}/>}
          </div>
        ))}
        {isLoading && <div className={styles.messageItem}><FaSpinner className="animate-spin" />Loading...</div>}
        {error && <div className={styles.messageItem}>Error: {error}</div>}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}




export default ChatArea;
