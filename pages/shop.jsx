'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, ChevronRight, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import '/pages/styles/shop.css';
import { isLoggedIn, logout } from '/utils/auth.js';
import Link from 'next/link';

export default function Shop() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleShowShop = () => {
    router.push('/shop-locator');
  };

  // Navbar handlers
  const handleSearchClick = () => {
    router.push('/SearchPage');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleBlogClick = () => {
    router.push('/Blog');
  };

  const handleContactUsClick = () => {
    router.push('/ContactUs');
  };

  const handleLoginClick = () => {
    router.push('/login');
    setIsDropdownOpen(false);
  };

  const handleConsultationClick = () => {
    router.push('/Doctor');
  };

  const handleshopClick = () => {
    router.push('/shop');
  };

  const handleLogoutClick = () => {
    logout();
    setIsUserLoggedIn(false);
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsDropdownOpen(false);
  };

  const handleBookmarksClick = () => {
    router.push('/bookmarks');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="shop-container">
      <header>
        <nav className="navbar">
          <Link href="/" className="logo">
            <Leaf className="logo-icon" />
            <span>Ayurvista</span>
          </Link>
          <ul>
            <li onClick={() => router.push('/')}>HOME</li>
            <li onClick={handleSearchClick}>SEARCH</li>
            <li onClick={handleAboutClick}>ABOUT</li>
            <li onClick={handleshopClick}>SHOP</li>
            <li onClick={handleConsultationClick}>CONSULTATION</li>
            <li onClick={handleBlogClick}>BLOG</li>
            <li onClick={handleContactUsClick}>CONTACT US</li>
          </ul>
          <div className="profile-icon-container" onClick={toggleDropdown}>
            <img src="/assets/icon.png" alt="Profile" className="profile-icon-img" />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {isUserLoggedIn ? (
                  <>
                    <button onClick={handleProfileClick}>My Profile</button>
                    <button onClick={handleBookmarksClick}>My Bookmarks</button>
                    <button onClick={handleLogoutClick}>Logout</button>
                  </>
                ) : (
                  <button onClick={handleLoginClick}>Login</button>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text-container">
              <h1 className="hero-title">Life in love with plants</h1>
              <div className="hero-stats">
                <div className="stat-item">
                  <h2>280+</h2>
                  <p>Shops around all over the world</p>
                </div>
              </div>
              <p className="hero-description">
                Plants are mainly multicellular organisms, predominantly photosynthetic eukaryotes of
                the kingdom Plantae. Historically, plants were treated as one of two kingdoms including all
                living things that were not animals.
              </p>
              <button className="cta-button" onClick={handleShowShop}>
                Show the shop
                <ChevronRight className="button-icon" />
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="arch">
              <Image
                src="/assets/shop container1.png?height=600&width=400"
                alt="Featured Plant"
                width={400}
                height={600}
                className="featured-plant"
                priority
              />
            </div>
          </div>

          <div className="hero-content right-content">
            <div className="hero-stats">
              <div className="stat-item">
                <h2>325+</h2>
                <p>Unique plant including signature items</p>
              </div>
            </div>
          </div>
        </section>

        <section className="decorate">
          <div className="decorate-image-container">
            <Image
              src="/assets/plant-icon.png?height=400&width=400"
              alt="Decorative Plant"
              width={400}
              height={400}
              className="decorate-img"
            />
          </div>
          
          <div className="decorate-content">
            <div className="content-wrapper">
              <h2 className="decorate-title">Decorate your home with natural beauty</h2>
              <p className="decorate-description">
                Green plants obtain most of their energy from sunlight via photosynthesis by primary
                chloroplasts that are derived from endosymbiosis with cyanobacteria.
              </p>
              <button className="secondary-button">
                Read more
                <ChevronRight className="button-icon" />
              </button>
            </div>
          </div>

          <div className="decorate-image-container">
            <Image
              src="/assets/shop container2.png?height=400&width=300"
              alt="Another Decorative Plant"
              width={300}
              height={400}
              className="decorate-img"
            />
          </div>
        </section>
      </main>
    </div>
  );
}