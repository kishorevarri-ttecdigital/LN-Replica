import React from 'react';
import styles from './VenueList.module.css';

function VenueList({ venues, selectedVenues, onVenueSelect }) {
  return (
    <div className={styles.venueList}>
      {venues.map((venue) => (
        <div key={venue.name} className={styles.venueItem}>
          <span>{venue.name}</span>
          <div className={styles.venueTags}>
            {venue.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <button
            className={`${styles.selectVenue} ${selectedVenues.includes(venue.name) ? styles.selected : ''}`}
            onClick={() => onVenueSelect(venue.name)}
          >
            &#9733;
          </button>
        </div>
      ))}
    </div>
  );
}

export default VenueList;
