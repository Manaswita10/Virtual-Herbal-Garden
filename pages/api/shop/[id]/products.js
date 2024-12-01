// pages/api/shop/[id]/products.js

import { MongoClient, ObjectId } from 'mongodb';

let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedDb, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { db } = await connectToDatabase();
    const { id } = req.query;

    // Find the shop and get its products
    const shop = await db.collection('shops').findOne(
      { _id: new ObjectId(id) },
      { projection: { products: 1 } }
    );

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Return the products array from the shop document
    res.status(200).json({
      success: true,
      data: shop.products || []
    });

  } catch (error) {
    console.error('Error in products API:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}