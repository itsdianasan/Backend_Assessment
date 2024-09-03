import NatsService from './services/natsService';

const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
const topic = 'test.topic';
const message = 'Hello from Publisher Service!';

(async () => {
    const natsService = new NatsService(natsUrl);

    try {
        await natsService.connect();
        await natsService.publish(topic, message);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        await natsService.close();
    }
})();
