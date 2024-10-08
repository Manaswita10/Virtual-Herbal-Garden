import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;