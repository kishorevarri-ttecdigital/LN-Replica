import React, { useState, useEffect } from 'react';
import styles from './MessageWhitepaperComponent.module.css';
import ReactMarkdown from 'react-markdown';
import { useSessionContext } from '../context/SessionContext';
import { copyRichTextToClipboard } from '../utils/helperFunctions';
import whitepaperEntrypoint from '../assets/whitepaper1.png';
import closerimg from '../assets/closer.png';
import { findTargetElement } from '../utils/helperFunctions';
import { marked } from 'marked';
import PopupSaveUserSession from './PopupSaveUserSession';

function MessageWhitepaperComponent({text, payload}) {
  const {sessionData} = useSessionContext();
  const [isSaveSessionPopupOpen, setIsSaveSessionPopupOpen] = useState(false);

  const IsWhitepaper = checkIfWhitepaper(text,payload);


  const setCopyToClipboard = async (whitepaper)=>{
    const MarkdownWhitepaper = parseAndConvertToMarkdown(whitepaper)
    const html = marked.parse(MarkdownWhitepaper, { breaks: true }); // Using breaks: true for GitHub-style line breaks
    let plainText = '';
    if (typeof window !== 'undefined' && window.document) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        plainText = doc.body.textContent || "";
      } catch (e) {
         console.error("Error parsing HTML for plain text fallback:", e);
         plainText = whitepaperContent; // Fallback to raw markdown if parsing fails
      }
    } else {
      plainText = whitepaperContent; // Fallback if DOMParser not available
    }

    // 3. Call the rich text copy utility
    await copyRichTextToClipboard(html, plainText.trim());
    };  

  // ***************************** /

  function checkIfWhitepaper(text, payload) { 
    if (!payload) {
      return false;
    }
    const hasWhitepaper = findTargetElement(payload,'whitepaper');
    const isWhitepaperInfo = false;
    if(text && (hasWhitepaper || isWhitepaperInfo) && text.length>1000){
      return true
    } else {
      return false
    }
  }
  

  // *******************************************/
  function parseAndConvertToMarkdown(text) {
    let markdown = '';
  
    const sections = text.split('\n\n');
  
    sections.forEach(section => {
      if (section.startsWith('*')) {
        // List item
        const items = section.split('\n ').filter(item => item.trim() !== '');
        items.forEach(item => {
            if (item.includes(':'))
            {
                let subItems = item.split('* ');
                if (subItems.length > 1) {
                    markdown += '* ' + subItems[0] + '\n';
                    subItems.shift();
                    subItems.forEach(subItem => {
                        markdown += '    * ' + subItem.trim() + '\n';
                    });
                }
                else
                {
                    markdown += '* ' + item.trim() + '\n';
                }
            }
            else
            {
                markdown += '* ' + item.trim() + '\n';
            }
        });
  
      } else if (section.endsWith(':')) {
        // Heading
        markdown += '## ' + section.slice(0, -1) + '\n\n';
      }
        else {
        // Paragraph
        markdown += section + '\n\n';
      }
    });
  
    return markdown;
  }

  //******************************* */

  function renderMarkdown(markdownString) {
    if (typeof markdownString !== 'string') {
      console.error('Input must be a string.');
      return ''; // Return empty string or throw an error
    }
    // Use marked.parse() for synchronous parsing
    try {
      const html = marked.parse(markdownString);
      return html;
    } catch (error) {
      console.error("Error parsing Markdown:", error);
      return `<p>Error rendering Markdown.</p>`; // Provide fallback content
    }
  }

  /********************************** */
  if(IsWhitepaper === false){
    return null
  }

  const markdownOutput = parseAndConvertToMarkdown(text);

  useEffect(() => {
    console.log("INFO FOR WHITEPAPER",sessionData["infoForWhitepaper"])
    
    }, []);

  const handleSaveSession = () => {
    setIsSaveSessionPopupOpen(true);

  };

  const closeSaveSessionPopup =()=>{
    setIsSaveSessionPopupOpen(false);
  }

  const handleSave = (sessionName, sessionDescription) => {
    console.log('Session Name:', sessionName);
    console.log('Session Description:', sessionDescription);
    closeSaveSessionPopup();
  }

  return (
    
    <div>
      <div className={styles.imageContainer}> 
        <img className={styles.images} src={whitepaperEntrypoint} alt="Live Nation Logo"  />
      </div>
      <div className={styles.formattedTextContainer}> 
                    <ReactMarkdown>{text}</ReactMarkdown>

        <div className={styles.copyToClipboardButtonContainer}>
          <button className={styles.copyToClipboardButton} onClick={() => setCopyToClipboard(text)}>
            Copy to Clipboard
          </button>
        </div>
      </div>
      <div className={styles.imageCloserContainer}> 
        <img src={closerimg} alt="Closing Frame"  />
        <button className="overlay-button" onClick={handleSaveSession}>Save Session</button>
      </div>

      {isSaveSessionPopupOpen && <PopupSaveUserSession
              onSave={handleSave}
              onClose={closeSaveSessionPopup}
            >
              <h2>Do you want to save Session</h2>
          </PopupSaveUserSession>
          }

    </div>
  
  );
}

export default MessageWhitepaperComponent;