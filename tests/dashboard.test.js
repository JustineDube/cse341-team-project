import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { getDb } from '../src/db/connect.js';

describe('User dashboard', () => {
  test('signed-out booking API returns 401', async () => {
    const response = await request(app).get('/api/bookings/me');
    expect(response.status).toBe(401);
  });

  test('dashboard filters bookings for the signed-in passenger email', async () => {
    const agent = request.agent(app);
    await agent.post('/register').type('form').send({
      displayName: 'Passenger',
      username: 'passenger',
      email: 'passenger@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    await agent.post('/login').type('form').send({
      identifier: 'passenger@example.com',
      password: 'password123'
    });

    await getDb().collection('bookings').insertMany([
      { id: 'matching', passengerEmail: 'passenger@example.com', status: 'confirmed' },
      { id: 'other', passengerEmail: 'someone@example.com', status: 'confirmed' }
    ]);

    const response = await agent.get('/api/bookings/me');
    expect(response.status).toBe(200);
    expect(response.body.bookings.map((booking) => booking.id)).toEqual(['matching']);
  });
});
