import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("<h1>Home page</h1>")
});

router.get("/report", (req, res) => {
    const student = {
        name: "vishal",
        grade: "B.Tech 2nd year",
        university: "Universal SkillTech"
    }
    res.render("report", { student });
})

export default router;