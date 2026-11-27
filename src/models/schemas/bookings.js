import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true },
  passengerEmail: { type: String, trim: true, lowercase: true },
  passengers: [{
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true }
  }],
  scheduleId: { type: String, trim: true },
  ticketClass: { type: String, trim: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { strict: false, timestamps: true });

export default mongoose.model('Booking', bookingSchema);
