import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Link, Search, Copy } from 'lucide-react';
import '/pages/styles/ShareModal.css';
import { getToken } from '/utils/auth.js';

const shareOptions = [
  { name: 'WhatsApp', icon: '/icon/whatsapp.png' },
  { name: 'Facebook', icon: '/icon/facebook.png' },
  { name: 'Instagram', icon: '/icon/instagram.png' },
  { name: 'Gmail', icon: '/icon/gmail.png' },
  { name: 'Twitter', icon: '/icon/twitter.png' },
  { name: 'Messages', icon: '/icon/messages.png' },
];

const FallingFlowers = () => {
  return (
    <div className="flowers-container">
      {[...Array(20)].map((_, index) => (
        <div 
          key={index} 
          className="flower"
          style={{
            '--fall-duration': `${Math.random() * 10 + 10}s`,
            '--fall-delay': `${Math.random() * 5}s`,
            '--start-pos': `${Math.random() * 100}%`,
            '--rotation': `${Math.random() * 360}deg`,
            '--size': `${Math.random() * 20 + 10}px`
          }}
        >
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="center"></div>
        </div>
      ))}
    </div>
  );
};

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  const userInitials = user && user.name ? getInitials(user.name) : '';
  const userName = user && user.name ? user.name : 'User';

  const modalContent = (
    <div className="modal-overlay">
      <FallingFlowers />
      <div className="modal-content">
        <div className="glass-effect"></div>
        <div className="modal-header">
          <h2>Share link</h2>
          <button onClick={onClose} className="close-button" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <div className="share-url-container">
          <Link size={20} className="link-icon" />
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="share-url-input"
          />
          <button
            onClick={handleCopy}
            className={`copy-button ${copied ? 'copied' : ''}`}
            aria-label="Copy link"
          >
            <Copy size={20} />
            <span className="copy-tooltip">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for people or email"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <span className="avatar-text">{userInitials}</span>
            <div className="avatar-ring"></div>
          </div>
          <div>
            <p className="user-name">{userName}</p>
            {userName !== 'User' && <p className="user-status">(You)</p>}
          </div>
        </div>

        <h3 className="section-title">Share using</h3>
        <div className="share-options">
          {shareOptions.map((option, index) => (
            <div 
              key={option.name} 
              className="share-option"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="share-icon-wrapper">
                <img src={option.icon} alt={option.name} className="share-icon" />
              </div>
              <span className="share-name">{option.name}</span>
            </div>
          ))}
        </div>

        <h3 className="section-title">Nearby Share</h3>
        <div className="nearby-share">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="nearby-share-item"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="pulse-ring"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ShareModal;