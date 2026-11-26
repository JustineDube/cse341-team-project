import { getSchedulesByTripId } from '../models/schedules.js';

export async function getSchedulesForTrip(req, res) {
  try {
    const schedules = await getSchedulesByTripId(req.params.id);
    return res.status(200).json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}

export async function getSchedulesForTripAndMonth(req, res) {
  try {
    const month = Number(req.query.month);
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Month must be an integer from 1 to 12' });
    }
    const schedules = await getSchedulesByTripId(req.params.id, month);
    return res.status(200).json({ schedules });
  } catch (error) {
    console.error('Error fetching monthly schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}
