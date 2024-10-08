'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '/pages/styles/otp.css'; // You'll need to create this CSS file

const OTP = ({ mobileNumber, onVerificationSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const router = useRouter();

  useEffect(() => {
    const timer = resendTimer > 0 && setInterval(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        onVerificationSuccess();
      } else {
        setError(data.message || 'OTP verification failed. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendTimer(30);
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <p>We've sent a 6-digit OTP to {mobileNumber}</p>
      <form onSubmit={handleSubmit}>
        <div className="otp-input-container">
          {otp.map((data, index) => {
            return (
              <input
                className="otp-input"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            );
          })}
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="verify-button" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <div className="resend-container">
        {resendTimer > 0 ? (
          <p>Resend OTP in {resendTimer} seconds</p>
        ) : (
          <button onClick={handleResendOTP} disabled={isLoading} className="resend-button">
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default OTP;