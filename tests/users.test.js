import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Protected user admin', () => {
  test('signed-out user page redirects to login', async () => {
    const response = await request(app).get('/admin/users');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('signed-out user API returns 401', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });

  test('customer API returns only their own user', async () => {
    const agent = request.agent(app);
    await agent.post('/register').type('form').send({
      displayName: 'Own User',
      username: 'ownuser',
      email: 'own@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    await agent.post('/login').type('form').send({
      identifier: 'own@example.com',
      password: 'password123'
    });
    const response = await agent.get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0].email).toBe('own@example.com');
  });
});
