import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '/utils/auth.js';

export default async function handler(req, res) {
  const { plantId } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  });

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const userId = verifyToken(token).id;

    if (req.method === 'POST') {
      const existingBookmark = await db.collection('bookmarks').findOne({
        userId: new ObjectId(userId),
        plantId: new ObjectId(plantId)
      });

      if (existingBookmark) {
        return res.status(400).json({ message: 'Bookmark already exists' });
      }

      const newBookmark = {
        userId: new ObjectId(userId),
        plantId: new ObjectId(plantId),
        createdAt: new Date()
      };

      await db.collection('bookmarks').insertOne(newBookmark);
      res.status(201).json({ message: 'Bookmark added', isBookmarked: true });

    } else if (req.method === 'DELETE') {
      const result = await db.collection('bookmarks').deleteOne({
        userId: new ObjectId(userId),
        plantId: new ObjectId(plantId)
      });

      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'Bookmark removed', isBookmarked: false });
      } else {
        res.status(404).json({ message: 'Bookmark not found' });
      }

    } else if (req.method === 'GET') {
      const bookmark = await db.collection('bookmarks').findOne({
        userId: new ObjectId(userId),
        plantId: new ObjectId(plantId)
      });

      if (bookmark) {
        const plant = await db.collection('plants').findOne(
          { _id: new ObjectId(plantId) },
          { projection: { name: 1, botanicalName: 1, commonNames: 1 } }
        );
        res.status(200).json({ isBookmarked: true, plant });
      } else {
        res.status(200).json({ isBookmarked: false });
      }

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Bookmark operation error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await client.close();
  }
}