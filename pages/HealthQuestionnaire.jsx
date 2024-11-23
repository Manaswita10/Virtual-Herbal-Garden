import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Download,
  ChevronRight,
  Heart
} from 'lucide-react';
import '/pages/styles/HealthQuestionnaire.css';

const HealthQuestionnaire = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    additionalInfo: ''
  });

  const [showResponses, setShowResponses] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const questions = [
    "Do you have any known allergies to medications, foods, or environmental factors?",
    "Have you experienced any unusual or unexplained pain recently?",
    "Do you often feel fatigued or low on energy?",
    "Have you noticed changes in your weight without trying?",
    "Do you have difficulty sleeping or staying asleep?",
    "Do you experience shortness of breath during regular activities?",
    "Have you had any episodes of dizziness or fainting recently?",
    "Do you have a family history of chronic illnesses like diabetes, heart disease, or cancer?",
    "Do you experience any persistent headaches or migraines?",
    "Have you noticed any unusual changes in your skin, such as rashes, lumps, or discoloration?",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResponses(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add header
    doc.setFontSize(24);
    doc.setTextColor(26, 66, 9);
    doc.text("Health Questionnaire", 105, yPos, { align: 'center' });
    yPos += 20;

    doc.setFontSize(12);
    doc.setTextColor(51, 51, 51);
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith('q')) {
        const questionNumber = key.slice(1);
        doc.text(`${questions[questionNumber - 1]}: ${value}`, 20, yPos);
      } else {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 20, yPos);
      }
      yPos += 10;
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save("health_questionnaire.pdf");
  };

  const steps = [
    {
      title: "Personal Information",
      fields: ["name", "email", "phone", "gender", "address"]
    },
    {
      title: "Health Assessment",
      fields: ["q1", "q2", "q3", "q4", "q5"]
    },
    {
      title: "Additional Details",
      fields: ["q6", "q7", "q8", "q9", "q10", "additionalInfo"]
    }
  ];

  const renderFormStep = (step) => {
    const currentFields = steps[step - 1].fields;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="form-step"
      >
        {currentFields.map((field) => {
          if (field.startsWith('q')) {
            const questionIndex = parseInt(field.slice(1)) - 1;
            return (
              <div key={field} className="form-group">
                <label>{questions[questionIndex]}</label>
                <select 
                  name={field} 
                  value={formData[field]}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>
            );
          }

          switch (field) {
            case 'name':
              return (
                <div key={field} className="form-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              );
            case 'email':
              return (
                <div key={field} className="form-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              );
            case 'phone':
              return (
                <div key={field} className="form-group">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              );
            case 'gender':
              return (
                <div key={field} className="form-group">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              );
            case 'address':
              return (
                <div key={field} className="form-group">
                  <MapPin className="input-icon" />
                  <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              );
            case 'additionalInfo':
              return (
                <div key={field} className="form-group">
                  <FileText className="input-icon" />
                  <textarea
                    name="additionalInfo"
                    placeholder="Any additional information you'd like to share..."
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </motion.div>
    );
  };

  return (
    <div className="health-questionnaire">
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="header"
      >
        <Heart className="header-icon" />
        <h1>Health Questionnaire</h1>
      </motion.div>

      {!showResponses ? (
        <div className="form-container">
          <div className="progress-bar">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`progress-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode='wait'>
              {renderFormStep(currentStep)}
            </AnimatePresence>

            <div className="form-navigation">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="prev-button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </motion.button>
              )}
              
              {currentStep < steps.length ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="next-button"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                >
                  Next
                  <ChevronRight className="button-icon" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="submit-button"
                >
                  Submit
                </motion.button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="responses"
        >
          <h2>Your Responses</h2>
          <div className="responses-grid">
            {Object.entries(formData).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="response-item"
              >
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                <span>{value}</span>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            className="download-button"
          >
            <Download className="button-icon" />
            Download PDF
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default HealthQuestionnaire;