import mongoose from 'mongoose';
import Booking from './schemas/bookings.js';

export async function getBookingsForAdminOrPassenger(req) {
  if (req.user.role === 'admin') return Booking.find({}).lean();
  const email = req.user.email.toLowerCase();
  return Booking.find({
    $or: [{ passengerEmail: email }, { 'passengers.email': email }]
  }).lean();
}

export async function getBookingById(id) {
  if (!mongoose.isValidObjectId(id) && !id) return null;
  return Booking.findOne({ id }).lean();
}

export async function updateBookingById(id, updates) {
  return Booking.findOneAndUpdate({ id }, updates, { new: true, runValidators: true }).lean();
}

export async function deleteBookingById(id) {
  return Booking.findOneAndDelete({ id }).lean();
}
