// pages/api/orders/[orderId]/invoice.js

import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { verifyToken } from '../../../../utils/auth';

export default async function invoiceHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { orderId } = req.query;
    await dbConnect();

    // Verify token and user authorization
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = await verifyToken(token);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Fetch order and verify user owns it
    const order = await Order.findOne({
      _id: orderId,
      user: decoded.id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Here you would generate the invoice
    // This is a placeholder - implement your invoice generation logic
    const invoice = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      // Add more invoice details as needed
    };

    return res.status(200).json({
      success: true,
      invoice
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating invoice',
      error: error.message
    });
  }
}