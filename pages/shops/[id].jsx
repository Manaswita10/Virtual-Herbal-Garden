import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import '/pages/styles/shop-details.css';

export default function ShopDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch shop details');
      }
      
      const result = await response.json();
      
      if (result.data) {
        setShop(result.data);
      } else {
        throw new Error('No shop data found');
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNowClick = () => {
    router.push(`/shops/${id}/products`);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading shop details...</p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="error-screen">
        <h2>Shop Not Found</h2>
        <p>{error || "The shop you're looking for doesn't exist."}</p>
        <button onClick={() => router.back()}>Go Back</button>
      </div>
    );
  }

  // Destructure shop data for easier access
  const {
    name,
    rating = 0,
    distance = 'N/A',
    description = 'No description available',
    address = 'Address not available',
    openingHours = 'Hours not available',
    phone = 'Phone not available',
    email = 'info@ayurvista.com',
    imageUrl = '/assets/blog comm bg1.png'
  } = shop;

  return (
    <div className="shop-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-content">
          <Link href="/" className="logo">
            Ayurvista
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/ContactUs">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>{name}</h1>
            <div className="shop-badges">
              <span className="badge rating">⭐ {rating}</span>
              <span className="badge distance">{distance}</span>
              <span className="badge timing">Open Now</span>
            </div>
            <p className="description">{description}</p>
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={handleBuyNowClick}
              >
                View Our Products
              </button>
              <button className="secondary-button">
                Learn More
                <svg 
                  className="arrow-icon" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <Image 
                src={imageUrl}
                alt={name}
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Information */}
      <section className="info-section">
        <div className="info-grid">
          <div className="info-card location">
            <div className="icon">📍</div>
            <h3>Location</h3>
            <p>{address}</p>
            <button className="text-button">Get Directions</button>
          </div>
          <div className="info-card hours">
            <div className="icon">🕒</div>
            <h3>Hours</h3>
            <p>{openingHours}</p>
            <button className="text-button">View Schedule</button>
          </div>
          <div className="info-card contact">
            <div className="icon">📞</div>
            <h3>Contact</h3>
            <p>{phone}</p>
            <button className="text-button">Call Now</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Natural Products</h3>
            <p>100% organic and natural medicinal plants</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Same day delivery for local orders</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💯</div>
            <h3>Quality Assured</h3>
            <p>All products are quality tested</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💪</div>
            <h3>Expert Guidance</h3>
            <p>Professional advice on plant selection</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>{description}</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <Link href="#products">Products</Link>
            <Link href="#services">Services</Link>
            <Link href="#contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>{address}</p>
            <p>{phone}</p>
            <p>{email}</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 {name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}