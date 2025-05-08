function convertToCsv(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return ""; // Return empty string for invalid or empty input
    }
  
    // Define CSV header
    const header = ["email", "SessionCreateDate", "SessionId"];
    const csvRows = [header.join(",")]; // Start with header row
  
    // Process each data object
    data.forEach(item => {
      const email = item.email || ""; // Handle potential missing fields
      const SessionId = item.id || "";
      let StartDate = "";
  
      if (item.startDateTime) {
        try {
          const date = new Date(item.startDateTime);
          // Format to MM/DD/YYYY - adding 1 to month since getMonth() is 0-indexed
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = date.getFullYear();
          StartDate = `${month}/${day}/${year}`;
        } catch (e) {
          console.error("Error parsing date:", item.startDateTime, e);
          StartDate = "Invalid Date"; // Or handle error as needed
        }
      }
  
      // Escape potential commas or quotes if necessary, basic example assumes simple data
      const row = [email, StartDate, SessionId];
      csvRows.push(row.join(","));
    });
  
    // Join all rows with newline characters
    return csvRows.join("\n");
  }


export function downloadCsv(userSessions, filename = 'data.csv') {
const csvString = convertToCsv(userSessions);
const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
const link = document.createElement('a');
if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
} else {
    console.error("Browser does not support automatic download.");
    // Provide fallback or message
}
}

