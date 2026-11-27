import mongoose from 'mongoose';
import Trip from './schemas/trips.js';

export async function getAllTrips() {
  return Trip.find({}).lean();
}

export async function updateTripById(id, updates) {
  if (!mongoose.isValidObjectId(id) && typeof id === 'string') {
    return Trip.findOneAndUpdate({ id }, updates, { new: true, runValidators: true }).lean();
  }
  return Trip.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
}

export async function deleteTripById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return Trip.findOneAndDelete({ id }).lean();
  }
  return Trip.findByIdAndDelete(id).lean();
}
