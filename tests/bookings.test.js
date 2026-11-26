import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { getDb } from '../src/db/connect.js';

describe('Bookings API', () => {
  test('GET /api/bookings returns an array', async () => {
    const response = await request(app).get('/api/bookings');
    expect(response.status).toBe(200);
    expect(response.body.bookings).toBeInstanceOf(Array);
  });

  test('creates a booking through the booking route', async () => {
    const response = await request(app)
      .post('/book')
      .type('form')
      .send({ passengerName: 'Test Passenger', passengerEmail: 'test@example.com' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toMatch(/^\/trips\/confirmation\//);
  });

  test('admin page uses the bookings view', async () => {
    await getDb().collection('trips').countDocuments();
    const response = await request(app).get('/bookings-admin');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Bookings Administration');
  });
});
