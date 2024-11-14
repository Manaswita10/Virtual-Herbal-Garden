import { MongoClient, ObjectId } from 'mongodb';
import { getPresignedUrls } from '/lib/s3.js';

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
    const { id } = req.query;

    const plant = await db.collection('plants').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    if (plant.modelBasePath) {
      try {
        const modelUrls = await getPresignedUrls(plant.modelBasePath);
        plant.modelUrls = modelUrls;
      } catch (error) {
        console.error('Error fetching pre-signed URLs:', error);
        plant.modelUrls = null;
      }
    }

    res.status(200).json({ data: plant });
  } catch (error) {
    console.error('Error in plant API:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
