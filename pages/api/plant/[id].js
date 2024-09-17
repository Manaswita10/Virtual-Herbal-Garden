import { MongoClient, ObjectId } from 'mongodb';
import { getPresignedUrls } from '/lib/s3.js';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    if (req.method === 'GET') {
      const { id } = req.query;

      const plant = await db.collection('plants').findOne({ _id: new ObjectId(id) });

      if (plant) {
        try {
          if (plant.modelBasePath) {
            const modelUrls = await getPresignedUrls(plant.modelBasePath);
            plant.modelUrls = modelUrls;
          }
        } catch (error) {
          console.error('Error fetching pre-signed URLs:', error);
          plant.modelUrls = null;
        }

        res.status(200).json({ data: plant });
      } else {
        res.status(404).json({ message: 'Plant not found' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in plant API:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    await client.close();
  }
}