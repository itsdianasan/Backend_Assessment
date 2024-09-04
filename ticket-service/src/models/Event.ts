import mongoose from "mongoose";
import { types } from "util";

interface TicketType {
    ticketTypeId: string;
    category: string;
    price: number;
    ticketsAvailable: number;
}

interface EventAttrs {
    eventId: string;
    eventName: string;
    eventDatetime: Date;
    eventVenue: string;
    typesOfTickets: Array<TicketType>;
    userId: string;
}

interface EventDoc extends mongoose.Document {
    eventId: string;
    eventName: string;
    eventDatetime: Date;
    eventVenue: string;
    typesOfTickets: Array<TicketType>;
    userId: string;
}

interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventAttrs): EventDoc;
}

const eventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
        },
        eventName: {
            type: String,
            required: true,
        },
        eventDatetime: {
            type: Date,
            required: true,
        },
        eventVenue: {
            type: String,
            required: true,
        },
        typesOfTickets: {
            type: Array,
        },
        userId: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

eventSchema.statics.build = (attrs: EventAttrs) => {
    return new Event(attrs);
};

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
mongoose.connect(url)
const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event , TicketType};
