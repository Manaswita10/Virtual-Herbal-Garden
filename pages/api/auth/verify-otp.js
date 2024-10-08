// pages/api/auth/verify-otp.js
import dbConnect from '/lib/mongodb.js';
import { getOtp, deleteOtp } from '/pages/api/auth/otpStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Received verification request:', req.body);

  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    console.log('Missing mobileNumber or otp in request');
    return res.status(400).json({ message: 'Missing mobileNumber or otp' });
  }

  try {
    await dbConnect();

    console.log(`Verifying OTP for ${mobileNumber}: ${otp}`);

    const storedOtp = getOtp(mobileNumber);

    if (!storedOtp) {
      console.log(`No OTP found for ${mobileNumber}`);
      return res.status(400).json({ message: 'OTP expired or not found' });
    }

    console.log(`Stored OTP for ${mobileNumber}: ${storedOtp}`);

    if (storedOtp !== otp) {
      console.log(`OTP mismatch for ${mobileNumber}. Received: ${otp}, Stored: ${storedOtp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    deleteOtp(mobileNumber);
    console.log(`OTP verified and removed for ${mobileNumber}`);

    res.status(200).json({ message: 'OTP verified successfully', success: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error', error: error.toString() });
  }
}