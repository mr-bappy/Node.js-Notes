// connecting database using mongoose
import mongoose from "mongoose";

// step 1: connect to db
try {
    await mongoose.connect("mongodb://localhost:27017/mongoose_db");
    mongoose.set("debug", true);
} catch (error) {
    console.log(error);
    process.exit();
}

// step 2: create schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

// step 3: create model
const Users = mongoose.model("User", userSchema);

// making a connection for example
await Users.create({
    name:"vishal",
    age: 20,
    email: "vishal@techenthusiast.com"
})

await mongoose.connection.close();