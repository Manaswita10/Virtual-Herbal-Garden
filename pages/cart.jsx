'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import '/pages/styles/cart.css';
import { loadProductImages } from '/utils/imageLoader';

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        // Get cart items from localStorage
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Load images for cart items
        const itemsWithImages = await loadProductImages(items);
        setCartItems(itemsWithImages);
      } catch (error) {
        console.error('Error loading cart images:', error);
        // Fallback to items without images
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (index, newQuantity) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = Math.max(1, newQuantity);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleProceedToBuy = () => {
    const orderItems = {
      items: cartItems
    };
    localStorage.setItem('tempOrder', JSON.stringify(orderItems));
    router.push('/billing');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-page">
      <nav className="nav-bar">
        <div className="nav-content">
          <Link href="/" className="logo">Ayurvista</Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1>Shopping Cart ({totalItems} items)</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <Link href="/" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.imageUrl || `/assets/plant-placeholder.jpg`}
                      alt={item.name}
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Size: {item.size}</p>
                    <p>Price: ₹{item.price}</p>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <button 
                className="proceed-button"
                onClick={handleProceedToBuy}
              >
                Proceed to Buy Items ({totalItems})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}