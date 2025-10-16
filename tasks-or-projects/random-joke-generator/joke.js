const https = require('https');
// const chalk = require('chalk'); // chalk is not working in my node

function randomJoke(){

    const url = "https://official-joke-api.appspot.com/random_joke";
    https.get(url, (response) =>{
        let data = "";
        response.on('data', (chunk) =>{
            data += chunk;
        });
        response.on('end', () => {
            const joke = JSON.parse(data);
            console.log(`Here is your ${joke.type} joke`);
            console.log(joke.setup);
            console.log(joke.punchline);
        });
        response.on('error', (err) => {
            console.log("Error generating joke: ", err.message);
        })
    })
}

// calling randomJoke()
randomJoke();