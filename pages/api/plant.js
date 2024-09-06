import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        // Fetch a single plant by ID
        const plant = await db.collection('plants').findOne({ _id: req.query.id });
        res.status(200).json(plant);
      } else {
        // Fetch all plants
        const plants = await db.collection('plants').find().toArray();
        res.status(200).json(plants);
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await client.close();
}