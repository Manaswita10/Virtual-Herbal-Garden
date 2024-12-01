import React, { useState, useEffect } from 'react';
import { Download, CreditCard, Smartphone, Landmark, Check } from 'lucide-react';
import Image from 'next/image';
import { jsPDF } from "jspdf";
import '/pages/styles/payment.css';

const Payment = () => {
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const mockAppointmentDetails = {
      doctorName: "Dr. Debanjan Mukherjee",
      date: "2024-10-15",
      time: "14:00",
      specialty: "General wellness",
      appointmentFee: "₹150"
    };
    setAppointmentDetails(mockAppointmentDetails);
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointment Details", 10, 10);
    doc.text(`Doctor: ${appointmentDetails.doctorName}`, 10, 30);
    doc.text(`Date: ${appointmentDetails.date}`, 10, 40);
    doc.text(`Time: ${appointmentDetails.time}`, 10, 50);
    doc.text(`Specialty: ${appointmentDetails.specialty}`, 10, 60);
    doc.text(`Fee: ${appointmentDetails.appointmentFee}`, 10, 70);
    doc.save("appointment-details.pdf");
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setBooked(true);
      setTimeout(() => setBooked(false), 3000);
    }, 3000);
  };

  if (!appointmentDetails) return <div>Loading...</div>;

  return (
    <div className="paymentPage">
      <h1 className="title">Appointment Payment</h1>
      
      <div className="appointmentDetails">
        <h2>Appointment Details</h2>
        <p><strong>Doctor:</strong> {appointmentDetails.doctorName}</p>
        <p><strong>Date:</strong> {appointmentDetails.date}</p>
        <p><strong>Time:</strong> {appointmentDetails.time}</p>
        <p><strong>Specialty:</strong> {appointmentDetails.specialty}</p>
        <p><strong>Appointment Fee:</strong> ${appointmentDetails.appointmentFee}</p>
        
        <button className="downloadBtn" onClick={handleDownloadPDF}>
          <Download size={18} />
          Download Appointment Details
        </button>
      </div>
      
      <div className="paymentMethods">
        <h2>Select Payment Method</h2>
        <div className="paymentOptions">
          <div
            className={`paymentOption ${paymentMethod === 'qr' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('qr')}
          >
            <div className="qrContainer">
              <Image src="/assets/qr.jpg" alt="QR Code" width={150} height={100} />
            </div>
            <p>Pay via QR Code</p>
          </div>
          <div
            className={`paymentOption ${paymentMethod === 'upi' ? 'selected' : ''}`}
            onClick={() => {
              setPaymentMethod('upi');
              setShowUPIModal(true);
            }}
          >
            <Smartphone size={48} />
            <p>Pay via UPI</p>
          </div>
          <div
            className={`paymentOption ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
            onClick={() => {
              setPaymentMethod('netbanking');
              setShowCardModal(true);
            }}
          >
            <Landmark size={48} />
            <p>Pay via Net Banking</p>
          </div>
        </div>
      </div>
      
      {showUPIModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>UPI Payment</h2>
            <p>Amount to Pay: ${appointmentDetails.appointmentFee}</p>
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <button onClick={handlePayment}>Pay</button>
            <button onClick={() => setShowUPIModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showCardModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>Credit/Debit Card Payment</h2>
            <p>Amount to Pay: ${appointmentDetails.appointmentFee}</p>
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
            />
            <input
              type="text"
              placeholder="Card Holder's Name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
            />
            <button onClick={handlePayment}>Pay</button>
            <button onClick={() => setShowCardModal(false)}>Close</button>
          </div>
        </div>
      )}

      {processing && (
        <div className="modal">
          <div className="modalContent">
            <p>Processing your request...</p>
          </div>
        </div>
      )}

      {booked && (
        <div className="modal">
          <div className="modalContent">
            <Check size={48} color="green" />
            <p>Appointment Booked!</p>
          </div>
        </div>
      )}

      <button className="payNowBtn" onClick={() => {
        if (paymentMethod === 'qr') handlePayment();
        else if (paymentMethod === 'upi') setShowUPIModal(true);
        else if (paymentMethod === 'netbanking') setShowCardModal(true);
      }}>
        Pay Now ${appointmentDetails.appointmentFee}
      </button>
    </div>
  );
};

export default Payment;