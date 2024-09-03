import MongoService from "./services/mongoService";
import NatsService from "./services/natsService";
import { createApp } from "./app";

const PORT = 3000;
const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

(async () => {
    const mongoService = new MongoService(mongoUrl);
    const natsService = new NatsService(natsUrl);

    try {
        // Connect to MongoDB
        await mongoService.connect();
        const collection = mongoService.getCollection("testCollection");

        // Create and start Express app
        const app = createApp(natsService);
        app.listen(PORT, () => {
            console.log(`Express.js server running on port ${PORT}`);
        });

        // Connect to NATS and subscribe to a topic
        await natsService.connect();
        await natsService.subscribe("test.topic", async (message) => {
            await collection.insertOne({ message });
            console.log("Message stored in MongoDB");
        });

    } catch (error) {
        console.error("Error:", error);
    }

    // Graceful shutdown
    process.on("SIGINT", async () => {
        console.log("Shutting down...");
        await mongoService.close();
        await natsService.close();
        process.exit(0);
    });
})();
