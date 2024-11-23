// pages/api/orders/user.js

import dbConnect from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Delivery from '../../../models/Delivery';
import { verifyToken } from '../../../utils/auth';

export default async function userOrdersHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get and verify token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Get user ID from token
    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    // Fetch orders for the user
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Fetch delivery information for each order
    const ordersWithDelivery = await Promise.all(orders.map(async (order) => {
      const delivery = await Delivery.findOne({ order: order._id }).lean().exec();
      
      return {
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        // Include delivery information in a structured way
        deliveryInfo: delivery ? {
          email: delivery.email,
          phone: delivery.phone,
          address: delivery.address.street,
          city: delivery.address.city,
          state: delivery.address.state,
          zipCode: delivery.address.zipCode,
          specialInstructions: delivery.specialInstructions,
          trackingStatus: delivery.trackingStatus
        } : order.deliveryInfo,
        payment: {
          ...order.payment,
          cardDetails: order.payment.cardDetails ? {
            ...order.payment.cardDetails,
            last4Digits: order.payment.cardDetails.last4Digits
          } : null
        }
      };
    }));

    return res.status(200).json({
      success: true,
      orders: ordersWithDelivery
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
}