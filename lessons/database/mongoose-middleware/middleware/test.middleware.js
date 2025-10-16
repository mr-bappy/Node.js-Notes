import mongoose from "mongoose";

// step 1: connect to db
try {
    await mongoose.connect("connection/db_name");
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
    // createdAt: {
    //     type: Date,
    //     default: Date.now()
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now()
    // }
}, {
    timestamps: true
});

// using middleware
// userSchema.pre(["updateOne", "updateMany", "findOneAndUpdate"], function (next){
//     this.set({ updatedAt: Date.now() });
//     next();
// })

const Users = mongoose.model("user", userSchema);

// await Users.create({
//     name:"vishal",
//     age: 20,
//     email: "vishal@techenthusiast.com"
// })

await Users.updateOne({
    email: "vishal@techenthusiast.com"
}, {
    $set: {
        age: 20
    }
})

await mongoose.connection.close();
