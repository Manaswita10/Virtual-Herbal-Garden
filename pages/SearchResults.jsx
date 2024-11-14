import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import ContinentPage from '/src/components/ContinentPage.jsx';
import '/pages/styles/SearchResults.css';

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const router = useRouter();
  const { q, imageSearch } = router.query;

  const fetchTextSearchResults = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      const uniqueResults = Array.from(
        new Map(data.map(item => [item._id, item])).values()
      );
      setSearchResults(uniqueResults);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setDataFetched(true);
    }
  }, []);

  const fetchImageSearchResults = useCallback(async (plantName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/plant?name=${encodeURIComponent(plantName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch plant data');
      }
      const data = await response.json();
      setSearchResults([data]);
    } catch (error) {
      console.error('Error fetching plant data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setDataFetched(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (q && !dataFetched && mounted) {
        if (imageSearch === 'true') {
          await fetchImageSearchResults(q);
        } else {
          await fetchTextSearchResults(q);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!searchResults.length) return <div className="no-results">No results found for "{q}"</div>;

  return (
    <div className="search-results">
      <h1>
        {imageSearch === 'true'
          ? `Identified Plant: "${q}"`
          : `Search Results for "${q}"`
        }
      </h1>
      <ContinentPage 
        key={q} 
        continent="search" 
        herbalPlants={searchResults} 
      />
    </div>
  );
};

export default SearchResults;