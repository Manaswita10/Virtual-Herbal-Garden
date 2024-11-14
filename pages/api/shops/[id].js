import dbConnect from '/lib/mongodb.js';
import Shop from '/models/Shop.js';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const shop = await Shop.findById(id).lean();
        if (!shop) {
          return res.status(404).json({ success: false, message: 'Shop not found' });
        }
        res.status(200).json(shop);
      } catch (error) {
        console.error('Error fetching shop:', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}