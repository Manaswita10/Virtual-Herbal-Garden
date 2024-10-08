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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Attempting to fetch user data...');
        const token = getToken();
        console.log('Token from localStorage:', token ? 'Found' : 'Not found');
        
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API response status:', response.status);

        if (response.ok) {
          const userData = await response.json();
          console.log('User data received:', userData);
          setUser(userData);
        } else {
          const errorData = await response.text();
          console.error('Failed to fetch user data. Server response:', errorData);
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  console.log('User data in ShareModal:', user);

  const userInitials = user && user.name ? getInitials(user.name) : '';
  const userName = user && user.name ? user.name : 'User';

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Share link</h2>
          <button onClick={onClose} className="close-button">
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
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="copy-button"
          >
            <Copy size={20} />
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
          <div className="user-avatar">{userInitials}</div>
          <div>
            <p className="user-name">{userName}</p>
            {userName !== 'User' && <p className="user-status">(You)</p>}
          </div>
        </div>

        <h3 className="section-title">Share using</h3>
        <div className="share-options">
          {shareOptions.map((option) => (
            <div key={option.name} className="share-option">
              <img src={option.icon} alt={option.name} className="share-icon" />
              <span className="share-name">{option.name}</span>
            </div>
          ))}
        </div>

        <h3 className="section-title">Nearby Share</h3>
        <div className="nearby-share">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="nearby-share-item"></div>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ShareModal;