import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Trips API', () => {
  test('GET /api/trips returns the starter trips', async () => {
    const response = await request(app).get('/api/trips');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body.trips).toBeInstanceOf(Array);
    expect(response.body.trips.length).toBeGreaterThan(0);
  });

  test('GET /api/trips/:id returns one trip', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('alpine-panorama');
  });

  test('GET /api/trips/:id returns 404 for unknown trips', async () => {
    const response = await request(app).get('/api/trips/not-a-real-trip');
    expect(response.status).toBe(404);
  });
});
