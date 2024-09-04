
import request from 'supertest';
import { app } from '../src/app';

describe('Event Management API', () => {
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

  it('should create a new event', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Concert',
        date: '2024-12-25',
        time: '18:00',
        venue: 'Stadium',
        availableTickets: 100
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Concert');
  });

  it('should retrieve all events', async () => {
    const response = await request(app)
      .get('/events')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should delete an event', async () => {
    const eventId = 1; // Replace with a dynamic eventId

    const response = await request(app)
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
  });
});