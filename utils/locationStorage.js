// utils/locationStorage.js

/**
 * Save user's location, address and timestamp to localStorage
 * @param {Object} location - Object containing latitude and longitude
 * @param {string} address - Formatted address string
 */
export const saveLocation = (location, address) => {
    if (typeof window !== 'undefined') {
      try {
        const locationData = {
          coords: {
            lat: location.lat,
            lng: location.lng
          },
          address: address,
          timestamp: Date.now()
        };
        
        localStorage.setItem('userLocation', JSON.stringify(locationData));
        
        // Also save as last known location for backup
        localStorage.setItem('lastKnownLocation', JSON.stringify(locationData));
      } catch (error) {
        console.error('Error saving location to localStorage:', error);
      }
    }
  };
  
  /**
   * Get saved location from localStorage
   * @returns {Object|null} Location data or null if not found/expired
   */
  export const getSavedLocation = () => {
    if (typeof window !== 'undefined') {
      try {
        // Try to get current location data
        const saved = localStorage.getItem('userLocation');
        
        if (saved) {
          const data = JSON.parse(saved);
          // Check if location is less than 24 hours old
          if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
            return data;
          }
          // If expired, clear current location but keep last known
          localStorage.removeItem('userLocation');
        }
  
        // If no current location or expired, try last known location
        const lastKnown = localStorage.getItem('lastKnownLocation');
        if (lastKnown) {
          return JSON.parse(lastKnown);
        }
      } catch (error) {
        console.error('Error getting location from localStorage:', error);
        clearSavedLocation(); // Clear potentially corrupted data
      }
    }
    return null;
  };
  
  /**
   * Clear saved location from localStorage
   * @param {boolean} [clearLastKnown=false] - Whether to also clear last known location
   */
  export const clearSavedLocation = (clearLastKnown = false) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('userLocation');
        if (clearLastKnown) {
          localStorage.removeItem('lastKnownLocation');
        }
      } catch (error) {
        console.error('Error clearing location from localStorage:', error);
      }
    }
  };
  
  /**
   * Update existing location with new address or coordinates
   * @param {Object} updates - Object containing updates to location data
   */
  export const updateSavedLocation = (updates) => {
    if (typeof window !== 'undefined') {
      try {
        const currentData = getSavedLocation();
        if (currentData) {
          const updatedData = {
            ...currentData,
            ...updates,
            timestamp: Date.now() // Reset timestamp on update
          };
          saveLocation(updatedData.coords, updatedData.address);
        }
      } catch (error) {
        console.error('Error updating location in localStorage:', error);
      }
    }
  };
  
  /**
   * Check if location data exists and is valid
   * @returns {boolean} Whether valid location data exists
   */
  export const hasValidLocation = () => {
    const locationData = getSavedLocation();
    return !!(locationData?.coords?.lat && locationData?.coords?.lng);
  };
  
  /**
   * Get location age in hours
   * @returns {number|null} Hours since location was saved, or null if no location
   */
  export const getLocationAge = () => {
    const locationData = getSavedLocation();
    if (locationData?.timestamp) {
      return (Date.now() - locationData.timestamp) / (1000 * 60 * 60);
    }
    return null;
  };
  
  /**
   * Force refresh of location data
   * Clears current location but keeps last known location as backup
   */
  export const forceLocationRefresh = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('userLocation');
      } catch (error) {
        console.error('Error forcing location refresh:', error);
      }
    }
  };
  
  /**
   * Save location preference (auto-detect vs manual)
   * @param {string} preference - 'auto' or 'manual'
   */
  export const saveLocationPreference = (preference) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('locationPreference', preference);
      } catch (error) {
        console.error('Error saving location preference:', error);
      }
    }
  };
  
  /**
   * Get saved location preference
   * @returns {string|null} Saved preference or null if not set
   */
  export const getLocationPreference = () => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('locationPreference');
      } catch (error) {
        console.error('Error getting location preference:', error);
        return null;
      }
    }
    return null;
  };