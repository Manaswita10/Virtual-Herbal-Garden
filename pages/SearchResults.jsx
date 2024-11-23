'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ContinentPage from '/src/components/ContinentPage.jsx';
import { Leaf, Send, X, MessageSquare } from 'lucide-react';
import { isLoggedIn, logout } from '/utils/auth.js';
import '/pages/styles/SearchResults.css';
import Link from 'next/link';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leafAnimation, setLeafAnimation] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { q, imageSearch } = router.query;

  // Navbar handlers
  const handleSearchClick = () => {
    router.push('/SearchPage');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleBlogClick = () => {
    router.push('/Blog');
  };

  const handleContactUsClick = () => {
    router.push('/ContactUs');
  };

  const handleLoginClick = () => {
    router.push('/login');
    setIsDropdownOpen(false);
  };

  const handleConsultationClick = () => {
    router.push('/Doctor');
  };

  const handleshopClick = () => {
    router.push('/shop');
  };

  const handleLogoutClick = () => {
    logout();
    setIsUserLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsDropdownOpen(false);
  };

  const handleBookmarksClick = () => {
    router.push('/bookmarks');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (q) {
      if (imageSearch === 'true') {
        fetchImageSearchResults(q);
      } else {
        fetchTextSearchResults(q);
      }
    }
    // Initialize leaf animation
    setTimeout(() => setLeafAnimation(true), 500);

    // Check login status
    const checkLoginStatus = () => {
      setIsUserLoggedIn(isLoggedIn());
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000);

    return () => clearInterval(intervalId);
  }, [q, imageSearch]);

  const fetchTextSearchResults = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageSearchResults = async (plantName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://plant-recognition-api-11.onrender.com/api/recognize-plant`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name: plantName })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plant) {
          const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(data.plant)}`);
          if (!searchResponse.ok) {
            throw new Error('Failed to fetch plant details');
          }
          const searchData = await searchResponse.json();
          setSearchResults(searchData);
        } else {
          setError('Could not recognize the plant');
        }
      } else {
        const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(plantName)}`);
        if (!searchResponse.ok) {
          throw new Error('Failed to fetch search results');
        }
        const searchData = await searchResponse.json();
        setSearchResults(searchData);
      }
    } catch (error) {
      console.error('Error fetching plant data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <header>
          <nav className="navbar">
            <Link href="/" className="logo">
              <Leaf className="logo-icon" />
              <span>Ayurvista</span>
            </Link>
            <ul>
              <li onClick={() => router.push('/')}>HOME</li>
              <li onClick={handleSearchClick}>SEARCH</li>
              <li onClick={handleAboutClick}>ABOUT</li>
              <li onClick={handleshopClick}>SHOP</li>
              <li onClick={handleConsultationClick}>CONSULTATION</li>
              <li onClick={handleBlogClick}>BLOG</li>
              <li onClick={handleContactUsClick}>CONTACT US</li>
            </ul>
            <div className="profile-icon-container" onClick={toggleDropdown}>
              <img src="/assets/icon.png" alt="Profile" className="profile-icon-img" />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {isUserLoggedIn ? (
                    <>
                      <button onClick={handleProfileClick}>My Profile</button>
                      <button onClick={handleBookmarksClick}>My Bookmarks</button>
                      <button onClick={handleLogoutClick}>Logout</button>
                    </>
                  ) : (
                    <button onClick={handleLoginClick}>Login</button>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
        <div className="search-page">
          <div className="loading">
            {imageSearch === 'true' ? 'Finding recognized plant...' : 'Searching for plants...'}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <header>
          <nav className="navbar">
            <Link href="/" className="logo">
              <Leaf className="logo-icon" />
              <span>Ayurvista</span>
            </Link>
            <ul>
              <li onClick={() => router.push('/')}>HOME</li>
              <li onClick={handleSearchClick}>SEARCH</li>
              <li onClick={handleAboutClick}>ABOUT</li>
              <li onClick={handleshopClick}>SHOP</li>
              <li onClick={handleConsultationClick}>CONSULTATION</li>
              <li onClick={handleBlogClick}>BLOG</li>
              <li onClick={handleContactUsClick}>CONTACT US</li>
            </ul>
            <div className="profile-icon-container" onClick={toggleDropdown}>
              <img src="/assets/icon.png" alt="Profile" className="profile-icon-img" />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {isUserLoggedIn ? (
                    <>
                      <button onClick={handleProfileClick}>My Profile</button>
                      <button onClick={handleBookmarksClick}>My Bookmarks</button>
                      <button onClick={handleLogoutClick}>Logout</button>
                    </>
                  ) : (
                    <button onClick={handleLoginClick}>Login</button>
                  )}
                </div>
              )}
            </div>
          </nav>
        </header>
        <div className="search-page">
          <div className="error-container">
            <div className="error">Error: {error}</div>
            <button onClick={() => router.back()} className="back-button">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header>
        <nav className="navbar">
          <Link href="/" className="logo">
            <Leaf className="logo-icon" />
            <span>Ayurvista</span>
          </Link>
          <ul>
            <li onClick={() => router.push('/')}>HOME</li>
            <li onClick={handleSearchClick}>SEARCH</li>
            <li onClick={handleAboutClick}>ABOUT</li>
            <li onClick={handleshopClick}>SHOP</li>
            <li onClick={handleConsultationClick}>CONSULTATION</li>
            <li onClick={handleBlogClick}>BLOG</li>
            <li onClick={handleContactUsClick}>CONTACT US</li>
          </ul>
          <div className="profile-icon-container" onClick={toggleDropdown}>
            <img src="/assets/icon.png" alt="Profile" className="profile-icon-img" />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {isUserLoggedIn ? (
                  <>
                    <button onClick={handleProfileClick}>My Profile</button>
                    <button onClick={handleBookmarksClick}>My Bookmarks</button>
                    <button onClick={handleLogoutClick}>Logout</button>
                  </>
                ) : (
                  <button onClick={handleLoginClick}>Login</button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="search-page">
        {/* Animated Leaves */}
        <div className="animated-leaves">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`floating-leaf ${leafAnimation ? 'animate' : ''}`}
              style={{ 
                animationDelay: `${i * 0.3}s`,
                left: `${Math.random() * 100}%`
              }}
            >
              <Leaf size={24} />
            </div>
          ))}
        </div>

        <div className="search-title-container">
          <h1 className="search-title">
            {imageSearch === 'true'
              ? searchResults.length === 1
                ? `Identified Plant: "${searchResults[0]?.name || q}"`
                : `Similar Plants to: "${q}"`
              : `Search Results for "${q}"`
            }
          </h1>
        </div>

        {searchResults.length > 0 ? (
          <div className="cards-container">
            {searchResults.map((plant) => (
              <div className="card-container" key={plant._id}>
                <div className="card-inner">
                  <div className="icon-container">
                    <div className="bookmark-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <div className="notes-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="plant-image">
                    {plant.imageUrl ? (
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="plant-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder-image">No image available</div>
                    )}
                  </div>

                  <div className="card-body">
                    <h2 className="card-title">{plant.name}</h2>
                    <div className="card-description">
                      <p className="botanical-name">{plant.botanicalName}</p>
                      <p className="common-names">{plant.commonNames}</p>
                    </div>

                    <div className="button-container">
                      <button
                        className="card-button"
                        onClick={() => router.push(`/plants/${plant._id}`)}
                      >
                        Learn More
                      </button>

                      <button className="share-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No plants found. Try another search.</p>
            <button onClick={() => router.back()} className="back-button">
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;