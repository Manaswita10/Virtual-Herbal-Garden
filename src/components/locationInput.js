// components/LocationInput.js

import React, { useRef, useEffect, useState } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Center of India

const LocationInput = ({ onLocationSelect, initialLocation = null }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(initialLocation);
  const [address, setAddress] = useState('');
  const [predictions, setPredictions] = useState([]);
  const autocompleteRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      geocoderRef.current = new window.google.maps.Geocoder();
      autocompleteRef.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleAddressInput = async (value) => {
    setAddress(value);
    if (value.length > 2 && autocompleteRef.current) {
      const result = await autocompleteRef.current.getPlacePredictions({
        input: value,
        componentRestrictions: { country: 'IN' }
      });
      setPredictions(result?.predictions || []);
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionSelect = async (prediction) => {
    setAddress(prediction.description);
    setPredictions([]);

    if (geocoderRef.current) {
      const result = await geocoderRef.current.geocode({
        placeId: prediction.place_id
      });

      if (result.results[0]) {
        const location = {
          lat: result.results[0].geometry.location.lat(),
          lng: result.results[0].geometry.location.lng()
        };
        setMarker(location);
        map?.panTo(location);
        onLocationSelect(location, prediction.description);
      }
    }
  };

  const handleMapClick = async (event) => {
    const location = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarker(location);

    if (geocoderRef.current) {
      const result = await geocoderRef.current.geocode({ location });
      if (result.results[0]) {
        setAddress(result.results[0].formatted_address);
        onLocationSelect(location, result.results[0].formatted_address);
      }
    }
  };

  return (
    <div style={styles.locationInputContainer}>
      <div style={styles.searchBox}>
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressInput(e.target.value)}
          placeholder="Enter your location"
          style={styles.input}
        />
        {predictions.length > 0 && (
          <ul style={styles.predictionsList}>
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                style={styles.predictionItem}
              >
                {prediction.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={styles.map}
          center={marker || defaultCenter}
          zoom={13}
          onClick={handleMapClick}
          onLoad={setMap}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>
      </div>
    </div>
  );
};

const styles = {
  locationInputContainer: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  searchBox: {
    position: 'relative',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  predictionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
    maxHeight: '200px',
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  predictionItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #e2e8f0',
    ':hover': {
      backgroundColor: '#f7fafc',
    },
  },
  mapContainer: {
    width: '100%',
    height: '400px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  map: {
    width: '100%',
    height: '100%',
  },
};

export default LocationInput;