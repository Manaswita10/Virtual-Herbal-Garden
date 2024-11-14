import { MongoClient } from 'mongodb';
import { getPresignedUrls } from '/lib/s3.js';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  let client;
  try {
    client = await connectToDatabase();
    const db = client.db(process.env.MONGODB_DB);

    const searchRegex = new RegExp(q, 'i');
    const plants = await db.collection('plants')
      .find({
        $or: [
          { name: searchRegex },
          { botanicalName: searchRegex },
          { commonNames: searchRegex },
          { habitat: searchRegex },
          { continent: searchRegex },
          { medicinalUses: searchRegex },
        ]
      })
      .toArray();

    const plantsWithUrls = await Promise.all(plants.map(async (plant) => {
      if (plant.modelBasePath) {
        try {
          const urls = await getPresignedUrls(plant.modelBasePath);
          const imageUrl = Object.entries(urls).find(([key]) => {
            const lowerKey = key.toLowerCase();
            return (lowerKey.endsWith('.jpg') || lowerKey.endsWith('.png') || lowerKey.endsWith('.jpeg')) &&
                   !lowerKey.includes('/textures/') &&
                   lowerKey.split('/').length === 2;
          });

          if (imageUrl) {
            return { ...plant, imageUrl: imageUrl[1] };
          }
        } catch (error) {
          console.error(`Error generating pre-signed URLs for ${plant.name}:`, error);
        }
      }
      return plant;
    }));

    res.status(200).json(plantsWithUrls);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).json({ error: 'An error occurred while searching', details: error.message });
  }
}