'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { isLoggedIn, getValidToken, logout } from '/utils/auth.js';
import NotesModal from '/src/components/NotesModal.jsx';
import ShareModal from '/src/components/ShareModal.jsx';
import '/pages/styles/Continent.css';

const BookmarksPage = () => {
  const router = useRouter();
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        const token = await getValidToken();
        console.log('Valid token retrieved in BookmarksPage:', token);

        if (!token) {
          throw new Error('No valid token found');
        }

        await fetchBookmarkedPlants(token);
        await fetchUserData(token);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        if (error.message.includes('Invalid token') || error.message.includes('No valid token found')) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const fetchBookmarkedPlants = async (token) => {
    try {
      const bookmarksResponse = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Bookmarks response status:', bookmarksResponse.status);

      if (!bookmarksResponse.ok) {
        const errorText = await bookmarksResponse.text();
        console.error('Bookmarks response error:', errorText);
        throw new Error(`Failed to fetch bookmarks: ${bookmarksResponse.status} ${errorText}`);
      }

      const bookmarkedPlants = await bookmarksResponse.json();
      setBookmarkedPlants(bookmarkedPlants);
    } catch (error) {
      console.error('Error fetching bookmarked plants:', error);
      throw error;
    }
  };

  const fetchUserData = async (token) => {
    try {
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
      throw error;
    }
  };

  const handleRemoveBookmark = async (plantId) => {
    try {
      const token = await getValidToken();
      console.log('Token for removing bookmark:', token);

      const response = await fetch(`/api/bookmarks/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Remove bookmark response status:', response.status);

      if (response.ok) {
        setBookmarkedPlants(prev => prev.filter(plant => plant._id !== plantId));
      } else {
        const errorText = await response.text();
        console.error('Remove bookmark error:', errorText);
        throw new Error(`Failed to remove bookmark: ${response.status} ${errorText}`);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
      setError('Failed to remove bookmark. Please try again.');
      if (error.message.includes('Invalid token')) {
        logout();
      }
    }
  };

  const handleLearnMoreClick = (id) => {
    router.push(`/plants/${id}`);
  };

  const handleNotesClick = (plant) => {
    setSelectedPlant(plant);
    setNotesModalOpen(true);
  };

  const handleShareClick = (plant) => {
    const url = `${window.location.origin}/plants/${plant._id}`;
    setShareUrl(url);
    setShareModalOpen(true);
  };

  if (isLoading) return <div className="loading">Loading your bookmarked plants...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="continent-page">
      <div className="continent-title-container">
        <div className="leaf leaf-left"></div>
        <h1 className="continent-title">My Bookmarked Plants</h1>
        <div className="leaf leaf-right"></div>
      </div>
      {bookmarkedPlants.length === 0 ? (
        <div className="no-bookmarks">
          <p>You haven't bookmarked any plants yet.</p>
          <button onClick={() => router.push('/EarthModel')}>Explore Plants</button>
        </div>
      ) : (
        <div className="cards-container">
          {bookmarkedPlants.map((plant) => (
            <div className="card-container" key={plant._id}>
              <div className="card-inner">
                <div className="icon-container">
                  <div 
                    className="bookmark-icon active"
                    onClick={() => handleRemoveBookmark(plant._id)}
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
      )}
      <NotesModal
        isOpen={notesModalOpen}
        onClose={() => setNotesModalOpen(false)}
        plantId={selectedPlant?._id}
        plantName={selectedPlant?.name}
      />
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        shareUrl={shareUrl}
        user={user}
      />
    </div>
  );
};

export default BookmarksPage;