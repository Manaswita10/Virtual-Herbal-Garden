import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
    router.push(`/plants/${id}`);  // Make sure only the ID is passed, not the entire object
  };
  
  return (
    <div className="asia-page">
      <div className="asia-title-container">
        <div className="asia-title">Asia</div>
      </div>
      <div className="cards-container">
        {herbalPlants.map((plant) => (
          <div className="card-container" key={plant._id}>
            <div className="card-image">
              <Image
                src={`/assets/Asia_images/${plant.imageName}`}
                alt={plant.name}
                width={300}
                height={200}
                layout="responsive"
              />
            </div>
            <div className="card-body">
              <div className="card-content">
                <div className="card-item title">{plant.name}</div>
                <div className="card-item description">
                  <ul>
                    <li>{plant.botanicalName}</li>
                    <li>{plant.commonNames}</li>

                  </ul>
                </div>
                <div className="card-item-button">
                  <button
                    className="card-button"
                    onClick={() => handleLearnMoreClick(plant._id)}  // Ensure _id is passed correctly
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
