// importing packages
const https = require('https');
const readline = require('readline');

// creating input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const API_KEY = '1eeccfb59edc61c8c944107e';
const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

// handle getAmount()
function getAmount(){
    https.get(url, (response) => {
        let data = "";
        response.on('data', (chunk) => {
            data += chunk;
        })
        response.on('end', () => {
            // const rates = JSON.parse(data).conversion_rates; // short way
            const rates = JSON.parse(data);
            const rate = rates.conversion_rates;
            // console.log(rate);
            rl.question("Enter amount in USD: ", (amount) => {
                rl.question("Enter to convert in which currency: ", (currency) => {
                    console.log(`USD ${amount} in ${currency} currency is ${amount*rate[currency.toUpperCase()].toFixed(2)}`)
                    rl.close();
                });
            });
        });
        response.on('error', (err) => {
            console.log("Error occurred: ", err.message);
            rl.close();
        })
    })
}

// calling getAmount()
getAmount();