import dbConnect from '../../lib/mongodb';
import Plant from '../../models/Plant';
import { getPresignedUrls } from '../../lib/s3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    const plants = await Plant.find({
      $or: [
        { name: searchRegex },
        { botanicalName: searchRegex },
        { commonNames: searchRegex },
        { habitat: searchRegex },
        { continent: searchRegex },
        { medicinalUses: searchRegex },
      ]
    }).lean();

    // Generate pre-signed URLs for each plant's images
    const plantsWithUrls = await Promise.all(plants.map(async (plant) => {
      if (plant.modelBasePath) {
        try {
          const urls = await getPresignedUrls(plant.modelBasePath);
          const imageUrl = Object.entries(urls).find(([key]) => {
            const lowerKey = key.toLowerCase();
            return (lowerKey.endsWith('.jpg') || 
                   lowerKey.endsWith('.png') || 
                   lowerKey.endsWith('.jpeg')) && 
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
    res.status(500).json({ 
      error: 'An error occurred while searching',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
