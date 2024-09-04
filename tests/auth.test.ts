import request from 'supertest';
import app from '../src/app';

describe('Authentication API', () => {
  let token: string;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should log in a user and return a token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'invaliduser',
        password: 'invalidpassword'
      });

    expect(response.statusCode).toBe(401);
  });
});

