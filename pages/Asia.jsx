import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import '/pages/styles/Asia.css'; // Adjust the path to your CSS file

export function Asia() {
  const router = useRouter();

  const herbalPlants = [
    {
      name: 'Thai Basil',
      description: [
        'Botanical Name: Ocimum basilicum var. thyrsiflora',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous',
        
      ],
      route: '/Thai-basil' // Add route for each plant if you want different pages for each
    },
    {
      name: 'Brahmi',
      description: [
        'Botanical Name: Bacopa monnieri',
        'Family: Plantaginaceae',
        'Plant Type: Perennial',
        
      ],
      route: '/Brahmi'
    },
    {
      name: 'Ashwagandha',
      description: [
        'Botanical Name: Withania somnifera',
        'Family: Solanaceae',
        'Plant Type: Shrub',
        
      ],
      route: '/Ashwagandha'
    },
    {
      name: 'Giloy',
      description: [
        'Botanical Name: Tinospora cordifolia',
        'Family: Menispermaceae',
        'Plant Type: Climber',
        
      ],
      route: '/Giloy'
    },
    {
      name: 'Aloe Vera',
      description: [
        'Botanical Name: Aloe barbadensis miller',
        'Family: Asphodelaceae',
        'Plant Type: Succulent',
        
      ],
      route: '/Aloevera' 
    },
    {
      name: 'Mint',
      description: [
        'Botanical Name: Mentha',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous, Perennial',
        
      ],
      route: '/Mint'
    },
    {
      name: 'Mint',
      description: [
        'Botanical Name: Mentha',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous, Perennial',
        
      ],
      route: '/Mint'
    },
    {
      name: 'Mint',
      description: [
        'Botanical Name: Mentha',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous, Perennial',
        
      ],
      route: '/Mint'
    },
    {
      name: 'Mint',
      description: [
        'Botanical Name: Mentha',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous, Perennial',
        
      ],
      route: '/Mint'
    },
    {
      name: 'Mint',
      description: [
        'Botanical Name: Mentha',
        'Family: Lamiaceae',
        'Plant Type: Herbaceous, Perennial',
        
      ],
      route: '/Mint'
    },

    
  ];

  const handleLearnMoreClick = (route) => {
    router.push(route); // Navigate to the specific route
  };

  return (
    <div className="asia-page">
      <div className="asia-title-container">
        <div className="asia-title">Asia</div>
      </div>
      <div className="cards-container">
        {herbalPlants.map((plant, index) => (
          <div className="card-container" key={index}>
            <div className="card-image">
              <Image
                src={`/assets/Asia_images/herb${index + 1}.png`}
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
                    {plant.description.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-item-button">
                  <button
                    className="card-button"
                    onClick={() => handleLearnMoreClick(plant.route)}
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
