import React from 'react';
import { copyToClipboard } from '../utils/helperFunctions';
import { parseAndConvertToMarkdown } from '../utils/helperFunctions';


function MessageComponent({ message}) {
  // Split the message by newline characters and map each part to a <p> tag.
  const formattedMessage = message.split('\n').map((line, index) => (
    <p key={index}>{line}</p>
  ));
  
  const IsWhitepaper = (text)=>{
    if(text.length>3000){
      return true
    } else {
      return false
    }
  }

  const setCopyToClipboard = (whitepaper)=>{
    const MarkdownWhitepaper = parseAndConvertToMarkdown(whitepaper)
      copyToClipboard(MarkdownWhitepaper)
    };  
  


  return (
    <div>
      {formattedMessage}

    </div>
  );
}



export default MessageComponent;
