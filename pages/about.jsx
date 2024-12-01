import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Leaf, Heart, Globe, Users, Award, BookOpen, Sun, Moon } from 'lucide-react';
import '/pages/styles/About.css';

const AboutUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);

    // Initialize intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(
      el => observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  const teamMembers = [
    {
      name: "Arshavi Roy",
      role: "Machine Learning expert",
      image: "/assets/arshavi.jpg",
      description: "Team leader and worked in ML core for plant recognition system."
    },
    {
      name: "Manaswita Chakraborty",
      role: "Backend Developer and cloud practitioner",
      image: "/assets/manaswita.jpg",
      description: "Backend and API handling and AWS S3 integration"
    },
    {
      name: "Rupsha Singha Ray",
      role: "Frontend Developer",
      image: "/assets/rupsha.jpg",
      description: "Specialized in designing and creating immersive virtual botanical experiences."
    },
    {
      name: "Soubhagyo Das",
      role: "3d modeler and video content creator",
      image: "/assets/soubhagyo.jpg",
      description: "3d plant models rendering and video editing"
    }
  ];

  const stats = [
    { icon: <Leaf className="stat-icon" />, number: "1000+", label: "Medicinal Plants" },
    { icon: <Heart className="stat-icon" />, number: "50K+", label: "Happy Users" },
    { icon: <Globe className="stat-icon" />, number: "100+", label: "Countries Reached" },
    { icon: <Award className="stat-icon" />, number: "25+", label: "Awards Won" }
  ];

  return (
    <div className={`about-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Animated Background */}
      <div className="herb-pattern-overlay"></div>
      
      {/* Theme Toggle */}
      <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content animate-on-scroll" id="hero">
          <h1 className="hero-title">
            Virtual Herbal Garden
            <span className="title-underline"></span>
          </h1>
          <p className="hero-subtitle">Bridging Ancient Wisdom with Modern Technology</p>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>Scroll to Explore</span>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section animate-on-scroll" id="mission">
        <div className="section-content">
          <h2 className="section-title">Our Mission</h2>
          <div className="mission-cards">
            <div className="mission-card">
              <div className="card-icon">🌿</div>
              <h3>Preserve</h3>
              <p>Documenting and preserving traditional herbal knowledge for future generations</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">🔬</div>
              <h3>Research</h3>
              <p>Conducting cutting-edge research on medicinal plants and their properties</p>
            </div>
            <div className="mission-card">
              <div className="card-icon">🌍</div>
              <h3>Share</h3>
              <p>Making herbal knowledge accessible to everyone through digital innovation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section animate-on-scroll" id="story">
        <div className="story-timeline">
          <div className="timeline-container">
            {[2018, 2019, 2020, 2021, 2022, 2023].map((year, index) => (
              <div 
                key={year}
                className={`timeline-item ${activeStory === index ? 'active' : ''}`}
                onClick={() => setActiveStory(index)}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>{year}</h3>
                  <p className="timeline-text">
                    {index === 0 && "digitize herbal knowledge"}
                    {index === 1 && "first virtual garden experience"}
                    {index === 2 && "Expanded to include 3D plant models"}
                    {index === 3 && "Introduced AI-powered plant identification"}
                    {index === 4 && "Reached 50,000 users worldwide"}
                    {index === 5 && "Launched research portal"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section animate-on-scroll" id="stats">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              {stat.icon}
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section animate-on-scroll" id="team">
        <h2 className="section-title">Meet Our Creators</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-image-container">
                <div className="member-image" style={{ backgroundImage: `url(${member.image})` }}>
                  <div className="image-overlay"></div>
                </div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section animate-on-scroll" id="values">
        <div className="values-content">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>Promoting sustainable practices in herbal medicine and conservation</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Working together with traditional healers and modern scientists</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>Leveraging technology to preserve and share botanical knowledge</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Accuracy</h3>
              <p>Ensuring precise and reliable information about medicinal plants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section animate-on-scroll" id="cta">
        <div className="cta-content">
          <h2>Join Our Green Journey</h2>
          <p>Explore the fascinating world of medicinal plants with us</p>
          <button onClick={() => router.push('/')} className="cta-button">
            Start Exploring
          </button>
        </div>
      </section>
    </div>
  );
};


export default AboutUs;