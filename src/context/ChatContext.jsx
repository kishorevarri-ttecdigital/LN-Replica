import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

    const ChatContext = createContext();

    export const useChat = () => useContext(ChatContext);

    export const ChatProvider = ({ children }) => {
      // Initialize state directly from localStorage, with a fallback to an empty array.
      const [messages, setMessages] = useState(() => {
        const storedMessages = localStorage.getItem('chatMessages');
        return storedMessages ? JSON.parse(storedMessages) : [{ id: uuidv4(), text:"Hi I am RIFF, your AI assistant here to help you through the RFP process.", sender: 'bot' }];
      });


      // Save messages to localStorage whenever messages change
      useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
      }, [messages]);

      const addMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      const reloadMessage = (newMessage) => {
        setMessages(newMessage);
        localStorage.setItem('chatMessages', JSON.stringify(newMessage));
      };

      const value = {
        messages,
        addMessage,
        reloadMessage,
      };

      return (
        <ChatContext.Provider value={value}>
          {children}
        </ChatContext.Provider>
      );
    };
