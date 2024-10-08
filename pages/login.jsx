import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, initializeAuth } from '/utils/auth.js';
import '/pages/styles/login.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        login(data.token, data.refreshToken);
        router.push('/');
      } else {
        setError(data.message || 'Login failed. Please try again.');
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h2>Welcome to Zeus Garden</h2>
        <p>One stop for all tree variety of plants</p>
        <div className="plant-image-container">
          <div className="plant-image"></div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-container">
          <h1>Login to your Zeus Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="identifier">Email or mobile phone number</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
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
            <button type="submit" className="continue-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="terms">
            By continuing, you agree to Zeus Garden's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
          </p>
          <details className="help-section">
            <summary>Need help?</summary>
            <a href="#">Forgot Password?</a>
          </details>
          <div className="divider">
            <h5>New to Ayurvista?</h5>
          </div>
          <button className="create-account-button" onClick={() => router.push('/createacc')}>
            Create your account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;