import React, { useState } from 'react';
import ModelContainer from '/pages/ModelContainer.jsx';
import '/pages/styles/Aloevera.css';
import Image from 'next/image';

export default function Aloevera() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoId = "kHsQYCM_sQs"; // Aloe Vera care video

  return (
    <div className="landing-page">
      <div className="model-container">
        <ModelContainer />
      </div>
      
      <div className="content-container">
        <h1 className="title">Aloe Vera</h1>
        
        <div className="info-section">
          <p><strong>Common Name:</strong> Aloe Vera</p>
          <p><strong>Botanical Name:</strong> Aloe barbadensis miller</p>
          <p><strong>Habitat:</strong> Native to the Arabian Peninsula, but cultivated worldwide in tropical and subtropical regions.</p>
        </div>
        
        <div className="info-section">
          <h2>Medicinal Uses</h2>
          <h3>Skin Care</h3>
          <ul>
            <li>Treats sunburn and minor burns</li>
            <li>Moisturizes skin</li>
            <li>Reduces inflammation and itching</li>
            <li>Helps with acne and eczema</li>
          </ul>
          
          <h3>Digestive Health</h3>
          <ul>
            <li>Alleviates constipation</li>
            <li>Reduces inflammation in irritable bowel syndrome</li>
            <li>Supports gut health</li>
          </ul>
          
          <h3>Other Benefits</h3>
          <ul>
            <li>Boosts oral health</li>
            <li>Supports diabetes management</li>
            <li>Enhances wound healing</li>
          </ul>
        </div>
        
        <div className="info-section recipes">
          <h2>Medicinal Recipes</h2>
          <ul>
            <li>
              <h3>Aloe Vera Juice</h3>
              <p><strong>Ingredients:</strong> 2 tbsp fresh aloe vera gel, 1 cup water or fruit juice</p>
              <p><strong>Instructions:</strong> Blend ingredients until smooth. Drink daily for digestive health.</p>
              <p><strong>Benefits:</strong> Improves digestion, boosts hydration, supports immune system</p>
            </li>
            <li>
              <h3>Sunburn Relief Gel</h3>
              <p><strong>Ingredients:</strong> 1/4 cup aloe vera gel, 2 drops lavender essential oil</p>
              <p><strong>Instructions:</strong> Mix ingredients and apply to sunburned skin for soothing relief.</p>
              <p><strong>Benefits:</strong> Reduces inflammation, cools skin, promotes healing</p>
            </li>
            <li>
              <h3>Aloe Face Mask</h3>
              <p><strong>Ingredients:</strong> 2 tbsp aloe vera gel, 1 tbsp honey</p>
              <p><strong>Instructions:</strong> Combine ingredients, apply to face for 15 minutes, then rinse.</p>
              <p><strong>Benefits:</strong> Hydrates skin, reduces acne, soothes irritation</p>
            </li>
          </ul>
        </div>
        
        <div className="info-section">
          <h2>Methods of Cultivation</h2>
          <ol>
            <li><strong>Soil:</strong> Well-draining, sandy soil mix</li>
            <li><strong>Sunlight:</strong> Bright, indirect light; can tolerate some direct sun</li>
            <li><strong>Watering:</strong> Allow soil to dry between waterings; reduce in winter</li>
            <li><strong>Temperature:</strong> Prefers 55-80°F (13-27°C)</li>
            <li><strong>Propagation:</strong> From offsets or leaf cuttings</li>
            <li><strong>Fertilization:</strong> Feed with balanced fertilizer in growing season</li>
          </ol>
        </div>
        
        <div className="video-section">
          <h2>Learn More About Aloe Vera</h2>
          <div className="video-container">
            <iframe
              src={ `https://www.youtube.com/embed/${videoId}${videoPlaying ? '?autoplay=1' : ''}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button 
            className="video-button"
            onClick={() => setVideoPlaying(!videoPlaying)}
          >
            {videoPlaying ? 'Pause Video' : 'Play Video'}
          </button>
        </div>
      </div>
    </div>
  );
}
