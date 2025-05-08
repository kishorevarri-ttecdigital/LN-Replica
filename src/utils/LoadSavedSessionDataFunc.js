

export function LoadSessionData(dataArray) {

    // Find the object with id 'chatMessages'
    const chatMessagesObject = dataArray.find(item => item.id === 'chatMessages');
    
    // Extract the message values
    const chatMessagesToLoad = [];

    if (chatMessagesObject) {
        for (const key in chatMessagesObject) {
            // Check if the key is a numerical string and not the 'id' key
            if (key !== 'id' && !isNaN(parseInt(key))) {
                chatMessagesToLoad.push(chatMessagesObject[key]);
            }
            }
    }    


    
    // Find the object with the specified id
    let summaryItemsToLoad = {
        start: null,
        inventory: null,
        research: null,
        brainstorming: null,
        whitepaper: null,
        
      };
    const foundObject = dataArray.find(item => item.id === 'summaryItems');

    if (foundObject) {
        const keysToExtract = ['start', 'inventory', 'research', 'brainstorming', 'whitepaper'];
        keysToExtract.forEach(key => {
            // Check if the key exists directly on the object
            if (foundObject.hasOwnProperty(key)) {
                summaryItemsToLoad[key] = foundObject[key];
              console.log(`- Found key '${key}', extracted value:`, foundObject[key]);
            } else {
              console.log(`- Key '${key}' not found in summaryItemsObject.`);
            }
          });

    }

    //tab state to load
    const TabStateToLoad = {
        start: true,
        inventory: false,
        research: false,
        brainstorming: false,
        whitepaper: false,
      }

    const foundTabStateObject = dataArray.find(item => item.id === 'tabStates');

    if (foundTabStateObject) {
        const keysToExtract = ['start', 'inventory', 'research', 'brainstorming', 'whitepaper'];
        keysToExtract.forEach(key => {
            // Check if the key exists directly on the object
            if (foundTabStateObject.hasOwnProperty(key)) {
            TabStateToLoad[key] = foundTabStateObject[key];
            console.log(`- Found key '${key}', extracted value:`, foundTabStateObject[key]);
            } else {
            console.log(`- Key '${key}' not found in summaryItemsObject.`);
            }
        });

    }


    // Let load sessionSummary

    let SessionDataToLoad = localStorage.getItem('sessionData')

    const foundSessionSummaryObject = dataArray.find(item => item.id === 'sessionSummary');

    if (foundSessionSummaryObject) {        
        SessionDataToLoad  = foundSessionSummaryObject;
    } 



    return {chatMessagesToLoad, summaryItemsToLoad, TabStateToLoad, SessionDataToLoad};
  }