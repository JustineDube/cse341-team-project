import { Router } from 'express';
import { tripDetailsPage, tripListPage } from '../controllers/trips.js';

const router = Router();

router.get('/trips', tripListPage);
router.get('/trips/:tripId', tripDetailsPage);

export default router;
