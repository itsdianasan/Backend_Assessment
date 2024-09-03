import { Request, Response } from "express";
import NatsService from "../services/natsService";
import { verifyToken } from "../utils/jwtUtils";
import { sendResponse } from "../utils/response";
import { User } from "../models/User";
import { Event } from "../models/Event";
import { v4 as uuidv4 } from "uuid";

const newEvent = (natsService: NatsService) => {
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

            const { eventName, eventDatetime, eventVenue } = req.body;
            if (
                !eventName ||
                !eventDatetime ||
                !eventVenue ||
                typeof eventName !== "string" ||
                typeof eventDatetime !== "string" ||
                typeof eventVenue !== "string"
            ) {
                sendResponse(res, { msg: "Missing fields" }, 400);
                return;
            }
            const event = Event.build({
                eventId: uuidv4(),
                eventName: eventName,
                eventDatetime: new Date(eventDatetime),
                eventVenue: eventVenue,
                totalTickets: 0,
                userId: user.userId,
            });
            await event.save();
            natsService.publish(
                "Event",
                JSON.stringify({
                    action: "EventCreated",
                    data: event,
                })
            );

            sendResponse(
                res,
                { msg: "Event created", eventId: event.eventId },
                200
            );
        } catch (error) {
            res.status(500).send("Server error");
            return;
        }
    };
};

const editEvent = (natsService: NatsService) => {
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

            const {
                eventId,
                eventName,
                eventDatetime,
                eventVenue,
                totalTickets,
            } = req.body;
            if (
                !eventId ||
                !eventName ||
                !eventDatetime ||
                !eventVenue ||
                typeof eventId !== "string" ||
                typeof eventName !== "string" ||
                typeof eventDatetime !== "string" ||
                typeof eventVenue !== "string"
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
            event.eventName = eventName;
            event.eventDatetime = new Date(eventDatetime);
            event.eventVenue = eventVenue;
            event.totalTickets = totalTickets;
            await event.save();
            natsService.publish(
                "Event",
                JSON.stringify({
                    action: "EventUpdated",
                    data: event,
                })
            );

            sendResponse(
                res,
                { msg: "Event updated", eventId: event.eventId },
                200
            );
        } catch (error) {
            res.status(500).send("Server error");
            return;
        }
    };
};

export { newEvent };
