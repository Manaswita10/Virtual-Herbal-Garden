import React, { useState, useEffect } from 'react';
import { Search, User, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '/pages/styles/appointment.css'

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    router.push('/payment');
  };

  const handleDoctorSelect = (e) => {
    const doctor = doctors.find(d => d._id === e.target.value);
    setSelectedDoctor(doctor);
    updateAvailableTimeSlots(doctor);
  };

  const updateAvailableTimeSlots = (doctor) => {
    if (doctor && doctor.timeSlots) {
      const allSlots = doctor.timeSlots.flatMap(daySlot => 
        daySlot.slots.map(slot => ({
          ...slot,
          day: daySlot.day
        }))
      );
      setAvailableTimeSlots(allSlots);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedDate(selectedDate);
    
    if (selectedDoctor) {
      updateAvailableTimeSlots(selectedDoctor);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="appointment-page">
      <header className="header">
        <div className="logo">Lybrate</div>
        <nav>
          <Link href="/">Home</Link>
          <Link href="#services">Services</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        <div className="header-icons">
          <Search />
          <User />
        </div>
      </header>

      <main>
        <h1>Make an Appointment</h1>
        <div className="appointment-content">
          <div className="appointment-form">
            <form onSubmit={handleBookAppointment}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="tel" placeholder="Your Phone" required />
              <select required onChange={handleDoctorSelect}>
                <option value="">Select a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
              <input type="date" required onChange={handleDateChange} min={new Date().toISOString().split('T')[0]} />
              <select required>
                <option value="">Select a Time Slot</option>
                {availableTimeSlots.map((slot, index) => (
                  <option 
                    key={index} 
                    value={`${slot.day}-${slot.time}`}
                    disabled={slot.currentAppointments >= slot.maxAppointments}
                  >
                    {slot.day} - {slot.time} {slot.currentAppointments >= slot.maxAppointments ? '(Full)' : ''}
                  </option>
                ))}
              </select>
              <div className="file-upload">
                <label htmlFor="health-checkup">
                  <Upload size={24} />
                  Upload Health Checkup Info (PDF)
                </label>
                <input
                  type="file"
                  id="health-checkup"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                {file && <p className="file-name">{file.name}</p>}
              </div>
              <button type="submit" className="btn">
                Book Appointment
              </button>
            </form>
          </div>
          <div className="hover-card-section">
            <div className="card-container">
              <h2>Health checkup information</h2>
              <p>Make it easier for doctors to treat you!</p>
              <Image src="/assets/doc bg2.png" alt="Health checkup" width={400} height={300} className="card-image" />
              <div className="card-footer">
                <Link href="/HealthQuestionnaire" className="sign-up-btn">
                  Fill up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="doctorCards">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="doctorCard">
              <Image src={doctor.image} alt={doctor.name} width={150} height={150} className="doctorImage" />
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <p className="appointmentFee">Appointment Fee: ${doctor.appointmentFee}</p>
              <button className="timeSlotsBtn" onClick={() => updateAvailableTimeSlots(doctor)}>
                View Time Slots
              </button>
              {selectedDoctor && selectedDoctor._id === doctor._id && (
                <div className="timeSlots">
                  {doctor.timeSlots.map((daySlot) => (
                    <div key={daySlot.day}>
                      <h4>{daySlot.day}</h4>
                      {daySlot.slots.map((slot, index) => (
                        <button
                          key={index}
                          disabled={slot.currentAppointments >= slot.maxAppointments}
                          className={`timeSlotBtn ${slot.currentAppointments >= slot.maxAppointments ? 'full' : ''}`}
                        >
                          {slot.time} {slot.currentAppointments >= slot.maxAppointments ? '(Full)' : ''}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">Lybrate</div>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="#services">Services</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Lybrate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Appointment;