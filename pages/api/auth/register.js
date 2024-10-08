// pages/api/auth/register.js
import dbConnect from '/lib/mongodb.js';
import User from '/models/User.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, mobileNumber, password } = req.body;

  // Input validation
  if (name.length < 3 || name.length > 60) {
    return res.status(400).json({ message: 'Username must be between 3 and 60 characters' });
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  if (password.length < 5 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 5 characters long and contain at least one special character' });
  }

  try {
    await dbConnect();
    const existingUser = await User.findOne({ phoneNumber: mobileNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phoneNumber: mobileNumber,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}