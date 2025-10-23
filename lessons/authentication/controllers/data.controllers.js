import { createUserData, deleteData, getData, getUserTitle, updateData } from "../services/auth.services.js";
import z from "zod";

const postUserData = async (req, res) => {
    const { title, tagline } = req.body;
    // console.log(title, tagline);

    const titleExists = await getUserTitle(title);

    if(titleExists){
        console.log(titleExists);
        // console.log("title is taken, please choose another one");
        return res.redirect("/");
    }

    const [data] = await createUserData({
        title,
        tagline,
        userId: req.user.id
    });
    // console.log(data);

    return res.redirect("/");

}

export const getUserData = async (req, res) => {
    const id = req.params.id;

    const [result] = await getData(id);
    const { title, tagline } = result;
    console.log(title, tagline);
    return res.render("update", { id, title, tagline });
}

export const updateUserData = async (req, res) => {

    const id = req.params.id;
    const { title, tagline } = req.body;
    // console.log(id);
    // console.log(title, tagline);

    const result = await updateData(id, title, tagline);

    return res.redirect("/")
}

export const deleteUserData = async (req, res) => {
    try {
        const id = req.params.id;
        // const { data: id, error} = z.coerce.number().int().safeParse(req.params.id);
        // console.log(userId);

        const result = await deleteData(id);
        return res.redirect("/");

    } catch (error) {
        console.log(error);
    }
}

export const dataControllers = {
    postUserData,
    deleteUserData,
    updateUserData,
    getUserData,
}