// built-in imports
import readline from 'readline/promises';


// creating input interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const API_KEY = '745921c20fa0677949a3f0b696ffa933';
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

// function to get weather
async function getWeather(city){
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("error fetching api!");
        }
        const data = await response.json();
        console.log(`\nWeather Information:`);
        console.log(`City: ${data.name}`);
        console.log(`Temperature: ${data.main.temp}°C`);
        console.log(`Description: ${data.weather[0].description}`);
        console.log(`Humidity: ${data.main.humidity}%`);
        console.log(`Wind speed: ${data.wind.speed} m/s`);

    }catch(error){
        console.log(error);
    }
}

// input operation
const city = await rl.question("Enter city name to get weather: ");
await getWeather(city);
rl.close();