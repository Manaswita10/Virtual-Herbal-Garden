// pages/orders.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  Package, 
  Clock, 
  ArrowLeft,
  Truck, 
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Download,
  XCircle 
} from 'lucide-react';
import { authenticatedFetch } from '../utils/auth';
import { loadProductImages } from '../utils/imageLoader';
import Toast from '/src/components/ui/Toast/Toast';
import ConfirmDialog from '/src/components/ui/ConfirmDialogue/ConfirmDialogue';
import '/pages/styles/orders.css';

// Helper function to prepare items for image loading
const prepareItemsForImageLoading = (items) => {
  return items.map(item => ({
    ...item,
    image: {
      modelBasePath: item.image
    }
  }));
};

// DeliverySection Component
const DeliverySection = ({ deliveryInfo }) => {
  const {
    address = '',
    city = '',
    state = '',
    zipCode = '',
    phone = '',
    email = ''
  } = deliveryInfo || {};

  return (
    <div className="details-section">
      <h3>Delivery Information</h3>
      <div className="delivery-details">
        <div className="detail-row">
          <MapPin className="w-5 h-5" />
          <div className="address-details">
            {address && <div className="address-line">{address}</div>}
            {(city || state) && (
              <div className="address-line">
                {[city, state].filter(Boolean).join(', ')}
              </div>
            )}
            {zipCode && <div className="address-line">{zipCode}</div>}
          </div>
        </div>
        {phone && (
          <div className="detail-row">
            <Phone className="w-5 h-5" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="detail-row">
            <Mail className="w-5 h-5" />
            <span>{email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// PaymentDetails Component
const PaymentDetails = ({ payment, pricing }) => {
  return (
    <div className="details-section">
      <h3>Payment Details</h3>
      <div className="payment-details">
        <div className="detail-row">
          <CreditCard className="w-5 h-5" />
          <span>
            {payment?.method?.toUpperCase() || 'N/A'}
            {payment?.cardDetails?.last4Digits && 
              ` - XXXX ${payment.cardDetails.last4Digits}`}
          </span>
        </div>
        <div className="price-breakdown">
          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{pricing?.subtotal || 0}</span>
          </div>
          {pricing?.discount > 0 && (
            <div className="price-row discount">
              <span>Discount</span>
              <span>-₹{pricing.discount}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Total</span>
            <span>₹{pricing?.total || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// OrderItems Component with S3 image loading
const OrderItems = ({ items = [] }) => {
  const [loadedItems, setLoadedItems] = useState(items);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const preparedItems = prepareItemsForImageLoading(items);
        const itemsWithImages = await loadProductImages(preparedItems);
        setLoadedItems(itemsWithImages);
      } catch (error) {
        console.error('Error loading order item images:', error);
        setLoadedItems(items);
      }
    };

    loadImages();
  }, [items]);

  return (
    <div className="details-section">
      <h3>Items Ordered</h3>
      <div className="ordered-items">
        {loadedItems.map((item, index) => (
          <div key={index} className="ordered-item">
            <div className="item-image">
              <img
                src={item.imageUrl || '/assets/plant-placeholder.jpg'}
                alt={item.name || 'Product'}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>
            <div className="item-details">
              <h4>{item.name}</h4>
              <div className="item-meta">
                <span>Qty: {item.quantity}</span>
                <span>₹{item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions for status color and icon
const getStatusColor = (status) => {
  const statusColors = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    processing: 'status-processing',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  };
  return statusColors[status?.toLowerCase()] || 'status-pending';
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'confirmed':
      return <CheckCircle className="w-4 h-4" />;
    case 'processing':
      return <Package className="w-4 h-4" />;
    case 'shipped':
      return <Truck className="w-4 h-4" />;
    case 'delivered':
      return <CheckCircle className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

// OrderCard Component
const OrderCard = ({ 
  order, 
  expandedOrder, 
  toggleOrderExpansion, 
  handleDownloadInvoice,
  handleCancelOrder 
}) => {
  const [loadedItems, setLoadedItems] = useState(order.items || []);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const preparedItems = prepareItemsForImageLoading(order.items || []);
        const itemsWithImages = await loadProductImages(preparedItems);
        setLoadedItems(itemsWithImages);
      } catch (error) {
        console.error('Error loading order preview images:', error);
        setLoadedItems(order.items || []);
      }
    };

    loadImages();
  }, [order.items]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status?.toLowerCase());

  const onCancelClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    setShowConfirmDialog(false);
    setIsCancelling(true);
    try {
      await handleCancelOrder(order._id);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-basic-info">
          <div className="order-number">
            Order #{order.orderNumber || 'N/A'}
          </div>
          <div className="order-date">
            {formatDate(order.createdAt)}
          </div>
        </div>
        <div className="order-status-payment">
          <div className={`status-badge ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span>
              {(order.status || 'pending').charAt(0).toUpperCase() + 
               (order.status || 'pending').slice(1)}
            </span>
          </div>
          <div className="total-amount">
            ₹{order.pricing?.total || 0}
          </div>
        </div>
      </div>

      <div className="order-items-preview">
        {loadedItems.slice(0, 2).map((item, index) => (
          <div key={index} className="preview-item">
            <div className="item-image">
              <img
                src={item.imageUrl || '/assets/plant-placeholder.jpg'}
                alt={item.name || 'Product'}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
            </div>
          </div>
        ))}
        {loadedItems.length > 2 && (
          <div className="more-items">
            +{loadedItems.length - 2} more items
          </div>
        )}
      </div>

      <div className="order-actions">
        <button 
          className="expand-button"
          onClick={() => toggleOrderExpansion(order._id)}
        >
          {expandedOrder === order._id ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="w-5 h-5" />
            </>
          ) : (
            <>
              <span>Show Details</span>
              <ChevronDown className="w-5 h-5" />
            </>
          )}
        </button>

        {canCancel && (
          <button 
            className="cancel-button"
            onClick={onCancelClick}
            disabled={isCancelling}
          >
            <XCircle className="w-5 h-5" />
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {expandedOrder === order._id && (
        <div className="order-details">
          <OrderItems items={order.items} />
          <DeliverySection deliveryInfo={order.deliveryInfo} />
          <PaymentDetails payment={order.payment} pricing={order.pricing} />

          {order.status === 'delivered' && (
            <button 
              className="invoice-button"
              onClick={() => handleDownloadInvoice(order._id)}
            >
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message="Are you sure you want to cancel this order? This action cannot be undone."
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </div>
  );
};

// Main Orders Component
export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await authenticatedFetch('/api/orders/user');

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      setToast({
        show: true,
        message: 'Failed to fetch orders: ' + error.message,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await authenticatedFetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT'
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: 'cancelled' }
              : order
          )
        );
        setToast({
          show: true,
          message: 'Order cancelled successfully',
          type: 'success'
        });
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setToast({
        show: true,
        message: `Failed to cancel order: ${error.message}`,
        type: 'error'
      });
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await authenticatedFetch(`/api/orders/${orderId}/invoice`);

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setToast({
        show: true,
        message: 'Failed to download invoice: ' + error.message,
        type: 'error'
      });
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>);
  }

  if (error) {
    return (
      <div className="orders-error">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">
          <Package className="w-6 h-6" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <ShoppingCart className="w-16 h-16" />
            <h2>No Orders Yet</h2>
            <p>Looks like you haven't placed any orders yet.</p>
            <Link href="/" className="shop-now-button">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                expandedOrder={expandedOrder}
                toggleOrderExpansion={toggleOrderExpansion}
                handleDownloadInvoice={handleDownloadInvoice}
                handleCancelOrder={handleCancelOrder}
              />
            ))}
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
}