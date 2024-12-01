// pages/api/validate-promo.js

import dbConnect from '../../lib/mongodb';
import Shop from '../../models/Shop';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const { code, productId, shopId } = req.body;

    const shop = await Shop.findById(shopId);
    const product = shop.products.id(productId);

    // Find the promo code
    const promoCode = product.offers.promoCodes.find(
      promo => promo.code === code && new Date(promo.validUntil) > new Date()
    );

    if (!promoCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired promo code'
      });
    }

    res.status(200).json({
      success: true,
      data: promoCode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating promo code'
    });
  }
}