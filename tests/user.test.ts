import request from 'supertest';
import app from '../src/app';

describe('User Management API', () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    token = response.body.token;
  });

  it('should retrieve the current user', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should update the current user', async () => {
    const response = await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'updatedTestUser'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('updatedTestUser');
  });
});