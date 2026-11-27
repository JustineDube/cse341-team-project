import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Protected booking administration', () => {
  test('signed-out admin page redirects to login', async () => {
    const response = await request(app).get('/admin/bookings');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('signed-out booking admin API returns 401', async () => {
    const response = await request(app).get('/api/admin/bookings');
    expect(response.status).toBe(401);
  });
});
