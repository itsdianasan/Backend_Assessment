import { User } from "../models/User";

export const UserReceiveMessage = async (msg: string) => {
    console.log(`Received message: ${msg}`);
    const msgObj = JSON.parse(msg);
    if (msgObj.action === "UserCreated") {
        console.log(`Creating user: ${JSON.stringify(msgObj.data)}`);
        const user = User.build(msgObj.data);
        await user.save();
    }
    return;
};