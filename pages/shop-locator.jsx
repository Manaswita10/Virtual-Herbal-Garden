import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '/pages/styles/shop-locator.css';

export default function ShopLocator() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const router = useRouter();

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
      
      console.error('No results found:', data);
      return "Location not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unable to get location details";
    }
  };

  // Fetch shops from MongoDB
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          
          const detectedAddress = await getAddressFromCoordinates(
            newLocation.latitude,
            newLocation.longitude
          );
          setAddress(detectedAddress);
          setShowConfirmDialog(true);
          
          // Fetch shops after getting location
          try {
            const shopsData = await fetchShops();
            setShops(shopsData);
          } catch (error) {
            setError("Error fetching shops: " + error.message);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setError("Error getting location: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
    }
  }, []);

  const handleShopClick = (shopId) => {
    router.push(`/shops/${shopId}`);
  };

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span>Getting your location...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-wrapper">
        <div className="error-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-locator">
      <div className="container">
        <h1 className="title">Ayurvedic Shops Near You</h1>
        
        {location && (
          <div className="location-info">
            <div className="location-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
            <span className="location-text">{address}</span>
          </div>
        )}

        <ul className="shop-list">
          {shops.map(shop => (
            <li 
              key={shop._id} 
              className="shop-item"
              onClick={() => handleShopClick(shop._id)}
            >
              <div className="shop-info">
                <span className="shop-name">{shop.name}</span>
                <span className="shop-rating">⭐ {shop.rating}</span>
                <span className="shop-address">{shop.address}</span>
                <span className="shop-distance">{shop.distance}</span>
              </div>
              <div className="shop-details">
                <span className="shop-hours">{shop.openingHours}</span>
                <span className="shop-phone">{shop.phone}</span>
              </div>
            </li>
          ))}
        </ul>

        <button 
          className="back-button"
          onClick={() => router.push('/shop')}
        >
          Back to Shop
        </button>

        {showConfirmDialog && (
          <div className="modal-overlay">
            <div className="modal-backdrop" onClick={() => setShowConfirmDialog(false)}></div>
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Confirm Your Location</h2>
                <div className="modal-description">
                  We detected your location as:
                  <div className="modal-address">{address}</div>
                  Is this correct?
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="modal-button modal-button-secondary"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  No, it's incorrect
                </button>
                <button 
                  className="modal-button modal-button-primary"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Yes, it's correct
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}