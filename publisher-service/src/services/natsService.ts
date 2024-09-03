import { connect, StringCodec, NatsConnection } from 'nats';

class NatsService {
    private nc: NatsConnection | null = null;
    private sc = StringCodec();

    constructor(private natsUrl: string) {}

    async connect() {
        try {
            this.nc = await connect({ servers: this.natsUrl });
            console.log('Connected to NATS server');
        } catch (error) {
            console.error('Failed to connect to NATS server:', error);
            throw error;
        }
    }

    async publish(topic: string, message: string) {
        if (!this.nc) {
            throw new Error('NATS connection is not established');
        }
        this.nc.publish(topic, this.sc.encode(message));
        console.log(`Published message: ${message}`);
    }

    async close() {
        if (this.nc) {
            await this.nc.flush();
            await this.nc.close();
            console.log('Connection to NATS server closed');
        }
    }
}

export default NatsService;
