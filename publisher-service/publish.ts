import { connect, StringCodec } from 'nats';

const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';

(async () => {
  try {
    // Connect to NATS server
    const nc = await connect({ servers: natsUrl });
    console.log('Connected to NATS server');

    // Send a message to the topic
    const sc = StringCodec();
    const message = 'Hello from Publisher Service!';
    nc.publish('test.topic', sc.encode(message));
    console.log(`Published message: ${message}`);

    // Close the connection after sending the message
    await nc.flush();
    await nc.close();
    console.log('Connection to NATS server closed');
  } catch (error) {
    console.error('Failed to connect to NATS server:', error);
  }
})();
