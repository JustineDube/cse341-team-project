import { getAllTrips, updateTripById, deleteTripById } from '../models/trips.js';
import { getDb } from '../db/connect.js';

export const tripAdminPage = (req, res) => {
  res.render('admin/trips', { title: 'Trip Administration' });
};

export const getTripAdminList = async (req, res) => {
  try {
    return res.status(200).json({ trips: await getAllTrips() });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ message: 'Unable to fetch trips' });
  }
};

export const getTripOptions = async (req, res) => {
  try {
    const db = getDb();
    const [stations, schedules] = await Promise.all([
      db.collection('stations').find({}).toArray(),
      db.collection('schedules').find({}).toArray()
    ]);
    return res.status(200).json({ stations, schedules });
  } catch (error) {
    console.error('Error fetching trip edit options:', error);
    return res.status(500).json({ message: 'Unable to fetch trip options' });
  }
};

export const updateTrip = async (req, res) => {
  const allowed = {};
  for (const field of [
    'name', 'description', 'region', 'startStation', 'endStation',
    'duration', 'distance', 'highlights', 'bestSeason', 'operatingMonths', 'imageUrl'
  ]) {
    if (req.body[field] !== undefined) allowed[field] = req.body[field];
  }
  if (allowed.distance !== undefined) allowed.distance = Number(allowed.distance);
  try {
    const trip = await updateTripById(req.params.id, allowed);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    return res.status(200).json({ trip });
  } catch (error) {
    console.error('Error updating trip:', error);
    return res.status(500).json({ message: 'Unable to update trip' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const deleted = await deleteTripById(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Trip not found' });
    return res.status(200).json({ message: 'Trip deleted' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    return res.status(500).json({ message: 'Unable to delete trip' });
  }
};
