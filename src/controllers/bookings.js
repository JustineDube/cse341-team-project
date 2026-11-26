import { createBooking, getAllBookings, getBookingById } from '../models/bookings.js';
import { generateConfirmationCode } from '../includes/helpers.js';

export async function getAllBookingsApi(req, res) {
  try {
    return res.status(200).json({ bookings: await getAllBookings() });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

export async function processBookingRequest(req, res) {
  try {
    const booking = await createBooking({
      id: generateConfirmationCode(),
      ...req.body
    });
    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).render('errors/500', { title: 'Server Error', error: 'Failed to create booking' });
  }
}

export async function bookingPage(req, res) {
  return res.render('trips/book', {
    title: 'Book Trip',
    scheduleId: req.params.scheduleId,
    schedule: { id: req.params.scheduleId }
  });
}

export async function bookingsAdminPage(req, res) {
  return res.render('bookings', { title: 'Bookings Administration' });
}

export async function bookingConfirmationPage(req, res) {
  const booking = await getBookingById(req.params.confirmationId);
  if (!booking) {
    return res.status(404).render('errors/404', { title: 'Booking Not Found', error: 'Booking not found' });
  }
  return res.render('trips/confirm', { title: 'Booking Confirmation', confirmation: booking });
}
