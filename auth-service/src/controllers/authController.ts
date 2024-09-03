import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { sendResponse } from "../utils/response";
import { signToken } from "../utils/jwtUtils";
import NatsService from "../services/natsService";

const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const passwordMatch = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (passwordMatch) {
                sendResponse(
                    res,
                    {
                        msg: "User authenticated",
                        token: signToken(existingUser.userId),
                    },
                    200
                );
                return;
            }

            sendResponse(res, { msg: "Password does not match" }, 400);
            return;
        }

        sendResponse(res, { msg: "User does not exist" }, 400);
    } catch (error) {
        res.status(500).send("Server error");
        return;
    }
};

const signup = (natsService: NatsService) => {
    return async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const existingUser = await User.findOne({ email });

            console.log("existingUser", existingUser);

            if (existingUser) {
                sendResponse(res, { msg: "User already exists" }, 400);
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.build({
                userId: uuidv4(),
                email,
                password: hashedPassword,
            });

            await user.save();

            natsService.publish(
                "User",
                JSON.stringify({
                    action: "UserCreated",
                    data: user,
                })
            );

            sendResponse(
                res,
                { msg: "User created", token: signToken(user.userId) },
                201
            );
            return;
        } catch (error) {
            sendResponse(res, { msg: "Server error" }, 500);
            return;
        }
    };
};

export { signin, signup };
