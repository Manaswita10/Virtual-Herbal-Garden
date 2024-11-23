import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import '/pages/styles/product-details.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Leaf, 
  Droplet, 
  Sun, 
  Thermometer, 
  Wind, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  Cloud,
  Star, 
  Send,
  Info,
  CheckCircle,
  XCircle,
  Package,
  FileText,
  Clock
} from 'lucide-react';
import { loadProductImages } from '/utils/imageLoader';

// Helper function to determine product type
const isPlantProduct = (product) => {
  return product.category === "Indoor" || 
         product.careInfo.wateringSchedule !== undefined;
};

// Notification Component
const Notification = ({ message, type = 'success' }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={`notification ${type}`}
  >
    {type === 'success' ? (
      <CheckCircle className="notification-icon" />
    ) : (
      <XCircle className="notification-icon" />
    )}
    <span>{message}</span>
  </motion.div>
);

export default function ProductDetails() {
  const router = useRouter();
  const { id: shopId, productId } = router.query;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [review, setReview] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    if (shopId && productId) {
      fetchProductDetails();
    }
    updateCartCount();
  }, [shopId, productId]);

  useEffect(() => {
    if (product?.galaryUrls?.length > 1 && !isImageHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === product.galaryUrls.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [product?.galaryUrls?.length, isImageHovered]);

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/${shopId}`);
      if (!response.ok) throw new Error('Failed to fetch shop details');
      
      const result = await response.json();
      if (!result.data) throw new Error('No shop data received');

      const foundProduct = result.data.products.find(p => p._id === productId);
      if (!foundProduct) throw new Error('Product not found');

      const [productWithImages] = await loadProductImages([foundProduct]);
      
      setProduct(productWithImages);
      if (productWithImages.sizes?.length > 0) {
        setSelectedSize(productWithImages.sizes[0]);
      }
      setCurrentImageIndex(0);
      
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showNotificationMessage('Please select a size first', 'error');
      return;
    }

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = existingCart.findIndex(
        item => item._id === product._id && item.size === selectedSize.option
      );

      if (existingProductIndex >= 0) {
        existingCart[existingProductIndex].quantity += 1;
      } else {
        existingCart.push({
          ...product,
          size: selectedSize.option,
          price: selectedSize.price,
          quantity: 1,
          shopId
        });
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      updateCartCount();
      showNotificationMessage('Item added to cart!');
      
      setTimeout(() => {
        router.push('/cart');
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotificationMessage('Failed to add item to cart', 'error');
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      showNotificationMessage('Please select a size first', 'error');
      return;
    }

    try {
      const orderItem = {
        items: [{
          ...product,
          size: selectedSize.option,
          price: selectedSize.price,
          quantity: 1,
          shopId
        }]
      };
      localStorage.setItem('tempOrder', JSON.stringify(orderItem));
      router.push('/billing');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      showNotificationMessage('Failed to proceed to checkout', 'error');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          shopId,
          ...review
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      showNotificationMessage('Review submitted successfully!');
      setReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      showNotificationMessage('Failed to submit review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
          }}
          className="loading-spinner"
        >
          <Leaf className="spinner-icon" />
        </motion.div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="error-container"
      >
        <div className="error-content">
          <Info className="error-icon" />
          <h2>Oops! Something went wrong</h2>
          <p>{error || 'Product not found'}</p>
          <Link href="/shops">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="back-button"
            >
              Back to Shops
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="product-details-container"
    >
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <Notification 
            message={notificationMessage}
            type={notificationType}
          />
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="nav-bar">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="nav-content"
        >
          <Link href="/" className="logo">
            <Leaf className="logo-icon" />
            <span>Ayurvista</span>
          </Link>
          <div className="nav-links">
            <Link href="/shop-locator" className="nav-link">Find Shops</Link>
            <Link href="/cart" className="cart-link">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="cart-icon-container"
              >
                <ShoppingCart className="cart-icon" />
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Product Details */}
      <div className="product-content">
        {/* Image Gallery */}
        <div className="product-gallery">
          <motion.div 
            className="main-image-container"
            onHoverStart={() => setIsImageHovered(true)}
            onHoverEnd={() => setIsImageHovered(false)}
          >
            <Image
              src={product.galaryUrls[currentImageIndex] || product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="main-image"
              priority
            />
            {product.galaryUrls?.length > 1 && (
              <div className="gallery-controls">
                <button 
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? product.galaryUrls.length - 1 : prev - 1
                  )}
                  className="gallery-control prev"
                >
                  <ChevronLeft />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === product.galaryUrls.length - 1 ? 0 : prev + 1
                  )}
                  className="gallery-control next"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </motion.div>

          {product.galaryUrls?.length > 0 && (
            <div className="thumbnail-gallery">
              {product.galaryUrls.map((url, index) => (
                <button
                  key={url}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                >
                  <Image
                    src={url}
                    alt={`${product.name} view ${index + 1}`}
                    width={80}
                    height={80}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="price-stock">
            <span className="price">₹{selectedSize ? selectedSize.price : product.price}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size.option}
                    onClick={() => setSelectedSize(size)}
                    className={`size-option ${selectedSize?.option === size.option ? 'active' : ''}`}
                  >
                    <span className="size-name">{size.option}</span>
                    {size.dimensions && (
                      <span className="size-dimensions">{size.dimensions}</span>
                    )}
                    <span className="size-price">₹{size.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="add-to-cart"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="button-icon" />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyNow}
              className="buy-now"
              disabled={product.stock <= 0}
            >
              <Heart className="button-icon" />
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Care Information */}
      <div className="care-section">
        <h2 className="section-title">
          {isPlantProduct(product) ? 'Plant Care Guide' : 'Product Information'}
        </h2>

        {isPlantProduct(product) ? (
          // Plant Care Guide
          <>
            <div className="care-grid">
              <motion.div whileHover={{ scale: 1.05 }} className="care-card">
                <div className="icon-wrapper water">
                  <Droplet className="care-icon" />
                </div>
                <h4>Watering</h4>
                <p>{product.careInfo.wateringSchedule}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="care-card">
                <div className="icon-wrapper sun">
                  <Sun className="care-icon" />
                </div>
                <h4>Sunlight</h4>
                <p>{product.careInfo.sunlight}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="care-card">
                <div className="icon-wrapper temp">
                  <Thermometer className="care-icon" />
                </div>
                <h4>Temperature</h4>
                <p>{product.careInfo.temperature}</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="care-card">
              <div className="icon-wrapper humidity">
    <Cloud className="care-icon" />
  </div>
  <h4>Humidity</h4>
  <p>{product.careInfo.humidity}</p>
</motion.div>
            </div>

            <div className="care-details">
              {product.careInfo.tips?.length > 0 && (
                <div className="care-tips">
                  <h3>Care Tips</h3>
                  <ul>
                    {product.careInfo.tips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {product.careInfo.commonIssues?.length > 0 && (
                <div className="common-issues">
                  <h3>Common Issues</h3>
                  <ul>
                    {product.careInfo.commonIssues.map((issue, index) => (
                      <motion.li
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {issue}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          // Medicine/Product Care Info
          <div className="medicine-care-info">
            {product.careInfo.storage && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="care-card"
              >
                <div className="icon-wrapper storage">
                  <Package className="care-icon" />
                </div>
                <h4>Storage</h4>
                <p>{product.careInfo.storage}</p>
              </motion.div>
            )}

            {product.careInfo.usage && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="care-card"
              >
                <div className="icon-wrapper usage">
                  <FileText className="care-icon" />
                </div>
                <h4>Usage</h4>
                <p>{product.careInfo.usage}</p>
              </motion.div>
            )}

            {product.careInfo.dosage && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="care-card"
              >
                <div className="icon-wrapper dosage">
                  <Clock className="care-icon" />
                </div>
                <h4>Dosage</h4>
                <p>{product.careInfo.dosage}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Reviews</h2>
        
        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-select">
            <h3>Rate this product</h3>
            <div className="star-rating">
              {[5,4,3,2,1].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${review.rating >= star ? 'active' : ''}`}
                  onClick={() => setReview({...review, rating: star})}
                >
                  <Star className="star-icon" />
                </button>
              ))}
            </div>
          </div>

          <div className="review-input">
            <textarea
              value={review.comment}
              onChange={(e) => setReview({...review, comment: e.target.value})}
              placeholder="Share your experience with this product..."
              required
              minLength={10}
              maxLength={500}
            />
            <span className="character-count">{review.comment.length}/500</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="submit-review"
          >
            <Send className="button-icon" />
            Submit Review
          </motion.button>
        </form>

        {/* Reviews List */}
        {product.reviews?.length > 0 ? (
          <div className="reviews-list">
            {product.reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="review-card"
              >
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.userName}</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`star-icon ${i < review.rating ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-content">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {typeof window !== 'undefined' && window.scrollY > 300 && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ChevronLeft className="up-icon" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { id: shopId, productId } = params;
    return {
      props: { shopId, productId }
    };
  } catch (error) {
    return {
      props: { error: 'Failed to fetch initial data' }
    };
  }
}
                  