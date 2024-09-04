import { connect, StringCodec, NatsConnection } from "nats";

class NatsService {
    private nc: NatsConnection | null = null;
    private sc = StringCodec();

    constructor(private natsUrl: string) {}

    async connect() {
        try {
            this.nc = await connect({ servers: this.natsUrl });
            console.log("Connected to NATS server");
        } catch (error) {
            console.error("Failed to connect to NATS", error);
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

    async subscribe(topic: string, callback: (message: string) => Promise<void>) {
        if (!this.nc) {
            throw new Error("NATS is not connected");
        }
        const sub = this.nc.subscribe(topic);
        const sc = StringCodec();

        for await (const msg of sub) {
            const message = sc.decode(msg.data);
            console.log(`Received message: ${message}`);
            await callback(message);
        }
    }

    async close() {
        await this.nc?.close();
        console.log("NATS connection closed");
    }
}

export default NatsService;
