// pages/api/billing/get-offers.js

import { MongoClient, ObjectId } from 'mongodb';
import dbConnect from '../../../lib/mongodb';
import Shop from '../../../models/Shop';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();
    const { shopId, productId } = req.query;

    // Find the shop and specific product
    const shop = await Shop.findOne(
      { 
        _id: ObjectId(shopId), 
        'products._id': ObjectId(productId) 
      },
      { 
        'products.$': 1 
      }
    );

    if (!shop || !shop.products[0]) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = shop.products[0];

    // Get available offers
    const offers = {
      promoCodes: product.offers?.promoCodes || [],
      cardOffers: product.offers?.cardOffers || []
    };

    res.status(200).json({
      success: true,
      data: offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
}