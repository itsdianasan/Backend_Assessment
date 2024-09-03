import express from "express";
import authRoutes from "./routes/authRoutes";
import { Collection } from "mongodb";

export function createApp(collection: Collection) {
    const app = express();
    app.use(express.json());

    app.get("/", (req, res) => {
        res.send("Hello from Express.js(Auth Service)!");
    });

    // Routes
    app.use("/auth", authRoutes(collection));

    return app;
}
