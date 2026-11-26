import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, trim: true },
  scheduleId: { type: String, trim: true },
  passengerName: { type: String, trim: true },
  passengerEmail: { type: String, trim: true },
  passengerCount: { type: Number, min: 1 },
  ticketClass: { type: String, trim: true },
  data: { type: mongoose.Schema.Types.Mixed }
}, { strict: false, timestamps: true });

export default mongoose.model('Booking', bookingSchema);
