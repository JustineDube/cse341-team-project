import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Schedules API', () => {
  test('GET /api/trips/:id/schedules returns schedules', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama/schedules');
    expect(response.status).toBe(200);
    expect(response.body.schedules).toBeInstanceOf(Array);
  });

  test('rejects invalid month values', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama/schedules?month=13');
    expect(response.status).toBe(400);
  });

  test('filters schedules by an operating month', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama/schedules?month=4');
    expect(response.status).toBe(200);
    expect(response.body.schedules.length).toBeGreaterThan(0);
  });
});
