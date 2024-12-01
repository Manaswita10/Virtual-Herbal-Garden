'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Search, Leaf } from 'lucide-react';
import { isLoggedIn, logout } from '/utils/auth.js';
import '/pages/styles/SearchPage.css';
import Link from 'next/link';

// Define the API URL properly
const API_URL = 'https://plant-recognition-api-11.onrender.com';

const SearchPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const fileInputRef = useRef(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  // Check login status and API health on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsUserLoggedIn(isLoggedIn());
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000);

    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        const data = await response.json();
        setApiStatus(data.status === 'healthy' ? 'ready' : 'error');
      } catch (error) {
        console.error('API Health check failed:', error);
        setApiStatus('error');
      }
    };

    checkApiHealth();
    return () => clearInterval(intervalId);
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (searchQuery.trim()) {
      // Normal text search
      router.push(`/SearchResults?q=${encodeURIComponent(searchQuery)}`);
      setIsLoading(false);
    } else if (selectedImageFile) {
      try {
        // Create FormData and append the image
        const formData = new FormData();
        formData.append('file', selectedImageFile);

        // Log the request details (for debugging)
        console.log('Sending request to:', `${API_URL}/api/recognize-plant`);
        console.log('File being sent:', selectedImageFile.name);

        // Make request to the plant recognition API with CORS headers
        const response = await fetch(`${API_URL}/api/recognize-plant`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`errorText || HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Recognition result:', result);

        if (result.plant) {
          // Navigate to search results with the recognized plant name
          router.push(`/SearchResults?q=${encodeURIComponent(result.plant)}&imageSearch=true`);
        } else {
          setError('Could not recognize the plant. Please try a different image.');
        }
      } catch (error) {
        console.error('Error during plant recognition:', error);
        setError(`Plant recognition failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please enter a search term or select an image.');
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (jpg, png, etc).');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedImageFile(file);
        setSelectedImageName(file.name);
        setSearchQuery(''); // Clear text search when image is selected
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading the image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    setSelectedImageName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

      <div className={`search-page ${isLoading ? 'loading' : ''}`}>
        <h1>Search Herbal Plants</h1>

        {apiStatus === 'error' && (
          <div className="api-error-banner">
            Plant recognition service is currently unavailable. Text search is still available.
          </div>
        )}

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedImage(null);
              setSelectedImageFile(null);
              setSelectedImageName('');
              setError('');
            }}
            placeholder="Search plants by name, botanical name, uses, etc..."
            className="search-input"
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="upload-photo-btn" 
            onClick={triggerFileInput}
            disabled={isLoading || apiStatus === 'error'}
            title={apiStatus === 'error' ? 'Plant recognition is currently unavailable' : 'Upload plant image'}
          >
            <Camera size={24} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <button 
            type="submit" 
            className="search-submit" 
            disabled={isLoading || (!searchQuery && !selectedImageFile)}
          >
            <Search size={24} />
          </button>
        </form>

        {selectedImage && (
          <div className="preview-container">
            <div className="image-preview-wrapper">
              <img 
                src={selectedImage} 
                alt="Selected plant" 
                className="image-preview"
              />
              <button 
                className="clear-image-btn"
                onClick={clearImage}
                title="Remove image"
              >
                ×
              </button>
            </div>
            <p className="selected-image-name">
              Selected: {selectedImageName}
            </p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>{selectedImageFile ? 'Analyzing plant image...' : 'Searching...'}</p>
          </div>
        )}

        <div className="search-decoration">
          <div className="leaf leaf-1"></div>
          <div className="leaf leaf-2"></div>
          <div className="leaf leaf-3"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;