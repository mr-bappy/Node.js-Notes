const EventEmitter = require('events');
const event = new EventEmitter();

// add event listener
// event.on("greet", () => {
//     console.log("Hello, I am Vishal");
// })
// emit or call event
// event.emit("greet");

// with arguments
// event.on("user", (firstname, lastname) => {
//     console.log(`fullname: ${firstname} ${lastname}`);
// })
// event.emit("user", "Vishal", "Yennam");

// with argument object
event.on("student", (arg) => {
    console.log(`name: ${arg.name} \ngrade: ${arg.grade} \nage: ${arg.age}`);
});
event.emit("student", {
    name: "yousaf hareen", 
    grade: "high school", 
    age: 18
})