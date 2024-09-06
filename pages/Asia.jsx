import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '/pages/styles/Asia.css';

export function Asia() {
  const router = useRouter();
  const [herbalPlants, setHerbalPlants] = useState([]);

  useEffect(() => {
    async function fetchPlants() {
      const response = await fetch('/api/plants');
      const data = await response.json();
      setHerbalPlants(data);
    }
    fetchPlants();
  }, []);

  const handleLearnMoreClick = (id) => {
    router.push(`/plant/${id}`);
  };

  return (
    <div className="asia-page">
      <div className="asia-title-container">
        <div className="asia-title">Asia</div>
      </div>
      <div className="cards-container">
        {herbalPlants.map((plant, index) => (
          <div className="card-container" key={plant._id}>
            <div className="card-image">
              <Image
                src={`/assets/Asia_images/${plant.imageName}`}
                alt={plant.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="card-body">
              <div className="card-content">
                <div className="card-item title">
                  {plant.name}
                </div>
                <div className="card-item description">
                  <ul>
                    <li>{plant.botanicalName}</li>
                    <li>{plant.family}</li>
                    <li>{plant.plantType}</li>
                  </ul>
                </div>
                <div className="card-item-button">
                  <button
                    className="card-button"
                    onClick={() => handleLearnMoreClick(plant._id)}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Asia;