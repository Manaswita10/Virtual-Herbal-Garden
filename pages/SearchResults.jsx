import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ContinentPage from '/src/components/ContinentPage.jsx';
import '/pages/styles/SearchResults.css';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { q, imageSearch } = router.query;

  useEffect(() => {
    if (q) {
      if (imageSearch === 'true') {
        fetchImageSearchResults(q);
      } else {
        fetchTextSearchResults(q);
      }
    }
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
      const response = await fetch(`/api/plant?name=${encodeURIComponent(plantName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plant data');
      }
      const data = await response.json();
      setSearchResults([data]); // Wrap the single plant data in an array
    } catch (error) {
      console.error('Error fetching plant data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="search-results">
      <h1>
        {imageSearch === 'true' 
          ? `Identified Plant: "${q}"`
          : `Search Results for "${q}"`
        }
      </h1>
      <ContinentPage continent="uses" herbalPlants={searchResults} />
    </div>
  );
};

export default SearchResults;