import React, { useState, useRef } from 'react';
import './InputArea.css';
import send from '../assets/send.png'
import attach from '../assets/attached-disabled.png'

function InputArea({ sendMessage }) { // Receive sendMessage as a prop
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInputChange = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (message.trim() !== '') {
      sendMessage(message); // Call the prop function
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  
  return (
    <div className='input-area'>
      <textarea
        id="messageInput"
        placeholder="Ask me a question..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        rows="1"
        // style={{ resize: 'none' }}
      />
      <div className="input-buttons">
        <div className='tooltip-container'>
          <button 
            id="attach"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            >
            <img src={attach} alt='attach' className='send-attach-img'/>
            </button>

          {showTooltip && (
          <div className="attach-btn-tooltip">
            <p>
            To add additional context,
            please copy and paste from the
            briefing document into the text
            box prefaced with "Context:"
            </p>
            <p>
            The feature to upload a document
            for context will come 
            in a future release.
            </p>
          </div>
          )}

          <button id="send" onClick={handleSend} >
             <img src={send} alt='Send' className='send-attach-img' />
          </button>

        </div>        
      </div>
    </div>
  );
}

export default InputArea;
