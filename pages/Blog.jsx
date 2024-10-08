import React from 'react';
import '/pages/styles/Blog.css';
import Link from 'next/link';

const Blog = () => {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <div className="logo">Blog review</div>
        <div className="header-right">
        </div>
      </header>
      
      <main className="blog-content">
        <article className="main-article">
          <img src="/assets/blog1.jpg" alt="Fashion model" className="article-image" />
          <div className="article-content">
            <h1>Review your favorite plants and share your experiences with the community!</h1>
            <Link href="/Blogcomm">
                  <button className="join-comm-btn">Join Community</button>
            </Link>
            <div className="article-meta">
            </div>
          </div>
        </article>
        
        <aside className="side-articles">
          <article className="side-article">
            <img src="/assets/blog2.webp" alt="Summer fashion" className="side-article-image" />
            <div className="side-article-content">
              <h2>Join the conversation, what is your top plant pick this season?</h2>
            </div>
          </article>
          
          <article className="side-article">
            <img src="/assets/Blog3.jpeg" alt="Fitness" className="side-article-image" />
            <div className="side-article-content">
              <h2>Got plant problems? Our blog is full of solutions to keep your garden thriving!</h2>
            </div>
          </article>
        </aside>
      </main>
    </div>
  );
};

export default Blog;