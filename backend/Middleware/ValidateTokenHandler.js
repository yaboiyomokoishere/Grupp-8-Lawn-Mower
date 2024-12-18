const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

/**
 * @function validateToken
 * @description validates a json web token
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {Function} next - express next middleware function
 * @returns {void}
 */
const validateToken = asyncHandler(async(req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User not Authorized!")

            }
            req.user = decoded.user;
            next();
        },
        {
            expiresIn: '10m'
        });
        if(!token){
            res.status(401);
            throw new Error("User not authorized or missing token")
        }
    }
});

module.exports = validateToken;