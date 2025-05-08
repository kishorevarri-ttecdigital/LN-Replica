import React, { createContext, useState, useContext, useEffect } from 'react';

const SummaryContext = createContext();

export const useSummaryContext = () => useContext(SummaryContext);

export const SummaryProvider = ({ children }) => {
    // Initialize summaryItems from localStorage, with a fallback.
    const [summaryItems, setSummaryItems] = useState(() => {
      const storedSummaryItems = localStorage.getItem('summaryItems');
      return storedSummaryItems
        ? JSON.parse(storedSummaryItems)
        : {
            start: null,
            inventory: null,
            research: null,
            brainstorming: null,
            whitepaper: null,
            
          };
    });

    // Save to localStorage whenever they change.
    useEffect(() => {
      localStorage.setItem('summaryItems', JSON.stringify(summaryItems));
    }, [summaryItems]);


    const updateSummaryItems = (tabToSet,itemsForSummary) => {

    
    if (tabToSet) {
        const newsummaryItems= { ...summaryItems };
        const tabName = tabToSet.toLowerCase();

        if (tabName in newsummaryItems) {
         
          newsummaryItems[tabName] = itemsForSummary;          
          setSummaryItems(newsummaryItems);
          
        }    
        
        

    }
    };

    const getLastKnownSummaryValues = () => {
      const entries = Object.entries(summaryItems);
      const reversedEntries = entries.reverse();
      const foundEntry = reversedEntries.find(([, value]) => value !=null); // Destructure to get value directly
      return foundEntry ? summaryItems[foundEntry[0]] : []; // Return key or null
    }

    const reloadSummaryItems =(summaryItemsToLoad) =>{
      setSummaryItems(summaryItemsToLoad);
      localStorage.setItem('summaryItems', JSON.stringify(summaryItemsToLoad));
    }
    
    const value = {
    summaryItems,
    updateSummaryItems,
    getLastKnownSummaryValues,
    reloadSummaryItems,

    };

    return (
    <SummaryContext.Provider value={value}>
        {children}
    </SummaryContext.Provider>
    );
};
