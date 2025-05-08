import React, { createContext, useState, useContext, useEffect } from 'react';

const TabContext = createContext();

export const useTabContext = () => useContext(TabContext);

export const TabProvider = ({ children }) => {
    // Initialize tabStates from localStorage, with a fallback.
    const [tabStates, setTabStates] = useState(() => {
      const storedTabStates = localStorage.getItem('tabStates');
      return storedTabStates
        ? JSON.parse(storedTabStates)
        : {
            start: true,
            inventory: false,
            research: false,
            brainstorming: false,
            whitepaper: false,
          };
    });    

    const updateTabStates = (tabsToEnable) => {
    if (tabsToEnable) {
        const newTabStates = { ...tabStates };

        tabsToEnable.forEach(tab => {
            const tabName = tab.toLowerCase();
            if (tabName in newTabStates) {
            newTabStates[tabName] = true;
            }

        });
        setTabStates(newTabStates);


    }
    };

        
    const getDisabledTabs = () => {
        const disabledTabs = [];
        for (const tabName in tabStates) {
          if (!tabStates[tabName]) {
            disabledTabs.push(tabName);
          }
        }
        return disabledTabs;
      };

    const getLatestEnabledTab = (listOfTabs) => {
      const entries = Object.entries(listOfTabs);
      const reversedEntries = entries.reverse();
      const foundEntry = reversedEntries.find(([, value]) => value === true); // Destructure to get value directly
      return foundEntry ? foundEntry[0] : null; // Return key or null
    }

    const resetTabStates = ()=>{
      const defaultTabStates = {
        start: true,
        inventory: false,
        research: false,
        brainstorming: false,
        whitepaper: false,
      };
      setTabStates(defaultTabStates);

    };

    const reloadTabStates = (TabStateToLoad)=>{
      setTabStates(TabStateToLoad);
      localStorage.setItem('tabStates', JSON.stringify(TabStateToLoad));
    };

    
    // Save tabStates to localStorage whenever they change.
    useEffect(() => {
      localStorage.setItem('tabStates', JSON.stringify(tabStates));
    }, [tabStates]);


    const value = {
    tabStates,
    updateTabStates,
    getDisabledTabs,
    getLatestEnabledTab,
    resetTabStates,
    reloadTabStates
    };

    return (
    <TabContext.Provider value={value}>
        {children}
    </TabContext.Provider>
    );
};
