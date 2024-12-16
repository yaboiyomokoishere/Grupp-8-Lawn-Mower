const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authroization;
    if(authHeader && authHeader.startwith("Bearer")) {
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User not Authorized!")

            }
            req.user = decoded.user;
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User not authorized or missing token")
        }
    }
});
module.exports = validateToken;