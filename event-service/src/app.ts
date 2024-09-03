import express from "express";
import eventRoutes from "./routes/eventRoutes";
import NatsService from "./services/natsService";

export function createApp(natsService: NatsService) {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Hello from Express.js(Auth Service)!");
    });

    app.use("/event", eventRoutes(natsService));

    // Routes
    // app.use("/event", authRoutes(natsService));

    return app;
}
