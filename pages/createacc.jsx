'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '/pages/styles/createacc.css';

const OTP = ({ mobileNumber, onVerificationSuccess, onResendOTP }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    const timer = resendTimer > 0 && setInterval(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

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

      if (response.ok && data.success) {
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
          <button onClick={onResendOTP} className="resend-button">
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

const CreateAccountPage = () => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('details'); // 'details' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const router = useRouter();

  const validateForm = () => {
    if (name.length < 3 || name.length > 60) {
      setError('Name must be between 3 and 60 characters');
      return false;
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      setError('Mobile number must be exactly 10 digits');
      return false;
    }
    if (password.length < 5 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError('Password must be at least 5 characters long and contain at least one special character');
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
        console.log('OTP sent successfully');
        setStep('otp');
        // In development, we'll store the OTP in state
        if (process.env.NODE_ENV === 'development') {
          setGeneratedOtp(data.otp);
        }
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP send error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      // Here you would typically create the user account
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobileNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Account created successfully:', data);
        // Redirect to the landing page
        router.push('/login');
      } else {
        setError(data.message || 'Account creation failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred. Please try again.');
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
        setError('OTP resent successfully');
        if (process.env.NODE_ENV === 'development') {
          setGeneratedOtp(data.otp);
        }
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
    <div className="create-account-page">
      <div className="create-account-container">
        <h1>Create Account</h1>
        {step === 'details' ? (
          <form onSubmit={handleSendOtp}>
            <div className="input-group">
              <label htmlFor="name">Your name</label>
              <input
                type="text"
                id="name"
                placeholder="First and last name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="mobile">Mobile number</label>
              <div className="mobile-input">
                <select className="country-code">
                  <option value="+91">IN +91</option>
                </select>
                <input
                  type="tel"
                  id="mobile"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <p className="info-text">
              To verify your number, we will send you a text message with a temporary code. Message and data rates may apply.
            </p>
            <button type="submit" className="verify-button" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <>
            {process.env.NODE_ENV === 'development' && generatedOtp && (
              <div className="dev-otp-display">
                Development OTP: {generatedOtp}
              </div>
            )}
            <OTP 
              mobileNumber={mobileNumber} 
              onVerificationSuccess={handleVerificationSuccess}
              onResendOTP={handleResendOTP}
            />
          </>
        )}
        <div className="additional-info">
          <p>Buying for work? <a href="#">Create a free business account</a></p>
          <p>Already have an account? <a href="#" onClick={() => router.push('/login')}>Sign in</a></p>
          <p className="terms">
            By creating an account or logging in, you agree to AYUSH's <a href="#">Conditions of Use</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;