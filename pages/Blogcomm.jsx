import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { getToken, isLoggedIn, logout } from '/utils/auth';
import EmojiPicker from 'emoji-picker-react';
import '/pages/styles/Blogcomm.css';

const Blogcomm = () => {
  const [images, setImages] = useState([]);
  const [review, setReview] = useState('');
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      fetchUserName();
      fetchPosts();
    }
  }, []);

  const fetchUserName = async () => {
    try {
      const token = getToken();
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const token = getToken();
      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      const token = getToken();
      await axios.post('/api/posts', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setImages([]);
      setReview('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const token = getToken();
      await axios.post(`/api/posts/${postId}/comments`, 
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
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
      const token = getToken();
      const response = await axios.post(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
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
    }
  };

  return (
    <div className="blogcomm-container">
      <header className="blogcomm-header">
        <h1>Community Blog</h1>
        <div className="user-info">
          <span>Welcome, {userName}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <div className="content-area">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="file-input-wrapper">
            <label htmlFor="file-upload" className="file-upload-label">
              Choose Images (Max 3)
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              max="3"
            />
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review or blog post here..."
            required
          />
          <button type="submit" className="submit-btn">Post</button>
        </form>
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post._id} className="post">
              <div className="post-header">
                <span className="post-author">{post.author.name}</span>
                <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <div className="post-images">
                {post.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    width={200}
                    height={200}
                  />
                ))}
              </div>
              <p className="post-content">{post.review}</p>
              <div className="post-actions">
                <button 
                  onClick={() => handleLike(post._id)} 
                  className={`like-button ${post.userLiked ? 'liked' : ''}`}
                >
                  👍 {post.userLiked ? 'Liked' : 'Like'}
                </button>
                <span className="like-count">
                  {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                </span>
              </div>
              <div className="comments">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <span className="comment-author">{comment.author.name}</span>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))}
              </div>
              <div className="add-comment">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={() => toggleEmojiPicker(post._id)} className="emoji-button">
                  😊
                </button>
                {showEmojiPicker[post._id] && (
                  <div className="emoji-picker-container">
                    <EmojiPicker onEmojiClick={(emojiObject) => onEmojiClick(emojiObject, post._id)} />
                  </div>
                )}
                <button onClick={() => handleComment(post._id)} className="comment-btn">Comment</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogcomm;