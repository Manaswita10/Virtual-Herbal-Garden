import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { 
  getToken, 
  isLoggedIn, 
  logout, 
  refreshTokens,
  isTokenExpired,
  isTokenExpiringSoon
} from '/utils/auth';
import EmojiPicker from 'emoji-picker-react';
import { Leaf, Trash2 } from 'lucide-react';
import '/pages/styles/Blogcomm.css';

// Create axios instance with default config
const api = axios.create();

// Add request interceptor
api.interceptors.request.use(
  async config => {
    let token = getToken();
    
    // Check if token is expired or expiring soon
    if (!token || isTokenExpired(token) || isTokenExpiringSoon(token)) {
      token = await refreshTokens();
      if (!token) {
        throw new Error('Session expired');
      }
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const token = await refreshTokens();
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const Blogcomm = () => {
  const [images, setImages] = useState([]);
  const [review, setReview] = useState('');
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState({});
  const [leafAnimation, setLeafAnimation] = useState(false);
  const [userId, setUserId] = useState(null); // Add this for user identification
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      fetchUserName();
      fetchPosts();

      // Set up polling for token refresh
      const refreshInterval = setInterval(async () => {
        try {
          await refreshTokens();
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
          router.push('/login');
        }
      }, 4 * 60 * 1000); // Check every 4 minutes

      return () => clearInterval(refreshInterval);
    }
    setTimeout(() => setLeafAnimation(true), 500);
  }, []);

  const fetchUserName = async () => {
    try {
      const response = await api.get('/api/user');
      setUserName(response.data.name);
      setUserId(response.data._id); // Store user ID for post ownership checks
    } catch (error) {
      console.error('Error fetching user name:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert('You can only upload up to 3 images');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim()) {
      alert('Please write a review before posting.');
      return;
    }
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    formData.append('review', review.trim());

    try {
      await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([]);
      setReview('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/api/posts/${postId}`);
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
        if (error.response?.status === 401) {
          logout();
          router.push('/login');
        }
      }
    }
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      await api.post(`/api/posts/${postId}/comments`, { content: comment });
      setComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleEmojiPicker = (postId) => {
    setShowEmojiPicker(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const onEmojiClick = (emojiObject, postId) => {
    setComment(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(prev => ({ ...prev, [postId]: false }));
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likesCount: response.data.likesCount,
              userLiked: response.data.userLiked
            } 
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
    }
  };

  return (
    <div className="blogcomm-container">
      <div className="animated-leaves">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`floating-leaf ${leafAnimation ? 'animate' : ''}`}
            style={{ 
              animationDelay: `${i * 0.3}s`,
              left: `${Math.random() * 100}%`
            }}
          >
            <Leaf size={24} />
          </div>
        ))}
      </div>

      <header className="blogcomm-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-leaf">🌿</span>
            <h1>Plant Community Blog</h1>
          </div>
          
          <div className="user-section">
            <div className="user-welcome">
              <span className="welcome-text">Welcome,</span>
              <span className="user-name">{userName}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-header">
            <h2>Share Your Plant Story</h2>
            <p>Share your experiences with the community</p>
          </div>

          <div className="form-content">
            <label className="upload-area">
              <input
                type="file"
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden-input"
                max="3"
              />
              <span className="upload-icon">📸</span>
              <span className="upload-text">Add Photos (Max 3)</span>
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about your favorite plants..."
              required
              className="post-textarea"
            />

            <button type="submit" className="submit-btn">
              <span>Share Post</span>
              <span className="sparkle">✨</span>
            </button>
          </div>
        </form>

        <div className="posts-container">
          {posts.map((post) => (
            <article key={post._id} className="post">
              <div className="post-header">
                <div className="author-info">
                  <div className="author-avatar">
                    {post.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="post-author">{post.author.name}</h3>
                    <time className="post-date">
                      {new Date(post.createdAt).toLocaleString()}
                    </time>
                  </div>
                </div>
                {post.author._id === userId && (
                  <button 
                    onClick={() => handleDelete(post._id)}
                    className="delete-btn"
                    aria-label="Delete post"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              <p className="post-content">{post.review}</p>

              {post.images.length > 0 && (
                <div className={`post-images images-${post.images.length}`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="image-wrapper">
                      <div className="image-container">
                        <Image
                          src={image}
                          alt={`Post image ${index + 1}`}
                          layout="fill"
                          objectFit="contain"
                          className="post-image"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="post-actions">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`like-button ${post.userLiked ? 'liked' : ''}`}
                >
                  <span>{post.userLiked ? '❤️' : '🤍'}</span>
                  <span className="like-count">{post.likesCount}</span>
                </button>
              </div>

              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <div className="comment-avatar">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-content">
                        <span className="comment-author">{comment.author.name}</span>
                        <p>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="add-comment">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="comment-input"
                  />
                  <button 
                    onClick={() => toggleEmojiPicker(post._id)}
                    className="emoji-button"
                  >
                    😊
                  </button>
                  <button 
                    onClick={() => handleComment(post._id)}
                    className="comment-btn"
                  >
                    Post
                  </button>

                  {showEmojiPicker[post._id] && (
                    <div className="emoji-picker-container">
                      <EmojiPicker 
                        onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, post._id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blogcomm;