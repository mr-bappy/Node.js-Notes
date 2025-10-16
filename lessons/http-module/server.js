// require http module
const http = require('http');

// importing json
const jsonObj = require("./jsonObj.json");

// creating server
const server = http.createServer((req, res) => {
    if(req.url == "/"){
        res.setHeader("Content-Type", "text/html");
        res.write("<h1>Welcome to the first server page, enjoy learning node.js and express.</h1>");
        res.end();
    }
    if(req.url == "/about"){
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(jsonObj));
        res.end();
    }
    if(req.url == "/contact"){
        res.setHeader("Content-Type", "text/plain");
        res.write("Welcome to the first server contact page");
        res.end();
    }
});

// creating port
const PORT = 3000;

// listening server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
})