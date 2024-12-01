import mongoose from 'mongoose';
import Shop from '../models/Shop.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arshaviroy:Manapodu1910@ayushplantsdb.mqaql.mongodb.net/test?retryWrites=true&w=majority&appName=AYUSHPlantsDB';

const shops = [
  {
    "name": "Ayurveda Essentials",
    "address": "Rahara,Khardah, West Bengal, Kolkata-700118",
    "phone": "+91 8476208439",
    "rating": 4.5,
    "distance": "0.5 km",
    "openingHours": "Mon-Sat: 9:00 AM - 8:00 PM",
    "description": "Your one-stop shop for all natural and medicinal plants",
    "products": [
    {
      "name": "Neem powder",
      "price": 350,
      "description": "100% pure neem leaf powder, ideal for skin health and detoxification.",
      "image": {
        "modelBasePath": "Neem powder",
        "galary": ["neem_powder1.jpg", "neem_powder2.jpg"]
      },
      "category": "Medicinal",
      "stock": 100,
      "sizes": [
        { "option": "100g", "price": 350 },
        { "option": "250g", "price": 700 }
      ],
      "offers": {
        "promoCodes": [{ "code": "NEEM15", "discount": 15, "validUntil": "2024-12-31" }]
      },
      "careInfo": {
        "storage": "Keep in an airtight container away from moisture.",
        "usage": "Mix 1 tsp in water or apply as a skin mask."
      }
    },
    {
      "name": "Plant-Based Joint Support Supplement",
      "price": 600,
      "description": "Herbal supplement to support joint health, enriched with Boswellia and Turmeric.",
      "image": {
        "modelBasePath": "Plant-Based Joint Support Supplement",
        "galary": ["joint_support1.jpg", "joint_support2.jpg"]
      },
      "category": "Wellness",
      "stock": 50,
      "sizes": [
        { "option": "60 Capsules", "price": 600 },
        { "option": "120 Capsules", "price": 1100 }
      ],
      "offers": {
        "cardOffers": [{ "bank": "SBI Bank", "type": "Credit Card", "discount": 10 }]
      },
      "careInfo": {
        "dosage": "Take 1 capsule twice daily after meals.",
        "storage": "Store in a cool, dry place."
      }
    },
    {
      "name": "Plant-Based Powdered Collagen",
      "price": 850,
      "description": "Supports skin elasticity and hair growth using natural plant ingredients.",
      "image": {
        "modelBasePath": "Plant-Based Powdered Collagen",
        "galary": ["collagen_powder1.jpg", "collagen_powder2.jpg"]
      },
      "category": "Wellness",
      "stock": 70,
      "sizes": [
        { "option": "200g", "price": 850 },
        { "option": "500g", "price": 1800 }
      ],
      "offers": {
        "promoCodes": [{ "code": "COLLAGEN20", "discount": 20, "validUntil": "2024-06-30" }]
      },
      "careInfo": {
        "usage": "Add 1-2 scoops to smoothies or drinks daily.",
        "storage": "Keep in a sealed container to preserve freshness."
      }
    },
    {
      "name": "Giloy Stem Powder",
      "price": 250,
      "description": "Boosts immunity and helps combat chronic illnesses. Made from 100% natural Giloy.",
      "image": {
        "modelBasePath": "Giloy Stem Powder",
        "galary": ["giloy_powder1.jpg", "giloy_powder2.jpg"]
      },
      "category": "Medicinal",
      "stock": 120,
      "sizes": [
        { "option": "100g", "price": 250 },
        { "option": "250g", "price": 500 }
      ],
      "offers": {
        "promoCodes": [{ "code": "GILOY10", "discount": 10, "validUntil": "2024-12-31" }]
      },
      "careInfo": {
        "usage": "Mix 1 tsp with water or juice daily.",
        "storage": "Store in a cool, dry place away from sunlight."
      }
    },
    {
      "name": "Spirulina Powder",
      "price": 400,
      "description": "A superfood rich in protein, vitamins, and antioxidants. Perfect for energy and detox.",
      "image": {
        "modelBasePath": "Spirulina Powder",
        "galary": ["spirulina_powder1.jpg", "spirulina_powder2.jpg"]
      },
      "category": "Superfood",
      "stock": 80,
      "sizes": [
        { "option": "100g", "price": 400 },
        { "option": "200g", "price": 750 }
      ],
      "offers": {
        "promoCodes": [{ "code": "SPIRU20", "discount": 20, "validUntil": "2024-08-31" }]
      },
      "careInfo": {
        "usage": "Add 1 tsp to smoothies or meals.",
        "storage": "Keep sealed and refrigerate after opening."
      }
    },
    {
      "name": "Moringa Capsules",
      "price": 450,
      "description": "Packed with nutrients to boost immunity, energy, and overall health.",
      "image": {
        "modelBasePath": "Moringa Capsules",
        "galary": ["moringa_capsules1.jpg", "moringa_capsules2.jpg"]
      },
      "category": "Wellness",
      "stock": 60,
      "sizes": [
        { "option": "60 Capsules", "price": 450 },
        { "option": "120 Capsules", "price": 830 }
      ],
      "offers": {
        "cardOffers": [{ "bank": "Axis Bank", "type": "Debit Card", "discount": 12 }]
      },
      "careInfo": {
        "dosage": "Take 1 capsule twice daily after meals.",
        "storage": "Store in a cool, dry place."
      }
    },
    {
      "name": "Jamun Seed Powder Capsules",
      "price": 350,
      "description": "Helps regulate blood sugar levels and improves digestion. Made from 100% pure Jamun seeds.",
      "image": {
        "modelBasePath": "Jamun Seed Powder Capsules",
        "galary": ["jamun_capsules1.jpg", "jamun_capsules2.jpg"]
      },
      "category": "Medicinal",
      "stock": 75,
      "sizes": [
        { "option": "60 Capsules", "price": 350 },
        { "option": "120 Capsules", "price": 650 }
      ],
      "offers": {
        "promoCodes": [{ "code": "JAMUN15", "discount": 15, "validUntil": "2024-12-31" }]
      },
      "careInfo": {
        "dosage": "Take 1 capsule twice daily before meals.",
        "storage": "Keep away from moisture and heat."
      }
    },
    {
      "name": "Ayurvedic Fertility Tablets",
      "price": 750,
      "description": "Herbal tablets formulated to enhance fertility and reproductive health naturally.",
      "image": {
        "modelBasePath": "Ayurvedic Fertility Tablets",
        "galary": ["fertility_tablets1.jpg", "fertility_tablets2.jpg"]
      },
      "category": "Wellness",
      "stock": 45,
      "sizes": [
        { "option": "60 Tablets", "price": 750 },
        { "option": "120 Tablets", "price": 1400 }
      ],
      "offers": {
        "promoCodes": [{ "code": "FERTILITY10", "discount": 10, "validUntil": "2024-12-31" }]
      },
      "careInfo": {
        "dosage": "Take 1 tablet daily after meals.",
        "storage": "Store in a cool, dry place away from sunlight."
      }
    }
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
        name: "Amla",
        price: 190,
        description: "The Aglaonema is a highly decorative plant with several interesting varieties. It is an ideal plant for indoor use as it is very hardy.",
        image: {
          modelBasePath: "Amla",
          galary: ["amla1.jpg","amla2.jpg","amla3.jpg","amla4.jpg"]
        },
        category: "Indoor",
        stock: 15,
        sizes: [
          {
            option: "Small",
            price: 190,
            dimensions: "15-20 cm"
          },
          {
            option: "Medium",
            price: 320,
            dimensions: "25-30 cm"
          }
        ],
        offers: {
          promoCodes: [
            {
              code: "AMLA10",
              discount: 10,
              description: "Get 10% off on Amla plants",
              validUntil: new Date("2024-12-31")
            },
            {
              code: "FIRSTBUY",
              discount: 15,
              description: "15% off on your first purchase",
              validUntil: new Date("2024-12-31")
            }
          ],
          cardOffers: [
            {
              bank: "HDFC Bank",
              type: "Credit Card",
              discount: 15,
              description: "15% instant discount on HDFC credit cards"
            },
            {
              bank: "SBI Bank",
              type: "Debit Card",
              discount: 10,
              description: "10% instant discount on SBI debit cards"
            }
          ]
        },
        careInfo: {
          wateringSchedule: "Water once every 3-4 days",
          sunlight: "Partial shade to moderate sunlight",
          soilType: "Well-draining potting soil",
          fertilizer: "Apply organic fertilizer monthly",
          temperature: "20-30°C",
          humidity: "Medium to high",
          commonIssues: [
            "Yellowing leaves may indicate overwatering",
            "Brown leaf tips might mean low humidity"
          ],
          tips: [
            "Keep soil moist but not waterlogged",
            "Mist leaves regularly for better growth"
          ]
        }
      },
      {
        name: "Tulsi",
        price: 199,
        description: "The Tiger Piran is known for its distinctive striped leaves and air-purifying qualities.",
        image: {
          modelBasePath: "Tulsi",
          galary: []
        },
        category: "Indoor",
        stock: 20,
        sizes: [
          {
            option: "Small",
            price: 199,
            dimensions: "10-15 cm"
          },
          {
            option: "Medium",
            price: 358,
            dimensions: "20-25 cm"
          }
        ],
        offers: {
          promoCodes: [
            {
              code: "TULSI15",
              discount: 15,
              description: "15% discount on Tulsi plants",
              validUntil: new Date("2024-12-31")
            },
            {
              code: "SUMMER20",
              discount: 20,
              description: "Summer special - 20% off",
              validUntil: new Date("2024-06-30")
            }
          ],
          cardOffers: [
            {
              bank: "Axis Bank",
              type: "Credit Card",
              discount: 12,
              description: "12% instant discount on Axis credit cards"
            },
            {
              bank: "ICICI Bank",
              type: "Debit Card",
              discount: 8,
              description: "8% instant discount on ICICI debit cards"
            }
          ]
        },
        careInfo: {
          wateringSchedule: "Water daily",
          sunlight: "Full sunlight",
          soilType: "Rich, well-draining soil",
          fertilizer: "Organic compost monthly",
          temperature: "20-35°C",
          humidity: "Moderate",
          commonIssues: [
            "Black spots might indicate fungal infection",
            "Drooping leaves suggest underwatering"
          ],
          tips: [
            "Prune regularly for bushier growth",
            "Place in morning sunlight for best results"
          ]
        }
      },
      {
        name: "Neem",
        price: 155,
        description: "The Snake Plant is one of the most popular and hardy houseplants.",
        image: {
          modelBasePath: "Neem",
          galary: ["neem1.jpg","neem2.jpg","neem3.jpg","neem4.jpg"]
        },
        category: "Indoor",
        stock: 25,
        sizes: [
          {
            option: "Small",
            price: 155,
            dimensions: "20-25 cm"
          },
          {
            option: "Medium",
            price: 327,
            dimensions: "30-35 cm"
          }
        ],
        offers: {
          promoCodes: [
            {
              code: "NEEM20",
              discount: 20,
              description: "Get 20% off on Neem plants",
              validUntil: new Date("2024-12-31")
            },
            {
              code: "WELCOME25",
              discount: 25,
              description: "Welcome offer - 25% off",
              validUntil: new Date("2024-12-31")
            }
          ],
          cardOffers: [
            {
              bank: "Kotak Bank",
              type: "Credit Card",
              discount: 15,
              description: "15% instant discount on Kotak credit cards"
            },
            {
              bank: "Yes Bank",
              type: "Debit Card",
              discount: 10,
              description: "10% instant discount on Yes Bank debit cards"
            }
          ]
        },
        careInfo: {
          wateringSchedule: "Water twice a week",
          sunlight: "Full sun to partial shade",
          soilType: "Well-draining, fertile soil",
          fertilizer: "Balanced NPK fertilizer quarterly",
          temperature: "20-40°C",
          humidity: "Low to moderate",
          commonIssues: [
            "Yellow leaves might indicate overwatering",
            "Pest infestation common in humid conditions"
          ],
          tips: [
            "Prune regularly to maintain shape",
            "Apply neem oil to prevent pest infestation"
          ]
        }
      }
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
        image: {
          modelBasePath: "Aloe Vera",
          galary: ["aloevera1.png", "aloevera2.png", "aloevera3.png"]
        },
        category: "Medicinal",
        stock: 30,
        sizes: [
          {
            option: "Small",
            price: 25,
            dimensions: "15-20 cm"
          },
          {
            option: "Medium",
            price: 40,
            dimensions: "25-30 cm"
          }
        ],
        offers: {
          promoCodes: [
            {
              code: "ALOE25",
              discount: 25,
              description: "25% off on Aloe Vera plants",
              validUntil: new Date("2024-12-31")
            },
            {
              code: "SPECIAL30",
              discount: 30,
              description: "Special discount - 30% off",
              validUntil: new Date("2024-09-30")
            }
          ],
          cardOffers: [
            {
              bank: "HDFC Bank",
              type: "Credit Card",
              discount: 20,
              description: "20% instant discount on HDFC credit cards"
            },
            {
              bank: "SBI Bank",
              type: "Debit Card",
              discount: 15,
              description: "15% instant discount on SBI debit cards"
            }
          ]
        },
        careInfo: {
          wateringSchedule: "Water every 2-3 weeks",
          sunlight: "Bright, indirect sunlight",
          soilType: "Cactus or succulent mix",
          fertilizer: "Diluted fertilizer every 2-3 months",
          temperature: "15-35°C",
          humidity: "Low",
          commonIssues: [
            "Brown spots indicate sunburn",
            "Soft, mushy leaves suggest overwatering"
          ],
          tips: [
            "Allow soil to dry completely between waterings",
            "Protect from direct afternoon sun"
          ]
        }
      },
      {
        name: "Ashwagandha",
        price: 40,
        description: "Ashwagandha is an adaptogenic herb known for reducing stress and boosting energy.",
        image: {
          modelBasePath: "Ashwagandha",
          galary: ["ashwagandha1.jpg", "ashwagandha2.jpg","ashwagandha3.jpg","ashwagandha4.jpg"]
        },
        category: "Medicinal",
        stock: 25,
        sizes: [
          { option: "Small", price: 40, dimensions: "15-20 cm" },
          { option: "Medium", price: 60, dimensions: "25-30 cm" }
        ],
        offers: {
          promoCodes: [
            { code: "ASHWA20", discount: 20, description: "20% off on Ashwagandha plants", validUntil: new Date("2024-12-31") }
          ],
          cardOffers: []
        },
        careInfo: {
          wateringSchedule: "Water weekly",
          sunlight: "Full sun",
          soilType: "Well-draining soil",
          temperature: "20-30°C",
          tips: ["Plant in warm, sunny spots"]
        }
      },
      {
        name: "Giloy",
        price: 35,
        description: "Giloy is a powerful herb that boosts immunity and detoxifies the body.",
        image: {
          modelBasePath: "Giloy",
          galary: ["giloy1.jpg", "giloy2.jpg","giloy3.jpg","giloy4.jpg"]
        },
        category: "Medicinal",
        stock: 30,
        sizes: [
          { option: "Small", price: 35, dimensions: "15-20 cm" },
          { option: "Medium", price: 50, dimensions: "25-30 cm" }
        ],
        offers: {
          promoCodes: [
            { code: "GILOY15", discount: 15, description: "15% off on Giloy plants", validUntil: new Date("2024-12-31") }
          ],
          cardOffers: []
        },
        careInfo: {
          wateringSchedule: "Water every 2-3 days",
          sunlight: "Partial sunlight",
          soilType: "Fertile soil",
          temperature: "15-30°C",
          tips: ["Supports growth with climbing structures"]
        }
      },
      {
        name: "Huang Qi (Astragalus)",
        price: 50,
        description: "Huang Qi is an ancient Chinese herb used for boosting immunity and overall vitality.",
        image: {
          modelBasePath: "Huang Qi",
          galary: ["huangqi1.jpg","huanqi2.jpg","huangqi3.jpg","huangqi4.jpg"]
        },
        category: "Medicinal",
        stock: 20,
        sizes: [
          { option: "Small", price: 50, dimensions: "10-15 cm" },
          { option: "Medium", price: 70, dimensions: "20-25 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Water weekly",
          sunlight: "Full sun to partial shade",
          soilType: "Well-drained soil",
          temperature: "18-25°C",
          tips: ["Ideal for traditional medicinal gardens"]
        }
      },
      {
        name: "Tongkat Ali",
        price: 80,
        description: "Tongkat Ali is a renowned herb known for improving stamina and male health.",
        image: {
          modelBasePath: "Tongkat Ali",
          galary: ["tongkatali1.jpg","tongkatali2.jpg","tongkatali3.jpg","tongkatali4.jpg"]
        },
        category: "Medicinal",
        stock: 10,
        sizes: [
          { option: "Small", price: 80, dimensions: "15-20 cm" },
          { option: "Medium", price: 120, dimensions: "25-30 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Water regularly",
          sunlight: "Partial sunlight",
          soilType: "Moist soil",
          temperature: "20-35°C",
          tips: ["Grows well in tropical climates"]
        }
      },
      {
        name: "Toothache Plant (Acmella Oleracea)",
        price: 25,
        description: "The Toothache Plant is used for pain relief and has unique medicinal properties.",
        image: {
          modelBasePath: "Toothache Plant",
          galary: ["toothacheplant1.jpg","toothacheplant2.jpg","toothacheplant3.jpg","toothacheplant4.jpg"]
        },
        category: "Medicinal",
        stock: 15,
        sizes: [
          { option: "Small", price: 25, dimensions: "10-15 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Keep soil moist",
          sunlight: "Full sunlight",
          soilType: "Loamy soil",
          temperature: "20-30°C",
          tips: ["Pinch back flowers to encourage growth"]
        }
      },
      {
        name: "Thai Basil",
        price: 20,
        description: "Thai Basil is a fragrant herb commonly used in Asian cuisines.",
        image: {
          modelBasePath: "Thai Basil",
          galary: ["thaibasil1.jpg","thaibasil2.jpg","thaibasil3.jpg","thaibasil4.jpg"]
        },
        category: "Culinary",
        stock: 40,
        sizes: [
          { option: "Small", price: 20, dimensions: "10-15 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Water every 2 days",
          sunlight: "Full sun",
          soilType: "Rich, moist soil",
          temperature: "20-32°C",
          tips: ["Prune regularly for better yields"]
        }
      },
      {
        name: "Mint",
        price: 15,
        description: "Mint is a versatile herb with a refreshing aroma and culinary uses.",
        image: {
          modelBasePath: "Mint",
          galary: ["mint1.jpg", "mint2.jpg","mint3.jpg","mint4.jpg"]
        },
        category: "Culinary",
        stock: 50,
        sizes: [
          { option: "Small", price: 15, dimensions: "10-15 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Water daily",
          sunlight: "Partial sunlight",
          soilType: "Moist, well-draining soil",
          temperature: "15-30°C",
          tips: ["Grows best in containers to control spreading"]
        }
      },
      {
        name: "Ginseng",
        price: 100,
        description: "Ginseng is a prized medicinal herb for energy and immunity enhancement.",
        image: {
          modelBasePath: "Ginseng",
          galary: ["ginseng1.jpg","ginseng2.jpg","ginseng3.jpg","ginseng4.jpg"]
        },
        category: "Medicinal",
        stock: 10,
        sizes: [
          { option: "Small", price: 100, dimensions: "15-20 cm" }
        ],
        offers: {},
        careInfo: {
          wateringSchedule: "Water weekly",
          sunlight: "Partial shade",
          soilType: "Loamy, well-draining soil",
          temperature: "10-20°C",
          tips: ["Requires patience as it grows slowly"]
        }
      },
      {
        name: "Brahmi",
        price: 35,
        description: "Brahmi is a powerful medicinal herb known for enhancing memory and cognitive function.",
        image: {
          modelBasePath: "Brahmi",
          galary: ["brahmi1.jpg","brahmi2.jpg","brahmi3.jpg","brahmi4.jpg"]
        },
        category: "Medicinal",
        stock: 20,
        sizes: [
          {
            option: "Small",
            price: 35,
            dimensions: "10-15 cm"
          },
          {
            option: "Medium",
            price: 55,
            dimensions: "20-25 cm"
          }
        ],
        offers: {
          promoCodes: [
            {
              code: "BRAHMI15",
              discount: 15,
              description: "15% off on Brahmi plants",
              validUntil: new Date("2024-12-31")
            },
            {
              code: "MEGA20",
              discount: 20,
              description: "Mega sale - 20% off",
              validUntil: new Date("2024-12-31")
            }
          ],
          cardOffers: [
            {
              bank: "ICICI Bank",
              type: "Credit Card",
              discount: 18,
              description: "18% instant discount on ICICI credit cards"
            },
            {
              bank: "Axis Bank",
              type: "Debit Card",
              discount: 12,
              description: "12% instant discount on Axis debit cards"
            }
          ]
        },
        careInfo: {
          wateringSchedule: "Keep soil consistently moist",
          sunlight: "Partial shade to full sun",
          soilType: "Rich, well-draining soil",
          fertilizer: "Liquid fertilizer monthly",
          temperature: "20-30°C",
          humidity: "Medium to high",
          commonIssues: [
            "Yellowing leaves indicate nutrient deficiency",
            "Wilting may suggest underwatering"
          ],
          tips: [
            "Grows well in shallow water",
            "Regular pruning promotes bushy growth"
          ]
        }
      }
    ]
  }
];

async function seedShops() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing shops
    console.log('Clearing existing shops...');
    await Shop.deleteMany({});

    // Insert new shops
    console.log('Inserting shops...');
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