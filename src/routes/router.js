import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import { registerPage, loginPage, register, login, logout } from '../controllers/auth.js';
import { requirePageLogin, requirePageRole } from '../middleware/auth.js';
import { requireApiRole } from '../middleware/auth.js';
import {
  tripAdminPage,
  getTripAdminList,
  getTripOptions,
  updateTrip,
  deleteTrip
} from '../controllers/tripAdmin.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

router.get('/register', registerPage);
router.post('/register', register);
router.get('/login', loginPage);
router.post('/login', login);
router.post('/logout', logout);
router.get('/dashboard', requirePageLogin, (req, res) => {
    res.render('dashboard', { title: 'User Dashboard' });
});
router.get('/admin', requirePageRole('admin'), (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard' });
});
router.get('/admin/trips', requirePageRole('admin'), tripAdminPage);
router.get('/api/admin/trips', requireApiRole('admin'), getTripAdminList);
router.get('/api/admin/trips/options', requireApiRole('admin'), getTripOptions);
router.put('/api/admin/trips/:id', requireApiRole('admin'), updateTrip);
router.delete('/api/admin/trips/:id', requireApiRole('admin'), deleteTrip);

// Trains API
router.get('/api/trains', trainsApi);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;