import React, { useState, useEffect } from 'react';
import { Search, User, ChevronRight } from 'lucide-react';
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
      <h2>Top doctors recommend Lybrate</h2>
      <div className="review-content">
        <h3>{reviews[currentReview].name}</h3>
        <p className="review-title">{reviews[currentReview].title}</p>
        <p className="review-text">"{reviews[currentReview].text}"</p>
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
      text: "Lybrate has been an invaluable resource for staying updated with the latest medical advancements. The platform fosters a great sense of community among healthcare professionals.",
    },
    {
      name: "Dr. Priya Sharma",
      title: "Pediatrician",
      text: "As a pediatrician, I find Lybrate extremely helpful in connecting with parents and addressing their concerns. It's a great platform for patient education and community outreach.",
    },
    {
      name: "Dr. Amit Patel",
      title: "Orthopedic Surgeon",
      text: "Lybrate has revolutionized the way I interact with patients. It's an excellent platform for providing initial consultations and follow-ups, especially for patients from remote areas.",
    },
    {
      name: "Dr. Sunita Reddy",
      title: "Dermatologist",
      text: "The collaborative environment on Lybrate is phenomenal. I've had the opportunity to learn from colleagues across the country and share my expertise. It's truly a win-win for doctors and patients alike.",
    }
  ];

  return (
    <div className="doctor-page">
      <header className="header">
        <div className="logo">Lybrate</div>
        <nav>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-icons">
          <Search />
          <User />
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <h1>Our experts make your health better</h1>
            <p>Over 9,000 people, we have provided hundreds of thousands of care services to serve the needs of our patients.</p>
            <div className="cta-buttons">
              <button className="btn primary" onClick={handleMakeAppointment}>Make an Appointment</button>
              <button className="btn secondary">See how we work</button>
            </div>
            <div className="stats">
              <div className="stat-item">
                <h2><CountUp end={172} duration={2000} />+</h2>
                <p>Expert doctors</p>
              </div>
              <div className="stat-item">
                <h2><CountUp end={10} duration={2000} />+</h2>
                <p>Years experience</p>
              </div>
              <div className="stat-item">
                <h2><CountUp end={15} duration={2000} />K</h2>
                <p>Happy patients</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src="/assets/doc bg2.png" alt="Doctor" />
          </div>
        </section>
        
        <section className="services" id="services">
          <div className="service-image">
            <img src="/assets/doc bg.png" alt="Doctor examining patient" />
          </div>
          <div className="service-content">
            <h2>Our best service for your health</h2>
            <div className="service-list">
              <div className="service-item active">
                <h3>Neurosurgery</h3>
                <p>MRI of the spine is a modern highly informative diagnostic examination that allows to assess the condition of a significant number of structures.</p>
                <ChevronRight className="service-icon" />
              </div>
              <div className="service-item">
                <h3>Cardiologist</h3>
                <ChevronRight className="service-icon" />
              </div>
              <div className="service-item">
                <h3>Radiology</h3>
                <ChevronRight className="service-icon" />
              </div>
              <div className="service-item">
                <h3>Therapy</h3>
                <ChevronRight className="service-icon" />
              </div>
            </div>
          </div>
        </section>

        <ReviewCarousel reviews={reviews} />

        <section className="faq-section" id="about">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>What services do you offer?</h3>
              <p>We offer a wide range of medical services including neurosurgery, cardiology, radiology, and general therapy.</p>
            </div>
            <div className="faq-item">
              <h3>How do I make an appointment?</h3>
              <p>You can make an appointment by clicking the "Make an Appointment" button at the top of the page or by calling our office.</p>
            </div>
            <div className="faq-item">
              <h3>Do you accept insurance?</h3>
              <p>Yes, we accept most major insurance plans. Please contact our office for specific details about your insurance.</p>
            </div>
            <div className="faq-item">
              <h3>What should I bring to my appointment?</h3>
              <p>Please bring your ID, insurance card, and any relevant medical records or test results.</p>
            </div>
            <div className="faq-item">
              <h3>Are your facilities wheelchair accessible?</h3>
              <p>Yes, all our facilities are wheelchair accessible to ensure comfort for all our patients.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer telehealth services?</h3>
              <p>Yes, we offer telehealth services for certain types of appointments. Please ask about this option when scheduling.</p>
            </div>
            <div className="faq-item">
              <h3>How long does a typical appointment last?</h3>
              <p>Appointment durations vary depending on the type of visit, but most last between 30 minutes to an hour.</p>
            </div>
            <div className="faq-item">
              <h3>What COVID-19 precautions are you taking?</h3>
              <p>We follow all CDC guidelines, including mask requirements, social distancing, and enhanced cleaning procedures.</p>
            </div>
          </div>
        </section>

        <section className="ask-question-section" id="contact">
          <h2>Got a question? Ask here</h2>
          <form className="question-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Question" required></textarea>
            <button type="submit" className="btn primary">Submit Question</button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Lybrate</div>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Lybrate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Doctor;