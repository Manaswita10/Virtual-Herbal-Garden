import { MongoClient, ObjectId } from 'mongodb';
import { verifyToken } from '/utils/auth.js';

export default async function handler(req, res) {
  const { plantId } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const userId = verifyToken(token).id;

    if (req.method === 'GET') {
      const note = await db.collection('notes').findOne({
        userId: new ObjectId(userId),
        plantId: new ObjectId(plantId)
      });

      res.status(200).json({ notes: note ? note.notes : '' });
    } else if (req.method === 'POST') {
      const { notes } = req.body;

      if (!notes) {
        return res.status(400).json({ message: 'Notes content is required' });
      }

      const result = await db.collection('notes').updateOne(
        { userId: new ObjectId(userId), plantId: new ObjectId(plantId) },
        { $set: { notes, updatedAt: new Date() } },
        { upsert: true }
      );

      res.status(200).json({ message: 'Notes updated successfully', notes });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Notes operation error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  } finally {
    await client.close();
  }
}