import React from 'react';
import Image from 'next/image';
import { Search, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/router';
import '/pages/styles/shop.css';

export default function Shop() {
  const router = useRouter();

  const handleShowShop = () => {
    router.push('/shop-locator');
  };

  return (
    <div className="shop-container">
      <header className="header">
        <div className="logo">
          <Image src="/placeholder.svg?height=24&width=24" alt="Planten Logo" width={24} height={24} />
          <span>Ayurvista</span>
        </div>
        <nav>
          <a href="#plant">Plant</a>
          <a href="#accesories">Accesories</a>
          <a href="#community">Community</a>
          <a href="#shop">Shop</a>
        </nav>
        <div className="header-icons">
          <Search />
          <ShoppingCart />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Life in love with plants</h1>
            <div className="hero-stats">
              <div>
                <h2>280+</h2>
                <p>Shops around all over the world</p>
              </div>
            </div>
            <p className="hero-description">
              Plants are mainly multicellular organisms, predominantly photosynthetic eukaryotes of
              the kingdom Plantae. Historically, plants were treated as one of two kingdoms including all
              living things that were not animals.
            </p>
            <button className="cta-button" onClick={handleShowShop}>Show the shop</button>
          </div>
          <div className="hero-image-container">
            <div className="arch">
              <Image src="/assets/shop container1.png?height=600&width=400" alt="Featured Plant" width={400} height={600} className="featured-plant" />
            </div>
          </div>
          <div className="hero-content right-content">
            <div className="hero-stats">
              <div>
                <h2>325+</h2>
                <p>Unique plant including signature items</p>
              </div>
            </div>
          </div>
        </section>

        <section className="decorate">
          <div className="decorate-image">
            <Image src="/assets/plant-icon.png?height=400&width=400" alt="Decorative Plant" width={400} height={400} />
          </div>
          <div className="decorate-content">
            <h2>Decorate your home with natural beauty</h2>
            <p>
              Green plants obtain most of their energy from sunlight via photosynthesis by primary
              chloroplasts that are derived from endosymbiosis with cyanobacteria.
            </p>
            <button className="secondary-button">Read more</button>
          </div>
          <div className="decorate-image">
            <Image src="/assets/shop container2.png?height=400&width=300" alt="Another Decorative Plant" width={300} height={400} />
          </div>
        </section>
      </main>
    </div>
  );
}