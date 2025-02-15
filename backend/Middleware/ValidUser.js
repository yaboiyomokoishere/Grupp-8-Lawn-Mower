const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");

const validateActiveUser = asyncHandler(async (req, res, next) => {
    
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    if (user.status !== 'active') {
        res.status(401);
        throw new Error("Access denied: User is not active");
    } else {
        //console.log("User is active");
        req.user = user;
        next();
    }  
});

module.exports = validateActiveUser;