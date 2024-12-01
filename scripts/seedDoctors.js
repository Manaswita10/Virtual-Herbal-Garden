import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arshaviroy:Manapodu1910@ayushplantsdb.mqaql.mongodb.net/test?retryWrites=true&w=majority&appName=AYUSHPlantsDB';

// Sample doctor data
const doctors = [
    {
        name: "Dr. K.M Saifullah",
        specialty: "Neuro Physiotherapy",
        image: "/assets/km saifullah.png",
        appointmentFee: 450,
        timeSlots: [
          {
            day: "Monday",
            slots: [
              { time: "09:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "11:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "02:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "04:00 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          },
          {
            day: "Wednesday",
            slots: [
              { time: "10:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "12:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "03:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "05:00 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          }
        ]
    },
    {
        name: "Dr. M.S Haque",
        specialty: "Thyroid and hamorrhoids",
        image: "/assets/ms haque.png",
        appointmentFee: 350,
        timeSlots: [
          {
            day: "Tuesday",
            slots: [
              { time: "09:30 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "11:30 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "02:30 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "04:30 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          },
          {
            day: "Thursday",
            slots: [
              { time: "10:30 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "12:30 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "03:30 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "05:30 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          }
        ]
    },
    {
        name: "Dr. Debanjan Mukherjee",
        specialty: "General wellness",
        image: "/assets/debanjan mukherjee.png",
        appointmentFee: 350,
        timeSlots: [
          {
            day: "Monday",
            slots: [
              { time: "09:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "11:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "02:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "04:00 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          },
          {
            day: "Friday",
            slots: [
              { time: "10:00 AM", maxAppointments: 3, currentAppointments: 0 },
              { time: "12:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "03:00 PM", maxAppointments: 3, currentAppointments: 0 },
              { time: "05:00 PM", maxAppointments: 3, currentAppointments: 0 }
            ]
          }
        ]
    }
];

async function seedDoctors() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    
    // Clear existing doctors
    await Doctor.deleteMany({});
    
    // Insert new doctors
    await Doctor.insertMany(doctors);
    
    console.log('Doctors seeded successfully');
  } catch (error) {
    console.error('Error seeding doctors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

seedDoctors().catch(console.error);