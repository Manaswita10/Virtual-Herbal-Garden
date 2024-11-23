Virtual Herbal Garden
Welcome to the Virtual Herbal Garden — an innovative web application that combines education, e-commerce, and health services to immerse users in the world of medicinal plants. This project leverages React, Three.js, React Three Fiber, and Machine Learning to provide a comprehensive and engaging experience, with features ranging from plant recognition, virtual consultations with Ayurvedic doctors, Blog communities, Herbal chatbot to solve queries, shopping to promote local business, engaging 3d plant models providing learning experiences on various aspects of herbal and ayurvedic treatment. 
Features
🌿 Interactive Landing Page
A visually stunning landing page with an elegant design.
A 3D Earth model (powered by Three.js) that provides a global perspective.
High resolution plant 3d-models providing learning experience on various aspects. 
🌱 Plant Showcase
Individual pages for various medicinal plants with comprehensive details, including:
Medicinal Uses
Cultivation Tips
Educational Videos
🤖 ML Plant Recognition
A machine learning-powered feature that allows users to upload an image of a plant for identification.
Displays detailed information about the identified plant, including its benefits and uses.
💬 Herbal Chatbot
An AI-driven chatbot that provides instant responses to user queries.
Offers personalized recommendations for herbal remedies, plant care, and general health advice.
🛍️ Shopping
An integrated e-commerce platform for purchasing:
Herbal products (e.g., plant seeds and saplings, ayurvedic medicine)
🩺 Doctor Consultation
A platform to connect users with certified Ayurvedic doctors for virtual consultations.
Schedule appointments and receive personalized advice for holistic health and wellness.
📝 Blog Community
A space for users to share herbal remedies, gardening tips, and plant care knowledge.
Engage in discussions and connect with a like-minded community passionate about nature and wellness.
🚀 Virtual Tour
A guided virtual tour showcasing different medicinal plants and their real-world applications.
Tech Stack:
🎨Frontend:
Next.js and React: For building the dynamic and interactive user interface.
Three.js, Web GL, React Three Fiber: For rendering 3D models and creating visually rich experiences.
🖥️Backend:
Node.js, MongoDB Atlas
FastAPI: Used for hosting machine learning models and providing API services.
Machine Learning:
A Plant Recognition ML Model (developed with TensorFlow) to identify plants through user-uploaded images.
 🌐Cloud services:
Amazon web services(AWS) S3 for seamless storage and retrieval using pre-signed URLs and IAM permissions.
Installation and Setup

Follow the steps below to run the project locally:

Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/virtual-herbal-garden.git  
cd virtual-herbal-garden  
Install dependencies:

bash
Copy code
npm install  
Start the development server:

bash
Copy code
npm start  
Access the application at:

arduino
Copy code
http://localhost:3000  

For Backend:
Navigate to the backend directory:

bash
Copy code
cd backend  
Install Python dependencies:

bash
Copy code
pip install -r requirements.txt  
Start the FastAPI server:

bash
Copy code
uvicorn main:app --reload  
Access the API at:

arduino
Copy code
http://127.0.0.1:8000  
Project structure:

virtual-herbal-garden/  
├── public/                # Static files (e.g., images)  
├── src/  
│   ├── components/        # Reusable React components  
│   ├── pages/             # Individual plant pages (e.g., ContinentPage.jsx)  
│   ├── assets/            # Images, icons, and other assets  
│   ├── App.js             # Main app entry point  
│   └── index.js           # React DOM rendering  
├── backend/               # FastAPI backend (ML integration)  
├── .gitignore  
├── package.json  
├── README.md              # Project documentation  
└── ...  
Future Enhancements
We plan to:

🧬 Expanding the Plant Database: Including endangered and rare species to promote conservation.
📱 Mobile App Development: Releasing dedicated iOS and Android apps for better accessibility.
🌿 Partnerships: Collaborating with botanical gardens, universities, and AYUSH institutions for validated content and credibility.
🌐 IoT Integration: Incorporating live plant monitoring for real-time user engagement.
🌎 Global Outreach Campaigns: Spreading awareness about herbal traditions and sustainable practices.
🌍 Multilingual Platform: Expanding language support to make the platform accessible to a global audience, preserving regional herbal knowledge and enabling more inclusive user experiences.
🕶️ AR/VR implementation.
License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
Arshavi Roy: Machine Learning expert-Team leader and worked in ML core for plant recognition system.
Contact: https://www.linkedin.com/in/arshavi-roy-730406265/ 
         https://github.com/Arshavi-03
Manaswita Chakraborty: Backend Developer and cloud practitioner- Backend and API handling and AWS S3 integration.
Contact: https://www.linkedin.com/in/manaswita-chakraborty-64b8aa286?trk=contact-info
Rupsha Singha Ray: Frontend Developer- Specialized in designing and creating immersive virtual botanical experiences.
Soubhagyo Roy: 3d modeler and video content creator- 3d plant models rendering and video editing.

🌱 Environmental Impacts of the Virtual Herbal Garden 🌍
Promotes Sustainable Gardening 🪴

Encourages users to grow their own herbs and plants, reducing reliance on mass-produced, resource-intensive agriculture.
Reduces Carbon Footprint 🌿

By promoting local and homegrown herbal solutions, the project minimizes transportation-related carbon emissions.
Spreads Awareness About Biodiversity 🦋

Educates users about the importance of medicinal plants, fostering a deeper connection with nature and the need to preserve biodiversity.
Minimizes Harmful Chemical Usage 🧪🚫

Advocates for natural remedies and organic gardening, reducing dependency on harmful pesticides and synthetic chemicals.
Promotes Recycling and Upcycling ♻️

Inspires eco-friendly practices such as composting and using biodegradable gardening tools available in the shopping platform.
Supports Reforestation Efforts 🌳

Through virtual tours and community engagement, the project highlights the importance of planting trees and conserving herbal plants in their natural habitats.
Encourages Digital Education Over Physical Travel 📱

Offers a virtual learning experience, reducing the need for physical travel and its environmental impact.
Builds an Eco-Conscious Community 🌏💚

Brings together individuals passionate about herbal remedies, creating a community that champions environmental sustainability and green living.
By blending technology and nature, the Virtual Herbal Garden not only enriches lives but also nurtures our planet. 🌟✨

🎨 Creativity and Engagement of the Virtual Herbal Garden 🌟
Immersive 3D Experiences 🌍

Explore detailed, interactive 3D models of plants rendered with React Three Fiber, bringing a lifelike visual experience.

Machine Learning Plant Recognition 🤖

Upload an image to identify plants instantly, combining cutting-edge AI with nature exploration for a seamless and engaging experience.
Virtual Tours of Herbal Gardens 🚶‍♂️🌿

Take guided tours of virtual herbal gardens, learning about plants and their uses in an entertaining, story-driven way.
Herbal Chatbot Assistance 💬

An AI-powered chatbot makes learning fun by providing instant, conversational answers to questions about plants and remedies.
Gamified Shopping Experience 🛍️🎮

Shop for herbal products with a vibrant interface to make every purchase feel exciting.
Community Blog and Forums ✍️🌏

Share experiences, remedies, and gardening tips with others, fostering a creative and collaborative community.
Doctor Consultation with a Natural Touch 🩺🌼

Connect with Ayurvedic doctors for personalized advice, blending health and creativity with a human touch.
Educational Content Made Fun 📚✨

Bite-sized lessons, interactive videos, and animations make learning about herbal plants enjoyable and memorable.
Aesthetic and Intuitive Design 🎨🖌️

A sleek, nature-inspired interface with vibrant visuals and intuitive navigation ensures users stay engaged throughout their journey.
By blending technology, art, and nature, the Virtual Herbal Garden offers a truly unique and creative platform for education, exploration, and connection. 🌟


