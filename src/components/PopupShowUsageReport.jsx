import React,{useEffect, useState, useRef} from 'react';
import './PopupShowUsageReport.css'
import useRTDBFunctions from '../hooks/useRealtimeDatabaseFunction'
import { downloadCsv } from '../utils/ReportDownload';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get the start of the current week (Monday)
const getStartOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust if Sunday
  const monday = new Date(date.setDate(diff));
  return monday;
};

// Helper function to get the end of the current week (Sunday)
const getEndOfWeek = (date) => {
  const startOfWeek = getStartOfWeek(new Date(date)); // Ensure we use a fresh date object
  const sunday = new Date(startOfWeek);
  sunday.setDate(startOfWeek.getDate() + 6);
  return sunday;
};


function PopupShowUsageReport({ children, onClose, closeMenu, onLoadSession}) { // Receive closeMenu
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const isDownloading = useRef(false); // Ref to track download state
  const {userSesssions, getUserSessions } = useRTDBFunctions(); 

  const handleLoadClick = () => {
    if (startDate && endDate) {
      getUserSessions(null,startDate,endDate);

      if (isDownloading.current) {
        console.log("Download already in progress, preventing duplicate.");
        return; // Exit if already downloading
      }

      // 2. Set the flag to true
      isDownloading.current = true;
      console.log("Starting download...");

      try{
        downloadCsv(userSesssions);
        isDownloading.current = false;
      }catch (error) {console.error("Error during CSV generation or download:", error);}      
      
    } else {
      alert('Please select a date range.');
    }
  };

  useEffect(() => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = getEndOfWeek(today);

    setStartDate(formatDate(startOfWeek));
    setEndDate(formatDate(endOfWeek));
  }, []); // Run only once on mount
  
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // Optional: Add validation to ensure start date is not after end date
    if (event.target.value > endDate) {
      setEndDate(event.target.value);
    }
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
     // Optional: Add validation to ensure end date is not before start date
    if (event.target.value < startDate) {
      setStartDate(event.target.value);
    }
  };


  return (
    
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */}
        <h2>Tool Usage Report</h2>
        <p>Please select a date range</p>
        <div className='popup-datepicker'>
          <label htmlFor="start-date">Start Date:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className='popup-datepicker'>
          <label htmlFor="end-date">End Date:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate} 
          />
        </div>
        {/* Button container */}
       <div className="popup-buttons">
          <button onClick={handleLoadClick}>Download</button>
          <button onClick={() => { closeMenu(); onClose(); }}>Close</button>
        </div>

      </div>
    </div>

  );
}

export default PopupShowUsageReport;
