// import bcrypt from "bcrypt";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "./constants.js";
import { db, sqlMod } from "../../database/drizzle_mysql/config/db.js"
import { passwordResetTokensTable, sessionsTable, userData, usersAuth, verifyEmailTokensTable } from "../../database/drizzle_mysql/schema/schema.js"

export const getUserByEmail = async (email) => {
    const [user] = await db.select().from(usersAuth).where({
        email: email
    });
    return user;

};

export const hashedPassword = async (password) => {
    // return await bcrypt.hash(password, 10);
    return await argon2.hash(password);
};

export const comparePassword = async (password, hash) => {
    // return await bcrypt.compare(password, hash);
    return await argon2.verify(hash, password);
};

export const createUser = async ({username, email, password}) => {
    return await db.insert(usersAuth).values({
        username,
        email,
        password
    }).$returningId();
};

// export const generateToken = ({ id, username, email }) => {
//     return jwt.sign(
//         { id, username, email }, 
//         process.env.JWT_SECRET, 
//         { expiresIn: "30d" }
//     );
// };

export const createSession = async (userId, {ip, userAgent}) => {
    const [session] = await db.insert(sessionsTable).values({
        userId,
        ip,
        userAgent
    }).$returningId();
    return session;
}

export const createAccessToken = ({id, username, email, sessionId}) => {
    return jwt.sign({id, username, email, sessionId}, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND // expiresIn: "15m"
    });
};

export const createRefreshToken = (sessionId) => {
    return jwt.sign({sessionId}, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND // expiresIn: "1w"
    });
};

export const verifyJWTToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

// creating data for user title and tagline
export const createUserData = async ({ title, tagline, userId }) => {
    return await db.insert(userData).values({
        title, 
        tagline,
        userId
    }).$returningId();
}

// checking title exists
export const getUserTitle = async (title) => {
    const [result] = await db.select().from(userData).where({
        title: title,
    });
    return result;
}

// getting user data
export const getUserData = async (userId) => {
    const data = await db.select().from(userData).where({
        user_id: userId
    });
    return data;
}

// delete data
export const deleteData = async (id) => {
    return await db.delete(userData).where({
        id: id
    })
}

// get data for update route
export const getData = async (id) => {
    return await db.select().from(userData).where({
        id
    });
}

// update data
export const updateData = async (id, title, tagline) => {
    const result = await db.update(userData).set({
        title,
        tagline
    }).where({
        id
    });
}

// find by session id
export const findSessionById = async (id) => {
    const result = await db.select().from(sessionsTable).where({
        id
    })
    // console.log("session table argument id:", id);
    // console.log("session table result:", result);
    return result;
}

// find by user id
export const findUserById = async (userId) => {
    const [user] = await db.select().from(usersAuth).where({
        id: userId
    })
    return user;
}

// refresh token
export const refreshTokens = async (refreshToken) => {
    try {
        const decodedToken = verifyJWTToken(refreshToken);
        // console.log("decoded token result: ", decodedToken);
        const [currentSession] = await findSessionById(decodedToken.sessionId);
        // console.log("current session result:", currentSession);

        // console.log("Current session valid: ", currentSession.valid);

        if(!currentSession || !currentSession.valid){
            throw new Error("Invalid session");
        }

        const user = await findUserById(currentSession.userId)

        if(!user) {
            throw new Error("Invalid user");
        }

        const userInfo = {
            id: user.id,
            username: user.username,
            email: user.email,
            isEmailValid: user.isEmailValid,
            sessionId: currentSession.id
        }
        // console.log("userInfo: ", userInfo);

        const newAccessToken = createAccessToken(userInfo);
        const newRefreshToken = createRefreshToken(currentSession.id);

        const refreshedTokenResult = {
            newAccessToken: newAccessToken, 
            newRefreshToken: newRefreshToken,
            user:userInfo
        };
        // console.log("refreshedTokenResult", refreshedTokenResult);

        return refreshedTokenResult;

        } catch (error) {   
            console.log(error.message);
            return null;
        }
}

// clear session
export const clearUserSession = async (sessionId) => {
    return await db.delete(sessionsTable).where({
        id: sessionId
    })
}

// generateOTP
export const generateOTP = (digit=8) => {
    const min = 10 ** (digit - 1);
    const max = 10 ** digit;

    return crypto.randomInt(min, max).toString();
}

// insertVerifyEmailToken
export const insertVerifyEmailToken = async ({userId, token}) => {

    return db.transaction(async (tx) => {
        try {
            await tx.delete(verifyEmailTokensTable).where(sqlMod.lt(verifyEmailTokensTable.expiresAt, sqlMod.sql`CURRENT_TIMESTAMP`));

            await tx.delete(verifyEmailTokensTable).where(
                sqlMod.eq(verifyEmailTokensTable.userId, userId)
            )

            await tx.insert(verifyEmailTokensTable).values({
                userId, 
                token
            }).$returningId();
        } catch (error) {
            console.log(error);
        }
    })

   
}

// createVerifyEmailLink
// export const createVerifyEmailLink = ({ email, token }) => {
//     const uriEncodedEmail = encodeURIComponent(email);
//     return `${process.env.FRONT_URL}/auth/user/verify-email?token=${token}&email=${email}`;
// }

export const createVerifyEmailLink = ({ email, token }) => {
    const url = new URL(`${process.env.FRONT_URL}/auth/user/verify-email-token`);

    url.searchParams.append("token", token);
    url.searchParams.append("email", email);

    console.log(email);

    return url.toString();
}

// findVerificationEmailToken
// export const findVerificationEmailToken = async ({token, email}) => {

//     const tokenData = await db.select({
//         userId: verifyEmailTokensTable.userId,
//         token: verifyEmailTokensTable.token,
//         expiresAt: verifyEmailTokensTable.expiresAt
//     })
//     .from(verifyEmailTokensTable)
//     .where(
//         sqlMod.and(
//             sqlMod.eq(verifyEmailTokensTable.token, token), 
//             sqlMod.gte(verifyEmailTokensTable.expiresAt, sqlMod.sql`CURRENT_TIMESTAMP`)
//         )
//     );

//     if(!tokenData.length){
//         return null;
//     }
//     const {userId} = tokenData[0];

//     const userData = await db.select({
//         userId: usersAuth.id,
//         email: usersAuth.email,
//     })
//     .from(usersAuth)
//     .where(
//         sqlMod.eq(usersAuth.id, userId)
//     );

//     if(!userData.length) return null;
    
//     return {
//         userId: userData[0].userId,
//         email: userData[0].email,
//         token: tokenData[0].token,
//         expiresAt: tokenData[0].expiresAt,
//     };
// }

// using joins
export const findVerificationEmailToken = async ({token, email}) => {
    return await db
    .select({
        userId: usersAuth.id,
        email: usersAuth.email,
        token: verifyEmailTokensTable.token,
        expiresAt: verifyEmailTokensTable.expiresAt
    })
    .from(verifyEmailTokensTable)
    .where(
        sqlMod.and(
            sqlMod.eq(verifyEmailTokensTable.token, token), 
            sqlMod.eq(usersAuth.email, email),    
            sqlMod.gte(verifyEmailTokensTable.expiresAt, sqlMod.sql`CURRENT_TIMESTAMP`),
        )
    ).innerJoin(usersAuth, sqlMod.eq(verifyEmailTokensTable.userId, usersAuth.id))
}

// verifyUserEmailAndUpdate
export const verifyUserEmailAndUpdate = async (email) => {
    return await db.update(usersAuth)
    .set({
        isEmailValid: true
    })
    .where(
        sqlMod.eq(usersAuth.email, email)
    )
}

// clearVerifyEmailTokens
export const clearVerifyEmailTokens = async (email) => {
    const [user] = await db.select().from(usersAuth).where(sqlMod.eq(usersAuth.email, email));

    return await db.delete(verifyEmailTokensTable).where(
        sqlMod.eq(verifyEmailTokensTable.userId, user.id)
    )
}

// updateUserByName
export const updateUserByName = async ({userId, updateName}) =>{
    return await db
    .update(usersAuth)
    .set({
        username: updateName
    })
    .where(sqlMod.eq(usersAuth.id, userId))
}

// updateUserPassword
export const updateUserPassword = async ({
    userId,
    newPassword,
}) => {
    const newHashPassword = await hashedPassword(newPassword);

    return await db
    .update(usersAuth)
    .set({
        password: newHashPassword
    })
    .where(
        sqlMod.eq(usersAuth.id, userId)
    )
}

// findUserByEmail
export const findUserByEmail = async (email) => {
    const [user] = await db.select().from(usersAuth).where(
        sqlMod.eq(usersAuth.email, email)
    )

    return user;
}

// createResetPasswordLink
export const createResetPasswordLink = async ({ userId }) => {

    const randomToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(randomToken).digest("hex");

    await db.delete(passwordResetTokensTable).where(
        sqlMod.eq(passwordResetTokensTable.userId, userId)
    )

    await db.insert(passwordResetTokensTable).values({
        userId: userId, 
        tokenHash: tokenHash,
    });

    return `${process.env.FRONT_URL}/auth/reset-password/${randomToken}`;
}

// getResetPasswordToken
export const getResetPasswordToken = async (token) => {

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [data] = await db.select().from(passwordResetTokensTable).where(
        sqlMod.and(
            sqlMod.eq(passwordResetTokensTable.tokenHash, tokenHash),
            sqlMod.gte(passwordResetTokensTable.expiresAt, sqlMod.sql`CURRENT_TIMESTAMP`)
        )
    );

    return data;
}

// clearResetPasswordToken
export const clearResetPasswordToken = async (userId) => {
    return await db
    .delete(passwordResetTokensTable)
    .where(
        sqlMod.eq(passwordResetTokensTable.userId, userId)
    )
}