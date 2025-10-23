import { Router } from "express";
import { authControllers } from "../controllers/auth.controllers.js";
import { dataControllers } from "../controllers/data.controllers.js";

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

router.route("/edit-profile").get(authControllers.editProfile).post(authControllers.postEditProfile);

router.route("/change-password").get(authControllers.getChangePassword).post(authControllers.postChangePassword);

router.route("/forget-password").get(authControllers.getForgetPasswordPage).post(authControllers.postForgetPasswordPage)

router.route("/reset-password/:token").get(authControllers.getResetPassword).post(authControllers.postResetPassword);


export const authRouter = router;