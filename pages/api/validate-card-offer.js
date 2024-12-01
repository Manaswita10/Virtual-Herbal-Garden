// pages/api/validate-card-offer.js

import dbConnect from '../../lib/mongodb';
import Shop from '../../models/Shop';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const { bank, type, productId, shopId } = req.body;

    const shop = await Shop.findById(shopId);
    const product = shop.products.id(productId);

    // Find the card offer
    const cardOffer = product.offers.cardOffers.find(
      offer => offer.bank === bank && offer.type === type
    );

    if (!cardOffer) {
      return res.status(400).json({
        success: false,
        message: 'No valid card offer found'
      });
    }

    res.status(200).json({
      success: true,
      data: cardOffer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating card offer'
    });
  }
}