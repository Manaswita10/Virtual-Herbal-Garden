'use client';
import { isLoggedIn, logout } from '/utils/auth.js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '/pages/styles/LandingPage.css';

const LandingPage = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hi there! Need any assistance?", isBot: true },
    { text: "How can I help you today?", isBot: true }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsUserLoggedIn(isLoggedIn());
    };

    checkLoginStatus();
    const intervalId = setInterval(checkLoginStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    router.push('/EarthModel');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleSearchClick = () => {
    router.push('/SearchPage');
  };

  const handleBlogClick = () => {
    router.push('/Blog');
  };

  const handleLoginClick = () => {
    router.push('/login');
    setIsDropdownOpen(false);
  };
  const handleConsultationClick = () => {
    router.push('/Doctor')
  }
  const handleshopClick = () => {
    router.push('/shop')
  }

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

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === '') return;

    const newUserMessage = { text: userInput, isBot: false };
    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);

    if (userInput.toLowerCase() === "what are the uses of aloevera?") {
      setIsGenerating(true);
      setTimeout(() => {
        const botReply = {
          text: `Aloe vera is a medicinal plant with many uses, including:

* Skincare
Aloe vera gel can soothe and moisturize the skin, and is used to treat a range of skin conditions, including:
   * Acne: Aloe gel can be more effective than prescription acne medicine when applied in the morning and evening.
   * Psoriasis: Aloe extract cream can reduce redness, itching, scaling, and inflammation.
   * Burns and wounds: Aloe gel can shorten the healing time for first- and second-degree burns.
   * Sunburn: Aloe vera can help relieve sunburn.

* Hair health
Aloe vera can reduce dandruff and promote healthy hair growth.

* Oral lichen planus
Applying aloe gel twice a day for eight weeks can help reduce symptoms of this inflammatory condition.

* Constipation
Aloe vera can act as a natural laxative, but aloe latex can also cause abdominal cramps and diarrhea.

* Fasting blood sugar
Preliminary research suggests that aloe vera juice may improve fasting blood sugar levels in people with pre-diabetes.

Aloe vera can be applied topically or taken orally as a juice or gel.`,
          isBot: true
        };
        setChatMessages(prevMessages => [...prevMessages, botReply]);
        setIsGenerating(false);
      }, 3000); // 3 seconds delay
    } else {
      const botReply = {
        text: "I'm sorry, I can only answer questions about the uses of aloe vera. If you'd like to know about that, please ask 'What are the uses of aloevera?'",
        isBot: true
      };
      setChatMessages(prevMessages => [...prevMessages, botReply]);
    }

    setUserInput('');
  };

  return (
    <div>
      <header>
        <img src="/assets/logo.gif" alt="Website Logo" className="website-logo" />
        <div className="title">Ministry Of AYUSH</div>
        <nav className="navbar">
          <ul>
            <li>HOME</li>
            <li onClick={handleSearchClick}>SEARCH</li>
            <li onClick={handleAboutClick}>ABOUT</li>
            <li onClick={handleshopClick}>SHOP</li>
            <li onClick={handleConsultationClick}>CONSULTATION</li>
            <li onClick={handleBlogClick}>BLOG</li>
            <li>CONTACT US</li>
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
          <img src="/assets/Asia_images/plant3.png" alt="Plant Image" className="plant-image"/>
        </div>
      </div>
      <div className="plant-icon-container">
        <img src="/assets/plant-icon.png" alt="Plant Icon" className="plant-icon"  />
      </div>
      
      {/* Chatbot */}
      <div className={`chatbot-container ${isChatbotOpen ? 'open' : ''}`}>
        {!isChatbotOpen && (
          <button className="chatbot-toggle" onClick={toggleChatbot}>
            Hi there! Need any assistance?
          </button>
        )}
        {isChatbotOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h3>Virtual Herbal Assistant</h3>
              <button onClick={toggleChatbot}>Close</button>
            </div>
            <div className="chatbot-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                  {message.text}
                </div>
              ))}
              {isGenerating && (
                <div className="message bot">
                  <div className="generating-animation">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
              )}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                placeholder="Type your question here..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;