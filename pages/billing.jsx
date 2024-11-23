// pages/billing.jsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  ArrowLeft, 
  CreditCard, 
  Tag, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Mail,
  Phone,
  Wallet,
  Smartphone,
  DollarSign 
} from 'lucide-react';
import { 
  getToken, 
  isLoggedIn, 
  getValidToken,
  setupAuthRefresh,
  cleanupAuthRefresh,
  getTokens 
} from '../utils/auth';
import './styles/billing.css';

export default function Billing() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(true);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showUpiInput, setShowUpiInput] = useState(false);
  const [showCardInput, setShowCardInput] = useState(false);
  const [showPriceSummary, setShowPriceSummary] = useState(false);
  
  const [availableOffers, setAvailableOffers] = useState({
    promoCodes: [],
    cardOffers: []
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    specialInstructions: ''
  });

  const [cardDetails, setCardDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  // Token refresh and authentication setup
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getValidToken();
        if (!token) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
    setupAuthRefresh();
    
    return () => {
      cleanupAuthRefresh();
    };
  }, []);

  // Load cart items
  useEffect(() => {
    const tempOrder = JSON.parse(localStorage.getItem('tempOrder') || '{}');
    if (tempOrder.items?.length > 0) {
      setOrderItems(tempOrder.items);
      const firstItem = tempOrder.items[0];
      if (firstItem.shopId && firstItem._id) {
        fetchOffers(firstItem.shopId, firstItem._id);
      }
    } else {
      router.push('/cart');
    }
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowPriceSummary(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshTokenAndFetch = async (apiCall) => {
    try {
      const validToken = await getValidToken();
      if (!validToken) {
        throw new Error('Failed to refresh token');
      }
      
      const response = await apiCall(validToken);
      
      if (response.status === 401) {
        const tokens = getTokens();
        if (!tokens.refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const refreshResponse = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh token');
          }

          const { token } = await refreshResponse.json();
          return await apiCall(token);
        } catch (refreshError) {
          throw new Error('Session expired');
        }
      }
      
      return response;
    } catch (error) {
      console.error('API call failed:', error);
      if (error.message.includes('token') || error.message.includes('Session')) {
        router.push('/login');
      }
      throw error;
    }
  };

  const fetchOffers = async (shopId, productId) => {
    try {
      setOffersLoading(true);
      const response = await refreshTokenAndFetch(async (token) => {
        return await fetch(
          `/api/shop/${shopId}/offers?productId=${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const result = await response.json();
      if (result.success) {
        setAvailableOffers(result.data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      showToast('error', error.message);
    } finally {
      setOffersLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    let discount = 0;

    if (selectedPromo) {
      discount += (subtotal * selectedPromo.discount) / 100;
    }
    if (selectedCard) {
      discount += (subtotal * selectedCard.discount) / 100;
    }

    return Math.round(discount);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const validateUpiId = (id) => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    return upiRegex.test(id);
  };

  const handlePaymentMethodChange = (method) => {
    // Convert method to lowercase before setting
    const lowerMethod = method.toLowerCase();
    setPaymentMethod(lowerMethod);
    setShowUpiInput(lowerMethod === 'upi');
    setShowCardInput(lowerMethod === 'card');
    
    if (lowerMethod === 'cod') {
      setCardDetails({
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
      setUpiId('');
      setSelectedCard(null);
    }
  };
  
  const handlePromoCodeApply = async (code) => {
    if (loading || !code.trim()) return;
    
    try {
      setLoading(true);
      const matchingPromo = availableOffers.promoCodes.find(p => p.code === code);
      
      if (!matchingPromo) {
        showToast('error', 'Invalid promo code');
        return;
      }
  
      if (new Date(matchingPromo.validUntil) < new Date()) {
        showToast('error', 'This promo code has expired');
        return;
      }
  
      setSelectedPromo(matchingPromo);
      showToast('success', 'Promo code applied successfully!');
      setPromoCode('');
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCardOfferSelect = (card) => {
    if (loading) return;
    setSelectedCard(card);
    showToast('success', 'Card offer applied successfully!');
  };
  
  const validateDeliveryInfo = () => {
    const newErrors = {};
    
    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!deliveryInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!deliveryInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!/^\d{6}$/.test(deliveryInfo.zipCode)) {
      newErrors.zipCode = 'Enter valid 6-digit PIN code';
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryInfo.email)) {
      newErrors.email = 'Enter a valid email address';
    }
  
    if (!/^\d{10}$/.test(deliveryInfo.phone)) {
      newErrors.phone = 'Enter valid 10-digit phone number';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePaymentInfo = () => {
    const newErrors = {};
  
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
      return false;
    }
  
    if (paymentMethod === 'upi' && !validateUpiId(upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@upi)';
    }
  
    if (paymentMethod === 'card') {
      if (!cardDetails.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Card holder name is required';
      }
  
      if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Enter valid 16-digit card number';
      }
  
      if (!/^(0[1-9]|1[0-2])\/([2-9]\d)$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Enter valid expiry date (MM/YY)';
      }
  
      if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Enter valid 3-digit CVV';
      }
    }
  
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };
  
  // Updated handlePlaceOrder function for billing.jsx

// In billing.jsx

const handlePlaceOrder = async () => {
  if (!validateDeliveryInfo() || !validatePaymentInfo()) {
    showToast('error', 'Please fill all required fields correctly');
    return;
  }

  try {
    setLoading(true);

    // Get the current valid token
    const token = await getValidToken();
    
    // Calculate pricing values
    const subtotalAmount = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const totalAmount = calculateTotal();

    // Prepare order data
    const orderData = {
      items: orderItems.map(item => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image?.modelBasePath || item.image || null,
        shopId: item.shopId || null
      })),
      deliveryInfo: {
        email: deliveryInfo.email,
        phone: deliveryInfo.phone,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        zipCode: deliveryInfo.zipCode,
        specialInstructions: deliveryInfo.specialInstructions || ''
      },
      payment: {
        method: paymentMethod.toLowerCase(),
        ...(paymentMethod === 'card' ? {
          cardDetails: {
            cardHolderName: cardDetails.cardHolderName,
            last4Digits: cardDetails.cardNumber.slice(-4),
            bank: selectedCard?.bank || null,
            type: selectedCard?.type || null
          }
        } : {}),
        ...(paymentMethod === 'upi' ? {
          upiId: upiId
        } : {})
      },
      appliedOffers: {
        promoCode: selectedPromo ? {
          code: selectedPromo.code,
          discount: Number(selectedPromo.discount),
          description: selectedPromo.description,
          validUntil: selectedPromo.validUntil
        } : null,
        cardOffer: selectedCard ? {
          bank: selectedCard.bank,
          type: selectedCard.type,
          discount: Number(selectedCard.discount),
          description: selectedCard.description
        } : null
      },
      pricing: {
        subtotal: subtotalAmount,
        discount: discountAmount,
        total: totalAmount
      }
    };

    // Make API call with proper authorization header
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to place order');
    }

    if (result.success) {
      setOrderNumber(result.data.orderNumber);
      setShowOrderSuccess(true);

      // Clear cart data
      localStorage.removeItem('cart');
      localStorage.removeItem('tempOrder');

      const successMessage = paymentMethod === 'cod'
        ? 'Order placed successfully! You can pay on delivery.'
        : 'Order placed and payment processed successfully!';

      showToast('success', successMessage);

      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    }
  } catch (error) {
    console.error('Order placement error:', error);
    showToast('error', error.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};

  const showToast = (type, message) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-in`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-out');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // ... Rest of your JSX remains the same as in the previous complete code
  // Continuing from the previous code...

return (
  <div className="billing-page">
    {showOrderSuccess && (
      <div className="success-modal">
        <div className="success-content">
          <CheckCircle size={48} color="#4CAF50" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with us.</p>
          <p>Your order number is: {orderNumber}</p>
          {paymentMethod === 'cod' && (
            <p>Please keep cash ready at the time of delivery.</p>
          )}
        </div>
      </div>
    )}

    <nav className="nav-bar">
      <div className="nav-content">
        <div className="nav-left">
          <button onClick={() => router.back()} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <Link href="/" className="logo">
            Ayurvista
          </Link>
        </div>
        <Link href="/cart" className="cart-link">
          <ShoppingCart size={24} />
          {orderItems.length > 0 && (
            <span className="cart-count">{orderItems.length}</span>
          )}
        </Link>
      </div>
    </nav>

    <div className="container">
      <h1 className="page-title">Checkout</h1>

      <div className="billing-content">
        <div className="order-summary">
          <h2>
            <ShoppingCart size={20} />
            Order Summary
          </h2>
        <div className="order-items">
  {orderItems.map((item, index) => (
    <div key={index} className="order-item">
      <div className="item-info">
        <div className="item-image">

        </div>
        <div className="item-details">
          <h3>{item.name}</h3>
          <div className="item-meta">
            <span className="quantity">Qty: {item.quantity}</span>
          </div>
          <p className="item-price">₹{item.price * item.quantity}</p>
        </div>
      </div>
    </div>
  ))}
</div>
          <div className="offers-section">
            <h2>
              <Tag size={20} />
              Available Offers
            </h2>
            
            <div className="promo-codes">
              <div className="promo-input">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className={errors.promoCode ? 'error' : ''}
                />
                <button 
                  onClick={() => handlePromoCodeApply(promoCode)}
                  disabled={loading}
                  className="apply-button"
                >
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>

              {selectedPromo && (
                <div className="applied-offer">
                  <div className="offer-info">
                    <CheckCircle size={16} className="success-icon" />
                    <span>{selectedPromo.description}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedPromo(null)}
                    className="remove-button"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {!offersLoading && availableOffers.promoCodes.map((promo, index) => (
                <div key={index} className="promo-item">
                  <div className="promo-details">
                    <span className="promo-code">{promo.code}</span>
                    <p>{promo.description}</p>
                    <div className="promo-meta">
                      <span className="discount">{promo.discount}% off</span>
                      <span className="validity">
                        <Clock size={14} />
                        Valid till {new Date(promo.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePromoCodeApply(promo.code)}
                    disabled={loading || selectedPromo?.code === promo.code}
                    className="apply-button"
                  >
                    {selectedPromo?.code === promo.code ? 'Applied' : 'Apply'}
                  </button>
                </div>
              ))}
            </div>

            <div className="card-offers">
              <h3>
                <CreditCard size={20} />
                Card Offers
              </h3>
              {!offersLoading && availableOffers.cardOffers.map((card, index) => (
                <div key={index} className="card-offer">
                  <input
                    type="radio"
                    id={`card-${index}`}
                    name="cardOffer"
                    checked={selectedCard?.bank === card.bank}
                    onChange={() => handleCardOfferSelect(card)}
                    disabled={loading}
                  />
                  <label htmlFor={`card-${index}`}>
                    <div className="card-details">
                      <div className="card-header">
                        <h4>{card.bank} {card.type}</h4>
                        <span className="discount">{card.discount}% off</span>
                      </div>
                      <p>{card.description}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            {calculateDiscount() > 0 && (
              <div className="price-row discount">
                <span>Discount</span>
                <span className="discount-amount">-₹{calculateDiscount()}</span>
              </div>
            )}
            <div className="price-row total">
              <span>Total</span>
              <span className="total-amount">₹{calculateTotal()}</span>
            </div>
          </div>
        </div>

        <div className="delivery-section">
          <h2>
            <MapPin size={20} />
            Delivery Information
          </h2>
          <form className="delivery-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={2} className="input-icon" />
                <input
                  type="email"
                  value={deliveryInfo.email}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                  placeholder="Enter your email address"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone size={2} className="input-icon" />
                <input
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setDeliveryInfo({...deliveryInfo, phone: value});
                    }
                  }}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'error' : ''}
                  maxLength="10"
                />
              </div>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Delivery Address</label>
              <input
                type="text"
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                placeholder="Street address, House number"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={deliveryInfo.city}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                  placeholder="City"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={deliveryInfo.state}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, state: e.target.value})}
                  placeholder="State"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label>PIN Code</label>
                <input
                  type="text"
                  value={deliveryInfo.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setDeliveryInfo({...deliveryInfo, zipCode: value});
                    }
                  }}
                  placeholder="PIN Code"
                  className={errors.zipCode ? 'error' : ''}
                  maxLength="6"
                />
                {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Special Instructions (Optional)</label>
              <textarea
                value={deliveryInfo.specialInstructions}
                onChange={(e) => setDeliveryInfo({...deliveryInfo, specialInstructions: e.target.value})}
                placeholder="Any special delivery instructions?"
                rows="3"
              />
            </div>
          </form>
        </div>

        <div className="payment-section">
          <h2>
            <Wallet size={20} />
            Payment Method
          </h2>
          
          <div className="payment-options">
  <div className="payment-option">
    <input
      type="radio"
      id="cod"
      name="paymentMethod"
      value="cod"  // Changed from 'COD' to 'cod'
      checked={paymentMethod === 'cod'}
      onChange={(e) => handlePaymentMethodChange(e.target.value)}
    />
    <label htmlFor="cod" className="payment-label">
      <DollarSign size={20} />
      <div className="payment-info">
        <span>Cash on Delivery</span>
        <small>Pay when you receive your order</small>
      </div>
    </label>
  </div>

  <div className="payment-option">
    <input
      type="radio"
      id="card"
      name="paymentMethod"
      value="card"  // Changed from 'CARD' to 'card'
      checked={paymentMethod === 'card'}
      onChange={(e) => handlePaymentMethodChange(e.target.value)}
    />
    <label htmlFor="card" className="payment-label">
      <CreditCard size={20} />
      <div className="payment-info">
        <span>Credit/Debit Card</span>
        <small>Pay securely with your card</small>
      </div>
    </label>
  </div>

  <div className="payment-option">
    <input
      type="radio"
      id="upi"
      name="paymentMethod"
      value="upi"  // Changed from 'UPI' to 'upi'
      checked={paymentMethod === 'upi'}
      onChange={(e) => handlePaymentMethodChange(e.target.value)}
    />
    <label htmlFor="upi" className="payment-label">
      <Smartphone size={20} />
      <div className="payment-info">
        <span>UPI</span>
        <small>Pay using UPI ID</small>
      </div>
    </label>
  </div>
</div>

          {errors.paymentMethod && (
            <span className="error-message">{errors.paymentMethod}</span>
          )}

          {showUpiInput && (
            <div className="upi-section">
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="Enter your UPI ID (e.g., name@upi)"
                  className={errors.upiId ? 'error' : ''}
                />
                {errors.upiId && <span className="error-message">{errors.upiId}</span>}
              </div>
            </div>
          )}

          {showCardInput && (
            <div className="card-details-section">
              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  value={cardDetails.cardHolderName}
                  onChange={(e) => setCardDetails({...cardDetails, cardHolderName: e.target.value})}
                  placeholder="Name on card"
                  className={errors.cardHolderName ? 'error' : ''}
                />
                {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const formattedValue = formatCardNumber(e.target.value);
                    if (formattedValue.replace(/\s/g, '').length <= 16) {
                      setCardDetails({...cardDetails, cardNumber: formattedValue});
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? 'error' : ''}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    value={cardDetails.expiryDate}
                    onChange={(e) => {
                      const formattedValue = formatExpiryDate(e.target.value);
                      if (formattedValue.length <= 5) {
                        setCardDetails({
                          ...cardDetails, 
                          expiryDate: formattedValue
                        });
                        }
                      }}
                      placeholder="MM/YY"
                      className={errors.expiryDate ? 'error' : ''}
                      maxLength="5"
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setCardDetails({...cardDetails, cvv: value});
                        }
                      }}
                      placeholder="123"
                      className={errors.cvv ? 'error' : ''}
                      maxLength="3"
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`place-order-section ${showPriceSummary ? 'floating' : ''}`}>
            <div className="order-total">
              <div className="total-details">
                <span>Total Amount:</span>
                <span className="amount">₹{calculateTotal()}</span>
                {calculateDiscount() > 0 && (
                  <span className="savings">You save: ₹{calculateDiscount()}</span>
                )}
              </div>
              <button
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={loading || orderItems.length === 0}
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Processing...
                  </span>
                ) : (
                  <>
                    {paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Place Order'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Shows when order is placed successfully */}
      {showOrderSuccess && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-content success-content">
              <CheckCircle size={48} className="success-icon" color="#4CAF50" />
              <h2>Order Placed Successfully!</h2>
              <p>Thank you for shopping with us.</p>
              <p>Your order number is: {orderNumber}</p>
              {paymentMethod === 'cod' && (
                <p className="cod-note">
                  <DollarSign size={20} />
                  Please keep cash ready at the time of delivery
                </p>
              )}
              {paymentMethod === 'upi' && (
                <p className="payment-note">
                  <Smartphone size={20} />
                  Payment will be processed through UPI
                </p>
              )}
              {paymentMethod === 'card' && (
                <p className="payment-note">
                  <CreditCard size={20} />
                  Payment will be processed through your card
                </p>
              )}
              <div className="modal-actions">
                <button 
                  className="view-order-button"
                  onClick={() => router.push('/orders')}
                >
                  View Order Details
                </button>
                <button 
                  className="continue-shopping-button"
                  onClick={() => router.push('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div id="toast-container" className="toast-container"></div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing your order...</p>
        </div>
      )}
    </div>
  );
}

