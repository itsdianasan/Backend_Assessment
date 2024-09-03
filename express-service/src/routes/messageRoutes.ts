import { Router } from "express";
import { Collection } from "mongodb";

const router = Router();

export default function messageRoutes(collection: Collection) {
    router.get("/", async (req, res) => {
        const messages = await collection.find().toArray();
        res.send(messages);
    });

    return router;
}
