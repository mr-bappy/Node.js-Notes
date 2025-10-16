// import path from 'path';
// import { readFile, writeFile } from 'fs/promises';

// const DATA_FILE = path.join("data", 'links.json');

// export async function loadLinks(){
//     try {
//         const data = await readFile(DATA_FILE, 'utf-8');
//         return JSON.parse(data);
//     } catch (error) {
//         if(error.code === "ENOENT"){
//             await writeFile(DATA_FILE, JSON.stringify({}));
//             return {};
//         }
//         throw error;
//     }
// }

// export async function saveLinks(links){
//     await writeFile(DATA_FILE, JSON.stringify(links));
// }

import { dbClient } from "../config/db-client.js";
// import { env } from "../config/env.js";

const db = dbClient.db("urlshortener");
const urlCollection = db.collection('url-shorteners');

export const loadLinks = async () => {
    return urlCollection.find().toArray();
}

export const saveLinks = async (link) => {
    return urlCollection.insertOne(link)
}

export const getLinkByShortcode = async (shortCode) => {
    return await urlCollection.findOne({shortCode: shortCode})
}