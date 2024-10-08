import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModelContainer from '/pages/ModelContainer.jsx';

const PlantDetail = () => {
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [medicinalUsesOpen, setMedicinalUsesOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [cultivationOpen, setCultivationOpen] = useState(false);

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
          const transformedData = JSON.parse(
            JSON.stringify(data).replace(/°/g, '\u00B0')
          );
          setPlant(transformedData.data);
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
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.includes(':') ? (
                <>
                  <span className="content-label">{item.split(':')[0]}:</span>
                  {item.split(':')[1]}
                </>
              ) : item.includes(':') ? (
                <>
                  <strong>{item.split(':')[0]}</strong>;{item.split(':').slice(1).join(':')}
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
    <div className="plant-detail-page">
      <div className="plant-model">
        {plant && plant.modelUrls ? (
          <>
            <ModelContainer
              modelUrls={plant.modelUrls}
              onError={(err) => {
                console.error('Error loading 3D model:', err);
                setError('Failed to load 3D model. Please try again later.');
              }}
            />
          </>
        ) : (
          <div className="model-placeholder">3D model not available</div>
        )}
      </div>

      <div className="info-container top-left">
        <h2>{plant.name}</h2>
        <p><strong>Botanical Name:</strong> {plant.botanicalName}</p>
        <p><strong>Common Names:</strong> {plant.commonNames}</p>
        <p><strong>Habitat:</strong> {plant.habitat}</p>
      </div>

      <div className="info-container top-right">
        <h3 onClick={() => setMedicinalUsesOpen(!medicinalUsesOpen)}>Medicinal Uses ▼</h3>
        {medicinalUsesOpen && (
          <div className="dropdown-content">
            {renderContent(plant.medicinalUses)}
          </div>
        )}
      </div>

      <div className="info-container bottom-left">
        <h3 onClick={() => setRecipesOpen(!recipesOpen)}>Medicinal Recipes ▼</h3>
        {recipesOpen && (
          <div className="dropdown-content">
            {renderContent(plant.medicinalRecipe)}
          </div>
        )}
      </div>

      <div className="info-container bottom-right">
        <h3 onClick={() => setCultivationOpen(!cultivationOpen)}>Methods of Cultivation ▼</h3>
        {cultivationOpen && (
          <div className="dropdown-content">
            {renderContent(plant.methodsOfCultivation)}
          </div>
        )}
        <div className="youtube-video">
          {plant.videos && plant.videos.length > 0 && getYouTubeVideoId(plant.videos[0]) && (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(plant.videos[0])}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>

      <button className="back-button" onClick={() => router.back()}>
        Back to Plants
      </button>

      <style jsx>{`
  .plant-detail-page {
    position: relative;
    width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: Arial, sans-serif;
    color: #333;
    background-color: #e5fade;
    background-image: linear-gradient(to right, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    background-attachment: fixed;
  }

  .plant-model {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }

  .hologram {
    position: absolute;
    bottom: -10%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 20px;
    background: radial-gradient(ellipse at center, rgba(0,255,0,0.5) 0%, rgba(0,255,0,0) 70%);
    filter: blur(5px);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  .model-placeholder {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #333;
  }

  .info-container {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 10px;
    max-width: 350px;
    max-height: 350px;
    overflow-y: auto;
    box-shadow: 0 0 15px rgba(0, 300, 0, 0.7);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .info-container:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 300, 0, 0.9);
  }

  .top-left {
    top: 20px;
    left: 20px;
  }

  .top-right {
    top: 20px;
    right: 20px;
  }

  .bottom-left {
    bottom: 20px;
    left: 20px;
  }

  .bottom-right {
    bottom: 20px;
    right: 20px;
  }

  .info-container h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #ffffff;
  }

  .info-container h3 {
    font-size: 1.2rem;
    cursor: pointer;
    user-select: none;
    color: #ffffff;
  }

  .info-container h3:hover {
    color: #00ff00;
  }

  .info-container p {
    margin-bottom: 5px;
    color: #ffffff;
  }

  .dropdown-content {
    margin-top: 10px;
    color: #ffffff;
  }

  .dropdown-content ul {
    list-style-type: none;
    padding-left: 0;
    color: #ffffff;
  }

  .dropdown-content li {
    margin-bottom: 5px;
    color: #ffffff;
  }

  .dropdown-content li strong {
    color: #00ff00;
    font-weight: bold;
  }

  .content-label {
    font-weight: bold;
    color: #00ff00;
  }

  .youtube-video {
    margin-top: 20px;
    width: 100%;
    max-width: 300px;
  }

  .youtube-video iframe {
    width: 100%;
    height: 169px; /* 16:9 aspect ratio */
  }

  .back-button {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #156d18;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .back-button:hover {
    background-color: #31c848;
  }

  .loading, .error {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
  }

  .loading {
    color: #3498db;
  }

  .error {
    color: #e74c3c;
  }

  @media (max-width: 1200px) {
    .plant-model {
      width: 50%;
      height: 50%;
    }

    .info-container {
      max-width: 300px;
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    .plant-model {
      width: 80%;
      height: 40%;
      top: 30%;
    }

    .info-container {
      max-width: 250px;
      max-height: 250px;
      font-size: 14px;
    }

    .top-left, .top-right {
      top: 10px;
    }

    .bottom-left, .bottom-right {
      bottom: 70px;
    }

    .back-button {
      bottom: 10px;
    }

    .youtube-video iframe {
      height: 113px; /* Adjusted for smaller screens */
    }
  }
`}</style>
    </div>
  );
};

export default PlantDetail;