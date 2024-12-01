import { MongoClient } from 'mongodb';
import { getPresignedUrls } from '/lib/s3.js';

// Cache database connection
let cachedDb = null;
let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
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
    
    const { continent } = req.query;
    const query = continent ? { continent } : {};
    
    const plants = await db.collection('plants')
      .find(query)
      .toArray();

    // Ensure we have unique plants
    const uniquePlants = Array.from(
      new Map(plants.map(plant => [plant._id.toString(), plant])).values()
    );

    res.status(200).json(uniquePlants);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}