import Booking from './schemas/bookings.js';

export async function getBookingsForPassenger(email) {
  const normalizedEmail = email.toLowerCase().trim();
  return Booking.find({
    $or: [
      { passengerEmail: normalizedEmail },
      { 'passengers.email': normalizedEmail }
    ]
  }).lean();
}
