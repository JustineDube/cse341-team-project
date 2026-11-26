import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  tripId: { type: String, required: true, trim: true },
  departureTime: { type: String, required: true, trim: true },
  arrivalTime: { type: String, required: true, trim: true },
  daysOfWeek: [{ type: String, required: true, trim: true }],
  status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
