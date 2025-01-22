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
    let authHeader =  req.headers.Authorization || req.headers.authorization;  
    if(authHeader && authHeader.startsWith("Bearer")) { // The Authorization header starts with "Bearer"
        token = authHeader.split(" ")[1]; // The token is the second part of the header
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User not Authorized!")
            }
            req.user = decoded.user;
            
            next();
        }); 
    } else{ // If there is no token
        res.status(401);
        throw new Error("Missing token")
    }
});

module.exports = validateToken;