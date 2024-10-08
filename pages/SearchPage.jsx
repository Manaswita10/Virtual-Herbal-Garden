import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Camera, Search } from 'lucide-react';
import '/pages/styles/SearchPage.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (searchQuery.trim()) {
      router.push(`/SearchResults?q=${encodeURIComponent(searchQuery)}`);
    } else if (selectedImage) {
      try {
        const response = await fetch('/api/recognize-plant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: selectedImage }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.plant) {
            router.push(`/SearchResults?q=${encodeURIComponent(result.plant)}&imageSearch=true`);
          } else {
            setError('Plant recognition failed. Please try again.');
          }
        } else {
          const errorData = await response.json();
          setError(`Plant recognition failed: ${errorData.error || 'Please try again.'}`);
        }
      } catch (error) {
        console.error('Error during plant recognition:', error);
        setError('An error occurred. Please try again later.');
      }
    } else {
      setError('Please enter a search term or select an image.');
    }

    setIsLoading(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setSelectedImageName(file.name);
        setSearchQuery('');
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="search-page">
      <h1>Search Herbal Plants</h1>
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedImage(null);
            setSelectedImageName('');
            setError('');
          }}
          placeholder="Search plants by name, botanical name, uses, etc..."
          className="search-input"
        />
        <button type="button" className="upload-photo-btn" onClick={triggerFileInput}>
          <Camera size={24} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button type="submit" className="search-submit" disabled={isLoading}>
          <Search size={24} />
        </button>
      </form>
      {selectedImageName && (
        <p className="selected-image-name">Selected image: {selectedImageName}</p>
      )}
      {error && <p className="error-message">{error}</p>}
      {isLoading && <p className="loading-message">Processing...</p>}
      <div className="search-decoration">
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>
        <div className="leaf leaf-3"></div>
      </div>
    </div>
  );
};

export default SearchPage;