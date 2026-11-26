import { Router } from 'express';
import { getAllTrips, getTripById } from '../controllers/trips.js';

const router = Router();

router.get('/trips', getAllTrips);
router.get('/trips/:id', getTripById);

export default router;
