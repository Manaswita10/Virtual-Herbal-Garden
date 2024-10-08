import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import '/pages/styles/HealthQuestionnaire.css'
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

  const questions = [
    "How would you rate your overall health?",
    "Do you have any chronic medical conditions?",
    "How often do you exercise?",
    "How would you describe your diet?",
    "Do you smoke or use tobacco products?",
    "How many hours of sleep do you get on average?",
    "How would you rate your stress levels?",
    "Have you had any recent surgeries or hospitalizations?",
    "Are you currently taking any medications?",
    "Do you have any allergies?"
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
    let yPos = 10;

    doc.setFontSize(20);
    doc.text("Health Questionnaire Responses", 10, yPos);
    yPos += 10;

    doc.setFontSize(12);
    Object.entries(formData).forEach(([key, value]) => {
      if (key.startsWith('q')) {
        const questionNumber = key.slice(1);
        doc.text(`${questions[questionNumber - 1]}: ${value}`, 10, yPos);
      } else {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 10, yPos);
      }
      yPos += 10;
      if (yPos > 280) {
        doc.addPage();
        yPos = 10;
      }
    });

    doc.save("health_questionnaire_responses.pdf");
  };

  return (
    <div className="health-questionnaire">
      <h1>Health Questionnaire</h1>
      {!showResponses ? (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
          <input type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} required />
          <select name="gender" onChange={handleInputChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <textarea name="address" placeholder="Address" onChange={handleInputChange} required></textarea>

          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <select name={`q${index + 1}`} onChange={handleInputChange} required>
                <option value="">Select an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </select>
            </div>
          ))}

          <textarea name="additionalInfo" placeholder="Additional Information" onChange={handleInputChange}></textarea>
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="responses">
          <h2>Your Responses</h2>
          {Object.entries(formData).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {value}</p>
          ))}
          <button onClick={generatePDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
};

export default HealthQuestionnaire;