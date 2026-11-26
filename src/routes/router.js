import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import {
  getAllBookingsApi,
  bookingsAdminPage,
  processBookingRequest,
  bookingPage,
  bookingConfirmationPage
} from '../controllers/bookings.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);
router.get('/bookings-admin', bookingsAdminPage);
router.get('/api/bookings', getAllBookingsApi);
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.post('/book', processBookingRequest);
router.get('/trips/confirmation/:confirmationId', bookingConfirmationPage);

// Trains API
router.get('/api/trains', trainsApi);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;