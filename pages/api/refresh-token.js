import { verifyToken, generateToken, generateRefreshToken } from '/utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    const newToken = generateToken(decoded.id);
    const newRefreshToken = generateRefreshToken(decoded.id);

    res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
}