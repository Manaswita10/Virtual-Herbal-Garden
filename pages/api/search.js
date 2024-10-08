import { MongoClient } from 'mongodb';
import { getPresignedUrls } from '/lib/s3.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB);

    try {
      const searchRegex = new RegExp(q, 'i');

      const plants = await db.collection('plants').find({
        $or: [
          { name: searchRegex },
          { botanicalName: searchRegex },
          { commonNames: searchRegex },
          { habitat: searchRegex },
          { continent: searchRegex },
          { medicinalUses: searchRegex },
        ]
      }).toArray();

      // Generate pre-signed URLs for each plant's images
      const plantsWithUrls = await Promise.all(plants.map(async (plant) => {
        if (plant.modelBasePath) {
          try {
            const urls = await getPresignedUrls(plant.modelBasePath);
            const imageUrl = Object.entries(urls).find(([key, value]) => {
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
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}