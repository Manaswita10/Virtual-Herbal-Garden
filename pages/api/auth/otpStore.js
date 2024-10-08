// pages/api/auth/otpStore.js

const otpStore = new Map();

export function setOtp(mobileNumber, otp) {
  otpStore.set(mobileNumber, otp);
  console.log(`OTP set for ${mobileNumber}: ${otp}`);
  console.log('Current OTP store:', Array.from(otpStore.entries()));

  // Set a timeout to delete the OTP after 5 minutes
  setTimeout(() => {
    otpStore.delete(mobileNumber);
    console.log(`OTP expired for ${mobileNumber}`);
    console.log('Current OTP store after expiration:', Array.from(otpStore.entries()));
  }, 5 * 60 * 1000);
}

export function getOtp(mobileNumber) {
  const otp = otpStore.get(mobileNumber);
  console.log(`Retrieved OTP for ${mobileNumber}: ${otp}`);
  return otp;
}

export function deleteOtp(mobileNumber) {
  otpStore.delete(mobileNumber);
  console.log(`Deleted OTP for ${mobileNumber}`);
  console.log('Current OTP store after deletion:', Array.from(otpStore.entries()));
}