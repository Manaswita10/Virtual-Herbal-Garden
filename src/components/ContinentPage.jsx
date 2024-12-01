'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { isLoggedIn, getValidToken, logout } from '/utils/auth.js';
import ShareModal from '/src/components/ShareModal.jsx';
import NotesModal from '/src/components/NotesModal.jsx';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import '/pages/styles/Continent.css';

export function ContinentPage({ continent, herbalPlants: initialPlants }) {
  const router = useRouter();
  const [herbalPlants, setHerbalPlants] = useState(() => {
    if (initialPlants) {
      return Array.from(
        new Map(initialPlants.map(plant => [plant._id, plant])).values()
      );
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(!initialPlants);
  const [error, setError] = useState(null);
  const [bookmarkedPlants, setBookmarkedPlants] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [user, setUser] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [leafAnimation, setLeafAnimation] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navbar handlers
  const handleSearchClick = () => router.push('/SearchPage');
  const handleAboutClick = () => router.push('/about');
  const handleBlogClick = () => router.push('/Blog');
  const handleContactUsClick = () => router.push('/ContactUs');
  const handleConsultationClick = () => router.push('/Doctor');
  const handleShopClick = () => router.push('/shop');
  
  const handleLoginClick = () => {
    router.push('/login');
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

  const handleLogoutClick = () => {
    logout();
    setIsUserLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Memoize the unique plants
  const uniquePlants = useMemo(() => {
    return Array.from(
      new Map(herbalPlants.map(plant => [plant._id, plant])).values()
    );
  }, [herbalPlants]);

  const fetchPlantData = useCallback(async () => {
    if (initialPlants || dataFetched) return;

    try {
      setIsLoading(true);
      setError(null);

      const plantsResponse = await fetch(`/api/plants?continent=${encodeURIComponent(continent)}`);
      if (!plantsResponse.ok) {
        throw new Error(`HTTP error! status: ${plantsResponse.status}`);
      }
      
      const plantsData = await plantsResponse.json();
      
      const plantsWithUrls = await Promise.all(
        plantsData.map(async (plant) => {
          if (!plant.modelBasePath) return plant;
          
          try {
            const urlsResponse = await fetch(
              `/api/getPresignedUrls?modelBasePath=${encodeURIComponent(plant.modelBasePath)}`
            );
            
            if (!urlsResponse.ok) {
              throw new Error(`HTTP error! status: ${urlsResponse.status}`);
            }
            
            const urls = await urlsResponse.json();
            const imageUrl = Object.entries(urls).find(([key]) => {
              const lowerKey = key.toLowerCase();
              return (
                (lowerKey.endsWith('.jpg') || 
                 lowerKey.endsWith('.png') || 
                 lowerKey.endsWith('.jpeg')) && 
                !lowerKey.includes('/textures/') &&
                lowerKey.split('/').length === 2
              );
            });

            return imageUrl ? { ...plant, imageUrl: imageUrl[1] } : plant;
          } catch (error) {
            console.error(`Error fetching URLs for ${plant.name}:`, error);
            return plant;
          }
        })
      );

      setHerbalPlants(plantsWithUrls);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [continent, initialPlants, dataFetched]);

  const fetchUserAndBookmarks = useCallback(async () => {
    if (!isLoggedIn()) return;

    try {
      const token = await getValidToken();
      if (!token) return;

      const [userResponse, bookmarksResponse] = await Promise.all([
        fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/bookmarks', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }

      if (bookmarksResponse.ok) {
        const bookmarks = await bookmarksResponse.json();
        const bookmarksObj = bookmarks.reduce((acc, bookmark) => {
          acc[bookmark._id] = true;
          return acc;
        }, {});
        setBookmarkedPlants(bookmarksObj);
      }
    } catch (error) {
      console.error('Error fetching user data and bookmarks:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!dataFetched) {
      const initializeData = async () => {
        if (mounted) {
          await fetchPlantData();
          await fetchUserAndBookmarks();
        }
      };

      initializeData();
    }

    // Check login status
    const checkLoginStatus = () => {
      setIsUserLoggedIn(isLoggedIn());
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000);

    // Initialize leaf animation
    setTimeout(() => setLeafAnimation(true), 500);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [fetchPlantData, fetchUserAndBookmarks, dataFetched]);

  const handleLearnMoreClick = useCallback((id) => {
    router.push(`/plants/${id}`);
  }, [router]);

  const handleBookmark = useCallback(async (plantId) => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    try {
      const token = await getValidToken();
      if (!token) return;

      const method = bookmarkedPlants[plantId] ? 'DELETE' : 'POST';
      const response = await fetch(`/api/bookmarks/${plantId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setBookmarkedPlants(prev => ({
          ...prev,
          [plantId]: !prev[plantId]
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bookmark');
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  }, [bookmarkedPlants, router]);

  const handleShareClick = useCallback((plant) => {
    const url = `${window.location.origin}/plants/${plant._id}`;
    setShareUrl(url);
    setShareModalOpen(true);
  }, []);

  const handleNotesClick = useCallback((plant) => {
    setSelectedPlant(plant);
    setNotesModalOpen(true);
  }, []);

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
              <li onClick={handleShopClick}>SHOP</li>
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
        <div className="loading">Loading...</div>
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
              <li onClick={handleShopClick}>SHOP</li>
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
        <div className="error">Error: {error}</div>
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
            <li onClick={handleShopClick}>SHOP</li>
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

      <div className="continent-page">
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

        <div className="continent-title-container">
          <h1 className="continent-title">Herbal Plants of {continent}</h1>
        </div>

        <div className="cards-container">
          {uniquePlants.map((plant) => (
            <div className="card-container" key={plant._id}>
              <div className="card-inner">
                <div className="icon-container">
                  <div 
                    className={`bookmark-icon ${bookmarkedPlants[plant._id] ? 'active' : ''}`} 
                    onClick={() => handleBookmark(plant._id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </div>
                  <div 
                    className="notes-icon"
                    onClick={() => handleNotesClick(plant)}
                  >
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
                      onClick={() => handleLearnMoreClick(plant._id)}
                    >
                      Learn More
                    </button>

                    <button 
                      className="share-button" 
                      onClick={() => handleShareClick(plant)}
                    >
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
        
        <ShareModal 
         isOpen={shareModalOpen} 
         onClose={() => setShareModalOpen(false)} 
         shareUrl={shareUrl}
         user={user}
       />
       <NotesModal
         isOpen={notesModalOpen}
         onClose={() => setNotesModalOpen(false)}
         plantId={selectedPlant?._id}
         plantName={selectedPlant?.name}
       />
      </div>
    </div>
  );
}

export default ContinentPage;