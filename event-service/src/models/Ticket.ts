import mongoose from "mongoose";

interface TicketAttrs {
    ticketId: string;
    eventId: string;
    ticketTypeId: string;
    userId: string;
}

interface TicketDoc extends mongoose.Document {
    ticketId: string;
    eventId: string;
    ticketTypeId: string;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            required: true,
        },
        eventId: {
            type: String,
            required: true,
        },
        ticketTypeId: {
            type: String,
            required: true,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const url = process.env.MONGO_URL || "mongodb://localhost:27017";
mongoose.connect(url)
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket , TicketAttrs };
