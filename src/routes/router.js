import railTripsRouter from './trips.js';
import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/trains', trainsPage);
router.get('/api/trains', trainsApi);
router.use('/', ejsRoutes);
router.use('/trips', railTripsRouter);
router.use('/api', apiRoutes);
router.get('/500', testErrorPage);

export default router;