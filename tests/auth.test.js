import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Core authentication', () => {
  test('register page is public', async () => {
    const response = await request(app).get('/register');
    expect(response.status).toBe(200);
  });

  test('dashboard redirects signed-out users to login', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('admin dashboard redirects signed-out users to login', async () => {
    const response = await request(app).get('/admin');
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login');
  });

  test('register and login a customer', async () => {
    const agent = request.agent(app);
    const registration = await agent.post('/register').type('form').send({
      displayName: 'Test Customer',
      username: 'testcustomer',
      email: 'customer@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(registration.status).toBe(302);

    const login = await agent.post('/login').type('form').send({
      identifier: 'customer@example.com',
      password: 'password123'
    });
    expect(login.status).toBe(302);
    expect(login.headers.location).toBe('/dashboard');

    const dashboard = await agent.get('/dashboard');
    expect(dashboard.status).toBe(200);
    expect(dashboard.text).toContain('Test Customer');
  });
});
