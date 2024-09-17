import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModelContainer from '/pages/ModelContainer.jsx';

const PlantDetail = () => {
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/plant/${id}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setPlant(data.data);
        })
        .catch((err) => {
          console.error('Error fetching data:', err);
          setError('Failed to load plant data. Please try again later.');
        });
    }
  }, [id]);

  const renderContent = (content) => {
    if (!content) return null;
    if (typeof content === 'string' || Array.isArray(content)) {
      const items = Array.isArray(content) ? content : content.split('\n').filter(item => item.trim() !== '');
      return (
        <ul style={{ paddingLeft: '1.5rem' }}>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              {item.includes(':') ? (
                <>
                  <span style={{ fontWeight: 'bold', color: '#61DC1A' }}>
                    {item.split(':')[0]}:
                  </span>
                  {item.split(':')[1]}
                </>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>{String(content)}</p>;
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (error) return <div className="error">{error}</div>;
  if (!plant) return <div className="loading">Loading...</div>;

  return (
    <div className="landing-page">
      <div className="model-container">
        {plant && plant.modelUrls ? (
          <ModelContainer
            modelUrls={plant.modelUrls}
            onError={(err) => {
              console.error('Error loading 3D model:', err);
              setError('Failed to load 3D model. Please try again later.');
            }}
          />
        ) : (
          <div className="model-placeholder">3D model not available</div>
        )}
      </div>
      <div className="content-container">
        <h1 className="title">{plant.name}</h1>
        <div className="info-section">
          <h2>Botanical Name</h2>
          {renderContent(plant.botanicalName)}
        </div>
        <div className="info-section">
          <h2>Common Names</h2>
          {renderContent(plant.commonNames)}
        </div>
        <div className="info-section">
          <h2>Habitat</h2>
          {renderContent(plant.habitat)}
        </div>
        <div className="info-section">
          <h2>Medicinal Uses</h2>
          {renderContent(plant.medicinalUses)}
        </div>
        <div className="info-section recipes">
          <h2>Medicinal Recipes</h2>
          {renderContent(plant.medicinalRecipe)}
        </div>
        <div className="info-section">
          <h2>Methods of Cultivation</h2>
          {renderContent(plant.methodsOfCultivation)}
        </div>
        {plant.videos && plant.videos.length > 0 && (
          <div className="video-section">
            <div className="video-container">
              {getYouTubeVideoId(plant.videos[0]) && (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(plant.videos[0])}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
            {plant.videos.length > 1 && (
              <button className="video-button">Watch More Videos</button>
            )}
          </div>
        )}
        <button className="video-button" onClick={() => router.back()}>
          Back to Plants
        </button>
      </div>
      <style jsx>{`
        .landing-page {
          display: flex;
          min-height: 100vh;
          background-color: #abeeab;
          font-family: Arial, sans-serif;
        }
        
        .model-container {
          width: 50%;
          height: 100vh;
          background-color: #000000;
          position: fixed;
          left: 0;
          top: 0;
        }
        
        .content-container {
          width: 50%;
          padding: 2rem;
          margin-left: 50%;
          overflow-y: auto;
          max-height: 100vh;
          box-sizing: border-box;
        }
        
        .title {
          font-size: 3rem;
          color: #2c7744;
          margin-bottom: 2rem;
        }
        
        .info-section {
          background-color: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .info-section h2 {
          color: #2c7744;
          border-bottom: 2px solid #2c7744;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .info-section h3 {
          color: #3a9d5d;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .info-section ul, .info-section ol {
          padding-left: 1.5rem;
        }
        
        .info-section li {
          margin-bottom: 1rem;
        }
        
        .bullet-main {
          font-weight: bold;
          color: #2c7744;
        }
        
        .video-section {
          text-align: center;
        }
        
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .video-button {
          background-color: #2c7744;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .video-button:hover {
          background-color: #3a9d5d;
        }
        
        .recipes {
          width: 100%;
          margin-bottom: 2rem;
          padding: 1.5rem;
        }
        
        .recipes ul {
          list-style-type: none;
          padding-left: 0;
        }
        
        .recipes li {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f0f8f0;
          border-radius: 8px;
        }
        
        .recipes h3 {
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .landing-page {
            flex-direction: column;
          }
        
          .model-container {
            width: 100%;
            height: 50vh;
            position: static;
          }
        
          .content-container {
            width: 100%;
            margin-left: 0;
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PlantDetail;