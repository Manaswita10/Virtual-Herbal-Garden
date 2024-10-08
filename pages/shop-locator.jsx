import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '/pages/styles/shop-locator.css';

export default function ShopLocator() {
  const [location, setLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoading(false);
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

  useEffect(() => {
    if (location) {
      // Here you would typically make an API call to get shops near the location
      // For this example, we'll use dummy data
      const dummyShops = [
        { id: 1, name: "Ayurveda Shop 1", distance: "0.5 km" },
        { id: 2, name: "Herbal Haven", distance: "1.2 km" },
        { id: 3, name: "Nature's Cure", distance: "2.0 km" },
      ];
      setShops(dummyShops);
    }
  }, [location]);

  if (isLoading) {
    return <div className="loading">Getting your location...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="shop-locator">
      <h1>Ayurvedic Shops Near You</h1>
      {location && (
        <p className="location">Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
      )}
      <ul className="shop-list">
        {shops.map(shop => (
          <li key={shop.id} className="shop-item">
            <span className="shop-name">{shop.name}</span>
            <span className="shop-distance">{shop.distance}</span>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => router.push('/shop')}>Back to Shop</button>
    </div>
  );
}