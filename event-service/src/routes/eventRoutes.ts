import { Router } from "express";
import NatsService from "../services/natsService";
import { newEvent } from "../controllers/eventController";

const router = Router();

export default function eventRoutes(natsService: NatsService) {
    router.post("/new", newEvent(natsService));
    return router;
}
