const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");



const getCustomerInfo = asyncHandler(async (req,res) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password"); 
    
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("Error: user not found");
    }
});


module.exports = {getCustomerInfo};
