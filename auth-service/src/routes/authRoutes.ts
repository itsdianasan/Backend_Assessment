import { Router } from "express";
import NatsService from "../services/natsService";
import { signin , signup , ticketHistory } from "../controllers/authController";

const router = Router();

export default function authRoutes(natsService: NatsService) {
    router.post("/signin",signin);

    router.post("/signup", signup(natsService));

    router.post("/ticket_history",ticketHistory)

    return router;
}
