import Shop from '/models/Shop.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Direct MongoDB connection
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect('mongodb+srv://arshaviroy:motapodu2003@ayushplantsdb.mqaql.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    }

    const { shopId, productId } = req.query;
    console.log('Query params:', { shopId, productId }); // Debug log

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(shopId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shop or product ID'
      });
    }

    // Find the shop
    const shop = await Shop.findById(shopId);
    console.log('Found shop:', shop); // Debug log

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Find the product in the shop's products array
    const product = shop.products.id(productId);
    console.log('Found product:', product); // Debug log

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Send the response
    return res.status(200).json({
      success: true,
      data: {
        product: product.toObject(),
        shop: {
          name: shop.name,
          distance: shop.distance,
          address: shop.address
        }
      }
    });

  } catch (error) {
    console.error('Error details:', error); // Debug log
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}