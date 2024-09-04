import { Router } from "express";
import NatsService from "../services/natsService";
import { newEvent , editEvent } from "../controllers/eventController";

const router = Router();

export default function eventRoutes(natsService: NatsService) {
    router.post("/new", newEvent(natsService));
    router.post("/edit", editEvent(natsService));
    return router;
}
