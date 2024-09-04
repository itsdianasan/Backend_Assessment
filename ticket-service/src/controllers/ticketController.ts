import { Request, Response } from "express";
import NatsService from "../services/natsService";
import { sendResponse } from "../utils/response";
import { verifyToken } from "../utils/jwtUtils";
import { User } from "../models/User";
import { Event , TicketType } from "../models/Event";
import { Ticket } from "../models/Ticket";
import { v4 as uuidv4 } from "uuid";

const newTicket = (natsService: NatsService) => {
    return async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, { msg: "No token provided" }, 400);
                return;
            }
            let token_obj = verifyToken(token);
            if (!token_obj || typeof token_obj === "string") {
                sendResponse(res, { msg: "Invalid token" }, 400);
                return;
            }
            const user = await User.findOne({ userId: token_obj.id });
            console.log(user);
            
            if (!user) {
                sendResponse(res, { msg: "User not found" }, 400);
                return;
            }

            const { eventId, category , price , ticketsAvailable } = req.body;
            if (
                !eventId ||
                !category ||
                !price ||
                !ticketsAvailable ||
                typeof eventId !== "string" ||
                typeof category !== "string" ||
                typeof price !== "number" ||
                typeof ticketsAvailable !== "number"
            ) {
                sendResponse(res, { msg: "Missing fields" }, 400);
                return;
            }
            const event = await Event.findOne({ eventId });
            if (!event) {
                sendResponse(res, { msg: "Event not found" }, 400);
                return;
            }
            if (event.userId !== user.userId) {
                sendResponse(res, { msg: "Unauthorized" }, 401);
                return;
            }
            const ticketType: TicketType = {
                ticketTypeId: uuidv4(),
                category,
                price,
                ticketsAvailable,
            };
            event.typesOfTickets.push(ticketType);
            await event.save();

            natsService.publish(
                "Ticket",
                JSON.stringify({
                    action: "NewTicket",
                    data: event,
                })
            );

            sendResponse(
                res,
                { msg: "Event created", eventId: event.eventId , ticketTypeId: ticketType.ticketTypeId },
                200
            );
        } catch (error) {
            console.error("Error:", error);
            sendResponse(res, { msg: "Internal server error" }, 500);
        }
    };
}

const editTicket = (natsService: NatsService) => {
    return async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, { msg: "No token provided" }, 400);
                return;
            }
            let token_obj = verifyToken(token);
            if (!token_obj || typeof token_obj === "string") {
                sendResponse(res, { msg: "Invalid token" }, 400);
                return;
            }
            const user = await User.findOne({ userId: token_obj.id });
            if (!user) {
                sendResponse(res, { msg: "User not found" }, 400);
                return;
            }

            const { eventId, ticketTypeId, category , price , ticketsAvailable } = req.body;
            if (
                !eventId ||
                !ticketTypeId ||
                !category ||
                !price ||
                !ticketsAvailable ||
                typeof eventId !== "string" ||
                typeof ticketTypeId !== "string" ||
                typeof category !== "string" ||
                typeof price !== "number" ||
                typeof ticketsAvailable !== "number"
            ) {
                sendResponse(res, { msg: "Missing fields" }, 400);
                return;
            }
            const event = await Event.findOne({ eventId });
            if (!event) {
                sendResponse(res, { msg: "Event not found" }, 400);
                return;
            }
            if (event.userId !== user.userId) {
                sendResponse(res, { msg: "Unauthorized" }, 401);
                return;
            }
            const ticketType = event.typesOfTickets.find((ticket) => ticket.ticketTypeId === ticketTypeId);
            if (!ticketType) {
                sendResponse(res, { msg: "Ticket not found" }, 400);
                return;
            }
            ticketType.category = category;
            ticketType.price = price;
            ticketType.ticketsAvailable = ticketsAvailable;
            await event.save();

            natsService.publish(
                "Ticket",
                JSON.stringify({
                    action: "EditTicket",
                    data: event,
                })
            );

            sendResponse(
                res,
                { msg: "Event updated", eventId: event.eventId },
                200
            );
        } catch (error) {
            console.error("Error:", error);
            sendResponse(res, { msg: "Internal server error" }, 500);
        }
    };
}

const deleteTicket = (natsService: NatsService) => {
    return async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, { msg: "No token provided" }, 400);
                return;
            }
            let token_obj = verifyToken(token);
            if (!token_obj || typeof token_obj === "string") {
                sendResponse(res, { msg: "Invalid token" }, 400);
                return;
            }
            const user = await User.findOne({ userId: token_obj.id });
            if (!user) {
                sendResponse(res, { msg: "User not found" }, 400);
                return;
            }

            const { eventId, ticketTypeId } = req.body;
            if (
                !eventId ||
                !ticketTypeId ||
                typeof eventId !== "string" ||
                typeof ticketTypeId !== "string"
            ) {
                sendResponse(res, { msg: "Missing fields" }, 400);
                return;
            }
            const event = await Event.findOne({ eventId });
            if (!event) {
                sendResponse(res, { msg: "Event not found" }, 400);
                return;
            }
            if (event.userId !== user.userId) {
                sendResponse(res, { msg: "Unauthorized" }, 401);
                return;
            }
            const ticketTypeIndex = event.typesOfTickets.findIndex((ticket) => ticket.ticketTypeId === ticketTypeId);
            if (ticketTypeIndex === -1) {
                sendResponse(res, { msg: "Ticket not found" }, 400);
                return;
            }
            event.typesOfTickets.splice(ticketTypeIndex, 1);
            await event.save();

            natsService.publish(
                "Ticket",
                JSON.stringify({
                    action: "TicketDeleted",
                    data: event,
                })
            );

            sendResponse(
                res,
                { msg: "Event updated", eventId: event.eventId },
                200
            );
        } catch (error) {
            console.error("Error:", error);
            sendResponse(res, { msg: "Internal server error" }, 500);
        }
    };
}

const purchaseTicket = (natsService: NatsService) => {
    return async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                sendResponse(res, { msg: "No token provided" }, 400);
                return;
            }
            let token_obj = verifyToken(token);
            if (!token_obj || typeof token_obj === "string") {
                sendResponse(res, { msg: "Invalid token" }, 400);
                return;
            }
            const user = await User.findOne({ userId: token_obj.id });
            if (!user) {
                sendResponse(res, { msg: "User not found" }, 400);
                return;
            }

            const { eventId, ticketTypeId } = req.body;
            if (
                !eventId ||
                !ticketTypeId ||
                typeof eventId !== "string" ||
                typeof ticketTypeId !== "string"
            ) {
                sendResponse(res, { msg: "Missing fields" }, 400);
                return;
            }
            const event = await Event.findOne({ eventId });
            if (!event) {
                sendResponse(res, { msg: "Event not found" }, 400);
                return;
            }

            const ticketType = event.typesOfTickets.find((ticket) => ticket.ticketTypeId === ticketTypeId);
            if (!ticketType) {
                sendResponse(res, { msg: "Ticket not found" }, 400);
                return;
            }
            if (ticketType.ticketsAvailable === 0) {
                sendResponse(res, { msg: "Ticket sold out" }, 400);
                return;
            }
            ticketType.ticketsAvailable -= 1;
            await event.save();

            const ticket = Ticket.build({
                ticketId: uuidv4(),
                eventId,
                ticketTypeId,
                userId: user.userId,
            });
            await ticket.save();

            user.tickets.push(ticket);
            await user.save();

            natsService.publish(
                "Ticket",
                JSON.stringify({
                    action: "BuyTicket",
                    data: ticket,
                })
            );

            sendResponse(
                res,
                { msg: "Ticket purchased", ticketId: ticket.ticketId },
                200
            );
        } catch (error) {
            console.error("Error:", error);
            sendResponse(res, { msg: "Internal server error" }, 500);
        }
    };
}

export { newTicket, editTicket, deleteTicket, purchaseTicket };