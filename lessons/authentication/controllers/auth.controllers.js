// import { sendEmail } from "../lib/nodemailer.js";
import { sendEmail } from "../lib/send-email.js";
import { clearResetPasswordToken, clearUserSession, clearVerifyEmailTokens, comparePassword, createAccessToken, createRefreshToken, createResetPasswordLink, createSession, createUser, createUserWithOauth, createVerifyEmailLink, findUserByEmail, findUserById, findVerificationEmailToken, generateOTP, getResetPasswordToken, getUserByEmail, getUserData, getUserWithOauthId, hashedPassword, insertVerifyEmailToken, linkUserWithOauth, updateUserByName, updateUserPassword, verifyUserEmailAndUpdate } from "../services/auth.services.js";
import { ACCESS_TOKEN_EXPIRY, OAUTH_EXCHANGE_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../services/constants.js";
import { forgetPasswordSchema, validateLogin, validateRegistration, verifyEmailSchema, verifyPasswordSchema, verifyResetPasswordSchema, verifySetPasswordSchema, verifyUserSchema } from "../validators/auth.validator.js";
import z, { httpUrl } from "zod";
import fs from "fs/promises";
import path from "path";
import mjml2html from "mjml";
import ejs from "ejs";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";
import { google } from "../lib/oauth/google.js";
import { github } from "../lib/oauth/github.js";

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

    if(!user.password){
        req.flash("invalid",
            "You have created account using social login. Please login with your social account"
        )
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
    if(!user) return res.redirect("/auth/login");

    const {username, email, isEmailValid } = user;

    const tags = await getUserData(user.id);
    // console.log(tags, user.id);

    let count = tags.length;
    // console.log(count);

    

    return res.render("profile", {
        username, 
        email, 
        count, 
        hasPassword: Boolean(user.password) ,
        isEmailValid,
        avatarURL: user.avatarURL
    });

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
        avatarURL: user.avatarURL,
        errors: req.flash("errors")
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

    // await updateUserByName({ userId: req.user.id, updateName: data.username });
    
    const fileURL = req.file ? `uploads/avatars/${req.file.filename}` : undefined;
    await updateUserByName({ userId: req.user.id, updateName: data.username, avatarURL: fileURL });

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

// getGoogleLoginPage
export const getGoogleLoginPage = async (req, res) => {
    if(req.user) return res.return("/");

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = google.createAuthorizationURL(state, codeVerifier, [
        "openid",
        "profile",
        "email",
    ]);

    const cookieConfig = {
        httpOnly: true, 
        secure: true,
        maxAge: OAUTH_EXCHANGE_EXPIRY,
        sameSite: "lax",
    }

    res.cookie("google_oauth_state", state, cookieConfig);
    res.cookie("google_code_verifier", codeVerifier, cookieConfig);

    res.redirect(url.toString())
}

// getGoogleLoginCallback
export const getGoogleLoginCallback = async (req, res) => {

    const { code, state } = req.query;

    const {
        google_oauth_state: storedState,
        google_code_verifier: codeVerifier
    } = req.cookies;

    try {
        if(
        !code ||
        !state ||
        !storedState ||
        !codeVerifier ||
        state !== storedState
    ){
        console.log(code)
        console.log(state)
        console.log(storedState)
        console.log(codeVerifier)
        req.flash("errors", "Couldn't login with google because of invalid attempt. Please try again! ");
        return res.redirect("/auth/login")
    }
    } catch (error) {
        console.log(error)
    }

    let tokens;
    try{
        tokens = await google.validateAuthorizationCode(code, codeVerifier);
    }catch{
         console.log("error occurred 2")
        req.flash(
            "errors",
            "Couldn't login with login because of invalid attempt. Please try again!"
        );
        return res.redirect("/auth/login");
    }
    console.log("token google:", tokens )

    const claims = decodeIdToken(tokens.idToken());
    const { sub: googleUserId, name, email } = claims;

    let user = await getUserWithOauthId({
        provider: "google",
        email,
    });

    if(user && !user.providerAccountId){
        await linkUserWithOauth({
            userId: user.id,
            provider: "google",
            providerAccountId: googleUserId,
        });
    }

    if(!user){
        user = await createUserWithOauth({
            name,
            email,
            provider: "google",
            providerAccountId: googleUserId
        });
    }

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

// getGithubLoginPage
export const getGithubLoginPage = async (req, res) => {

    if(req.user) return res.return("/");

    const state = generateState();
    const url = github.createAuthorizationURL(state, ["user:email"]);

    const cookieConfig = {
        httpOnly: true, 
        secure: true,
        maxAge: OAUTH_EXCHANGE_EXPIRY,
        sameSite: "lax",
    }

    res.cookie("github_oauth_state", state, cookieConfig);

    res.redirect(url.toString());
}

// getGithubLoginCallback
export const getGithubLoginCallback = async (req, res) => {

    const { code, state } = req.query;
    const {
        github_oauth_state: storedState
    } = req.cookies;

    function handleFailedLogin(){
        req.flash(
            "errors",
            "Couldn't login with GitHub because of invalid login attempt. Please try again!"
        );
        return res.redirect("/auth/login");
    }

    if(!code || !state || !storedState || state !== storedState){
        return handleFailedLogin();
    }

    let tokens;
    try{
        tokens = await github.validateAuthorizationCode(code);
    }catch{
        return handleFailedLogin();
    }

    const githubUserResponse = await fetch("https://api.github.com/user", {
        headers : {
            Authorization: `Bearer ${tokens.accessToken()}`,
        },
    });

    if(!githubUserResponse.ok) return handleFailedLogin();

    const githubUser = await githubUserResponse.json();
    const { id: githubUserId, name} = githubUser;

    const githubEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            }
        },
    )

    if(!githubEmailResponse.ok) return handleFailedLogin();

    const emails = await githubEmailResponse.json();
    const email = emails.filter((e) => e.primary)[0].email;

    if(!email) return handleFailedLogin();

    // few things to check
    // 1. user already exists with github's oauth linked
    // 2. user already exists with same email but google oauth isn't linked
    // 3. user doesn't exist

    let user = await getUserWithOauthId({
        provider: "github",
        email
    });

    if(user && !user.providerAccountId){
        await linkUserWithOauth({
            userId: user.id,
            provider: "github",
            providerAccountId: githubUserId,
        });
    }

    if(!user){
        user = await createUserWithOauth({
            name, 
            email,
            provider: "github",
            providerAccountId: githubUserId,
        })
    }

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

    return res.redirect("/");
}

// getSetPassword
export const getSetPassword = (req, res) => {
    if(!req.user) return res.redirect("/");

    return res.render("auth/set-password", {
        errors: req.flash("errors")
    })
}

// postSetPassword
export const postSetPassword = async (req, res) => {

    const {data, error} = await verifySetPasswordSchema.safeParse(req.body);

    if(error instanceof z.ZodError){
        console.log()
        const errorMessages = error.issues[0].message;
        req.flash("errors", errorMessages);
        return res.redirect(`/auth/set-password/`);
    }

    const { setPassword } = data;

    const user = await findUserById(req.user.id);
    if(user.password){
        req.flash(
            "errors",
            "You already have your password set, instead change your password"
        );
        return res.redirect("/auth/set-password");
    }

    await updateUserPassword({
        userId: req.user.id,
        newPassword: setPassword,
    });

    return res.redirect("/auth/user");
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
    getGoogleLoginPage,
    getGoogleLoginCallback,
    getGithubLoginPage,
    getGithubLoginCallback,
    getSetPassword,
    postSetPassword
}