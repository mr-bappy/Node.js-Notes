import crypto from "crypto";
import { loadLinks, saveLinks, getLinkByShortcode } from "../models/shortener.model.js";

export const getURLShortener = async (req, res) => {
    try{
        // const file = await readFile(path.join("views", "url.html"));
        const links = await loadLinks();

        return res.render("url", {links, host:req.host})
    }catch(error){
        console.log(error);
        return res.status(500).send("Internal server error");
    }
}

export const postURLShortener =  async (req, res) => {
    try{
        const { url, shortCode } = req.body;
        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
        const links = await loadLinks();

        if(links[finalShortCode]){
            return res.status(400).send("Short code already exists, Please choose another")
        }

        // links[finalShortCode] = url;
        // await saveLinks(links);

        await saveLinks({url, shortCode});

        return res.redirect("/")
    }catch(error){
        console.log(error);
    }
}

export const redirectToShortLink = async(req, res) => {
    try {
        const { shortCode } = req.params;
        // const links = await loadLinks();
        const link = await getLinkByShortcode(shortCode);

        // if(!links[shortCode]) return res.status(404).send("404 error occurred");
        if(!link) return res.send("404 error occurred");

        return res.redirect(link.url);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}