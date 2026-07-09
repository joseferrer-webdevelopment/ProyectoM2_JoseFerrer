const request = require('supertest');
const app = require('../app');
const pool = require('../db');

describe('GET /authors', () => {
  it('debería devolver status 200 y un array', async () => {
    const response = await request(app).get('/authors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

afterAll(async () => {
  await pool.end();
});