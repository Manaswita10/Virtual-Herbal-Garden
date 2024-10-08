import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  image: String,
  appointmentFee: Number,
  timeSlots: [
    {
      day: String,
      slots: [
        {
          time: String,
          maxAppointments: Number,
          currentAppointments: Number
        }
      ]
    }
  ]
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;