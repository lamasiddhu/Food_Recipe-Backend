jest.mock('../config/db', () => require('../__mocks__/sequelize'));
const request = require('supertest');
const app = require('../server'); // Make sure app is exported

describe('User Controller', () => {
  test('POST /api/users/register with missing data', async () => {
    const res = await request(app).post('/api/users/register').send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test('POST /api/users/login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400); // assuming your login returns 400
    expect(res.body.success).toBe(false);
  });

  test('GET /api/users/ping should return pong', async () => {
    const res = await request(app).get('/api/users/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pong');
  });
});
