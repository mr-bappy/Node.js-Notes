import { Router } from "express";
import { getURLShortener, postURLShortener, redirectToShortLink } from "../controllers/post_url_shortener.controller.js";

const shortenedRouter = Router();

shortenedRouter.get("/", getURLShortener);
shortenedRouter.post("/", postURLShortener);
shortenedRouter.get("/:shortCode", redirectToShortLink);

export default shortenedRouter;