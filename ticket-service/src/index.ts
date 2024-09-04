import MongoService from "./services/mongoService";
import NatsService from "./services/natsService";
import { UserReceiveMessage } from "./services/userService";
import { EventReceiveMessage } from "./services/eventService";
import { createApp } from "./app";
// import { yolo } from "../../common/one";

// yolo();  // This should now work without issues

const PORT = 3000;
const natsUrl = process.env.NATS_URL || "nats://localhost:4222";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";

(async () => {
    const mongoService = new MongoService(mongoUrl);
    const natsService = new NatsService(natsUrl);

    try {
        // yolo();  // This should now work without issues
        // Connect to MongoDB
        await mongoService.connect();

        // Create and start Express app
        const app = createApp(natsService);
        app.listen(PORT, () => {
            console.log(
                `Express.js(Ticket Service) server running on port ${PORT}`
            );
        });

        // Connect to NATS and subscribe to a topic
        await natsService.connect();

        await Promise.all([
            natsService.subscribe("Event", EventReceiveMessage),
            natsService.subscribe("User", UserReceiveMessage),
        ]);
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
