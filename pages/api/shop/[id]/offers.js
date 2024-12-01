// pages/api/shop/[id]/offers.js

import mongoose from 'mongoose';
import dbConnect from '../../../../lib/mongodb';
import Shop from '../../../../models/Shop';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Log incoming parameters
    console.log('Query params:', req.query);
    const { id: shopId, productId } = req.query;

    if (!shopId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Shop ID and Product ID are required'
      });
    }

    // Verify IDs are valid MongoDB ObjectIds
    if (!mongoose.isValidObjectId(shopId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Shop ID or Product ID format'
      });
    }

    // Find shop
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Find specific product
    const product = shop.products.id(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get offers
    const offers = {
      promoCodes: product.offers?.promoCodes || [],
      cardOffers: product.offers?.cardOffers || []
    };

    console.log('Found offers:', offers);

    return res.status(200).json({
      success: true,
      data: offers
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}