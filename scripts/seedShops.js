import mongoose from 'mongoose';
import Shop from '../models/Shop.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arshaviroy:motapodu2003@ayushplantsdb.mqaql.mongodb.net/';

const shops = [
  {
    name: "Ayurveda Shop 1",
    address: "123 Green Street, Nature Valley, NY 10001",
    phone: "+1 (555) 123-4567",
    rating: 4.5,
    distance: "0.5 km",
    openingHours: "Mon-Sat: 9:00 AM - 8:00 PM",
    description: "Your one-stop shop for all natural and medicinal plants",
    products: [
      {
        name: "Aglaonema",
        price: 45,
        description: "The Aglaonema is a highly decorative plant with several interesting varieties. It is an ideal plant for indoor use as it is very hardy.",
        image: "/images/plants/aglaonema.jpg",
        category: "Indoor",
        stock: 15,
        size: "Small"
      },
      {
        name: "Tiger Piran",
        price: 35,
        description: "The Tiger Piran is known for its distinctive striped leaves and air-purifying qualities.",
        image: "/images/plants/tiger-piran.jpg",
        category: "Indoor",
        stock: 20,
        size: "Medium"
      },
      // Add more products...
    ]
  },
  {
    name: "Herbal Haven",
    address: "456 Garden Avenue, Eco Park, NY 10002",
    phone: "+1 (555) 234-5678",
    rating: 4.8,
    distance: "1.2 km",
    openingHours: "Mon-Sun: 8:00 AM - 9:00 PM",
    description: "Specializing in rare and exotic medicinal plants",
    products: [
      {
        name: "Snake Plant",
        price: 30,
        description: "The Snake Plant is one of the most popular and hardy houseplants.",
        image: "/images/plants/snake-plant.jpg",
        category: "Indoor",
        stock: 25,
        size: "Medium"
      },
      // Add more products...
    ]
  },
  {
    name: "Nature's Cure",
    address: "789 Healing Road, Wellness District, NY 10003",
    phone: "+1 (555) 345-6789",
    rating: 4.3,
    distance: "2.0 km",
    openingHours: "Mon-Fri: 10:00 AM - 7:00 PM",
    description: "Traditional healing plants and modern wellness solutions",
    products: [
      {
        name: "Aloe Vera",
        price: 25,
        description: "Aloe Vera is well known for its healing properties and easy care requirements.",
        image: "/assets/plant-icon.png",
        category: "Medicinal",
        stock: 30,
        size: "Small"
      },
      // Add more products...
    ]
  }
];

async function seedShops() {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');
    
    // Clear existing shops
    await Shop.deleteMany({});
    
    // Insert new shops
    await Shop.insertMany(shops);
    
    console.log('Shops seeded successfully');
  } catch (error) {
    console.error('Error seeding shops:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedShops().catch(console.error);