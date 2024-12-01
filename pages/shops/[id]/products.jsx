// pages/shops/[id]/products.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { loadProductImages } from '../../../utils/imageLoader';
import '/pages/styles/products.css';

export default function ShopProducts() {
  const router = useRouter();
  const { id: shopId } = router.query;
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (shopId) {
      fetchShopAndProducts();
    }
  }, [shopId]);

  const fetchShopAndProducts = async () => {
    try {
      setLoading(true);
      const shopResponse = await fetch(`/api/shop/${shopId}`);
      if (!shopResponse.ok) throw new Error('Failed to fetch shop details');
      const shopResult = await shopResponse.json();
      
      if (!shopResult.data) {
        throw new Error('No shop data received');
      }

      // Load product images
      const productsWithImages = await loadProductImages(shopResult.data.products || []);
      
      setShop(shopResult.data);
      setProducts(productsWithImages);
      console.log('Products loaded:', productsWithImages);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (productId) => {
    router.push(`/shops/${shopId}/products/${productId}`);
  };

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = existingCart.findIndex(
      item => item._id === product._id
    );

    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex].quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        shopId: shopId,
        shopName: shop.name
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert('Product added to cart successfully!');
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.category === selectedCategory
  );

  const categories = ['all', ...new Set(products.map(p => p.category || 'uncategorized'))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error loading shop details</h2>
        <p>{error}</p>
        <button onClick={() => router.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="error-message">
        <h2>Shop not found</h2>
        <button onClick={() => router.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <Link href="/" className="logo">
            Ayurvista
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/cart">Cart</Link>
          </div>
        </div>
      </nav>

      {/* Products Container */}
      <div className="products-container">
        {/* Shop Header */}
        <div className="products-header">
          <div className="header-content">
            <h1>{shop.name}</h1>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={300}
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="/assets/plant-placeholder.jpg"
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-meta">
                  <p className="price">₹{product.price}</p>
                  <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
                  </span>
                </div>
                <div className="button-group">
                  <button 
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="view-details-button"
                    onClick={() => handleViewDetails(product._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h2>No products found</h2>
            <p>Try selecting a different category or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}