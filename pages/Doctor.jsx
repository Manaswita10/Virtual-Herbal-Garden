import React, { useState, useEffect } from 'react';
import { Search, User, ChevronRight, Star, Calendar, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { isLoggedIn } from '/utils/auth.js';
import '/pages/styles/Doctor.css';

const ReviewCarousel = ({ reviews }) => {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="review-carousel">
      <h2 className="section-title">What Our Doctors Say</h2>
      <div className="review-content">
        <div className="review-header">
          <div className="review-avatar">
            {reviews[currentReview].name.charAt(0)}
          </div>
          <div className="review-info">
            <h3>{reviews[currentReview].name}</h3>
            <p className="review-title">{reviews[currentReview].title}</p>
          </div>
        </div>
        <div className="review-quote">
          <p className="review-text">"{reviews[currentReview].text}"</p>
        </div>
      </div>
      <div className="review-dots">
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentReview ? 'active' : ''}`}
            onClick={() => setCurrentReview(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

const CountUp = ({ end, duration }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      setCount(Math.floor(start));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

const Doctor = () => {
  const router = useRouter();

  const handleMakeAppointment = () => {
    if (isLoggedIn()) {
      router.push('/appointment');
    } else {
      router.push('/login');
    }
  };

  const reviews = [
    {
      name: "Dr. Shiwani Agarwal",
      title: "Gynaecologist",
      text: "It is here I can read about medical news and get into clinical discussions. There are things I can joke about. I can laugh on what others are sharing. And If I am stuck with any diagnosis, I can find help too.",
    },
    {
      name: "Dr. Rajesh Kumar",
      title: "Cardiologist",
      text: "Ayurvista has been an invaluable resource for staying updated with the latest medical advancements. The platform fosters a great sense of community among healthcare professionals.",
    },
    {
      name: "Dr. Priya Sharma",
      title: "Pediatrician",
      text: "As a pediatrician, I find Ayurvista extremely helpful in connecting with parents and addressing their concerns. It's a great platform for patient education and community outreach.",
    },
    {
      name: "Dr. Amit Patel",
      title: "Orthopedic Surgeon",
      text: "Ayurvista has revolutionized the way I interact with patients. It's an excellent platform for providing initial consultations and follow-ups, especially for patients from remote areas.",
    },
    {
      name: "Dr. Sunita Reddy",
      title: "Dermatologist",
      text: "The collaborative environment on Ayurvista is phenomenal. I've had the opportunity to learn from colleagues across the country and share my expertise. It's truly a win-win for doctors and patients alike.",
    }
  ];

  return (
    <div className="doctor-page">
      <header className="header">
        <div className="header-content">
          <div className="logo">Ayurvista</div>
          <nav>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Your Journey to Wellness Begins Here</h1>
            <p>Discover the perfect blend of ancient wisdom and modern healthcare. Over 9,000 satisfied patients trust our holistic approach to healing.</p>
            <div className="cta-buttons">
              <button className="btn primary" onClick={handleMakeAppointment}>
                <Calendar className="btn-icon" />
                Book Appointment
              </button>
              <button className="btn secondary">
                Learn More
                <ArrowRight className="btn-icon" />
              </button>
            </div>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">
                  <CountUp end={172} duration={2000} />+
                </div>
                <p>Expert doctors</p>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <CountUp end={10} duration={2000} />+
                </div>
                <p>Years experience</p>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  <CountUp end={15} duration={2000} />K
                </div>
                <p>Happy patients</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <img src="https://img.freepik.com/premium-photo/herbs-spices-ayurvedic-medicine-products-herbal-medicine-products_677428-1565.jpg" alt="Doctor" />
            </div>
          </div>
        </section>
        
        <section className="services" id="services">
          <div className="services-container">
            <div className="service-image">
              <img src="https://i.pinimg.com/550x/b8/5b/ae/b85bae29c62be807c05ed0d83e11c8d2.jpg" alt="Doctor examining patient" />
            </div>
            <div className="service-content">
              <h2 className="section-title">Our Healing Therapies</h2>
              <div className="service-list">
                <div className="service-item active">
                  <div className="service-item-content">
                    <h3>Abhangya</h3>
                    <p>Traditional ayurvedic oil massage therapy</p>
                  </div>
                  <ChevronRight className="service-icon" />
                </div>
                <div className="service-item">
                  <div className="service-item-content">
                    <h3>Panchakarma</h3>
                    <p>Detoxification and rejuvenation program</p>
                  </div>
                  <ChevronRight className="service-icon" />
                </div>
                <div className="service-item">
                  <div className="service-item-content">
                    <h3>Shirodhara</h3>
                    <p>Stress-relieving head and scalp treatment</p>
                  </div>
                  <ChevronRight className="service-icon" />
                </div>
                <div className="service-item">
                  <div className="service-item-content">
                    <h3>Purana</h3>
                    <p>Ancient healing techniques</p>
                  </div>
                  <ChevronRight className="service-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewCarousel reviews={reviews} />

        <section className="faq-section" id="about">
  <div className="faq-shapes">
    <div className="faq-shape-1"></div>
    <div className="faq-shape-2"></div>
  </div>
  <h2 className="section-title">Common Questions</h2>
  <div className="faq-list">
            <div className="faq-item">
              <h3>What services do you offer?</h3>
              <p>We offer a wide range of ayurvedic treatments including Abhangya, Panchakarma, Shirodhara, and more.</p>
            </div>
            <div className="faq-item">
              <h3>How do I make an appointment?</h3>
              <p>You can make an appointment by clicking the "Book Appointment" button or by calling our office.</p>
            </div>
            <div className="faq-item">
              <h3>Do you accept insurance?</h3>
              <p>Yes, we accept most major insurance plans. Please contact our office for specific details about your insurance.</p>
            </div>
            <div className="faq-item">
              <h3>What should I bring to my appointment?</h3>
              <p>Please bring your ID, insurance card, and any relevant medical records or test results.</p>
            </div>
          </div>
        </section>

        <section className="ask-question-section" id="contact">
          <div className="contact-container">
            <h2 className="section-title">Have a Question?</h2>
            <form className="question-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Question" required></textarea>
              </div>
              <button type="submit" className="btn primary">Send Message</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-branding">
            <div className="footer-logo">Ayurvista</div>
            <p>Your trusted partner in holistic healthcare</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-social">
            <h4>Connect With Us</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Ayurvista. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Doctor;