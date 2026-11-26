import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  operatingMonths: [{ type: Number }]
});

export default mongoose.model('ScheduleTrip', tripSchema, 'trips');
