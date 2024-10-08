import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isLoggedIn, getValidToken } from '/utils/auth.js';
import ShareModal from '/src/components/ShareModal.jsx';
import NotesModal from '/src/components/NotesModal.jsx';
import '/pages/styles/Continent.css';

export function ContinentPage({ continent, herbalPlants: initialPlants }) {
  const router = useRouter();
  const [herbalPlants, setHerbalPlants] = useState(initialPlants || []);
  const [isLoading, setIsLoading] = useState(!initialPlants);
  const [error, setError] = useState(null);
  const [bookmarkedPlants, setBookmarkedPlants] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [user, setUser] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!initialPlants) {
        try {
          setIsLoading(true);
          const plantsResponse = await fetch(`/api/plants?continent=${continent}`);
          if (!plantsResponse.ok) {
            throw new Error(`HTTP error! status: ${plantsResponse.status}`);
          }
          const plantsData = await plantsResponse.json();

          const plantsWithUrls = await Promise.all(plantsData.map(async (plant) => {
            try {
              const urlsResponse = await fetch(`/api/getPresignedUrls?modelBasePath=${encodeURIComponent(plant.modelBasePath)}`);
              if (!urlsResponse.ok) {
                throw new Error(`HTTP error! status: ${urlsResponse.status}`);
              }
              const urls = await urlsResponse.json();

              const imageUrl = Object.entries(urls).find(([key, value]) => {
                const lowerKey = key.toLowerCase();
                return (lowerKey.endsWith('.jpg') || lowerKey.endsWith('.png') || lowerKey.endsWith('.jpeg')) && 
                       !lowerKey.includes('/textures/') &&
                       lowerKey.split('/').length === 2;
              });

              if (imageUrl) {
                return { ...plant, imageUrl: imageUrl[1] };
              } else {
                return plant;
              }
            } catch (error) {
              console.error(`Error fetching URLs for ${plant.name}:`, error);
              return plant;
            }
          }));

          setHerbalPlants(plantsWithUrls);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
    }

    async function fetchBookmarks() {
      if (isLoggedIn()) {
        try {
          const token = getValidToken();
          const response = await fetch('/api/bookmarks', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const bookmarks = await response.json();
            const bookmarksObj = bookmarks.reduce((acc, bookmark) => {
              acc[bookmark._id] = true;
              return acc;
            }, {});
            setBookmarkedPlants(bookmarksObj);
          }
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      }
    }

    async function fetchUserData() {
      if (isLoggedIn()) {
        try {
          const token = getValidToken();
          const response = await fetch('/api/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      }
    }

    fetchData();
    fetchBookmarks();
    fetchUserData();
  }, [continent, initialPlants]);

  const handleLearnMoreClick = (id) => {
    router.push(`/plants/${id}`);
  };

  const handleBookmark = async (plantId) => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }

    try {
      const token = getValidToken();
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
  };

  const handleShareClick = (plant) => {
    const url = `${window.location.origin}/plants/${plant._id}`;
    setShareUrl(url);
    setShareModalOpen(true);
  };

  const handleNotesClick = (plant) => {
    setSelectedPlant(plant);
    setNotesModalOpen(true);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="continent-page">
      <div className="continent-title-container">
        <div className="leaf leaf-left"></div>
        <h1 className="continent-title">Herbal Plants of {continent}</h1>
        <div className="leaf leaf-right"></div>
      </div>
      <div className="cards-container">
        {herbalPlants.map((plant) => (
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

              <div className="image-container">
                {plant.imageUrl ? (
                  <Image
                    src={plant.imageUrl}
                    alt={plant.name}
                    layout="fill"
                    objectFit="cover"
                    className="image"
                    onError={() => console.error(`Failed to load image for ${plant.name}`)}
                  />
                ) : (
                  <div className="placeholder-image">No image available for {plant.name}</div>
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

                  <button className="share-button" onClick={() => handleShareClick(plant)}>
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
  );
}

export default ContinentPage;