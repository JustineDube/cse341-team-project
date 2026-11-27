import { getBookingsForPassenger } from '../models/bookings.js';

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getBookingsForPassenger(req.user.email);
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching passenger bookings:', error);
    return res.status(500).json({ message: 'Unable to fetch bookings' });
  }
};
