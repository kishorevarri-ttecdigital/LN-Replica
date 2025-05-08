export async function downloadSessionLogs(folderName) {

    try {

        const response = await fetch(`https://ln-frontend-middleware-dev-1089873937305.us-central1.run.app/downloads/${folderName}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${folderName}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a); // Clean up the DOM.

      } catch (error) {
        console.error("Error downloading folder:", error);
        alert(`Error downloading folder: ${error.message}`); // User-friendly error message.
      }
    }