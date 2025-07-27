'use client';
import { isLoggedIn, logout } from '/utils/auth.js';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '/pages/styles/LandingPage.css';
import { Send, X, MessageSquare, Leaf } from 'lucide-react'; // Added Leaf here
import Link from 'next/link';
const LandingPage = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      text: "🌿 Hello! I'm your Virtual Herbal Expert. Ask me anything about medicinal plants, herbs, and traditional remedies!", 
      isBot: true 
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

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

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message to chat
    const newUserMessage = { text: userInput, isBot: false };
    setChatMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Add bot response to chat
      setChatMessages(prevMessages => [
        ...prevMessages,
        { text: data.reply, isBot: true }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prevMessages => [
        ...prevMessages,
        { 
          text: "🌿 I'm having trouble connecting right now. Please try again in a moment.", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <header>
        <nav className="navbar">
          <Link href="/" className="logo">
            <Leaf className="logo-icon" />
            <span>Ayurvista</span>
          </Link>
          <ul>
            <li>HOME</li>
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

      <div className="content">
        <div className="content-text">
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
        <img src="/assets/plant-icon.png" alt="Plant Icon" className="plant-icon" />
      </div>
      
      {/* Enhanced Chatbot */}
      <div className={`chatbot-container ${isChatbotOpen ? 'open' : ''}`}>
        {!isChatbotOpen && (
          <button 
            className="chatbot-toggle" 
            onClick={() => setIsChatbotOpen(true)}
            aria-label="Open herbal expert chat"
          >
            <MessageSquare className="toggle-icon" />
            <span>Ask Your Herbal Expert🌿 </span>
          </button>
        )}
        {isChatbotOpen && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <div className="header-content">
                <div className="header-icon">🌿</div>
                <h3>Virtual Herbal Expert</h3>
              </div>
              <button 
  onClick={() => setIsChatbotOpen(false)}
  aria-label="Close chat"
  className="close-button"
>
  <X size={20} />
</button>
            </div>
            <div className="chatbot-messages" role="log">
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.isBot ? 'bot' : 'user'}`}
                  role={message.isBot ? 'status' : 'comment'}
                >
                  {message.isBot && <div className="bot-icon">🌿</div>}
                  <div className="message-content">{message.text}</div>
                </div>
              ))}
              {isLoading && (
                <div className="message bot typing">
                  <div className="bot-icon">🌿</div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about any medicinal plants..."
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isLoading || !userInput.trim()}
                className="send-button"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;