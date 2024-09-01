'use client';

import '/pages/styles/LandingPage.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
const LandingPage = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/EarthModel');
  };

  return (
    <div>
      <header>
        <Image src="/assets/logo.gif" alt="Website Logo" className="website-logo" width={100} height={100} />
        <div className="title">Ministry Of AYUSH</div>
        <nav className="navbar">
          <ul>
            <li>HOME</li>
            <li>SEARCH</li>
            <li>REMEDIES</li>
            <li>CONSULTATION</li>
            <li>SHOP</li>
            <li>ABOUT</li>
          </ul>
        </nav>
      </header>
      <div className="content">
        <div>
          <h1 className="main-heading">Virtual Herbal Garden</h1>
          <p className="description">
            Welcome to the Virtual Herbal Garden, where you can explore a vast collection of 
            herbs and medicinal plants from the comfort of your home.
          </p>
          <div className="explore-button-container">
            <div className="leaf leaf-left"></div>
            <div className="leaf leaf-right"></div>
            <button className="explore-button" onClick={handleClick}>
              Start The Virtual Tour
            </button>
          </div>
        </div>
        <div className="image-section">
          <Image src="/assets/Asia_images/plant3.png" alt="Plant Image" className="plant-image" width={100} height={100}/>
        </div>
      </div>
      <div className="plant-icon-container">
        <Image src="/assets/plant-icon.png" alt="Plant Icon" className="plant-icon" width={100} height={100} />
      </div>
    </div>
  );
};

export default LandingPage;