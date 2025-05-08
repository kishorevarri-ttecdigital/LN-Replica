import React from 'react';
import styles from './ChatArea.module.css';

function MessageFormattedTextComponent({ payload, messageText }) {

  if (!payload || !Array.isArray(payload)) {
    return null;
  }

  // HELPER FUNCTION TO LOOK FOR THE TARGET ELEMENT
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

 
  const formattedText = findTargetElement(payload, 'formatted_text');

  if (!formattedText) {
    return null;
  }

  const { header, bullet_points, tailer } = formattedText.payload;

  return (
    <>
      {messageText && <div style={{marginBottom: '10px'}}>{messageText}</div>}
      <div className={styles.formattedTextContainer}>
        {header && <h2>{header?header:""}</h2>}
        {bullet_points && (
          <ul>
            {bullet_points.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </ul>
        )}
      </div>
      {tailer && <div style={{margin:'10px 0'}}>{tailer}</div>}
    </>
  );
}

export default MessageFormattedTextComponent;
