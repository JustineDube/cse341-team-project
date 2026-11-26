import Schedule from './schemas/schedules.js';
import ScheduleTrip from './schemas/schedules-trip.js';

export async function getSchedulesByTripId(tripId, month) {
  const schedules = await Schedule.find({ tripId, status: true }).lean();
  if (!month) {
    return schedules;
  }

  const trip = await ScheduleTrip.findOne({ id: tripId }).lean();
  const monthNumber = Number(month);
  if (!trip || !trip.operatingMonths?.includes(monthNumber)) {
    return [];
  }
  return schedules;
}
