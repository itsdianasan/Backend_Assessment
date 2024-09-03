import { Event } from '../models/Event';

const EventCreated = async (msgObj:any) => {
    console.log(`Creating event: ${JSON.stringify(msgObj.data)}`);
    const event = Event.build(msgObj.data);
    await event.save();
    console.log(`Event created: ${event}`);
    return;
}

const EventUpdated = async (msgObj:any) => {
    console.log(`Updating event: ${JSON.stringify(msgObj.data)}`);
    const event = await Event.findOne({ eventId: msgObj.data.eventId });
    if (!event) {
        console.log(`Event not found: ${msgObj.data.eventId}`);
        return;
    }
    event.set(msgObj.data);
    await event.save();
    return;
}

export const EventReceiveMessage = async (msg: string) => {
    console.log(`Received message: ${msg}`);
    const msgObj = JSON.parse(msg);
    if (msgObj.action === 'EventCreated') {
        await EventCreated(msgObj);
    }
    if (msgObj.action === 'EventUpdated') {
        await EventUpdated(msgObj);
    }
    return;
};