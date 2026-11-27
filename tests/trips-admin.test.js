import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Protected trip administration', () => {
  test('signed-out trip admin page redirects to login', async () => {
    const response = await request(app).get('/admin/trips');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('signed-out trip API returns 401', async () => {
    const response = await request(app).get('/api/admin/trips');
    expect(response.status).toBe(401);
  });
});
