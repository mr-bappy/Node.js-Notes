// import { sendEmail } from "../lib/nodemailer.js";
import { sendEmail } from "../lib/send-email.js";
import { clearResetPasswordToken, clearUserSession, clearVerifyEmailTokens, comparePassword, createAccessToken, createRefreshToken, createResetPasswordLink, createSession, createUser, createVerifyEmailLink, findUserByEmail, findUserById, findVerificationEmailToken, generateOTP, getResetPasswordToken, getUserByEmail, getUserData, hashedPassword, insertVerifyEmailToken, updateUserByName, updateUserPassword, verifyUserEmailAndUpdate } from "../services/auth.services.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../services/constants.js";
import { forgetPasswordSchema, validateLogin, validateRegistration, verifyEmailSchema, verifyPasswordSchema, verifyResetPasswordSchema, verifyUserSchema } from "../validators/auth.validator.js";
import z from "zod";
import fs from "fs/promises";
import path from "path";
import mjml2html from "mjml";
import ejs from "ejs";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";

const getRegisterPage = (req, res) => {
    if(req.user) return res.redirect("/");
    return res.render("register", {
        errors: req.flash("errors")
    });
}

const getLoginPage = (req, res) => {
    if(req.user) return res.redirect("/");
    return res.render("login", {
        invalid: req.flash("invalid")
    });
}

const postRegister = async (req, res) => {
    if(req.user) return res.redirect("/");

    // const { username, email, password } = req.body;
    // console.log(username, email, password);

    // try {
    //     const data = validateRegistration.parse(req.body);
    //     const {username, email, password} = data;
    //     console.log(data);
    // } catch (err) {
    //     if(err instanceof z.ZodError){
    //         const errors = err.issues[0].message
    //         req.flash("errors", errors);
    //         // console.log(err.issues[0].message);
    //     }
    //     return res.redirect("/auth/register")
    // }

    const { data, error } = validateRegistration.safeParse(req.body);
    
    if(error instanceof z.ZodError){
        const errors = error.issues[0].message
        req.flash("errors", errors);
        // console.log(err.issues[0].message);
        return res.redirect("/auth/register")
    }
    
    const { username, email, password } = data;
    // console.log(data);

    const userExists = await getUserByEmail(email);
    // console.log(userExists);

    if(userExists){
        req.flash("errors", "User already exists");
        return res.redirect("/auth/register")
    }

    const hashPassword = await hashedPassword(password);

    const [user] = await createUser({
        username, 
        email,
        password: hashPassword,
    })

    // hybrid authentication
    const session = await createSession(user.id, {
        ip: req.clientIp,
        userAgent: req.headers["user-agent"],
    });

    const accessToken = createAccessToken({
        id: user.id,
        username: username,
        email: email,
        isEmailValid: user.isEmailValid,
        sessionId: session.id
    });

    const refreshToken = createRefreshToken(session.id);

    const baseConfig = { httpOnly: true, secure: true };

    res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
    });

    res.redirect("/");

    // res.redirect("/auth/login");
}

const postLogin = async (req, res) => {
    if(req.user) return res.redirect("/");

    // const {email, password} = req.body;
    // console.log(email, password);

    const { data, error } = validateLogin.safeParse(req.body);

    if(error instanceof z.ZodError){
        const errors = error.issues[0].message;
        req.flash("invalid", errors);
        // console.log(error.issues);
        return res.redirect("/auth/login");
    }

    const { email, password } = data;

    const user = await getUserByEmail(email);
    // console.log(user);

    if(!user){
        // console.log("email does not exists");
        req.flash("invalid", "Invalid email or password");
        return res.redirect("/auth/login"); 
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if(!isPasswordValid){
        // console.log("wrong password");
        req.flash("invalid", "Invalid email or password");
        return res.redirect("/auth/login");
    }

    // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;" );
    // res.cookie("isLoggedIn", true);

    // const token = generateToken({
    //     id: user.id,
    //     username: user.username,
    //     email: user.email,
    // });

    // res.cookie("user_cookie", token);

    // hybrid authentication
    const session = await createSession(user.id, {
        ip: req.clientIp,
        userAgent: req.headers["user-agent"],
    });

    const accessToken = createAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailValid: user.isEmailValid,
        sessionId: session.id
    });

    const refreshToken = createRefreshToken(session.id);

    const baseConfig = { httpOnly: true, secure: true };

    res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
    });

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
    });

    res.redirect("/");
}

export const getUser = async(req, res) => {
    if(!req.user) 
        return res.send(`
            <h1>Not logged in!</h1>
        `);
    
    const user = await findUserById(req.user.id);
    const {username, email, isEmailValid } = user;

    const tags = await getUserData(user.id);
    // console.log(tags, user.id);

    let count = tags.length;
    // console.log(count);

    

    return res.render("profile", {username, email, count, isEmailValid});

}

export const logoutUser = async (req, res) => {
    await clearUserSession(req.user.sessionId);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.redirect("/auth/login");
}

export const getVerifyEmailPage = (req, res) => {

    if(!req.user || req.user.isEmailValid) return res.redirect("/");

    return res.render("verify", {
        email: req.user.email
    });
}

// emailVerification
export const emailVerification = async (req, res) => {
    if(!req.user || req.user.isEmailValid) return res.redirect("/");

    const randomOTP = generateOTP();

    await insertVerifyEmailToken({
        userId: req.user.id, token: randomOTP
    });

    const verifyEmailLink = await createVerifyEmailLink({
        email: req.user.email,
        token: randomOTP,
    });

    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname, "..", "emails", "verify-email.mjml"), 'utf-8');

    const filledTemplate = ejs.render(mjmlTemplate, {
        code: randomOTP,
        link: verifyEmailLink,
    });

    const htmlOutput = mjml2html(filledTemplate).html;

    sendEmail({
        to: req.user.email,
        subject: "Verify your email",
        html: htmlOutput,
    }).catch(console.error);

    res.redirect("/auth/user/email-verify");
}

// verifyEmailToken
export const verifyEmailToken = async (req, res) => {
    // console.log(req.query);
    const {data, error} = verifyEmailSchema.safeParse(req.query);

    if(error instanceof z.ZodError){
        // console.log(error);
        return res.send("Verification link invalid or expired");
    }

    // const token = await findVerificationEmailToken(data);
    const [token] = await findVerificationEmailToken(data); // using joins
    // console.log("verifyEmailToken - token: ", token);
    if(!token) return res.send("Verification link invalid or expired!");

    await verifyUserEmailAndUpdate(token.email);

    clearVerifyEmailTokens(token.email).catch(console.error)
    
    return res.redirect("/auth/user");
}

// editProfile
export const editProfile = async (req, res) => {
    if(!req.user) return res.redirect("/");

    const user = await findUserById(req.user.id);

    if(!user) return res.status(400).send("User not found!");

    return res.render("auth/edit-profile", {
        username: user.username,
        error: req.flash("errors")
    });
};

// postEditProfile
export const postEditProfile = async (req, res) => {
    if(!req.user) return res.redirect("/");

    const {data, error} = verifyUserSchema.safeParse(req.body);

    if(error instanceof z.ZodError){
        const errorMessages = error.issues[0].message;
        req.flash("errors", errorMessages);
        return res.redirect("/auth/edit-profile");
    }

    await updateUserByName({ userId: req.user.id, updateName: data.username });

    return res.redirect('/auth/user');
}

// getChangePassword
export const getChangePassword = (req, res) => {
    if(!req.user) return res.redirect("/");

    return res.render("auth/change-password", {
        errors: req.flash("errors"),
    });

    
}

// postChangePassword
export const postChangePassword = async (req, res) => {

    const {data, error} = verifyPasswordSchema.safeParse(req.body);

    if(error instanceof z.ZodError){
        console.log(error);
        const errorMessages = error.issues[0].message;
        req.flash("errors", errorMessages);
        return res.redirect("/auth/change-password");
    }
    const {currentPassword, newPassword} = data;

    const user = await findUserById(req.user.id);
    if(!user) return res.status(400).send("User not found!");

    const isPasswordValid = comparePassword(currentPassword, user.password);
    if(!isPasswordValid){
        req.flash("errors", "Current password is invalid");
        return res.redirect("/auth/change-password");
    }

    await updateUserPassword({userId: user.id, newPassword});

    return res.redirect("/auth/user");
}

// getForgetPasswordPage
export const getForgetPasswordPage = (req, res) => {

    return res.render("auth/forget-password", {
        formSubmitted: req.flash("formSubmitted")[0],
        errors: req.flash("errors"),
    })
}

// postForgetPasswordPage
export const postForgetPasswordPage = async (req, res) => {

    const {data, error} = forgetPasswordSchema.safeParse(req.body);

    if(error instanceof z.ZodError){
        console.log(error);
        const errorMessages = error.issues[0].message;
        req.flash("errors", errorMessages);
        return res.redirect("/auth/forget-password");
    }

    const user = await findUserByEmail(data.email);

    if(user){
        const resetPasswordLink = await createResetPasswordLink({ 
            userId: user.id
        });

        const html = await getHtmlFromMjmlTemplate("reset-password-email", {
            username: user.username,
            link: resetPasswordLink,
        });

        sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: html,
        });
    }

    req.flash("formSubmitted", true);
    return res.redirect("/auth/forget-password");
}

// getResetPassword
export const getResetPassword = async (req, res) => {

    const {token} = req.params;
    const passwordResetData = await getResetPasswordToken(token);
    if(!passwordResetData) return res.render("auth/wrong-reset-password-token");

    res.render("auth/reset-password", {
        formSubmitted: req.flash("formSubmitted")[0],
        errors: req.flash("errors"),
        token
    });
}

// postResetPassword
export const postResetPassword = async (req, res) => {

    const {token} = req.params;
    const passwordResetData = await getResetPasswordToken(token);
    if(!passwordResetData) return res.render("auth/wrong-reset-password-token");

    const {data, error} = verifyResetPasswordSchema.safeParse(req.body);
    if(error instanceof z.ZodError){
        console.log(error);
        const errorMessages = error.issues[0].message;
        req.flash("errors", errorMessages);
        return res.redirect(`/auth/reset-password/${token}`);
    }

    const {newPassword} = data;
    
    const user = await findUserById(passwordResetData.userId);

    await clearResetPasswordToken(user.id);

    await updateUserPassword({userId: user.id, newPassword});

    return res.redirect("/auth/login");
}

export const authControllers = {
    getRegisterPage,
    getLoginPage,
    postRegister,
    postLogin,
    getUser,
    logoutUser,
    getVerifyEmailPage,
    emailVerification,
    verifyEmailToken,
    editProfile,
    postEditProfile,
    getChangePassword,
    postChangePassword,
    getForgetPasswordPage,
    postForgetPasswordPage,
    getResetPassword,
    postResetPassword,
}