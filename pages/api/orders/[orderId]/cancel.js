// pages/api/orders/[orderId]/cancel.js

import { verifyToken } from '../../../../utils/auth';
import dbConnect from '../../../../lib/mongodb';
import Order from '../../../../models/Order';

export default async function handler(req, res) {
  // Check if method is PUT
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Only PUT requests are accepted.' 
    });
  }

  // Get authentication token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication token is missing' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token and get user data
    const userData = verifyToken(token);
    if (!userData || !userData.id) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authentication token' 
      });
    }

    // Connect to database
    await dbConnect();

    // Get orderId from query
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order ID is required' 
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order belongs to authenticated user
    if (order.user?.toString() !== userData.id) {  // Changed from userId to user
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this order' 
      });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in ${order.status} status. Orders can only be cancelled when pending or confirmed.`
      });
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = 'Cancelled by customer';

    // Save the updated order
    await order.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        _id: order._id,
        status: order.status,
        cancelledAt: order.cancelledAt,
        cancellationReason: order.cancellationReason
      }
    });

  } catch (error) {
    console.error('Order cancellation error:', error);
    
    // Return appropriate error response
    return res.status(500).json({
      success: false,
      message: 'Error processing order cancellation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}