import { MongoClient, ObjectId } from 'mongodb';

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

    const shop = await db.collection('shops').findOne({
      _id: new ObjectId(id)
    });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json({ data: shop });
  } catch (error) {
    console.error('Error in shop API:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}