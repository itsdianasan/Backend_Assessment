import { Router } from "express";
import NatsService from "../services/natsService";
import { newTicket, editTicket , deleteTicket , purchaseTicket } from "../controllers/ticketController";

const router = Router();

export default function ticketRoutes(natsService: NatsService) {
    router.post("/new", newTicket(natsService));
    router.put("/edit", editTicket(natsService));
    router.delete("/delete", deleteTicket(natsService));
    router.post("/purchase", purchaseTicket(natsService));
    return router;
}
