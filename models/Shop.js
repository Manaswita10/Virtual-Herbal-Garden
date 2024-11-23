import mongoose from 'mongoose';

// Define Promo Code Schema
const PromoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    // Making description optional since some entries don't have it
    required: false,
  },
  validUntil: {
    type: Date,
    required: true,
  },
});

// Define Card Offer Schema
const CardOfferSchema = new mongoose.Schema({
  bank: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Credit Card', 'Debit Card'],
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    // Making description optional since some entries don't have it
    required: false,
  },
});

// Define Offers Schema
const OffersSchema = new mongoose.Schema({
  promoCodes: [PromoCodeSchema],
  cardOffers: [CardOfferSchema],
});

// Define Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    modelBasePath: String,
    galary: [String],
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  sizes: [{
    option: {
      type: String,
      // Removing enum restriction to allow all size options
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    dimensions: {
      type: String,
      // Making dimensions optional since not all products have it
      required: false,
    },
  }],
  offers: OffersSchema,
  careInfo: {
    wateringSchedule: String,
    sunlight: String,
    soilType: String,
    fertilizer: String,
    temperature: String,
    humidity: String,
    commonIssues: [String],
    tips: [String],
    // Adding additional fields found in your data
    storage: String,
    usage: String,
    dosage: String
  },
});

// Define Shop Schema
const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    distance: {
      type: String,
      required: true,
    },
    products: [ProductSchema],
    openingHours: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Shop || mongoose.model('Shop', ShopSchema);