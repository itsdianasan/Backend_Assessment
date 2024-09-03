import { Router } from "express";
import NatsService from '../services/natsService';

const router = Router();

export default function authRoutes(natsService: NatsService) {
    router.get("/signin", async (req, res) => {
        natsService.publish("test.topic", "User signed in");
        res.send("Sign in");
    });

    return router;
}
