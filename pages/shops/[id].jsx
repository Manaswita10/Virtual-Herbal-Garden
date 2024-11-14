import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '/pages/styles/shop-details.css';

export default function ShopDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (id) {
      fetchShopDetails();
    }
  }, [id]);

  const fetchShopDetails = async () => {
    try {
      const response = await fetch(`/api/shops/${id}`);
      const data = await response.json();
      setShop(data);
    } catch (error) {
      console.error('Error fetching shop details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = shop?.products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  ) || [];

  const featuredProducts = filteredProducts.slice(0, 3);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!shop) {
    return <div className="error-message">Shop not found</div>;
  }

  return (
    <div className="shop-detail-container">
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="logo">Ayurvista</div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/products">Products</Link>
          <Link href="/news">News</Link>
        </div>
        <button className="contact-button">Contact</button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="main-title">{shop.name}</h1>
            <p className="subtitle">{shop.description}</p>
            <div className="cta-buttons">
              <button className="buy-now-button">Buy Now</button>
              <button className="how-it-works-button">
                How it Works
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            {featuredProducts.length > 0 && (
              <div className="featured-product">
                <img 
                  src={featuredProducts[currentSlide].image} 
                  alt={featuredProducts[currentSlide].name}
                />
              </div>
            )}
            <div className="slide-controls">
              <span className="current-slide">0{currentSlide + 1}</span>
              <div className="slide-buttons">
                <button 
                  onClick={() => setCurrentSlide(prev => prev > 0 ? prev - 1 : featuredProducts.length - 1)}
                  className="slide-button"
                >
                  ←
                </button>
                <button 
                  onClick={() => setCurrentSlide(prev => prev < featuredProducts.length - 1 ? prev + 1 : 0)}
                  className="slide-button"
                >
                  →
                </button>
              </div>
              <span className="total-slides">0{featuredProducts.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="category-cards">
          <div className="category-card">
            <img src={filteredProducts[0]?.image} alt="Interior Plants" />
            <div className="category-info">
              <h3>Plants for Interiors</h3>
              <Link href="#" className="shop-now-link">
                Shop Now →
              </Link>
            </div>
          </div>
          <div className="category-card">
            <img src={filteredProducts[1]?.image} alt="Office Plants" />
            <div className="category-info">
              <h3>Plants for Office</h3>
              <Link href="#" className="shop-now-link">
                Shop Now →
              </Link>
            </div>
          </div>
          <div className="category-card">
            <img src={filteredProducts[2]?.image} alt="Outdoor Plants" />
            <div className="category-info">
              <h3>Plants for Outdoor</h3>
              <Link href="#" className="shop-now-link">
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Information */}
      <section className="shop-info-section">
        <div className="shop-details">
          <div className="detail-item">
            <span className="label">Address:</span>
            <span>{shop.address}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span>{shop.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Hours:</span>
            <span>{shop.openingHours}</span>
          </div>
          <div className="detail-item">
            <span className="label">Rating:</span>
            <span>{'⭐'.repeat(Math.floor(shop.rating))}</span>
          </div>
        </div>
      </section>
    </div>
  );
}