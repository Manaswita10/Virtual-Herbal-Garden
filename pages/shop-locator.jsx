// pages/shop-locator.jsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoadScript } from '@react-google-maps/api';
import LocationInput from '/src/components/locationInput.js';
import { saveLocation, getSavedLocation, clearSavedLocation } from '/utils/locationStorage.js';
import styles from '/pages/styles/shopLocator.module.css';

const libraries = ['places', 'geometry'];

export default function ShopLocator() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const router = useRouter();

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops');
      if (!response.ok) {
        throw new Error('Failed to fetch shops');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw error;
    }
  };

  useEffect(() => {
    const savedLocation = getSavedLocation();
    
    if (savedLocation) {
      setLocation(savedLocation.coords);
      setAddress(savedLocation.address);
      loadShops();
    } else {
      detectCurrentLocation();
    }
  }, []);

  const loadShops = async () => {
    try {
      const shopsData = await fetchShops();
      setShops(shopsData);
      setIsLoading(false);
    } catch (error) {
      setError("Error fetching shops: " + error.message);
      setIsLoading(false);
    }
  };

  const detectCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          const detectedAddress = await getAddressFromCoordinates(
            newLocation.lat,
            newLocation.lng
          );
          
          setLocation(newLocation);
          setAddress(detectedAddress);
          setShowConfirmDialog(true);
          
          await loadShops();
        },
        (error) => {
          setError("Error getting location: " + error.message);
          setShowManualInput(true);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setShowManualInput(true);
      setIsLoading(false);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'REQUEST_DENIED') {
        console.error('Google Maps API key error:', data.error_message);
        return 'Location services unavailable';
      }
      
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      
      return "Location not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to get location details";
    }
  };

  const handleLocationConfirm = () => {
    saveLocation(location, address);
    setShowConfirmDialog(false);
  };

  const handleLocationDeny = () => {
    setShowConfirmDialog(false);
    setShowManualInput(true);
    clearSavedLocation();
  };

  const handleManualLocationSelect = async (newLocation, newAddress) => {
    setLocation(newLocation);
    setAddress(newAddress);
    saveLocation(newLocation, newAddress);
    await loadShops();
    setShowManualInput(false);
  };

  const handleShopClick = (shopId) => {
    router.push(`/shops/${shopId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingSpinner}></div>
        <span className={styles.loadingText}>
          Discovering nearby Ayurvedic treasures...
        </span>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className={styles.shopLocator}>
        <div className={styles.container}>
          <h1 className={styles.title}>Discover Ayurvedic Sanctuaries Near You</h1>
          
          {showManualInput ? (
            <LocationInput
              onLocationSelect={handleManualLocationSelect}
              initialLocation={location}
            />
          ) : location && (
            <div className={styles.locationInfo}>
              <div className={styles.locationIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className={styles.locationText}>{address}</span>
              <button
                className={styles.changeLocationButton}
                onClick={() => setShowManualInput(true)}
              >
                Change Location
              </button>
            </div>
          )}

          {/* Shop List */}
          <ul className={styles.shopList}>
            {shops.map(shop => (
              <li 
                key={shop._id} 
                className={styles.shopItem}
                onClick={() => handleShopClick(shop._id)}
              >
                <div className={styles.shopHeader}>
                  <span className={styles.shopName}>{shop.name}</span>
                  <span className={styles.shopRating}>{'⭐'.repeat(Math.round(shop.rating))}</span>
                </div>
                <div className={styles.shopInfo}>
                  <div className={styles.shopInfoItem}>
                    <svg className={styles.shopInfoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className={styles.shopAddress}>{shop.address}</span>
                  </div>
                  <div className={styles.shopInfoItem}>
                    <svg className={styles.shopInfoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={styles.shopHours}>{shop.openingHours}</span>
                  </div>
                  <div className={styles.shopInfoItem}>
                    <svg className={styles.shopInfoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className={styles.shopPhone}>{shop.phone}</span>
                  </div>
                </div>
                <div className={styles.shopDistance}>
                  <svg className={styles.distanceIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {shop.distance}
                </div>
              </li>
            ))}
          </ul>

          {showConfirmDialog && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Confirm Your Location</h2>
                <p className={styles.modalDescription}>
                  We've pinpointed your location:
                  <div className={styles.modalAddress}>{address}</div>
                  Is this correct?
                </p>
                <div className={styles.modalButtons}>
                  <button
                    className={`${styles.modalButton} ${styles.modalButtonSecondary}`}
                    onClick={handleLocationDeny}
                  >
                    No, it's incorrect
                  </button>
                  <button
                    className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
                    onClick={handleLocationConfirm}
                  >
                    Yes, it's correct
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
}