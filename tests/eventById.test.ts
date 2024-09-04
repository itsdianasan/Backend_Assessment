import request from 'supertest';
import app from '../src/app';

describe('Event Management API', () => {
  let token: string;
  let eventId: number;

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    token = response.body.token;

    const createEventResponse = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Concert',
        date: '2024-12-25',
        time: '18:00',
        venue: 'Stadium',
        availableTickets: 100
      });

    eventId = createEventResponse.body.id;
  });

  it('should retrieve an event by ID', async () => {
    const response = await request(app)
      .get(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', eventId);
  });

  it('should update an existing event', async () => {
    const response = await request(app)
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Concert'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('Updated Concert');
  });
});