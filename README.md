# Virtual Herbal Garden 🌿

Welcome to the Virtual Herbal Garden — an innovative web application that combines education, e-commerce, and health services to immerse users in the world of medicinal plants.

This project leverages React, Three.js, React Three Fiber, and Machine Learning to provide a comprehensive and engaging experience, with features ranging from plant recognition, virtual consultations with Ayurvedic doctors, blog communities, herbal chatbot to solve queries, shopping to promote local businesses, and engaging 3D plant models providing learning experiences on various aspects of herbal and Ayurvedic treatment.

## Features 🌟

### 🌿 Interactive Landing Page
* A visually stunning landing page with an elegant design
* A 3D Earth model (powered by Three.js) that provides a global perspective
* High-resolution 3D plant models providing a learning experience on various aspects

### 🌱 Plant Showcase
* Individual pages for various medicinal plants with comprehensive details, including:
  * Medicinal Uses
  * Cultivation Tips
  * Educational Videos

### 🤖 ML Plant Recognition
* A machine learning-powered feature that allows users to upload an image of a plant for identification
* Displays detailed information about the identified plant, including its benefits and uses

### 💬 Herbal Chatbot
* An AI-driven chatbot that provides instant responses to user queries
* Offers personalized recommendations for herbal remedies, plant care, and general health advice

### 🛍️ Shopping
* An integrated e-commerce platform for purchasing:
  * Herbal products (e.g., plant seeds and saplings, Ayurvedic medicine)

### 🩺 Doctor Consultation
* A platform to connect users with certified Ayurvedic doctors for virtual consultations
* Schedule appointments and receive personalized advice for holistic health and wellness

### 📝 Blog Community
* A space for users to share herbal remedies, gardening tips, and plant care knowledge
* Engage in discussions and connect with a like-minded community passionate about nature and wellness

### 🚀 Virtual Tour
* A guided virtual tour showcasing different medicinal plants and their real-world applications

## Tech Stack

### 🎨 Frontend
* Next.js and React: For building the dynamic and interactive user interface
* Three.js, Web GL, React Three Fiber: For rendering 3D models and creating visually rich experiences

### 🖥️ Backend
* Node.js, MongoDB Atlas
* FastAPI: Used for hosting machine learning models and providing API services

### 🤖 Machine Learning
* A Plant Recognition ML Model (developed with TensorFlow) to identify plants through user-uploaded images

### 🌐 Cloud Services
* Amazon Web Services (AWS) S3 for seamless storage and retrieval using pre-signed URLs and IAM permissions

## Installation and Setup

Follow the steps below to run the project locally:

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/virtual-herbal-garden.git
cd virtual-herbal-garden
```

2. **Install Dependencies:**
To install the necessary dependencies, use the following command:
```bash
npm install
```

3. **Start the Development Server:**
Run the development server with the command:
```bash
npm start
```

4. **Access the Application:**
You can access the application locally at:
```
http://localhost:3000
```

### Backend Setup:
To set up and run the backend:

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start the FastAPI server:**
```bash
uvicorn main:app --reload
```

4. **Access the API at:**
```
http://127.0.0.1:8000
```

## Project Structure
```
virtual-herbal-garden/
├── public/                 # Static files (e.g., images)
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/             # Individual plant pages (e.g., ContinentPage.jsx)
│   ├── assets/            # Images, icons, and other assets
│   ├── App.js             # Main app entry point
│   └── index.js           # React DOM rendering
├── backend/               # FastAPI backend (ML integration)
├── .gitignore
├── package.json
├── README.md              # Project documentation
└── ...
```

## Future Enhancements

### 🔬 Expanding the Plant Database
* Including endangered and rare species to promote conservation and raise awareness about biodiversity

### 📱 Mobile App Development
* Developing dedicated iOS and Android apps to improve accessibility and provide a seamless user experience

### 🌿 Partnerships
* Collaborating with botanical gardens, universities, and AYUSH institutions for validated content and increased credibility

### 🌎 Global Outreach Campaigns
* Launching campaigns to spread awareness about herbal traditions, sustainable gardening, and eco-friendly practices

### 🌍 Multilingual Platform
* Adding support for multiple languages to make the platform accessible to diverse users worldwide, preserving regional herbal knowledge

### 🕶️ AR/VR Implementation
* Incorporating augmented and virtual reality features to create immersive learning experiences about herbal plants and their uses

## Our Team

* Arshavi Roy [LinkedIn](https://linkedin.com) | [GitHub](https://github.com)
* Manaswita Chakraborty [LinkedIn](https://linkedin.com)
* Rupsha Singha Ray [LinkedIn](https://linkedin.com) | [GitHub](https://github.com)
* Soubhagyo Das [LinkedIn](https://linkedin.com) | [GitHub](https://github.com)
