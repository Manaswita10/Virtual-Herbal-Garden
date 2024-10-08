// pages/api/auth/send-otp.js
import dbConnect from '/lib/mongodb.js';
import User from '/models/User.js';
import { setOtp } from '/pages/api/auth/otpStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { mobileNumber } = req.body;

  try {
    await dbConnect();
    
    const existingUser = await User.findOne({ phoneNumber: mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(mobileNumber, otp);

    console.log(`OTP set for ${mobileNumber}: ${otp}`);

    res.status(200).json({ 
      message: 'OTP sent successfully', 
      otp: otp // Only for development
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
}