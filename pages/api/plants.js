import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  try {
    if (req.method === 'GET') {
      const { continent } = req.query;
      const query = continent ? { continent } : {};
      const plants = await db.collection('plants').find(query).toArray();
      res.status(200).json(plants);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    await client.close();
  }
}