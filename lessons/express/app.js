import express from "express";
import { PORT } from "./env.js";
import path from "path";
import router from "./routes/example.js";

const app = express();

// app.get("/", (req, res) => {
//     res.send("<h1>Hello World!</h1>");
// });
// app.get("/about", (req, res) => {
//     res.send("<h1>Hello About Page!</h1>");
// });
// app.get("/contact", (req, res) => {
//     res.send(`
//     <div class="container">
//         <div>
//             <h1>URL Shortener</h1>
//         </div>
//         <form class="form-data">
//             <div class="url-container">
//                 <label for="url">Enter URL Link:</label>
//                 <input type="url" name="url" id="url" placeholder="enter or paste the link here...">
//             </div>
//             <div class="shortCode-container">
//                 <label for="shortCode">Enter short text:</label>
//                 <input type="text" name="shortCode" id="shortCode" placeholder="enter text to make it short...">
//             </div>
//             <div class="btn-container">
//                 <button type="submit" id="shorten-btn">Shorten</button>
//             </div>
//         </form>
//         <div class="shortened-container">
//             <h2>Shortened URLs</h2>
//             <ul class="shortened-urls">

//             </ul>
//         </div>
//     </div>    
//     `);
// });

// absolute path
const staticPath = path.join(import.meta.dirname, "public");

// serving files
// app.use(express.static(staticPath));

// sending files
// app.get("/", (req, res) => {
//     // console.log(__dirname);
//     // console.log(__filename);
//     // not supported bcz we are using type module es(ecmascript)
//     // console.log(import.meta.dirname);
//     // console.log(import.meta.filename);
//     // console.log(import.meta.url); //complete filename
//     // const __filename = new URL(import.meta.url).pathname;
//     // console.log(__filename);

//     // const homePagePath = path.join(import.meta.dirname, "public", "index.html");
//     // res.sendFile(homePagePath);
// })

// route parameters
// app.get("/user/:username", (req, res) => {
//     console.log(req.params);
//     res.send(`<h1>Hii ${req.params.username}</h1>`);
// })

// app.get("/user/:username/article/:slug", (req, res) => {
//     console.log(req.params);
//     const formatedSlug = req.params.slug.replace(/-/g, " ")
//     res.send(`<h1>Article ${req.params.username} by ${formatedSlug}</h1>`);
// })

// query parameters
// app.get("/product", (req, res) => {
//     console.log(req.query);
//     res.send(`<h1>you have searched for: ${req.query.search}</h1>`)
// });

// submitting form
// app.use(express.static(staticPath));
// app.use(express.urlencoded({ extended: true }));
// extended: true - uses qs library, allows parsing for complex structures like nested objects while normal parsing can't do

// app.get("/contact", (req, res) => {
//     console.log(req.query);
//     res.redirect("/");
// })

// app.post("/contact", (req, res) => {
//     console.log(req.body);
//     // res.redirect("/");
//     res.send("submitted")
// })

// router paths
app.use("/",router)

// handle errors
// app.use((req, res) => {
//     return res.status(404).sendFile(path.join(import.meta.dirname, "views", "404.html"));
// })

// EJS template engine
app.set("view engine", 'ejs');

// creating PORT
// const PORT = process.env.PORT || 3000;

// listening server
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});