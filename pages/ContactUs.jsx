import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, MapPin, Clock, Leaf } from 'lucide-react';
import '/pages/styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [leafAnimation, setLeafAnimation] = useState(false);

  useEffect(() => {
    // Trigger leaf animation on mount
    setTimeout(() => setLeafAnimation(true), 500);

    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme ? savedTheme === 'dark' : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Thank you for your message! We will get back to you soon.');
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`contact-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Animated Background Elements */}
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

      <div className="content-wrapper">
        <h1 className="main-title">
          Get in Touch
          <span className="title-decoration"></span>
        </h1>

        <div className="contact-content">
          {/* Info Section */}
          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">
                <MapPin size={24} />
              </div>
              <h3>Visit Us</h3>
              <p>Uttarpara, Bally<br />Kotrung 712258, Kokata<br />India</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Clock size={24} />
              </div>
              <h3>Opening Hours</h3>
              <p>Monday - Friday: 9 AM - 6 PM<br />Saturday: 10 AM - 4 PM<br />Sunday: Closed</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Mail size={24} />
              </div>
              <h3>Email Us</h3>
              <p>info@virtualherbal.com<br />support@virtualherbal.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <Phone size={24} />
              </div>
              <h3>Call Us</h3>
              <p>+91 7439596554<br />+91 8274069878</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="form-section">
            <div className="form-container">
              <h2>Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="form-input"
                  />
                  <div className="input-decoration"></div>
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="form-input"
                  />
                  <div className="input-decoration"></div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                    className="form-input"
                  />
                  <div className="input-decoration"></div>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    className="form-input"
                    rows={5}
                  />
                  <div className="input-decoration"></div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="button-loader"></div>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="social-and-map-container">
          {/* Social Media Section */}
          <div className="social-media-section">
            <h2 className="social-title">Connect With Us</h2>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <div className="social-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="social-tooltip">Facebook</span>
                </div>
              </a>
              
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                <div className="social-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                  <span className="social-tooltip">Twitter</span>
                </div>
              </a>
              
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <div className="social-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="social-tooltip">Instagram</span>
                </div>
              </a>
              
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                <div className="social-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="social-tooltip">LinkedIn</span>
                </div>
              </a>
              
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
                <div className="social-icon-wrapper">
                  <svg viewBox="0 0 24 24" className="social-icon">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                  <span className="social-tooltip">YouTube</span>
                </div>
              </a>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-overlay"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.83923192776!2d77.06889754725782!3d28.52758200617607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1699586387317!5m2!1sen!2sus"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;