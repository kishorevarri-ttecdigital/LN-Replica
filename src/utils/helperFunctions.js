export function parseJson(jsonObject) {
    const fulfillmentResponse = jsonObject.fulfillment_response;

    if (fulfillmentResponse && fulfillmentResponse.payload && fulfillmentResponse.payload.length > 0) {
      const names = [];
      for (const item of fulfillmentResponse.payload) {
        names.push(item.name);
      }
      console.log("Names:", names);
      return names;
    } else {
      console.log("Payload is either missing or empty.");
      return [];
    }
  }

// This function takes an array of keywords and search
// the string variable for its existence
// Example usage:
// const text = "This is a test string with some keywords like JavaScript and programming.";
// const keywordsToFind = ["JavaScript", "Python", "Programming", "Test"];
// const found = inspectString(text, keywordsToFind);
// console.log("Found keywords:", found); // Output: Found keywords: [ 'JavaScript', 'Programming', 'Test' ]

export function inspectString(inputString, keywords) {
  const lowerCaseInput = inputString.toLowerCase();
  const foundKeywords = [];

  for (const keyword of keywords) {
    if (lowerCaseInput.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }

  return foundKeywords;
}

export function concatArrayToString(selectedArray){
  let text='';
  if (!selectedArray){
    return text
  }
  if (selectedArray.length === 0) {
    text= ''
  } else if (selectedArray.length === 1) {
    text = `${selectedArray[0]}`
  } else {
    const lastItem = selectedArray.pop();
    text = `${selectedArray.join(', ')} and ${lastItem}`

  }

  return text
}

export function geSessionDatatSelectedInsights(sessionData,targetElement) {
  if (typeof sessionData === 'object' && sessionData !== null) {
    // Handle objects (including arrays)
    if (Array.isArray(sessionData)) {
      // Handle arrays efficiently using find
      const targetElementItem = sessionData.find(item => item && item.name === targetElement);
      return targetElementItem ? targetElementItem : undefined;
    } else {
      // Handle plain objects
      return sessionData.targetElement; // Directly access the property
    }
  }
  return undefined; // Or null, depending on your preference
}


export function checkIfWhitepaper(text) {
  const words = ["executive", "summary", "start", "draft", "proposal"];
  for (const word of words) {
    if (!text.toLowerCase().includes(word)) {
      return false;
    }
  }
  return true;
}


export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
      return; // Exit the function if successful
    } catch (err) {
      console.warn('Clipboard API writeText failed: ', err);
      // Proceed to fallback
    }
  }

  // Fallback for older browsers or insecure contexts
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Avoid scrolling to bottom of page in MS Edge.
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  } finally {
      document.body.removeChild(textarea);
  }
}



export const copyRichTextToClipboard = async (htmlContent, plainText) => {
  if (!navigator.clipboard || !navigator.clipboard.write) {
    // console.warn('Clipboard API (write) not available. Falling back to plain text copy.');
    // Fallback to plain text copy if the advanced API is not supported
    fallbackCopyTextToClipboard(plainText);
    return;
  }

  try {
    // Create Blob objects for both HTML and plain text
    const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
    const textBlob = new Blob([plainText], { type: 'text/plain' });

    // Create a ClipboardItem with both formats
    const clipboardItem = new ClipboardItem({
      'text/html': htmlBlob,
      'text/plain': textBlob,
    });

    // Write the item to the clipboard
    await navigator.clipboard.write([clipboardItem]);
    // console.log('HTML and plain text copied to clipboard');
    alert('Content (HTML) copied to clipboard!'); // User feedback

  } catch (err) {
    console.error('Failed to copy rich text: ', err);
    // If writing HTML fails, try falling back to plain text
    // console.warn('Falling back to plain text copy due to error.');
    fallbackCopyTextToClipboard(plainText);
  }
};

// Fallback function for plain text copy (remains the same)
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.readOnly = true;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
    if (successful) alert('Content (plain text) copied to clipboard.');
    else throw new Error('Copy command unsuccessful');
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    alert('Failed to copy text.');
  }

  document.body.removeChild(textArea);
}


export function convertReactElementsToString(elements) {
  let result = '';

  elements.forEach(element => {
    // Check if the element is a <p> tag (or has the expected structure).
    if (element.type === 'p' && element.props && element.props.children) {
      // Extract the text content from within the <p> tag.
      if (typeof element.props.children === 'string') {
        result += element.props.children;
      }
      result += "\\n"; // Add a newline after each <p> element's content.
    }
  });
    //the last \n is not needed
    result = result.slice(0,-1)
    const output = formatText(result)

  return output;
}

function formatText(text) {
  // Add line breaks after sentences.
  let formattedText = text.replace(/\.(?!\s*\n)/g, '.\n\n');

  // Add line breaks before headings (lines starting with ##).
  formattedText = formattedText.replace(/^(##.*)$/gm, '\n$1\n');

  // Add line breaks before bolded text (lines starting with **).
  formattedText = formattedText.replace(/(\*\*[^*]*\*\*)/g, '\n$1\n');
  
  //Remove any leading spaces on each line
  formattedText = formattedText.replace(/^[ ]*/gm, '');

  // Remove occurrences of "\n*"
    formattedText = formattedText.replace(/\\n\*/g, '');

  // Remove occurrences of "\n" followed immediately by a letter or number or *
    formattedText = formattedText.replace(/\\n(?=[a-zA-Z0-9\*])/g, '');
    
  // Remove any remaining isolated "\n"
    formattedText = formattedText.replace(/\\n/g, '');

  return formattedText;
}

export function parseAndConvertToMarkdown(text) {
  let markdown = '';

  const sections = text.split('\n\n');

  sections.forEach(section => {
    if (section.startsWith('*')) {
      // List item
      const items = section.split('\n* ').filter(item => item.trim() !== '');
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

//HELPER FUNCTION TO LOOK FOR THE TARGET ELEMENT
export function findTargetElement(data, targetName) {
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