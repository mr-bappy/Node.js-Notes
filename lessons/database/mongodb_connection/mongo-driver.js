// connecting mongodb using Node.js

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/");
await client.connect();

const db = client.db("mongodb_nodejs_db");
const userCollection = db.collection('user');

// Create
// userCollection.insertOne({
//     name: "Vishal Yennam",
//     age: 20
// });

// userCollection.insertMany([
//     {
//         name:"vishal",
//         age: 20,
//         role: "admin"
//     },
//     {
//         name: "hasti",
//         age: 19,
//         role: "user"
//     },
//     {
//         name: "raccoon",
//         age: 19,
//         role: "user"
//     }
// ])

// Read
// const usersCursor = userCollection.find();
// console.log(usersCursor);

// for await (const user of usersCursor){
//     console.log(user);
// }

// const usersCursor = await userCollection.find().toArray();
// console.log(usersCursor);

// const user = await userCollection.findOne({name: "vishal"});
// console.log(user);
// console.log(user._id.toHexString());

// Update
// await userCollection.updateOne({name: "hasti"}, {$set: {age: 20}})

// Delete
// await userCollection.deleteOne({name: "hasti"})

// const result = await userCollection.deleteMany({ role: "user" });
// console.log(`${result.deletedCount} documents deleted`);