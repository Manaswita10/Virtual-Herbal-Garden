import dbConnect from '/lib/mongodb.js';
import User from '/models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '/utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { identifier, password } = req.body;

  try {
    await dbConnect();
    const user = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}