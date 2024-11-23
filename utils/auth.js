// utils/auth.js

import jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    return done(null, payload);
  } catch (error) {
    return done(error, false);
  }
});

export const setTokens = (token, refreshToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  }
};

export const getTokens = () => {
  if (typeof window !== 'undefined') {
    return {
      token: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  }
  return { token: null, refreshToken: null };
};

export const getToken = () => {
  const { token } = getTokens();
  return token;
};

export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenTimestamp');
  }
};

export const isLoggedIn = () => {
  const { token, refreshToken } = getTokens();
  return !!token && !!refreshToken;
};

export const logout = () => {
  removeTokens();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const login = (token, refreshToken) => {
  setTokens(token, refreshToken);
};

// Export the token refresh function
export const refreshTokens = async () => {
  const tokens = getTokens();
  if (!tokens.refreshToken) {
    console.error('No refresh token found');
    logout();
    return null;
  }

  try {
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { token, refreshToken } = await response.json();
    setTokens(token, refreshToken);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    logout();
    return null;
  }
};

// Helper function to check token expiration
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

// Helper function to check if token is expiring soon
export const isTokenExpiringSoon = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return true;
    return (decoded.exp * 1000) - Date.now() <= REFRESH_THRESHOLD;
  } catch {
    return true;
  }
};

export const getValidToken = async () => {
  const { token, refreshToken } = getTokens();
  if (!token || !refreshToken) {
    console.error('No token or refresh token found');
    logout();
    return null;
  }

  try {
    if (isTokenExpired(token) || isTokenExpiringSoon(token)) {
      return await refreshTokens();
    }
    return token;
  } catch (error) {
    console.error('Error checking token:', error);
    return await refreshTokens();
  }
};

let refreshInterval;

export const initializeAuth = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }

  refreshInterval = setInterval(async () => {
    if (isLoggedIn()) {
      await getValidToken();
    } else {
      clearInterval(refreshInterval);
    }
  }, REFRESH_THRESHOLD / 2);
};

export const setupAuthRefresh = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', initializeAuth);
    initializeAuth();
  }
};

export const cleanupAuthRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('focus', initializeAuth);
  }
};

// Helper function for making authenticated requests
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const token = await getValidToken();
    if (!token) {
      throw new Error('No valid token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const newToken = await refreshTokens();
      if (!newToken) {
        throw new Error('Session expired');
      }

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Authenticated fetch error:', error);
    if (error.message.includes('token') || error.message.includes('Session')) {
      logout();
    }
    throw error;
  }
};