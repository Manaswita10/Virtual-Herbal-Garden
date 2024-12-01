import dbConnect from '/lib/mongodb.js';
import Shop from '/models/Shop.js';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const shops = await Shop.find({}).lean();
        res.status(200).json(shops);
      } catch (error) {
        console.error('Error fetching shops:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}