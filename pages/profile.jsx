import React, { useState, useEffect } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { isLoggedIn, authenticatedFetch, logout } from '/utils/auth';
import '/pages/styles/Profile.css';

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);

    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch('/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to load user data');
      
      // If the error is authentication-related, redirect to login
      if (error.message.toLowerCase().includes('unauthorized') || 
          error.message.toLowerCase().includes('token') ||
          error.message.toLowerCase().includes('authentication')) {
        logout();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <div className="errorMessage">{error}</div>
        <button 
          onClick={() => fetchUserData()}
          className="retryButton"
        >
          Retry
        </button>
      </div>
    );
  }

  const themeClass = isDarkMode ? 'dark' : 'light';

  return (
    <div className={`container ${themeClass}`}>
      <div className="wrapper">
        <div className="header">
          <h1 className="title">My Profile</h1>
          <button
            onClick={toggleTheme}
            className={`themeToggle ${themeClass}`}
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className={`card ${themeClass}`}>
          <div className={`profileHeader ${themeClass}`}>
            <div className={`avatar ${themeClass}`}>
              <User className={`avatarIcon ${themeClass}`} />
            </div>
            <p className={`subtitle ${themeClass}`}>
              Personal Information
            </p>
          </div>

          <div className="infoGrid">
            <div className={`infoItem ${themeClass}`}>
              <label className={`label ${themeClass}`}>
                Full Name
              </label>
              <p className="value">{userData?.name || 'Not available'}</p>
            </div>

            <div className={`infoItem ${themeClass}`}>
              <label className={`label ${themeClass}`}>
                Phone Number
              </label>
              <p className="value">{userData?.phoneNumber || 'Not available'}</p>
            </div>

            <div className={`infoItem ${themeClass}`}>
              <label className={`label ${themeClass}`}>
                Member Since
              </label>
              <p className="value">
                {userData?.createdAt 
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : 'Not available'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;