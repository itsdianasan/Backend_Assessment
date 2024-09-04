import { Ticket } from "../models/Ticket";
import { User } from "../models/User";
import { Event } from "../models/Event";

const NewTicket = async (msgObj:any) => {
    console.log(`Creating event ticket: ${JSON.stringify(msgObj.data)}`);
    const event = await Event.findOne({ eventId: msgObj.data.eventId });
    if (!event) {
        console.log(`Event not found: ${msgObj.data.eventId}`);
        return;
    }
    event.typesOfTickets = msgObj.data.typesOfTickets;
    await event.save();
    console.log(`Ticket type saved to event: ${event}`);
    return;
}

const EditTicket = async (msgObj:any) => {
    console.log(`Editing ticket: ${JSON.stringify(msgObj.data)}`);
    const event = await Event.findOne({ eventId: msgObj.data.eventId });
    if (!event) {
        console.log(`Event not found: ${msgObj.data.eventId}`);
        return;
    }
    event.typesOfTickets = msgObj.data.typesOfTickets;
    await event.save();
    return;
}

const DeleteTicket = async (msgObj:any) => {
    console.log(`Editing ticket: ${JSON.stringify(msgObj.data)}`);
    const event = await Event.findOne({ eventId: msgObj.data.eventId });
    if (!event) {
        console.log(`Event not found: ${msgObj.data.eventId}`);
        return;
    }
    event.typesOfTickets = msgObj.data.typesOfTickets;
    await event.save();
    return;
}


const BuyTicket = async (msgObj:any) => {
    console.log(`Buying ticket: ${JSON.stringify(msgObj)}`);
    const ticket = Ticket.build(msgObj.data);
    await ticket.save();
    const user = await User.findOne({ userId: msgObj.data.userId });
    if (!user) {
        console.log("User not found");
        return;
    }
    user.tickets.push(ticket);
    await user.save();
    return;
}

export const TicketReceiveMessage = async (msg: string) => {
    console.log(`Received message: ${msg}`);
    const msgObj = JSON.parse(msg);
    if (msgObj.action === "NewTicket") {
        await NewTicket(msgObj);
    }
    if (msgObj.action === "EditTicket") {
        await EditTicket(msgObj);
    }
    if (msgObj.action === "TicketDeleted") {
        await DeleteTicket(msgObj);
    }
    if (msgObj.action === "BuyTicket") {
        await BuyTicket(msgObj);
    }
    return;
};