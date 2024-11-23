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
      {plant.videos && plant.videos.length > 0 && getYouTubeVideoId(plant.videos[0]) && (
        <div className="youtube-video">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(plant.videos[0])}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  )}
</div>

      <button className="back-button" onClick={() => router.back()}>
        Back to Plants
      </button>

      <style jsx>{`
  .plant-detail-page {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  background: #0a0f0d;
  color: #ffffff;
  overflow: hidden;
}

.plant-detail-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background: 
    linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

.plant-model {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 1;
}

.info-container {
  position: fixed;
  background: rgba(15, 26, 15, 0.95);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 15px;
  padding: 20px;
  width: 350px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 
    0 0 20px rgba(76, 175, 80, 0.2),
    inset 0 0 10px rgba(76, 175, 80, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 10;
}

/* Container Positions */
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

/* Adjust positions when dropdowns are open */
.bottom-left.expanded,
.bottom-right.expanded {
  bottom: auto;
  top: 20px;
}

.top-right.expanded,
.bottom-right.expanded {
  right: 20px;
}

/* Scrollbar Styling */
.info-container::-webkit-scrollbar {
  width: 6px;
}

.info-container::-webkit-scrollbar-track {
  background: rgba(76, 175, 80, 0.1);
  border-radius: 3px;
}

.info-container::-webkit-scrollbar-thumb {
  background: rgba(76, 175, 80, 0.5);
  border-radius: 3px;
}

/* Content Styling */
.info-container h2 {
  color: #4CAF50;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.info-container h3 {
  color: #4CAF50;
  font-size: 1.3rem;
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.3s ease;
}

.info-container h3:hover {
  color: #69F0AE;
}

.dropdown-content {
  margin-top: 10px;
  padding: 15px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  animation: fadeIn 0.3s ease-out;
}

.dropdown-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-content li {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #e0e0e0;
  padding-left: 20px;
  position: relative;
}

.dropdown-content li::before {
  content: '•';
  color: #4CAF50;
  position: absolute;
  left: 0;
}

.youtube-video {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.youtube-video iframe {
  width: 100%;
  height: 200px;
  border: none;
}

.back-button {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.back-button:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .info-container {
    width: calc(100% - 40px);
    max-height: 70vh;
  }

  .bottom-left.expanded,
  .bottom-right.expanded {
    top: 50%;
    transform: translateY(-50%);
  }
}
`}</style>
    </div>
  );
};

export default PlantDetail;