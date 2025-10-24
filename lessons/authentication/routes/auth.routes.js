import { Router } from "express";
import { authControllers } from "../controllers/auth.controllers.js";
import { dataControllers } from "../controllers/data.controllers.js";

import multer from "multer";
import path from "path";

const router = Router();

// router.get("/register", authControllers.getRegisterPage);
// router.get("/login", authControllers.getLoginPage);

// router.post("/register", authControllers.postRegister);
// router.post("/login", authControllers.postLogin);

router.route("/register")
    .get(authControllers.getRegisterPage)
    .post(authControllers.postRegister);

router.route("/login")
    .get(authControllers.getLoginPage)
    .post(authControllers.postLogin);

router.route("/user").get(authControllers.getUser);
router.route("/logout").get(authControllers.logoutUser);

router.route("/user/data").post(dataControllers.postUserData);

router.route("/user/update/:id").get(dataControllers.getUserData).post(dataControllers.updateUserData);
router.route("/user/delete/:id").post(dataControllers.deleteUserData);

router.route("/user/email-verify").get(authControllers.getVerifyEmailPage)

router.route("/user/send-verification").post(authControllers.emailVerification);

router.route("/user/verify-email-token").get(authControllers.verifyEmailToken);

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/avatars");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}_${Math.random()}${ext}`);
    }
});

const avatarFileFilters = (req, file, cb) => {
    if(file.mimetype.startsWith("image/")){
        cb(null, true);
    }else{
        cb(new Error("Only image files are allowed!"), false);
    }
}

const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilters,
    limits: {
        fileSize: 5*1024*1024
    }, // 5mb
})

router.route("/edit-profile")
.get(authControllers.editProfile)
// .post(authControllers.postEditProfile);
.post(avatarUpload.single('avatar'), authControllers.postEditProfile);

router.route("/change-password").get(authControllers.getChangePassword).post(authControllers.postChangePassword);

router.route("/forget-password").get(authControllers.getForgetPasswordPage).post(authControllers.postForgetPasswordPage)

router.route("/reset-password/:token").get(authControllers.getResetPassword).post(authControllers.postResetPassword);

router.route("/google").get(authControllers.getGoogleLoginPage);
router.route("/google/callback").get(authControllers.getGoogleLoginCallback)

router.route("/github").get(authControllers.getGithubLoginPage);
router.route("/github/callback").get(authControllers.getGithubLoginCallback);

router.route("/set-password").get(authControllers.getSetPassword).post(authControllers.postSetPassword);

export const authRouter = router;