import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import flash from "connect-flash";
import requestIp from "request-ip";
import session from "express-session";

import { authRouter } from "./routes/auth.routes.js";
import { getUserData } from "./services/auth.services.js";
import { verifyAuthentication } from "./middlewares/verify.middleware.js";

const app = express();

app.set("view engine", 'ejs');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "my_secret",
    resave: true, 
    saveUninitialized: false,
}));
app.use(flash());
app.use(requestIp.mw());
app.use(verifyAuthentication);
app.use((req, res, next) => {
    res.locals.user = req.user;
    return next();
});
app.use("/auth", authRouter);

app.get("/", async (req, res) => {
    // console.log(req.user);
    if(!req.user) return res.redirect("/auth/login");
    // let isLoggedIn = req.headers.cookie;
    // isLoggedIn = Boolean(isLoggedIn?.split("=")[1]);

    let isLoggedIn = req.user;
    // console.log(typeof isLoggedIn);


    const userId = String(req.user.id)
    const userData = await getUserData(userId);
    // console.log(userId);
    // console.log(userData);
    return res.render("index", { isLoggedIn, userData });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});