import { MongoClient, Db, Collection } from "mongodb";

class MongoService {
    private client: MongoClient;
    private db: Db | null = null;

    constructor(private mongoUrl: string) {
        this.client = new MongoClient(mongoUrl);
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("Connected to MongoDB");
            this.db = this.client.db("testdb");
        } catch (error) {
            console.error("Failed to connect to MongoDB", error);
            throw error;
        }
    }

    getCollection(collectionName: string): Collection {
        if (!this.db) {
            throw new Error("MongoDB is not connected");
        }
        return this.db.collection(collectionName);
    }

    async close() {
        await this.client.close();
        console.log("MongoDB connection closed");
    }
}

export default MongoService;
