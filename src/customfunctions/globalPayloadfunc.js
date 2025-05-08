export function checkExtractNameAndPayload(obj) {
    if (
      typeof obj === 'object' &&
      obj !== null &&
      obj.hasOwnProperty('name') &&
      obj.hasOwnProperty('payload')
    ) {
      return {
        name: obj.name,
        payload: obj.payload,
      };
    } else {
      return null; // Or undefined, or an empty object, depending on your needs
    }
  };



export function fetchTabToEnable(globalPayload) {
  const listOfTabs = [];
  
  if (globalPayload) {
    globalPayload.forEach(item => {
      if(item && Array.isArray(item)){
        item.forEach(subItem => {
          if (subItem.name === 'tabs' && subItem.payload && subItem.payload.text) {
            const tabName = subItem.payload.text.toLowerCase();
            listOfTabs.push(tabName);
          };
        });
      } else if(item.name === 'tabs' && item.payload && item.payload.text) {
        const tabName = subItem.payload.text.toLowerCase();
        listOfTabs.push(tabName);
      };
    });
  }

  return listOfTabs

};

export function extractSummaryItems(globalPayload) {
  const summaryItems = [];
  
  if (globalPayload) {
    globalPayload.forEach(item => {
      if(item && Array.isArray(item)){
        item.forEach(subItem => {
          if (subItem.name === 'summary' && subItem.payload && subItem.payload.length>0) {
            const items = subItem.payload;
            summaryItems.push(items);
          };
        });
      } else if(item.name === 'summary' && item.payload && item.payload.length>0) {
        const items = subItem.payload;
        summaryItems.push(items);
      };
    });
  }

  return summaryItems

};