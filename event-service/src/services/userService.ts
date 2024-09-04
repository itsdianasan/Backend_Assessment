import { User } from "../models/User";

const UserCreate = async (msgObj:any) => {
    console.log(`Creating user: ${JSON.stringify(msgObj)}`);
    const user = User.build(msgObj);
    await user.save();
    return;
};

const BuyTicket = async (msgObj:any) => {
    console.log(`Buying ticket: ${JSON.stringify(msgObj)}`);
    const user = await User.findOne({ userId: msgObj.userId });
    if (!user) {
        console.log("User not found");
        return;
    }
    user.tickets.push(msgObj.ticket);
    await user.save();
    return;
}

export const UserReceiveMessage = async (msg: string) => {
    console.log(`Received message: ${msg}`);
    const msgObj = JSON.parse(msg);
    if (msgObj.action === "UserCreated") {
        await UserCreate(msgObj.data);
    }
    return;
};