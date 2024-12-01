// pages/api/refresh-token.js
import { verifyToken, generateToken, generateRefreshToken } from '/utils/auth.js';

let refreshInProgress = false;
const refreshQueue = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  // Implement queue system for concurrent refresh requests
  if (refreshInProgress) {
    return new Promise((resolve, reject) => {
      refreshQueue.push({ resolve, reject, refreshToken });
    });
  }

  refreshInProgress = true;

  try {
    const decoded = verifyToken(refreshToken);
    
    if (!decoded || decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    const newToken = generateToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    // Process queue if any
    while (refreshQueue.length > 0) {
      const { resolve } = refreshQueue.shift();
      resolve(res.status(200).json({ 
        token: newToken, 
        refreshToken: newRefreshToken 
      }));
    }

    return res.status(200).json({ 
      token: newToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    console.error('Error refreshing token:', error);

    // Reject all queued requests on error
    while (refreshQueue.length > 0) {
      const { reject } = refreshQueue.shift();
      reject(new Error('Invalid or expired refresh token'));
    }

    return res.status(401).json({ 
      message: 'Invalid or expired refresh token' 
    });
  } finally {
    refreshInProgress = false;
  }
}