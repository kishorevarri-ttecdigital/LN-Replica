import { useState, useCallback, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { checkExtractNameAndPayload } from '../customfunctions/globalPayloadfunc';
import { useChat } from '../context/ChatContext';
import { useSessionContext } from '../context/SessionContext';
import { useSummaryContext } from '../context/SummaryContext';
import { useTabContext } from '../context/TabContext';


export const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalPayload, setGlobalPayload] = useState([]);
  const { messages, addMessage } = useChat();
  const {sessionData,setSessionData} = useSessionContext();
  const {summaryItems, updateSummaryItems, getLastKnownSummaryValues} = useSummaryContext();
  const { tabStates, updateTabStates, getDisabledTabs,getLatestEnabledTab} = useTabContext();
  const userId = sessionData["userId"]
  const TimeStamp = new Date().getTime();

  const sendMessage = useCallback(async (text,altText) => {
    setIsLoading(true);
    setError(null);

    const userMessage = { id: uuidv4(), text, sender: 'user' ,TimeStamp:TimeStamp};

    addMessage(userMessage);
    setGlobalPayload(prevPayloads => [...prevPayloads, []]);

    const activeTab = getLatestEnabledTab(tabStates);
    const activeSummaryItems = getLastKnownSummaryValues();
    const infoForWhitepaper =   altText;
 
    // console.log("SENDING DATA TO MW *******", JSON.stringify({userId:userId, sessionId: sessionData['sessionId'], text: infoForWhitepaper?infoForWhitepaper:userMessage.text, effective_tab: activeTab, effective_summary_items:activeSummaryItems}));

    try {
      // Send only the new message text
      const response = await fetch('https://ln-frontend-middleware-dev-1089873937305.us-central1.run.app/api', {      
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId:userId, sessionId: sessionData['sessionId'], text: infoForWhitepaper?infoForWhitepaper:userMessage.text, effective_tab: activeTab, effective_summary_items:activeSummaryItems}), // Send only the new message
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data && data.fulfillment_response) {
          let botResponse = data.fulfillment_response.textResponse;
          let payloadArray = data.fulfillment_response.payload;
          let tabText = data.fulfillment_response.tab;
          let summaryArray = data.fulfillment_response.summary;
          let originalTextResponse = data.fulfillment_response.originalTextResponse;

          if(botResponse && botResponse.toLowerCase()){
            const keywordList = ["based","criteria","please","select","interested"]
            let foundCount = 0;
            for (const keyword of keywordList) {
              if (botResponse.toLowerCase().includes(keyword.toLowerCase())) {
                foundCount++;
              }
            }

            if(foundCount>2 && sessionData["venuePayloadRe-render"] && Array.isArray(sessionData["venuePayloadRe-render"])){
              payloadArray = sessionData["venuePayloadRe-render"];
            }


          }
          

          const botMessage = { id: uuidv4(), text: botResponse, sender: 'bot',payload:payloadArray, 'originalTextResponse':originalTextResponse, 'TimeStamp':TimeStamp };
          addMessage(botMessage);

          const disabledTabs = getDisabledTabs();
          if(disabledTabs.length>0 && disabledTabs.includes(tabText)){
            updateTabStates([tabText]); 
          }

          if(summaryArray && summaryArray.length>0) {         
          updateSummaryItems(tabText,summaryArray);
          
          } else{
            updateSummaryItems(tabText,activeSummaryItems);
            
          }

          const payloadData = data.fulfillment_response.payload ? data.fulfillment_response.payload[0] : [];
          const extractedPayload = [];

          if (Array.isArray(payloadData)) {
            payloadData.forEach(item => {
              const payloadObj = checkExtractNameAndPayload(item);
              if (payloadObj) {
                extractedPayload.push(payloadObj);
              }
            });
          }

          setGlobalPayload(prevPayloads => [...prevPayloads, extractedPayload]);

        } else {
          setError("Invalid response format from server.");
          console.error("Invalid response format:", data);
        }
      } else {
        const text = await response.text();
        setError(`Non-JSON response: ${text}`);
        console.error("Received non-JSON response:", text);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error in sendMessage:", error);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]); // addMessage is a dependency

  return { messages, sendMessage, isLoading, error, globalPayload };
};
