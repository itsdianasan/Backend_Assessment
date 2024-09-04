import express from "express";
import ticketRoutes from "./routes/ticketRoutes";
import NatsService from "./services/natsService";

export function createApp(natsService: NatsService) {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Hello from Express.js(Auth Service)!");
    });

    app.use("/ticket", ticketRoutes(natsService));

    return app;
}
