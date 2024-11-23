// pages/api/orders.js

import dbConnect from '../../lib/mongodb';
import Order from '../../models/Order';
import Delivery from '../../models/Delivery';
import { verifyToken } from '../../utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();

    // Verify token and get user ID
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    if (token) {
      try {
        const decoded = await verifyToken(token);
        if (decoded && decoded.id) {
          userId = decoded.id;
        }
      } catch (error) {
        console.warn('Token verification failed:', error);
      }
    }

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order object
    const orderData = {
      ...req.body,
      orderNumber,
      status: 'pending',
      user: userId
    };

    // Create and save the order
    const order = new Order(orderData);
    await order.save();

    // Create delivery record
    const deliveryData = {
      order: order._id,
      user: userId,
      email: orderData.deliveryInfo.email,
      phone: orderData.deliveryInfo.phone,
      address: {
        street: orderData.deliveryInfo.address,
        city: orderData.deliveryInfo.city,
        state: orderData.deliveryInfo.state,
        zipCode: orderData.deliveryInfo.zipCode
      },
      specialInstructions: orderData.deliveryInfo.specialInstructions || '',
      trackingStatus: 'pending'
    };

    const delivery = new Delivery(deliveryData);
    await delivery.save();

    return res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderNumber: order.orderNumber
      }
    });

  } catch (error) {
    console.error('Order API Error:', error);
    return res.status(500).json({
      success: false,
      message: `Error placing order: ${error.message}`,
      details: error.toString()
    });
  }
}