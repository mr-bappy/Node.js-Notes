// built-in imports
const fs = require('fs/promises');
const path = require('path');
const EventEmitter = require('events');
const event = new EventEmitter();

// external imports
const countEvents = require('./event-counter.json')

// counting for each event
const eventCounts = countEvents;

// for user
event.on("user-login", (username) => {
    eventCounts['user-login']++;
    console.log(`${username} logged in`);
});
event.on("user-logout", (username) => {
    eventCounts['user-logout']++;
    console.log(`${username} logged out`);
});
event.on("profile-update", (username, updateInfo) => {
    eventCounts['profile-update']++;
    console.log(`${username} updated their ${updateInfo}`);
});
event.on("user-purchase", (username, item) => {
    eventCounts['user-purchase']++;
    console.log(`${username} purchased ${item}`);
});

// for counting events
event.on("event-counter", ()=>{
    console.log(eventCounts);
})

// user event emits
event.emit("user-login", "Vishal");
event.emit("user-purchase", "Vishal", "Lenovo Tab M11");
event.emit("profile-update", "Vishal", "profile image");
event.emit("user-logout", "Vishal");

// count emit
event.emit("event-counter");

// dynamic countEvents logic

const fileName = "event-counter.json";
const filePath = path.join(__dirname, fileName);

async function writeCountFile(countEvents){
    try{
        await fs.writeFile(filePath, JSON.stringify(countEvents), 'utf-8');
        console.log("date created in file");
    }catch(err){
        console.log(err);
    }
}
writeCountFile(eventCounts);