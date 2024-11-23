// models/Order.js
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      required: false,
      default: null
    },
    shopId: {
      type: String,
      required: false,
      default: null
    }
  }],
  deliveryInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    specialInstructions: {
      type: String,
      required: false
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cod', 'card', 'upi'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    cardDetails: {
      cardHolderName: String,
      last4Digits: String,
      bank: String,
      type: String
    },
    upiId: String
  },
  appliedOffers: {
    promoCode: {
      code: String,
      discount: Number,
      description: String,
      validUntil: Date
    },
    cardOffer: {
      bank: String,
      type: String,
      discount: Number,
      description: String
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Add a pre-save middleware to normalize payment method
OrderSchema.pre('save', function(next) {
  if (this.payment && this.payment.method) {
    this.payment.method = this.payment.method.toLowerCase();
  }
  next();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);