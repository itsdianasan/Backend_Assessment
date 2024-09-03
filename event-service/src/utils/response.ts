import { Response } from "express";

export const sendResponse = (res: Response, data: any, statusCode: number) => {
    res.status(statusCode).json(data);
};