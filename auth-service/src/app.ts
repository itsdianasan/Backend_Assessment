import express from "express";
import authRoutes from "./routes/authRoutes";
import NatsService from "./services/natsService";

export function createApp(natsService: NatsService) {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Hello from Express.js(Auth Service)!");
    });

    // Routes
    app.use("/auth", authRoutes(natsService));

    return app;
}
