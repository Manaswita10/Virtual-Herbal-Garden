import dbConnect from '/lib/mongodb.js';
import User from '/models/User.js';
import jwt from 'jsonwebtoken';
import { verifyToken, generateToken, generateRefreshToken } from '/utils/auth.js';

async function validateAndRefreshTokens(authHeader, req) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // First try to verify the current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { decoded, newToken: null, newRefreshToken: null };
  } catch (error) {
    // If token is invalid or expired, try to refresh
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      // Get refresh token from request cookies or headers
      const refreshToken = req.cookies?.refreshToken || req.headers['x-refresh-token'];
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      try {
        const refreshDecoded = verifyToken(refreshToken);
        
        if (!refreshDecoded || refreshDecoded.type !== 'refresh') {
          throw new Error('Invalid refresh token');
        }

        // Generate new tokens
        const newToken = generateToken(refreshDecoded.id);
        const newRefreshToken = generateRefreshToken(refreshDecoded.id);

        return {
          decoded: refreshDecoded,
          newToken,
          newRefreshToken
        };
      } catch (refreshError) {
        throw new Error('Invalid or expired refresh token');
      }
    }
    throw error;
  }
}

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  try {
    // Validate and potentially refresh tokens
    const { decoded, newToken, newRefreshToken } = await validateAndRefreshTokens(
      req.headers.authorization,
      req
    );

    // If new tokens were generated, set them in response headers
    if (newToken && newRefreshToken) {
      res.setHeader('X-New-Token', newToken);
      res.setHeader('X-New-Refresh-Token', newRefreshToken);
    }

    const userId = decoded.id;

    switch (method) {
      case 'GET':
        try {
          const user = await User.findById(userId).select('-password');
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json(user);
        } catch (error) {
          console.error('Error fetching user:', error);
          res.status(500).json({ error: 'Error fetching user data' });
        }
        break;

      case 'PUT':
        try {
          const { name, phoneNumber } = req.body;
          
          if (!name || !phoneNumber) {
            return res.status(400).json({ error: 'Name and phone number are required' });
          }

          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ error: 'Invalid phone number format. Please enter a 10-digit number.' });
          }

          const existingUser = await User.findOne({ 
            phoneNumber, 
            _id: { $ne: userId } 
          });
          
          if (existingUser) {
            return res.status(400).json({ error: 'Phone number already in use' });
          }

          const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
              name,
              phoneNumber,
              updatedAt: Date.now()
            },
            { 
              new: true,
              runValidators: true
            }
          ).select('-password');

          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }

          res.status(200).json(updatedUser);
        } catch (error) {
          if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
          }
          console.error('Error updating user:', error);
          res.status(500).json({ error: 'Error updating user data' });
        }
        break;

      case 'DELETE':
        try {
          const deletedUser = await User.findByIdAndDelete(userId);
          if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
          console.error('Error deleting user:', error);
          res.status(500).json({ error: 'Error deleting user' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}