import { refreshTokens, verifyJWTToken } from "../services/auth.services.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../services/constants.js";


// export const verifyAuthentication = (req, res, next) => {
//     const token = req.cookies.user_cookie;
//     if(!token){
//         req.user = null;
//         return next();
//     }

//     try {
//         const decodedToken = verifyJWTToken(token);
//         req.user = decodedToken;
//         // console.log(req.user);
        
//     } catch (error) {
//         console.log(error);
//         req.user = null;
//     }

//     return next();
// }

export const verifyAuthentication = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    // console.log("refresh_token: ", req.cookies.refresh_token);
    // console.log("refreshToken: ", refreshToken);

    req.user = null;
    
    if(!accessToken && !refreshToken){
        return next();
    }

    if(accessToken){
        const decodedToken = verifyJWTToken(accessToken);
        req.user = decodedToken;
        return next();
    }

    if(refreshToken){
        try {
            const refreshedToken = await refreshTokens(refreshToken);

            console.log("refreshedToken: ", refreshedToken);

            const {newAccessToken, newRefreshToken, user} = refreshedToken;
            // console.log("newAccessToken: ", newAccessToken)
            // console.log("newAccessToken: ", newRefreshToken)
            // console.log("user: ", user);

            req.user = user;

            const baseConfig = { httpOnly: true, secure: true };
            
            res.cookie("access_token", newAccessToken, {
                ...baseConfig,
                maxAge: ACCESS_TOKEN_EXPIRY,
            });
        
            res.cookie("refresh_token", newRefreshToken, {
                ...baseConfig,
                maxAge: REFRESH_TOKEN_EXPIRY,
            });

            return next();
        } catch (error) {
            console.log(error)
        }
    }
    return next();
}