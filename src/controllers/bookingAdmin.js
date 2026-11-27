import {
  getBookingsForAdminOrPassenger,
  getBookingById,
  updateBookingById,
  deleteBookingById
} from '../models/bookings.js';

export const bookingAdminPage = (req, res) => {
  res.render('admin/bookings', { title: 'Booking Administration' });
};

export const getBookingAdminList = async (req, res) => {
  try {
    return res.status(200).json({ bookings: await getBookingsForAdminOrPassenger(req) });
  } catch (error) {
    console.error('Error fetching booking admin list:', error);
    return res.status(500).json({ message: 'Unable to fetch bookings' });
  }
};

const canManage = (req, booking) =>
  req.user.role === 'admin' ||
  booking.passengerEmail?.toLowerCase() === req.user.email.toLowerCase() ||
  booking.passengers?.some((passenger) => passenger.email?.toLowerCase() === req.user.email.toLowerCase());

export const updateBooking = async (req, res) => {
  const booking = await getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (!canManage(req, booking)) return res.status(403).json({ message: 'Forbidden' });
  const allowed = {};
  for (const field of ['passengerEmail', 'passengers', 'scheduleId', 'ticketClass', 'status']) {
    if (req.body[field] !== undefined) allowed[field] = req.body[field];
  }
  try {
    const updated = await updateBookingById(req.params.id, allowed);
    return res.status(200).json({ booking: updated });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Unable to update booking' });
  }
};

export const deleteBooking = async (req, res) => {
  const booking = await getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (!canManage(req, booking)) return res.status(403).json({ message: 'Forbidden' });
  const deleted = await deleteBookingById(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Booking not found' });
  return res.status(200).json({ message: 'Booking deleted' });
};
