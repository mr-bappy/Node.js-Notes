import express from "express";
import shortenedRouter from './routes/shortenedRoutes.routes.js';
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(shortenedRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});