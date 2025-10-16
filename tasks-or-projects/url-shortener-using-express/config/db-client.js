import { MongoClient } from "mongodb";
// import { env } from "./env.js";

// export const dbClient = new MongoClient(process.env.MONGO_URI);
export const dbClient = new MongoClient("mongodb://localhost:27017/");
