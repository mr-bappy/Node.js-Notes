// readling package for input operations
const readline = require('readline');

// create interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// array to store tasks
const tasks = [];

// function to show menus
function showMenu(){
    console.log("\n1. Add a task");
    console.log("2. View tasks");
    console.log("3. Exit");
    // when using rl.question, a callback function is called to perform operation.
    rl.question("Enter option: ", handleInput)
}

// handle input operations
function handleInput(option){
    if(option === "1") rl.question("Enter your task: ", addTask);
    else if(option === "2") showTasks(); 
    else if(option === "3"){
        console.log("No Task added.");
        rl.close();
    }
    else{
        console.log("Invalid option.")
        showMenu();
    }
}

// function - add task
function addTask(task){
    tasks.push(task);
    console.log("Task Added: ", task);
    showMenu();
}

// function - show tasks
function showTasks(){
    console.log("Your tasks")
    tasks.forEach((task,index) => {
        console.log(`${index+1}. ${task}`);
    });
    showMenu();
}

// calling showMenu()
showMenu();